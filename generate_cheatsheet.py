from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()
# set narrow margins
sections = doc.sections
for section in sections:
    section.top_margin = Inches(0.5)
    section.bottom_margin = Inches(0.5)
    section.left_margin = Inches(0.5)
    section.right_margin = Inches(0.5)

# Add title
title = doc.add_heading('機率與統計 考前必備小抄 (Ch2, 3.1-3.2, 4.1-4.7)', 0)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

def add_heading(text, level=1):
    h = doc.add_heading(text, level)
    run = h.runs[0]
    run.font.color.rgb = RGBColor(0, 51, 102)

def add_bullet(text):
    doc.add_paragraph(text, style='List Bullet')

def add_weakness(text):
    p = doc.add_paragraph()
    r = p.add_run("⚠️ 弱點提示 (隨時補充)：")
    r.bold = True
    r.font.color.rgb = RGBColor(204, 0, 0)
    p.add_run(" " + text)

add_heading("Ch 2 機率與貝氏定理 (Probability & Bayes' Theorem)")
add_bullet("聯集機率 (Union): P(A ∪ B) = P(A) + P(B) - P(A ∩ B)")
add_bullet("條件機率 (Conditional Prob): P(A | B) = P(A ∩ B) / P(B)")
add_bullet("獨立事件 (Independent): P(A ∩ B) = P(A)P(B)  (💡注意：獨立與「互斥」不同，互斥是P(A ∩ B) = 0)")
add_bullet("全機率定理 (Law of Total Prob): P(B) = Σ P(B | A_i) P(A_i)")
add_bullet("貝氏定理 (Bayes' Theorem): P(A_i | B) = [P(B | A_i) P(A_i)] / P(B)")
add_weakness("遇到「抽菸與疾病」、「瑕疵品分類」等歷屆題型，立刻畫樹狀圖(Tree Diagram)！先將分支機率標上去。")
add_weakness("注意「抽出不放回(Without Replacement)」的情況，分母與分子會隨每次抽取遞減。")

add_heading("Ch 3.1 - 3.2 離散型隨機變數 (Discrete Random Variables)")
add_bullet("機率質量函數 (PMF): P_X(x) = P(X = x)")
add_bullet("期望值 (Expected Value): E[X] = Σ x * P_X(x)")
add_bullet("函數期望值: E[g(X)] = Σ g(x) * P_X(x)")
add_bullet("變異數 (Variance): Var(X) = E[(X - μ)²] = E[X²] - (E[X])²")
add_bullet("標準差 (Standard Deviation): σ = √Var(X)")
add_weakness("若題目要求計算 Var(X²)，公式為 Var(X²) = E[X⁴] - (E[X²])²，要算出每個x的四次方。這在歷屆題有出過，不要跟 E[X²] 搞混。")

add_heading("Ch 4.1 - 4.7 連續型隨機變數 (Continuous Random Variables)")
add_bullet("機率密度函數 (PDF) 性質: ∫ f(x) dx = 1 (在所有可能區間積分為1)")
add_bullet("累積分布函數 (CDF): F(x) = P(X ≤ x) = ∫_(-∞)^x f(t) dt")
add_bullet("期望值 (Expected Value): E[X] = ∫ x * f(x) dx")
add_bullet("變異數 (Variance): Var(X) = E[X²] - (E[X])² = ∫ x² * f(x) dx - μ²")
add_bullet("均勻分配 (Uniform Distribution): f(x) = 1/(b-a), 期望值 (a+b)/2, 變異數 (b-a)²/12")
add_weakness("條件期望值 E[X | X ≤ a] 的陷阱：計算時必須要「除以 P(X ≤ a)」。\n公式: E[X | X ≤ a] = ( ∫_(-∞)^a x*f(x) dx ) / P(X ≤ a)。歷屆題常考給定條件下的期望值！")

add_heading("聯合機率分配 (Joint Probability) 與其他重點 (補充教材/歷屆)")
add_bullet("聯合 PMF: P_{X,Y}(x, y)")
add_bullet("邊際分配 (Marginal Prob): P_X(x) = Σ_y P_{X,Y}(x, y)")
add_bullet("獨立隨機變數: P_{X,Y}(x, y) = P_X(x) * P_Y(y)")
add_bullet("線性組合: E[aX + bY] = aE[X] + bE[Y]；若獨立，Var(aX + bY) = a²Var(X) + b²Var(Y)")
add_weakness("多變數超幾何分配(Hypergeometric)題型 (例如：從N個物品中抽出n個)：分母是總組合數 C(N, n)，分子是各項分別取出的組合數相乘。要確定邊際機率的求法。")

doc.save('機率與統計小抄.docx')
