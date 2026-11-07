import os
import sys
import re

def transform_os_or_ds(file_path, dry_run=True):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Title
    title_m = re.search(r"^#\s+(.*)", content, re.MULTILINE)
    title = title_m.group(1).strip() if title_m else ""

    # 2. Mermaid conversion from graph TD to flowchart LR
    mermaid_m = re.search(r"```mermaid\s*graph TD([\s\S]*?)```", content)
    if not mermaid_m:
        print(f"No graph TD mermaid in {file_path}")
        return

    old_mermaid_body = mermaid_m.group(1).rstrip()
    
    # Find all top-level sections connected directly from Root
    sec_matches = re.findall(r'Root\s*-->\s*(\w+)\s*\["([^"]+)"\]', old_mermaid_body)
    
    # We want to change Root shape to rounded rectangle Root(["..."]) if it's Root["..."]
    new_body = re.sub(r'Root\["([^"]+)"\]', r'Root(["\1"])', old_mermaid_body)
    
    # Append click events for all Sec nodes
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

    replacement_mermaid = f"```mermaid\n{new_mermaid_code}\n```\n\n{checklist_str}\n"
    content = content[:mermaid_m.start()] + replacement_mermaid + content[mermaid_m.end():]

    # 3. Add section anchors
    lines = content.split("\n")
    new_lines = []
    sec_idx = 0
    
    for line in lines:
        if line.startswith("### ") and not line.startswith("### 🎯") and not line.startswith("### 🔑") and not line.startswith("### 歷屆") and not line.startswith("### 基礎") and not line.startswith("### 進階"):
            sec_idx += 1
            new_lines.append(f'<a id="sec-{sec_idx}"></a>')
        new_lines.append(line)
        
    full_text = "\n".join(new_lines)

    # 4. Handle Questions and Details
    # Find questions like "#### Q1. (單選題)..." or "#### Q1."
    # Add <a id="q{n}"></a> before each question
    # And replace its <details> with jump link
    q_matches = list(re.finditer(r"####\s+(Q\d+)\.", full_text))
    
    # Replace each question header to include anchor: <a id="q1"></a>\n#### Q1.
    for q_m in reversed(q_matches):
        q_id = q_m.group(1).lower()
        start = q_m.start()
        # check if already has anchor
        if f'<a id="{q_id}">' not in full_text[max(0, start-40):start]:
            full_text = full_text[:start] + f'<a id="{q_id}"></a>\n' + full_text[start:]

    # Extract all details blocks
    details_pattern = re.compile(r"<details>\s*<summary>.*?👉 點擊展開答案與詳細解析.*?</summary>([\s\S]*?)</details>", re.DOTALL)
    
    ans_blocks = []
    
    def replace_os_details(match):
        preceding = full_text[:match.start()]
        # find the nearest question before this details
        last_q = list(re.finditer(r'<a id="(q\d+)">', preceding))
        if last_q:
            q_id = last_q[-1].group(1)
        else:
            q_id = f"q{len(ans_blocks) + 1}"
            
        inner_content = match.group(1).strip()
        ans_blocks.append((q_id, inner_content))
        return f"\n👉 [查看 {q_id.upper()} 答案與詳細解析](#ans-{q_id})\n"

    transformed_text = details_pattern.sub(replace_os_details, full_text)

    # 5. Build Answer Key
    if ans_blocks:
        ans_key_lines = [
            "",
            "---",
            "",
            "## 🔑 本章練習題答案與詳細解析 (Answer Key)",
            ""
        ]
        for q_id, inner_content in ans_blocks:
            ans_key_lines.append(f'<a id="ans-{q_id}"></a>')
            ans_key_lines.append(f"### {q_id.upper()} 答案與詳細解析")
            ans_key_lines.append("")
            ans_key_lines.append(inner_content)
            ans_key_lines.append("")
            ans_key_lines.append(f"[🔙 返回題目 {q_id.upper()}](#{q_id}) ｜ [🔝 返回知識架構圖](#tree-diagram)")
            ans_key_lines.append("")
            ans_key_lines.append("---")
            ans_key_lines.append("")

        if "## 📊 重點速記表" in transformed_text:
            parts = transformed_text.split("## 📊 重點速記表")
            transformed_text = parts[0] + "\n".join(ans_key_lines) + "\n\n## 📊 重點速記表" + parts[1]
        elif "## 🔗 相關章節索引" in transformed_text:
            parts = transformed_text.split("## 🔗 相關章節索引")
            transformed_text = parts[0] + "\n".join(ans_key_lines) + "\n\n## 🔗 相關章節索引" + parts[1]
        else:
            transformed_text += "\n" + "\n".join(ans_key_lines)

    if not dry_run:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(transformed_text)

    print(f"[OK] {os.path.basename(file_path)}: {len(sec_matches)} tree sections, {len(ans_blocks)} questions/answers converted")
