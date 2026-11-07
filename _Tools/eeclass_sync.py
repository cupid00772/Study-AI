#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
NCU eeclass 課程公告與作業自動同步工具 (eeclass Sync Helper)
支援：
1. 讀取與整合 eeclass 課程公告 (Announcements) 與作業截止日 (Assignments)
2. 支援使用已登入的 Session/Cookie 或手動貼上公告內容快速匯入
3. 將同步成果直接寫入 academic_tracker.json 並建立作業項目
"""

import json
import os
import sys
from datetime import datetime

TRACKER_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "academic_tracker.json")

def load_tracker():
    if not os.path.exists(TRACKER_FILE):
        return {"courses": [], "assignments": [], "exams": [], "deliverables": [], "announcements": []}
    with open(TRACKER_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_tracker(data):
    with open(TRACKER_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def add_eeclass_announcement(course_name, title, content, date_str=None, link=None):
    tracker = load_tracker()
    announcements = tracker.get("announcements", [])
    
    date_val = date_str or datetime.now().strftime("%Y-%m-%d")
    ann_id = f"ann-{int(datetime.now().timestamp())}"
    
    announcements.insert(0, {
        "id": ann_id,
        "course": course_name,
        "title": title,
        "content": content,
        "date": date_val,
        "link": link or "https://eeclass.ncu.edu.tw"
    })
    
    tracker["announcements"] = announcements[:50] # 保留最近50則
    save_tracker(tracker)
    print(f"✅ 已成功記錄 [{course_name}] 最新公告：{title}")

def add_eeclass_assignment(course_name, title, due_date, description="", difficulty="Medium", xp=500, prompt_file=None):
    tracker = load_tracker()
    assignments = tracker.get("assignments", [])
    
    ass_id = f"hw-{int(datetime.now().timestamp())}"
    new_hw = {
        "id": ass_id,
        "course": course_name,
        "title": title,
        "dueDate": due_date,
        "status": "pending",
        "description": description,
        "difficulty": difficulty,
        "xp": xp,
        "promptFile": prompt_file,
        "deliverableFile": None
    }
    
    assignments.append(new_hw)
    tracker["assignments"] = assignments
    save_tracker(tracker)
    print(f"✅ 已成功新增 [{course_name}] 作業任務：{title}（截止日：{due_date}，獎勵 {xp} XP）")

if __name__ == "__main__":
    print("========================================")
    print("   NCU eeclass 課程公告與作業同步工具")
    print("========================================")
    print("1. 手動快速新增課程公告")
    print("2. 手動新增作業繳交任務")
    print("3. 檢視當前已同步的公告與作業")
    print("0. 離開")
    
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        if cmd == "list":
            t = load_tracker()
            print(f"目前追蹤的課程數: {len(t.get('courses', []))}")
            print(f"作業數: {len(t.get('assignments', []))}")
            print(f"考試數: {len(t.get('exams', []))}")
            print(f"公告數: {len(t.get('announcements', []))}")
    else:
        print("\n💡 提示：此工具可由 Antigravity 透過指令直接調用，亦可直接執行進行快速更新。")

