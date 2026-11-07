import os
import sys
import re

cur_dir = os.path.dirname(os.path.abspath(__file__))
if cur_dir not in sys.path:
    sys.path.append(cur_dir)

from convert_mindmap import convert_mindmap_to_flowchart

base_dir = r"c:\Users\Cupid\Downloads\Study-space\Study_Materials"

def upgrade_stats_and_econ():
    for subj in ["統計學", "經濟學"]:
        subj_dir = os.path.join(base_dir, subj)
        for f in sorted(os.listdir(subj_dir)):
            if not f.endswith(".md") or f.startswith("_"):
                continue
            p = os.path.join(subj_dir, f)
            with open(p, "r", encoding="utf-8") as file:
                content = file.read()

            title_m = re.search(r"^#\s+(.*)", content, re.MULTILINE)
            title = title_m.group(1).strip() if title_m else f"{subj} {f}"

            # Convert Mermaid Mindmap
            mermaid_m = re.search(r"```mermaid\s*mindmap([\s\S]*?)```", content)
            if not mermaid_m:
                print(f"[SKIP MERMAID] No mindmap in {subj}/{f}")
                continue

            old_mermaid = mermaid_m.group(1).strip()
            new_mermaid, sec_ids = convert_mindmap_to_flowchart(old_mermaid, title)

            # Checklist
            checklist_lines = [
                '<a id="tree-diagram"></a>',
                '',
                '### 🎯 本章學習進度檢核 (完成後打勾，建立成就反饋)'
            ]
            for _, sec_title, sec_num in sec_ids:
                checklist_lines.append(f"- [ ] [{sec_title}](#sec-{sec_num})")
            checklist_str = "\n".join(checklist_lines)

            rep_mermaid = f"```mermaid\n{new_mermaid}\n```\n\n{checklist_str}\n"
            content = content[:mermaid_m.start()] + rep_mermaid + content[mermaid_m.end():]

            # Add section anchors
            lines = content.split("\n")
            new_lines = []
            curr_sec = 0

            for line in lines:
                if line.startswith("### ") and not any(line.startswith(prefix) for prefix in ["### 🎯", "### 🔑", "### 歷屆", "### 基礎", "### 進階"]):
                    curr_sec += 1
                    new_lines.append(f'<a id="sec-{curr_sec}"></a>')
                if "#### ✏️ 練習題" in line:
                    new_lines.append(f'<a id="q-sec-{curr_sec}"></a>')
                new_lines.append(line)

            full_text = "\n".join(new_lines)

            # Replace details with jump link
            ans_blocks = []
            def replace_details(match):
                preceding = full_text[:match.start()]
                sec_matches = list(re.finditer(r'<a id="sec-(\d+)">', preceding))
                sec_n = int(sec_matches[-1].group(1)) if sec_matches else (len(ans_blocks) + 1)
                inner = match.group(1).strip()
                ans_blocks.append((sec_n, inner))
                return f"\n👉 [查看本節練習題答案與詳細解析](#ans-sec-{sec_n})\n"

            details_pattern = re.compile(r"<details>\s*<summary>.*?</summary>([\s\S]*?)</details>", re.DOTALL)
            transformed = details_pattern.sub(replace_details, full_text)

            # Build Answer Key
            if ans_blocks:
                ans_lines = [
                    "",
                    "---",
                    "",
                    "## 🔑 本章練習題答案與詳細解析 (Answer Key)",
                    ""
                ]
                for sec_n, inner in ans_blocks:
                    s_title = f"第 {sec_n} 節"
                    for _, t_item, n_item in sec_ids:
                        if n_item == sec_n:
                            s_title = t_item
                            break
                    ans_lines.append(f'<a id="ans-sec-{sec_n}"></a>')
                    ans_lines.append(f"### {s_title} — 練習題答案與詳細解析")
                    ans_lines.append("")
                    ans_lines.append(inner)
                    ans_lines.append("")
                    ans_lines.append(f"[🔙 返回本節練習題](#q-sec-{sec_n}) ｜ [🔝 返回知識架構圖](#tree-diagram)")
                    ans_lines.append("")
                    ans_lines.append("---")
                    ans_lines.append("")

                # Insert Answer Key before index / flashcards or at end
                if "## 📋 本章重點速記表" in transformed:
                    parts = transformed.split("## 📋 本章重點速記表")
                    transformed = parts[0] + "\n".join(ans_lines) + "\n\n## 📋 本章重點速記表" + parts[1]
                elif "## 🃏 考前速查卡片" in transformed:
                    parts = transformed.split("## 🃏 考前速查卡片")
                    transformed = parts[0] + "\n".join(ans_lines) + "\n\n## 🃏 考前速查卡片" + parts[1]
                elif "## 🔗 相關章節索引" in transformed:
                    parts = transformed.split("## 🔗 相關章節索引")
                    transformed = parts[0] + "\n".join(ans_lines) + "\n\n## 🔗 相關章節索引" + parts[1]
                else:
                    transformed += "\n" + "\n".join(ans_lines)

            with open(p, "w", encoding="utf-8") as file:
                file.write(transformed)

            print(f"[SUCCESS] {subj}/{f}: {len(sec_ids)} tree sections, {len(ans_blocks)} answer blocks converted")

def upgrade_os_and_ds():
    for subj in ["作業系統", "資料結構"]:
        subj_dir = os.path.join(base_dir, subj)
        for f in sorted(os.listdir(subj_dir)):
            if not f.endswith(".md") or f.startswith("_"):
                continue
            p = os.path.join(subj_dir, f)
            with open(p, "r", encoding="utf-8") as file:
                content = file.read()

            title_m = re.search(r"^#\s+(.*)", content, re.MULTILINE)
            title = title_m.group(1).strip() if title_m else f"{subj} {f}"

            mermaid_m = re.search(r"```mermaid\s*graph TD([\s\S]*?)```", content)
            if not mermaid_m:
                print(f"[SKIP MERMAID] No graph TD in {subj}/{f}")
                continue

            old_body = mermaid_m.group(1).rstrip()
            sec_matches = re.findall(r'Root\s*-->\s*(\w+)\s*\["([^"]+)"\]', old_body)
            new_body = re.sub(r'Root\["([^"]+)"\]', r'Root(["\1"])', old_body)

            click_lines = ["", "    %% 節點點擊跳轉事件 (可點擊跳轉至各知識點)"]
            checklist_lines = [
                '<a id="tree-diagram"></a>',
                '',
                '### 🎯 本章學習進度檢核 (完成後打勾，建立成就反饋)'
            ]

            for idx, (sec_id, sec_title) in enumerate(sec_matches, 1):
                clean_title = re.sub(r"<br>.*", "", sec_title).strip()
                click_lines.append(f'    click {sec_id} href "#sec-{idx}" "👉 點擊閱讀 {clean_title}"')
                checklist_lines.append(f'- [ ] [{clean_title}](#sec-{idx})')

            new_mermaid_code = "flowchart LR" + new_body + "\n" + "\n".join(click_lines)
            checklist_str = "\n".join(checklist_lines)

            rep_mermaid = f"```mermaid\n{new_mermaid_code}\n```\n\n{checklist_str}\n"
            content = content[:mermaid_m.start()] + rep_mermaid + content[mermaid_m.end():]

            # Section anchors
            lines = content.split("\n")
            new_lines = []
            sec_idx = 0
            for line in lines:
                if line.startswith("### ") and not any(line.startswith(prefix) for prefix in ["### 🎯", "### 🔑", "### 歷屆", "### 基礎", "### 進階"]):
                    sec_idx += 1
                    new_lines.append(f'<a id="sec-{sec_idx}"></a>')
                new_lines.append(line)

            full_text = "\n".join(new_lines)

            # Questions anchors
            q_matches = list(re.finditer(r"####\s+(Q\d+)\.", full_text))
            for q_m in reversed(q_matches):
                q_id = q_m.group(1).lower()
                start = q_m.start()
                if f'<a id="{q_id}">' not in full_text[max(0, start-40):start]:
                    full_text = full_text[:start] + f'<a id="{q_id}"></a>\n' + full_text[start:]

            # Replace details
            ans_blocks = []
            def replace_os_details(match):
                preceding = full_text[:match.start()]
                last_q = list(re.finditer(r'<a id="(q\d+)">', preceding))
                q_id = last_q[-1].group(1) if last_q else f"q{len(ans_blocks) + 1}"
                inner = match.group(1).strip()
                ans_blocks.append((q_id, inner))
                return f"\n👉 [查看 {q_id.upper()} 答案與詳細解析](#ans-{q_id})\n"

            details_pattern = re.compile(r"<details>\s*<summary>.*?👉 點擊展開答案與詳細解析.*?</summary>([\s\S]*?)</details>", re.DOTALL)
            transformed = details_pattern.sub(replace_os_details, full_text)

            # Build Answer Key
            if ans_blocks:
                ans_lines = [
                    "",
                    "---",
                    "",
                    "## 🔑 本章練習題答案與詳細解析 (Answer Key)",
                    ""
                ]
                for q_id, inner in ans_blocks:
                    ans_lines.append(f'<a id="ans-{q_id}"></a>')
                    ans_lines.append(f"### {q_id.upper()} 答案與詳細解析")
                    ans_lines.append("")
                    ans_lines.append(inner)
                    ans_lines.append("")
                    ans_lines.append(f"[🔙 返回題目 {q_id.upper()}](#{q_id}) ｜ [🔝 返回知識架構圖](#tree-diagram)")
                    ans_lines.append("")
                    ans_lines.append("---")
                    ans_lines.append("")

                if "## 📊 重點速記表" in transformed:
                    parts = transformed.split("## 📊 重點速記表")
                    transformed = parts[0] + "\n".join(ans_lines) + "\n\n## 📊 重點速記表" + parts[1]
                elif "## 🔗 相關章節索引" in transformed:
                    parts = transformed.split("## 🔗 相關章節索引")
                    transformed = parts[0] + "\n".join(ans_lines) + "\n\n## 🔗 相關章節索引" + parts[1]
                else:
                    transformed += "\n" + "\n".join(ans_lines)

            with open(p, "w", encoding="utf-8") as file:
                file.write(transformed)

            print(f"[SUCCESS] {subj}/{f}: {len(sec_matches)} tree sections, {len(ans_blocks)} questions converted")

def upgrade_index_files():
    # Add click links in index files if not present
    for subj in ["作業系統", "統計學", "經濟學", "資料結構"]:
        p = os.path.join(base_dir, subj, "_INDEX.md")
        if not os.path.exists(p):
            continue
        with open(p, "r", encoding="utf-8") as file:
            txt = file.read()
        
        # Check if click events already exist
        if "click CH1" in txt:
            continue
            
        # Add click links to mermaid block
        mermaid_m = re.search(r"```mermaid([\s\S]*?)```", txt)
        if mermaid_m:
            body = mermaid_m.group(1).rstrip()
            # find all CH\d+
            chs = sorted(list(set(re.findall(r"\bCH(\d+)\b", body))))
            click_lines = ["", "    %% 章節節點點擊跳轉事件"]
            for ch_num in chs:
                click_lines.append(f'    click CH{ch_num} href "./Chapter_{ch_num}_教材.md" "👉 開啟 Chapter {ch_num} 教材"')
            new_mermaid = f"```mermaid{body}\n" + "\n".join(click_lines) + "\n```"
            txt = txt[:mermaid_m.start()] + new_mermaid + txt[mermaid_m.end():]
            with open(p, "w", encoding="utf-8") as file:
                file.write(txt)
            print(f"[SUCCESS] {subj}/_INDEX.md: added {len(chs)} click links")

if __name__ == "__main__":
    print("Starting full upgrade...")
    upgrade_stats_and_econ()
    upgrade_os_and_ds()
    upgrade_index_files()
    print("Upgrade finished successfully!")
