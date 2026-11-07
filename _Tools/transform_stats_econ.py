import os
import sys
import re

cur_dir = os.path.dirname(os.path.abspath(__file__))
if cur_dir not in sys.path:
    sys.path.append(cur_dir)

from convert_mindmap import convert_mindmap_to_flowchart


base_dir = r"c:\Users\Cupid\Downloads\Study-space\Study_Materials"

def transform_stats_or_econ(file_path, dry_run=True):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # 1. Title
    title_m = re.search(r"^#\s+(.*)", content, re.MULTILINE)
    title = title_m.group(1).strip() if title_m else ""

    # 2. Convert Mermaid
    # Search for mermaid block
    mermaid_m = re.search(r"```mermaid([\s\S]*?)```", content)
    if not mermaid_m:
        print(f"No mermaid in {file_path}")
        return
        
    old_mermaid = mermaid_m.group(1).strip()
    new_mermaid, sec_ids = convert_mindmap_to_flowchart(old_mermaid, title)
    
    # 3. Build Checklist
    checklist_lines = [
        '<a id="tree-diagram"></a>',
        '',
        '### 🎯 本章學習進度檢核 (完成後打勾，建立成就反饋)',
    ]
    for _, sec_title, sec_num in sec_ids:
        checklist_lines.append(f"- [ ] [{sec_title}](#sec-{sec_num})")
    checklist_str = "\n".join(checklist_lines)
    
    # Replace the mermaid block and add checklist
    replacement_mermaid = f"```mermaid\n{new_mermaid}\n```\n\n{checklist_str}\n"
    content = content[:mermaid_m.start()] + replacement_mermaid + content[mermaid_m.end():]
    
    # 4. Insert section anchors and return links
    # Find all "### X.Y " or "### [number]" headings
    # In stats: "### 1.1 ..."
    # In econ: "### 導論..." or "### 1. ..." or "### 原理一..."
    lines = content.split("\n")
    new_lines = []
    current_sec_idx = 0
    ans_blocks = [] # [(sec_num, sec_title, inner_ans)]
    
    # To handle details in stats & econ:
    # Each section might have <details><summary>🔑 答案與解析</summary>...</details>
    # We can match them per section
    i = 0
    while i < len(lines):
        line = lines[i]
        # Check if heading level 3
        if line.startswith("### ") and not line.startswith("### 🎯") and not line.startswith("### 🔑"):
            current_sec_idx += 1
            sec_title_clean = line.replace("### ", "").strip()
            # If previous section exists and we are starting a new section, we can insert return link before it if needed
            new_lines.append(f'<a id="sec-{current_sec_idx}"></a>')
            new_lines.append(line)
            i += 1
            continue
            
        # Check for practice questions header
        if "#### ✏️ 練習題" in line:
            new_lines.append(f'<a id="q-sec-{current_sec_idx}"></a>')
            new_lines.append(line)
            i += 1
            continue
            
        new_lines.append(line)
        i += 1
        
    full_text = "\n".join(new_lines)
    
    # Now extract all <details> blocks and replace them with jump links
    details_pattern = re.compile(r"<details>\s*<summary>.*?</summary>([\s\S]*?)</details>", re.DOTALL)
    
    # We can associate each details with the preceding section
    # Let's find matches and their positions
    def replace_details(match):
        preceding = full_text[:match.start()]
        # find last <a id="sec-(\d+)">
        sec_matches = list(re.finditer(r'<a id="sec-(\d+)">', preceding))
        if sec_matches:
            sec_n = int(sec_matches[-1].group(1))
        else:
            sec_n = len(ans_blocks) + 1
            
        inner_content = match.group(1).strip()
        ans_blocks.append((sec_n, inner_content))
        return f"\n👉 [查看本節練習題答案與詳細解析](#ans-sec-{sec_n})\n"
        
    transformed_text = details_pattern.sub(replace_details, full_text)
    
    # 5. Build Answer Key Section
    if ans_blocks:
        ans_key_lines = [
            "",
            "---",
            "",
            "## 🔑 本章練習題答案與詳細解析 (Answer Key)",
            ""
        ]
        for sec_n, inner_content in ans_blocks:
            # find section title from sec_ids if available
            s_title = f"第 {sec_n} 節"
            for _, title_item, num_item in sec_ids:
                if num_item == sec_n:
                    s_title = title_item
                    break
            ans_key_lines.append(f'<a id="ans-sec-{sec_n}"></a>')
            ans_key_lines.append(f"### {s_title} — 練習題答案與詳細解析")
            ans_key_lines.append("")
            ans_key_lines.append(inner_content)
            ans_key_lines.append("")
            ans_key_lines.append(f"[🔙 返回本節練習題](#q-sec-{sec_n}) ｜ [🔝 返回知識架構圖](#tree-diagram)")
            ans_key_lines.append("")
            ans_key_lines.append("---")
            ans_key_lines.append("")
            
        # Append before references or at the very end
        if "## 🔗 相關章節索引" in transformed_text:
            parts = transformed_text.split("## 🔗 相關章節索引")
            transformed_text = parts[0] + "\n".join(ans_key_lines) + "\n\n## 🔗 相關章節索引" + parts[1]
        elif "## 🎯 全科考前必背" in transformed_text:
            parts = transformed_text.split("## 🎯 全科考前必背")
            transformed_text = parts[0] + "\n".join(ans_key_lines) + "\n\n## 🎯 全科考前必背" + parts[1]
        else:
            transformed_text += "\n" + "\n".join(ans_key_lines)

    if not dry_run:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(transformed_text)
            
    print(f"[OK] {os.path.basename(file_path)}: {len(sec_ids)} tree sections, {len(ans_blocks)} answer blocks")

print("Loaded transform module")
