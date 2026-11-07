# -*- coding: utf-8 -*-
import os

sol_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "Test_Bank", "Solutions")
f114 = os.path.join(sol_dir, "NTU_114_Calculus_B_Solution.md")
f113 = os.path.join(sol_dir, "NTU_113_Calculus_B_Solution.md")
f112 = os.path.join(sol_dir, "NTU_112_Calculus_B_Solution.md")
out_file = os.path.join(sol_dir, "NTU_Calculus_B_112_114_Master.md")

with open(f114, "r", encoding="utf-8") as f:
    c114 = f.read()
with open(f113, "r", encoding="utf-8") as f:
    c113 = f.read()
with open(f112, "r", encoding="utf-8") as f:
    c112 = f.read()

header = """# 國立臺灣大學 112 ~ 114 學年度轉學生招生考試 微積分(B) 歷屆真題詳解全集

> 🎯 **適用對象**：台大、台聯大轉學考微積分(B) 考生  
> 📚 **收錄年份**：114 學年度、113 學年度、112 學年度（全題目完整解答與逐步推導）  
> 🧮 **數學符號**：已全面升級 KaTeX 渲染引擎，呈現標準數學教科書排版符號  

---

## 快速導航目錄
- [👉 前往 114 學年度台大微積分(B) 試題詳解](#part-114)
- [👉 前往 113 學年度台大微積分(B) 試題詳解](#part-113)
- [👉 前往 112 學年度台大微積分(B) 試題詳解](#part-112)

---

<div id="part-114"></div>

"""

content = header + c114 + "\n\n---\n\n<div id=\"part-113\"></div>\n\n" + c113 + "\n\n---\n\n<div id=\"part-112\"></div>\n\n" + c112

with open(out_file, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_file} ({len(content)} chars)")

