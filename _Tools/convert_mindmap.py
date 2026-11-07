import os
import re

def convert_mindmap_to_flowchart(mindmap_code, chapter_title=""):
    """
    Converts a mindmap mermaid block into flowchart LR
    """
    lines = mindmap_code.strip().split("\n")
    root_text = chapter_title or "章節核心架構"
    nodes = [] # (indent, text)
    
    for line in lines[1:]:
        line_clean = line.rstrip()
        if not line_clean.strip():
            continue
        raw_text = line_clean.strip()
        if raw_text.startswith("root"):
            m = re.search(r"root\(\((.*?)\)\)", raw_text) or re.search(r"root\[(.*?)\]", raw_text) or re.search(r"root\((.*?)\)", raw_text)
            if m:
                root_text = m.group(1).strip()
            else:
                root_text = raw_text.replace("root", "").strip()
            continue
            
        indent = len(line_clean) - len(line_clean.lstrip())
        t = raw_text
        if (t.startswith("(") and t.endswith(")")) or (t.startswith("[") and t.endswith("]")):
            t = t[1:-1].strip()
        nodes.append((indent, t))
    
    if not nodes:
        return f"flowchart LR\n    Root[\"{root_text}\"]\n", []

    indents = sorted(list(set(n[0] for n in nodes)))
    indent_map = {ind: idx for idx, ind in enumerate(indents)}
    
    flow_lines = [
        "flowchart LR",
        f'    Root(["{root_text.replace('"', "'")}"])',
        ""
    ]
    
    sec_count = 0
    sub_count = 0
    det_count = 0
    
    stack = [("Root", -1)]
    sec_ids = []
    
    for indent, text in nodes:
        level = indent_map[indent]
        while stack and stack[-1][1] >= level:
            stack.pop()
        parent_id = stack[-1][0] if stack else "Root"
        
        safe_text = text.replace('"', "'")
        
        if level == 0:
            sec_count += 1
            node_id = f"Sec{sec_count}"
            stack.append((node_id, level))
            flow_lines.append(f'    {parent_id} --> {node_id}["{safe_text}"]')
            sec_ids.append((node_id, safe_text, sec_count))
        elif level == 1:
            sub_count += 1
            node_id = f"Sub{sub_count}"
            stack.append((node_id, level))
            flow_lines.append(f'    {parent_id} --> {node_id}["{safe_text}"]')
        else:
            det_count += 1
            node_id = f"Det{det_count}"
            stack.append((node_id, level))
            flow_lines.append(f'    {parent_id} --> {node_id}["{safe_text}"]')
            
    flow_lines.append("")
    flow_lines.append("    %% 節點點擊跳轉事件 (可點擊跳轉至各知識點)")
    for sec_id, sec_title, sec_num in sec_ids:
        flow_lines.append(f'    click {sec_id} href "#sec-{sec_num}" "👉 點擊前往 {sec_title}"')
        
    return "\n".join(flow_lines), sec_ids
