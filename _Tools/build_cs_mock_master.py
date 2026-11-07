# -*- coding: utf-8 -*-
import os

cs_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "Test_Bank", "Exam_paper", "Transfer", "計算機概論")
out_file = os.path.join(cs_dir, "CS_Mock_Exams_Master.md")

exams = [
    ("第 1 回模擬試題 (Mock Exam 1)", "Mock_Exam_1.md", "Answers_1.md", "程式指標、快取記憶體、二元搜尋樹與補數"),
    ("第 3 回模擬試題 (Mock Exam 3)", "Mock_Exam_3.md", "Answers_3.md", "字串記憶體大小、作業系統排程與管線化"),
    ("第 4 回模擬試題 (Mock Exam 4)", "Mock_Exam_4.md", "Answers_4.md", "虛擬記憶體分頁、TCP/IP 與演算法時間複雜度"),
    ("第 5 回模擬試題 (Mock Exam 5)", "Mock_Exam_5.md", "Answers_5.md", "IEEE 754 浮點數轉換、布林代數與數位邏輯閘"),
    ("第 6 回模擬試題 (Mock Exam 6)", "Mock_Exam_6.md", "Answers_6.md", "資料庫正規化、SQL 語法與加密雜湊演算法"),
    ("第 7 回模擬試題 (Mock Exam 7)", "Mock_Exam_7.md", "Answers_7.md", "圖形演算法 (Dijkstra, Prim)、最小生成樹與堆疊佇列"),
    ("第 8 回模擬試題 (Mock Exam 8)", "Mock_Exam_8.md", "Answers_8.md", "全真綜合衝刺模擬測驗，全方位覆蓋台聯大考點"),
    ("專題強化測驗 (Targeted Exam 1)", "Targeted_Exam_1.md", "Targeted_Answers_1.md", "數位邏輯、組合電路與計概弱點專題特訓"),
    ("專題強化測驗 (Targeted Exam 2)", "Targeted_Exam_2.md", "Targeted_Answers_2.md", "作業系統同步 (Mutex/Semaphore) 與網路通訊專題")
]

doc = """# 國立臺灣聯合大學系統 計算機概論 模擬試題與詳解總目錄 (第 1 ~ 8 回全集)

> 🎯 **適用對象**：台聯大轉學考、台綜大計算機概論衝刺考生  
> 📚 **收錄回數**：全真模擬考題第 1 ~ 8 回 + 弱點專題測驗卷與完整詳解  
> 💡 **使用說明**：點擊各回「試卷」或「解答」可快速跳轉檢閱，作答完成後可在 Task Commander 標記完成以獲取 XP 升級經驗！

---

## 📑 試卷與解答總覽目錄

| 回數 | 測驗名稱 | 核心考點摘要 | 試卷連結 | 解答連結 |
| :---: | :--- | :--- | :---: | :---: |
"""

for title, q_file, a_file, desc in exams:
    doc += f"| 📌 | **{title}** | {desc} | [`開啟試題本`]({q_file}) | [`開啟解析卷`]({a_file}) |\n"

doc += "\n---\n\n"

# Append each exam's content with clear anchors
for title, q_file, a_file, desc in exams:
    doc += f"## 📝 {title}\n\n"
    doc += f"> 💡 **本回考點**：{desc}  \n"
    doc += f"> 📄 **試卷檔案**：`{q_file}` ｜ 🔑 **詳解檔案**：`{a_file}`\n\n"
    
    q_path = os.path.join(cs_dir, q_file)
    if os.path.exists(q_path):
        with open(q_path, "r", encoding="utf-8") as f:
            q_content = f.read()
        doc += f"<details>\n<summary><b>👉 點擊展開「{title} 完整試卷題目」</b></summary>\n\n{q_content}\n\n</details>\n\n"

    a_path = os.path.join(cs_dir, a_file)
    if os.path.exists(a_path):
        with open(a_path, "r", encoding="utf-8") as f:
            a_content = f.read()
        doc += f"<details>\n<summary><b>🔑 點擊展開「{title} 完整解答與逐步推理」</b></summary>\n\n{a_content}\n\n</details>\n\n"
    
    doc += "---\n\n"

with open(out_file, "w", encoding="utf-8") as f:
    f.write(doc)

print(f"Successfully generated {out_file} ({len(doc)} chars)")

