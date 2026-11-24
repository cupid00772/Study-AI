#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
國立中央大學 eeclass 智慧爬蟲與每日排程同步管家 (NCU eeclass Crawler & Sync Manager)
支援：
1. 中央大學新 ee-class 數位教學系統 (https://ncueeclass.ncu.edu.tw/)
2. 支援 FMC AJAX 模擬登入 (含 checkMultiLogin keep session 自動續訂)
3. 支援「最近事件」、「最新公告」與各門課程的「真實作業繳交狀態/成績/截止日」完整爬取
4. 自動檢查即將到期作業，並發送 Windows 原生 Toast 桌面通知
5. 支援 Windows 工作排程器 (Task Scheduler) 一鍵配置每日定時自動更新
"""

import os
import sys
import json
import re
import argparse
import subprocess
from datetime import datetime, date
from urllib.parse import urljoin

try:
    import requests
except ImportError:
    print("❌ 缺少 requests 模組，請執行 pip install requests")
    sys.exit(1)

# 系統路徑定義
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRACKER_FILE = os.path.join(ROOT_DIR, "academic_tracker.json")
TC_DATA_FILE = os.path.join(ROOT_DIR, "task-commander", "src", "data", "defaultTracker.json")
CONFIG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".eeclass_config.json")
TOAST_SCRIPT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "send_toast.ps1")

BASE_URL = "https://ncueeclass.ncu.edu.tw"

# 非課業雜訊過濾規則（行政填表、護照認證、純成績公告等）
ADMIN_NOISE_KEYWORDS = (
    "出國補助", "補助申請", "國際菁英獎", "英語優等獎", "活動紀錄表",
    "英檢證明", "成績單繳交區", "英檢課堂加分", "多益", "問卷調查",
    "滿意度調查", "基本資料", "訪談紀錄", "不計分;不計次", "護照"
)
GRADE_NOTICE_KEYWORDS = (
    "期中考-成績", "期末考-成績", "小考成績", "成績公告", "成績發布", "成績查詢"
)
NOISE_COURSE_IDS = {"30025", "42869"}


def is_noise_assignment(course_name, title, course_id=None):
    """判斷是否為非課堂學術作業的行政/護照/成績公告雜訊"""
    title_str = (title or "").strip()
    course_str = (course_name or "").strip()
    if any(kw in title_str for kw in ADMIN_NOISE_KEYWORDS):
        return True
    if any(kw in title_str for kw in GRADE_NOTICE_KEYWORDS):
        return True
    if str(course_id or "") in NOISE_COURSE_IDS or "護照" in course_str or "導師班" in course_str:
        if not any(k in title_str for k in ("作業", "習題", "心得")):
            return True
    return False

# 中央大學標準修課對照表 (校正學分、課號、教室與師資)
CANONICAL_COURSE_MAP = {
    "30025": {
        "code": "MT9999B",
        "name": "管院國際學習護照－資管系*",
        "credits": 0,
        "category": "院推護照",
        "instructor": "許文錦",
        "schedule": "自主認證 / 彈性安排",
        "location": "管理學院",
        "color": "#8B5CF6",
        "icon": "Award",
        "description": "中央大學管理學院國際學習護照：EMI英語優等獎與國際菁英獎自主認證（0 學分）。"
    },
    "42869": {
        "code": "IM001G",
        "name": "資訊管理學系導師班",
        "credits": 0,
        "category": "系訂輔導",
        "instructor": "蘇雅惠",
        "schedule": "定期導聚 / 自主安排",
        "location": "資管系所",
        "color": "#06B6D4",
        "icon": "Users",
        "description": "中央大學資訊管理學系導師輔導、職涯諮詢與班級事務聯絡（0 學分）。"
    },
    "42168": {
        "code": "SC0003W",
        "name": "服務學習課程",
        "credits": 0,
        "category": "校共同必修",
        "instructor": "蔡志豐",
        "schedule": "週四 12:00 - 13:00 (四Z) / 週五 12:00 - 13:00 (五Z)",
        "location": "管二館 I1-105",
        "color": "#34A853",
        "icon": "HeartHandshake",
        "description": "中央大學全校共同必修服務學習課程（畢業門檻 0 學分）。"
    },
    "41079": {
        "code": "GS4110*",
        "name": "通識地球物理",
        "credits": 2,
        "category": "通識課程",
        "instructor": "陳洲生",
        "schedule": "週一 13:00 - 15:00 (一56)",
        "location": "通識大樓 O-122",
        "color": "#10B981",
        "icon": "Globe",
        "description": "地球物理原理與校園實地觀測，包含直流電阻率法與暫態電磁法 (TEM) 實習。"
    },
    "41741": {
        "code": "MT2041E",
        "name": "統計學",
        "credits": 3,
        "category": "院訂必修",
        "instructor": "黃子菱",
        "schedule": "週三 09:00 - 12:00 (三234)",
        "location": "志希館 I-204",
        "color": "#1BA0E2",
        "icon": "BarChart3",
        "description": "敘述統計、機率導論、離散與連續隨機變數分配、抽樣分配與區間估計。"
    },
    "41261": {
        "code": "IM2011*",
        "name": "資料與檔案結構",
        "credits": 3,
        "category": "系訂必修",
        "instructor": "蘇坤良",
        "schedule": "週五 09:00 - 12:00 (五234)",
        "location": "管二館 I1-017",
        "color": "#9B72CF",
        "icon": "Binary",
        "description": "資料組織、陣列、鏈結串列、堆疊、佇列、樹、圖形結構與高階搜尋/排序演算法。"
    },
    "41265": {
        "code": "IM2046*",
        "name": "作業系統",
        "credits": 3,
        "category": "系訂必修",
        "instructor": "陳以錚",
        "schedule": "週四 09:00 - 12:00 (四234)",
        "location": "志希館 I-204",
        "color": "#4285F4",
        "icon": "Cpu",
        "description": "深入探討程序管理、CPU 排程、記憶體管理、虛擬記憶體與檔案系統架構。"
    },
    "41725": {
        "code": "MT1011E",
        "name": "經濟學",
        "credits": 3,
        "category": "院訂必修",
        "instructor": "張李治華",
        "schedule": "週一 09:00 - 12:00 (一234)",
        "location": "志希館 I-204",
        "color": "#D96570",
        "icon": "TrendingUp",
        "description": "Mankiw 經濟學原理，涵蓋市場供需、價格彈性、市場福利、租稅無謂損失與國際貿易。"
    },
    "40254": {
        "code": "CC0141*",
        "name": "邏輯與批判思考",
        "credits": 2,
        "category": "核心通識",
        "instructor": "黃崇修",
        "schedule": "週三 14:00 - 16:00 (三67)",
        "location": "文二館 C2-101",
        "color": "#F59E0B",
        "icon": "Brain",
        "description": "邏輯推論形式、論證分析、日常思維謬誤剖析與批判性思考訓練。"
    }
}

def normalize_course_name(name):
    """將含有英文名稱的科目統一歸一化"""
    if not name:
        return ""
    clean = re.sub(r'\[[A-Z0-9_-]+\]', '', name).strip()
    for cid, meta in CANONICAL_COURSE_MAP.items():
        base_name = meta["name"].replace('*', '')
        if base_name in clean or clean in base_name:
            return meta["name"]
    return clean

# ==========================================
# 1. 設定檔與 Tracker 讀寫
# ==========================================

def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_config(cfg):
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(cfg, f, ensure_ascii=False, indent=2)

def load_tracker():
    if not os.path.exists(TRACKER_FILE):
        return {
            "version": "1.2.0",
            "last_updated": datetime.now().isoformat() + "Z",
            "academic_year": "115",
            "courses": [],
            "assignments": [],
            "exams": [],
            "deliverables": [],
            "announcements": [],
            "calendar_events": []
        }
    with open(TRACKER_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_tracker(data):
    data["last_updated"] = datetime.now().astimezone().isoformat()
    for p in [TRACKER_FILE, TC_DATA_FILE]:
        try:
            if os.path.exists(os.path.dirname(p)):
                with open(p, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f"⚠️ 寫入 {p} 失敗：{e}")
    print(f"💾 學業追蹤檔案已儲存：{TRACKER_FILE}")

# ==========================================
# 2. 認證登入邏輯 (FMC AJAX & MultiLogin)
# ==========================================

def create_session(cookie=None, account=None, password=None):
    """建立授權 Session，支援 Cookie 或 Portal 帳密模擬登入"""
    s = requests.Session()
    s.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Referer": BASE_URL + "/",
        "X-Requested-With": "XMLHttpRequest"
    })

    # 1. 優先使用指定的 Cookie
    if cookie:
        s.cookies.set("PHPSESSID", cookie, domain="ncueeclass.ncu.edu.tw")
        if verify_login(s):
            print("🔑 使用指定的 PHPSESSID Cookie 驗證成功！")
            return s
        else:
            print("⚠️ 提供的 Cookie 已過期或無效。")

    # 2. 次之使用設定檔中的 Cookie
    cfg = load_config()
    saved_cookie = cfg.get("cookie")
    if saved_cookie and saved_cookie != cookie:
        s.cookies.set("PHPSESSID", saved_cookie, domain="ncueeclass.ncu.edu.tw")
        if verify_login(s):
            print("🔑 使用已儲存的 Cookie 登入成功！")
            return s

    # 3. 嘗試使用帳號密碼 FMC 登入
    acc = account or cfg.get("account")
    pwd = password or cfg.get("password")
    if acc and pwd:
        print(f"🔄 正在透過 NCU Portal 帳號 [{acc}] 模擬登入 eeclass...")
        try:
            r_home = s.get(BASE_URL + "/")
            csrf_match = re.search(r"name=['\"]anticsrf['\"]\s+value=['\"]([^'\"]+)['\"]", r_home.text)
            csrf_token = csrf_match.group(1) if csrf_match else ""

            # 第一次提交 (帶 act='keep' 防止被 checkMultiLogin 卡住)
            login_data = {
                "_fmSubmit": "yes",
                "formVer": "3.0",
                "formId": "login_form",
                "next": "/dashboard",
                "act": "keep",
                "account": acc,
                "password": pwd,
                "rememberMe": "1",
                "anticsrf": csrf_token
            }
            r_post = s.post(BASE_URL + "/index/login", data=login_data, timeout=12)
            
            # 若有 multiLogin 彈窗，再次自動處理
            if "checkMultiLogin" in r_post.text:
                login_data["act"] = "keep"
                r_post = s.post(BASE_URL + "/index/login", data=login_data, timeout=12)

            if verify_login(s):
                print(f"✅ 帳號 [{acc}] 登入成功！")
                new_cookie = s.cookies.get("PHPSESSID")
                if new_cookie:
                    cfg["cookie"] = new_cookie
                    cfg["account"] = acc
                    cfg["password"] = pwd
                    save_config(cfg)
                return s
            else:
                print("❌ 登入失敗：請確認帳號或密碼是否正確，或中央伺服器暫時維護中。")
        except Exception as e:
            print(f"❌ 登入請求異常：{e}")

    return None

def verify_login(session):
    """檢查目前 Session 是否已登入成功"""
    try:
        r = session.get(BASE_URL + "/dashboard", allow_redirects=False, timeout=8)
        if r.status_code == 200 and "/index/login" not in r.url:
            return True
        return False
    except Exception:
        return False

# ==========================================
# 3. 核心爬取邏輯 (Dashboard, HW, Bulletin)
# ==========================================

def crawl_eeclass(session):
    """主爬取函式：抓取儀表板修課、最近事件、最新公告與各科真實作業"""
    print("📡 正在擷取中央大學 eeclass 儀表板課程清單...")
    r = session.get(BASE_URL + "/dashboard")
    if r.status_code != 200:
        print(f"❌ 無法存取儀表板，HTTP 狀態碼：{r.status_code}")
        return None

    html = r.text
    courses = []
    assignments = []
    announcements = []

    # 1. 抽取儀表板「最近事件」
    recent_events = []
    events_match = re.search(r"<div class='caption underline'>最近事件</div>\s*<ul[^>]*>(.*?)</ul>", html, re.DOTALL)
    if events_match:
        li_items = re.findall(r"<li\b[^>]*>(.*?)</li>", events_match.group(1), re.DOTALL)
        for li in li_items:
            d_match = re.search(r"(\d{2}-\d{2})", li)
            date_str = d_match.group(1) if d_match else ""
            a_tag_match = re.search(r"<a\b([^>]*)>(.*?)</a>", li, re.DOTALL)
            if a_tag_match:
                attrs, inner_html = a_tag_match.group(1), a_tag_match.group(2)
                href_m = re.search(r"\bhref=['\"]([^'\"]+)['\"]", attrs)
                title_m = re.search(r"(?<![-\w])title=['\"]([^'\"]*)['\"]", attrs)
                link = href_m.group(1) if href_m else "/dashboard"
                course_title_attr = title_m.group(1) if title_m else ""
                clean_title = re.sub(r'<[^>]+>', '', inner_html).strip()

                cname_raw = re.sub(r'^課程:\s*', '', course_title_attr).strip() if course_title_attr else "中央修習科目"
                cname = normalize_course_name(cname_raw)
                if is_noise_assignment(cname, clean_title):
                    continue
                is_quiz = "exam" in link or any(k in clean_title for k in ['測驗', '小考', '模擬考'])

                recent_events.append({
                    "id": f"evt-{len(recent_events)+1}",
                    "date": date_str,
                    "course": cname,
                    "type": "quiz" if is_quiz else "homework",
                    "icon": "CheckSquare" if is_quiz else "Briefcase",
                    "title": clean_title,
                    "link": urljoin(BASE_URL, link) if link and not link.startswith('#') else BASE_URL + "/dashboard"
                })

    # 2. 抽取儀表板「最新公告」（正確解析 data-url 與真實課程名稱）
    latest_announcements = []
    bulletin_match = re.search(r"<div class='caption underline'>最新公告</div>\s*<ul[^>]*>(.*?)</ul>", html, re.DOTALL)
    if bulletin_match:
        li_items = re.findall(r"<li\b[^>]*>(.*?)</li>", bulletin_match.group(1), re.DOTALL)
        for li in li_items:
            d_match = re.search(r"(\d{2}-\d{2})", li)
            date_str = d_match.group(1) if d_match else ""
            a_tag_match = re.search(r"<a\b([^>]*)>(.*?)</a>", li, re.DOTALL)
            if a_tag_match:
                attrs, inner_html = a_tag_match.group(1), a_tag_match.group(2)
                href_m = re.search(r"\bhref=['\"]([^'\"]+)['\"]", attrs)
                data_url_m = re.search(r"\bdata-url=['\"]([^'\"]+)['\"]", attrs)
                title_m = re.search(r"(?<![-\w])title=['\"]([^'\"]*)['\"]", attrs)

                raw_href = href_m.group(1) if href_m else ""
                data_url = data_url_m.group(1) if data_url_m else ""
                course_title_attr = title_m.group(1) if title_m else ""
                clean_title = re.sub(r'<[^>]+>', '', inner_html).strip()

                # 從 data-url 提取真實公告 ID（例如 /bulletin/content/?id=175048&pageId=course.41725）
                resolved_link = BASE_URL + "/dashboard"
                if raw_href and not raw_href.startswith('#'):
                    resolved_link = urljoin(BASE_URL, raw_href)
                elif data_url:
                    bid_m = re.search(r"[?&]id=(\d+)", data_url)
                    cid_m = re.search(r"pageId=course\.(\d+)", data_url)
                    if bid_m:
                        resolved_link = f"{BASE_URL}/bulletin/{bid_m.group(1)}"
                    elif cid_m:
                        resolved_link = f"{BASE_URL}/course/bulletin/{cid_m.group(1)}"

                cname_raw = re.sub(r'^課程:\s*', '', course_title_attr).strip() if course_title_attr else "中央公告"
                cname = normalize_course_name(cname_raw)
                is_hot = "hot.gif" in li or "HOT" in clean_title

                latest_announcements.append({
                    "id": f"ann-dash-{len(latest_announcements)+1}",
                    "date": date_str,
                    "course": cname,
                    "title": clean_title,
                    "isHot": is_hot,
                    "link": resolved_link
                })

    print(f"  📌 儀表板雙欄：已爬取最近事件 {len(recent_events)} 項、最新公告 {len(latest_announcements)} 則。")

    # 3. 解析真實修課清單與授課教師
    # eeclass 儀表板卡片直接標註真實之「老師: xxx」與「代碼: xxx」
    crawled_teachers = {cid: t.strip() for cid, t in re.findall(r'href=[\'"]/course/(\d+)[\'"].*?老師:\s*([^<]+?)</div>', html, re.DOTALL)}
    crawled_codes = {cid: c.strip() for cid, c in re.findall(r'href=[\'"]/course/(\d+)[\'"].*?代碼:\s*([^<]+?)</div>', html, re.DOTALL)}

    course_links = re.findall(r'href=["\']/course/(\d+)["\'][^>]*>(.*?)</a>', html, re.DOTALL | re.I)
    seen_course_ids = set()

    for cid, text in course_links:
        if cid in seen_course_ids:
            continue
        clean_name = re.sub(r'<[^>]+>', '', text).strip()
        if not clean_name or clean_name in ['進入課程', '課程資訊', '公告', '作業', '課程活動']:
            continue

        seen_course_ids.add(cid)

        # 課號與名稱
        code_match = re.search(r'\[([A-Z0-9_-]+)\]', clean_name)
        code = crawled_codes.get(str(cid)) or (code_match.group(1) if code_match else f"NCU-{cid}")
        course_name = re.sub(r'\[[A-Z0-9_-]+\]', '', clean_name).strip() or clean_name
        real_teacher = crawled_teachers.get(str(cid))

        canon = CANONICAL_COURSE_MAP.get(str(cid))
        if canon:
            course_item = {
                "id": f"course-{cid}",
                "eeclass_id": cid,
                "name": canon["name"],
                "code": real_code if (real_code := crawled_codes.get(str(cid))) else canon["code"],
                "category": canon["category"],
                "instructor": real_teacher or canon["instructor"],
                "credits": canon["credits"],
                "schedule": canon["schedule"],
                "location": canon["location"],
                "color": canon["color"],
                "icon": canon["icon"],
                "description": canon["description"]
            }
        else:
            course_item = {
                "id": f"course-{cid}",
                "eeclass_id": cid,
                "name": course_name,
                "code": code,
                "category": "中央大學修習科目",
                "instructor": real_teacher or "授課教師",
                "credits": 0 if any(k in course_name for k in ['護照', '導師班', '服務學習']) else 3,
                "schedule": "依選課結果排定",
                "location": "中央校區",
                "color": "#4285F4",
                "icon": "BookOpen",
                "description": f"中央大學 115 學年度 eeclass 同步課程：{course_name}"
            }
        courses.append(course_item)
        print(f"  📚 找到已選課程：[{course_item['code']}] {course_item['name']} ({course_item['credits']}學分, 教師: {course_item['instructor']}) (ID: {cid})")

    # 4. 深入爬取各門課程的真實作業清單 (/course/homeworkList/{cid}) 與測驗型作業 (/course/examList/{cid})
    current_year = date.today().year

    def parse_due_date(clean_due):
        full_date_match = re.search(r'(\d{4}[-/]\d{1,2}[-/]\d{1,2})', clean_due)
        short_date_match = re.search(r'(\d{1,2}[-/]\d{1,2})', clean_due)
        if full_date_match:
            return full_date_match.group(1).replace('/', '-')
        if short_date_match:
            m_d = short_date_match.group(1).replace('/', '-')
            parts = m_d.split('-')
            if len(parts) == 2:
                return f"{current_year}-{int(parts[0]):02d}-{int(parts[1]):02d}"
            return f"{current_year}-{m_d}"
        return ""

    for c in courses:
        cid = str(c["eeclass_id"])
        cname = c["name"]
        if cid in NOISE_COURSE_IDS:
            continue

        # 4a. 一般作業專區 (/course/homeworkList/{cid})
        try:
            r_hw = session.get(f"{BASE_URL}/course/homeworkList/{cid}", timeout=10)
            if r_hw.status_code == 200:
                ths = re.findall(r'<th\b[^>]*>(.*?)</th>', r_hw.text, re.DOTALL | re.I)
                th_names = [re.sub(r'<[^>]+>', '', th).strip() for th in ths]

                title_idx = next((i for i, h in enumerate(th_names) if '名稱' in h), 1)
                due_idx = next((i for i, h in enumerate(th_names) if '期限' in h or '截止' in h), 5)
                submit_idx = next((i for i, h in enumerate(th_names) if h == '繳交'), 6)
                grade_idx = next((i for i, h in enumerate(th_names) if ('分數' in h or '成績' in h) and '組' not in h), 7)

                rows = re.findall(r'<tr\b[^>]*>(.*?)</tr>', r_hw.text, re.DOTALL | re.I)
                for row in rows:
                    cols = re.findall(r'<td\b[^>]*>(.*?)</td>', row, re.DOTALL | re.I)
                    if len(cols) > title_idx:
                        t_col = cols[title_idx]
                        title_match = re.search(r"<a\b[^>]*href=['\"]([^'\"]+)['\"][^>]*>(.*?)</a>", t_col, re.DOTALL)
                        if not title_match:
                            title_match = re.search(r"<a\b[^>]*>(.*?)</a>", t_col, re.DOTALL)

                        hw_title = re.sub(r'<[^>]+>', '', title_match.group(2) if (title_match and len(title_match.groups()) >= 2) else (title_match.group(1) if title_match else t_col)).strip()
                        if not hw_title or hw_title == '沒有資料':
                            continue
                        if is_noise_assignment(cname, hw_title, cid):
                            continue

                        hw_rel_link = title_match.group(1) if (title_match and len(title_match.groups()) >= 2 and title_match.group(1).startswith('/')) else None
                        hw_link = urljoin(BASE_URL, hw_rel_link) if hw_rel_link else None

                        clean_due = re.sub(r'<[^>]+>', ' ', cols[due_idx]).strip() if len(cols) > due_idx else ''
                        due_date = parse_due_date(clean_due)

                        submit_col = cols[submit_idx] if len(cols) > submit_idx else ''
                        has_submitted = 'fa-check' in submit_col or '已繳交' in submit_col

                        grade_col = cols[grade_idx] if len(cols) > grade_idx else ''
                        clean_grade = re.sub(r'<[^>]+>', '', grade_col).strip()
                        if clean_grade == '-':
                            clean_grade = ''

                        status = "completed" if (has_submitted or clean_grade) else "pending"
                        hw_id_match = re.search(r'/homework/(\d+)', hw_rel_link or '')
                        hw_unique_id = f"hw-{cid}-{hw_id_match.group(1)}" if hw_id_match else f"hw-{cid}-{len(assignments)+1}"

                        assignments.append({
                            "id": hw_unique_id,
                            "course": cname,
                            "title": hw_title,
                            "dueDate": due_date,
                            "status": status,
                            "grade": clean_grade,
                            "description": f"來自 eeclass 作業專區：{hw_title}" + (f" (成績：{clean_grade})" if clean_grade else ""),
                            "link": hw_link,
                            "promptFile": None,
                            "deliverableFile": None
                        })
                        grade_display = f"(得分: {clean_grade})" if clean_grade else ("(已繳交)" if has_submitted else "(待繳交)")
                        print(f"    📝 作業：{hw_title} | 期限：{due_date} | 狀態：{status} {grade_display}")
        except Exception as e:
            print(f"    ⚠️ 作業抓取異常 [{cname}]: {e}")

        # 4b. 測驗專區線上作業 (/course/examList/{cid}，例如經濟學 CH 作業)
        try:
            r_ex = session.get(f"{BASE_URL}/course/examList/{cid}", timeout=10)
            if r_ex.status_code == 200:
                ths = re.findall(r'<th\b[^>]*>(.*?)</th>', r_ex.text, re.DOTALL | re.I)
                th_names = [re.sub(r'<[^>]+>', '', th).strip() for th in ths]

                title_idx = next((i for i, h in enumerate(th_names) if '名稱' in h), 1)
                due_idx = next((i for i, h in enumerate(th_names) if '期限' in h or '截止' in h), 2)
                grade_idx = next((i for i, h in enumerate(th_names) if '分數' in h or '成績' in h), 3)

                rows = re.findall(r'<tr\b[^>]*>(.*?)</tr>', r_ex.text, re.DOTALL | re.I)
                for row in rows:
                    cols = re.findall(r'<td\b[^>]*>(.*?)</td>', row, re.DOTALL | re.I)
                    if len(cols) > title_idx:
                        t_col = cols[title_idx]
                        title_match = re.search(r"<a\b[^>]*href=['\"]([^'\"]+)['\"][^>]*>(.*?)</a>", t_col, re.DOTALL)
                        if not title_match:
                            continue
                        ex_rel_link = title_match.group(1)
                        ex_title = re.sub(r'<[^>]+>', '', title_match.group(2)).strip()
                        if not ex_title or ex_title == '沒有資料' or is_noise_assignment(cname, ex_title, cid):
                            continue
                        # 排除純筆試/期中期末考試（由考試日程管理，不重複混入作業清單）
                        if re.fullmatch(r'(?:期中|期末)(?:考|考試|筆試|測驗)', ex_title):
                            continue

                        clean_due = re.sub(r'<[^>]+>', ' ', cols[due_idx]).strip() if len(cols) > due_idx else ''
                        due_date = parse_due_date(clean_due)

                        grade_col = cols[grade_idx] if len(cols) > grade_idx else ''
                        clean_grade = re.sub(r'<[^>]+>', '', grade_col).strip()
                        if clean_grade in ('-', '--', '未批改', '不顯示'):
                            clean_grade = ''

                        status = "completed" if clean_grade else "pending"
                        ex_id_match = re.search(r'/exam/(\d+)', ex_rel_link or '')
                        ex_unique_id = f"hw-{cid}-exam-{ex_id_match.group(1)}" if ex_id_match else f"hw-{cid}-exam-{len(assignments)+1}"

                        # 避免舊學期/已完成且已過期很久的測驗灌爆清單：僅納入未完成或本學期有成績且已在追蹤/近期的項目
                        assignments.append({
                            "id": ex_unique_id,
                            "course": cname,
                            "title": ex_title,
                            "dueDate": due_date,
                            "status": status,
                            "grade": clean_grade,
                            "description": f"eeclass 測驗專區作業：{ex_title}" + (f" (成績：{clean_grade})" if clean_grade else ""),
                            "link": urljoin(BASE_URL, ex_rel_link),
                            "promptFile": None,
                            "deliverableFile": None
                        })
                        print(f"    🧪 測驗作業：{ex_title} | 期限：{due_date} | 狀態：{status}" + (f" (得分: {clean_grade})" if clean_grade else ""))
        except Exception as e:
            print(f"    ⚠️ 測驗作業抓取異常 [{cname}]: {e}")

    return {
        "recent_events": recent_events,
        "latest_announcements": latest_announcements,
        "courses": courses,
        "assignments": assignments,
        "announcements": latest_announcements
    }

# ==========================================
# 4. 合併至 academic_tracker.json
# ==========================================

def merge_and_save_data(crawled_data):
    """智慧合併：保留使用者已勾選的成果與設定，無縫整合最新爬取結果"""
    tracker = load_tracker()

    # 0. 更新儀表板雙欄 (圖一所呈現之內容)
    if "recent_events" in crawled_data or "latest_announcements" in crawled_data:
        tracker["eeclass_dashboard"] = {
            "recent_events": crawled_data.get("recent_events", []),
            "latest_announcements": crawled_data.get("latest_announcements", [])
        }

    # 1. 智慧去重合併課程 (依標準課號、eeclass_id 或歸一化名稱去重)
    merged_courses = []
    seen_keys = set()
    for c in crawled_data.get("courses", []):
        cname = normalize_course_name(c.get("name"))
        cid = str(c.get("eeclass_id", ""))
        key = cid or cname
        if key in seen_keys:
            continue
        seen_keys.add(key)

        # 尋找既有清單中相符的課程
        match = None
        for old in tracker.get("courses", []):
            if str(old.get("eeclass_id", "")) == cid or old.get("code") == c.get("code") or normalize_course_name(old.get("name")) == cname:
                match = old
                break
        if match:
            # 覆蓋為標準規範值
            match["name"] = c["name"]
            match["code"] = c["code"]
            match["credits"] = c["credits"]
            match["category"] = c.get("category", match.get("category"))
            match["schedule"] = c.get("schedule", match.get("schedule"))
            match["location"] = c.get("location", match.get("location"))
            match["instructor"] = c.get("instructor", match.get("instructor"))
            match["color"] = c.get("color", match.get("color"))
            match["icon"] = c.get("icon", match.get("icon"))
            match["description"] = c.get("description", match.get("description"))
            merged_courses.append(match)
        else:
            merged_courses.append(c)

    # 保留原本不在 eeclass 上但使用者自訂的重點專題（如：台聯大/台大轉學考）
    for old in tracker.get("courses", []):
        old_name = normalize_course_name(old.get("name"))
        old_code = old.get("code")
        if not any(mc.get("code") == old_code or normalize_course_name(mc.get("name")) == old_name for mc in merged_courses):
            merged_courses.append(old)

    tracker["courses"] = merged_courses

    # 2. 合併作業（嚴格套用雜訊過濾與使用者忽略黑名單，保留自訂截止日與成果檔案）
    ignored_ids = set(tracker.get("ignored_assignment_ids", []))
    ignored_keys = set(tracker.get("ignored_assignment_keys", []))

    existing_by_id = {}
    existing_by_key = {}
    for old in tracker.get("assignments", []):
        if is_noise_assignment(old.get("course"), old.get("title")):
            continue
        oid = old.get("id")
        okey = f"{normalize_course_name(old.get('course'))}_{old.get('title')}"
        if oid in ignored_ids or okey in ignored_keys:
            continue
        if oid:
            existing_by_id[oid] = old
        existing_by_key[okey] = old

    merged_hw = []
    seen_ids = set()
    seen_keys = set()

    for h in crawled_data.get("assignments", []):
        hkey = f"{normalize_course_name(h.get('course'))}_{h.get('title')}"
        hid = h.get("id")
        if is_noise_assignment(h.get("course"), h.get("title")):
            continue
        if hid in ignored_ids or hkey in ignored_keys:
            continue
        if hid in seen_ids or hkey in seen_keys:
            continue

        old = existing_by_id.get(hid) or existing_by_key.get(hkey)
        if old:
            # 僅在原本未設定 dueDate 時才以爬蟲日期補齊，避免覆蓋手動標註的原始分數期限
            if not old.get("dueDate") and h.get("dueDate"):
                old["dueDate"] = h["dueDate"]
            if h.get("status") == "completed":
                old["status"] = "completed"
            if h.get("grade"):
                old["grade"] = h["grade"]
            if h.get("link"):
                old["link"] = h["link"]
            merged_hw.append(old)
            seen_ids.add(old.get("id"))
            seen_keys.add(hkey)
        else:
            merged_hw.append(h)
            seen_ids.add(hid)
            seen_keys.add(hkey)

    for old in tracker.get("assignments", []):
        if is_noise_assignment(old.get("course"), old.get("title")):
            continue
        oid = old.get("id")
        okey = f"{normalize_course_name(old.get('course'))}_{old.get('title')}"
        if oid in ignored_ids or okey in ignored_keys:
            continue
        if oid not in seen_ids and okey not in seen_keys:
            merged_hw.append(old)
            seen_ids.add(oid)
            seen_keys.add(okey)

    tracker["assignments"] = merged_hw
    tracker["ignored_assignment_ids"] = sorted(ignored_ids)
    tracker["ignored_assignment_keys"] = sorted(ignored_keys)

    # 3. 合併公告
    all_ann = crawled_data.get("announcements", []) + tracker.get("announcements", [])
    seen_ann_titles = set()
    deduped_ann = []
    for a in all_ann:
        akey = f"{a.get('course')}_{a.get('title')}"
        if akey not in seen_ann_titles:
            seen_ann_titles.add(akey)
            deduped_ann.append(a)
    tracker["announcements"] = deduped_ann[:50]

    save_tracker(tracker)
    print("✅ 已成功整併 eeclass 課程、作業與公告資料！")

# ==========================================
# 5. 到期日自動檢查與 Windows Toast 通知
# ==========================================

def check_and_notify_deadlines(tracker=None, alert_days=3, exam_alert_days=7):
    """檢查即將到期作業（0~alert_days 天及逾期）與考前 7 天考試，並發送 Windows 桌面通知"""
    if tracker is None:
        tracker = load_tracker()

    today = date.today()
    assignments = tracker.get("assignments", [])
    ignored_ids = set(tracker.get("ignored_assignment_ids", []))

    urgent_list = []
    overdue_list = []

    for hw in assignments:
        if hw.get("status") == "completed" or hw.get("id") in ignored_ids:
            continue
        if is_noise_assignment(hw.get("course"), hw.get("title")):
            continue
        due_str = hw.get("dueDate")
        if not due_str:
            continue

        try:
            due_date = datetime.strptime(due_str, "%Y-%m-%d").date()
            diff_days = (due_date - today).days

            if diff_days < 0:
                overdue_list.append((hw, abs(diff_days)))
            elif 0 <= diff_days <= alert_days:
                urgent_list.append((hw, diff_days))
        except Exception:
            continue

    # 檢查 7 天內即將到來的真實考試與官方考試週
    upcoming_exams = []
    for ex in tracker.get("exams", []):
        if ex.get("status") == "completed":
            continue
        d_str = ex.get("date")
        if not d_str:
            continue
        try:
            ex_date = datetime.strptime(d_str, "%Y-%m-%d").date()
            diff_days = (ex_date - today).days
            if 0 <= diff_days <= exam_alert_days:
                upcoming_exams.append((ex.get("course", ""), ex.get("title", ""), d_str, diff_days))
        except Exception:
            continue

    for ev in tracker.get("calendar_events", []):
        if ev.get("category") != "Official_Exam":
            continue
        s_str = ev.get("startDate")
        if not s_str:
            continue
        try:
            s_date = datetime.strptime(s_str, "%Y-%m-%d").date()
            diff_days = (s_date - today).days
            if 0 <= diff_days <= exam_alert_days:
                upcoming_exams.append(("校曆考試週", ev.get("title", ""), s_str, diff_days))
        except Exception:
            continue

    print("\n========================================")
    print("   📅 eeclass 作業與考前倒數即時監控報告")
    print("========================================")

    if not urgent_list and not overdue_list and not upcoming_exams:
        print(f"🎉 太棒了！近期 {alert_days} 天內無急迫作業，未來 {exam_alert_days} 天內無考試。")
        return

    if upcoming_exams:
        print(f"🔥 考前 {exam_alert_days} 天倒數警告（共 {len(upcoming_exams)} 項）：")
        for course, title, d_str, days in upcoming_exams:
            day_text = "【今天考試 🚨】" if days == 0 else ("【明天考試 ⚠️】" if days == 1 else f"剩 {days} 天")
            print(f"  • [{course}] {title} ➔ {d_str} ({day_text})")

    if urgent_list:
        print(f"⚠️ 即將到期作業（未來 {alert_days} 天內共 {len(urgent_list)} 項）：")
        for hw, days in urgent_list:
            day_text = "【今天截止 🚨】" if days == 0 else ("【明天截止 ⚠️】" if days == 1 else f"剩 {days} 天")
            print(f"  • [{hw['course']}] {hw['title']} ➔ {hw['dueDate']} ({day_text})")

    if overdue_list:
        print(f"\n⏰ 已逾期未完成作業（共 {len(overdue_list)} 項）：")
        for hw, days in overdue_list:
            print(f"  • [{hw['course']}] {hw['title']} ➔ 逾期 {days} 天！")

    # 發送 Windows 原生 Toast 桌面通知
    if os.path.exists(TOAST_SCRIPT) and (urgent_list or upcoming_exams):
        parts = []
        if upcoming_exams:
            parts.append(f"{len(upcoming_exams)} 場考前倒數")
        if urgent_list:
            parts.append(f"{len(urgent_list)} 項急迫作業")
        title = f"⚠️ Task Commander 警告：{' / '.join(parts)}"
        body_lines = []
        for course, ex_title, _d, days in upcoming_exams[:2]:
            day_text = "今天考試" if days == 0 else ("明天考試" if days == 1 else f"剩{days}天")
            body_lines.append(f"🔥 [{course}] {ex_title} ({day_text})")
        for hw, days in urgent_list[:2]:
            day_text = "今天截止" if days == 0 else ("明天截止" if days == 1 else f"剩{days}天")
            body_lines.append(f"📝 [{hw['course']}] {hw['title']} ({day_text})")

        message = "\n".join(body_lines)
        try:
            subprocess.run([
                "powershell", "-ExecutionPolicy", "Bypass", "-File", TOAST_SCRIPT,
                "-Title", title,
                "-Message", message
            ], check=False)
        except Exception as e:
            print(f"⚠️ 喚起 Windows Toast 失敗：{e}")

# ==========================================
# 6. Windows 工作排程器 (每日自動執行配置)
# ==========================================

def setup_windows_scheduler(trigger_time="08:30"):
    """使用 PowerShell 自動在 Windows 工作排程器註冊每日更新任務"""
    task_name = "NCU_EEClass_DailySync"
    python_exe = sys.executable
    script_path = os.path.abspath(__file__)
    
    ps_cmd = f"""
    $Action = New-ScheduledTaskAction -Execute '{python_exe}' -Argument '"{script_path}" --cron' -WorkingDirectory '{ROOT_DIR}'
    $Trigger = New-ScheduledTaskTrigger -Daily -At '{trigger_time}'
    $Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
    Register-ScheduledTask -TaskName '{task_name}' -Action $Action -Trigger $Trigger -Settings $Settings -Description '中央大學 eeclass 課程作業每日定時同步與到期推播管家' -Force
    """

    print(f"⚙️ 正在註冊 Windows 每日工作排程器 [{task_name}]（排定時間：每天 {trigger_time}）...")
    try:
        res = subprocess.run(["powershell", "-Command", ps_cmd], capture_output=True, text=True, check=True)
        print("✅ 成功建立 Windows 每日自動排程任務！每天早上將自動執行爬蟲並推播到期通知。")
    except Exception as e:
        print(f"⚠️ 註冊排程器失敗（若無系統管理員權限可手動執行批次檔）：{e}")

# ==========================================
# 主程式入口
# ==========================================

def main():
    parser = argparse.ArgumentParser(description="NCU eeclass 智慧爬蟲與每日排程同步管家")
    parser.add_argument("--cookie", help="手動指定 eeclass PHPSESSID Cookie")
    parser.add_argument("--account", help="NCU Portal 學號/帳號")
    parser.add_argument("--password", help="NCU Portal 密碼")
    parser.add_argument("--check-deadlines", action="store_true", help="僅檢查作業到期日並發送 Windows 桌面通知")
    parser.add_argument("--setup-scheduler", action="store_true", help="在 Windows 排程器建立每日定時同步任務")
    parser.add_argument("--cron", action="store_true", help="每日排程模式：執行同步並主動推播到期日")
    parser.add_argument("--sync-materials", action="store_true", help="同步下載各課程講義與上課教材")

    args = parser.parse_args()

    # 1. 設定 Windows 排程
    if args.setup_scheduler:
        setup_windows_scheduler()
        return

    # 2. 單純檢查到期日
    if args.check_deadlines:
        check_and_notify_deadlines()
        return

    # 3. 爬蟲執行模式
    session = create_session(cookie=args.cookie, account=args.account, password=args.password)
    if session:
        crawled = crawl_eeclass(session)
        if crawled:
            merge_and_save_data(crawled)
            check_and_notify_deadlines()
        
        # 若為每日排程或使用者要求同步講義教材
        if args.cron or args.sync_materials:
            try:
                from download_course_materials import sync_all_materials
                sync_all_materials(session)
            except Exception as e:
                print(f"⚠️ 課程教材同步過程發生異常：{e}")
    else:
        print("\n💡 登入未完成，即刻執行現有學業庫的到期日檢查...")
        check_and_notify_deadlines()

if __name__ == "__main__":
    main()
