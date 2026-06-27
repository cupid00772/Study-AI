# 第 1 章：極限與連續 (Limits and Continuity) 掃題解答卷

## 考點分佈總表與能力分析
本卷測驗重點包含：
*   **選擇題**：極限存在條件、有理化技巧、夾擠定理應用、三角函數極限。
*   **填充題**：無窮極限運算、自然對數極限 $e$ 變形、$x \to 0$ 型態的極限、分段函數連續性求未知數、特殊型極限變形。
*   **計算題**：極限進階求值 (結合根號與三角函數)、斜漸近線 (Slant Asymptote) 完整求法。

---

## 評分建議與標準 (Marking Scheme)
*   **選擇題 (32%)**：每題 8 分。
*   **填充題 (48%)**：每題 8 分，答案必須完全化簡。
*   **計算與證明題 (20%)**：每題 10 分。
    *   Q11：若使用泰勒展開，展開至正確項數並相減得 6 分，答案正確得 4 分。若用 L'Hopital 需確保過程無誤。
    *   Q12：求出 $x \to \infty$ 的漸近線得 5 分，求出 $x \to -\infty$ 的漸近線得 5 分。

---

## 一、選擇題詳解

**1. (A)** [Easy]
*   解析：若 $\lim_{x \to a} |f(x)|$ 存在，$\lim_{x \to a} f(x)$ 不一定存在。例如 $f(x) = \begin{cases} 1, & x > 0 \\ -1, & x < 0 \end{cases}$，$\lim_{x \to 0} |f(x)| = 1$，但 $\lim_{x \to 0} f(x)$ 不存在。(A) 不正確。
*   補充：(D) 選項中，因為 $\lim f(x)g(x)$ 存在且 $\lim f(x) \neq 0$，由極限定理 $\lim g(x) = \lim \frac{f(x)g(x)}{f(x)} = \frac{\lim f(x)g(x)}{\lim f(x)}$，故 $\lim g(x)$ 必定存在，(D) 正確。

**2. (C)** [Medium]
*   解析：有理化分子。
    $$ \lim_{x \to 0} \frac{\sqrt{1+cx} - \sqrt{1-cx}}{x} \times \frac{\sqrt{1+cx} + \sqrt{1-cx}}{\sqrt{1+cx} + \sqrt{1-cx}} $$
    $$ = \lim_{x \to 0} \frac{(1+cx) - (1-cx)}{x(\sqrt{1+cx} + \sqrt{1-cx})} = \lim_{x \to 0} \frac{2cx}{x(\sqrt{1+cx} + \sqrt{1-cx})} $$
    消去 $x$ 得 $\frac{2c}{\sqrt{1}+\sqrt{1}} = c$。故 $c = 3$。

**3. (C)** [Medium]
*   解析：利用夾擠定理 (Squeeze Theorem)。
    因為 $-1 \le \sin(1/x) \le 1$，所以 $-x^2 \le x^2\sin(1/x) \le x^2$。
    當 $x \to 0$ 時，$\lim (-x^2) = 0$ 且 $\lim (x^2) = 0$。
    由夾擠定理知 $\lim_{x \to 0} x^2\sin(1/x) = 0 = f(0)$。故極限存在且函數在 $x=0$ 連續。

**4. (C)** [Medium]
*   解析：利用半角公式 $1 - \cos(2x) = 2\sin^2(x)$。
    $$ \lim_{x \to 0} \frac{1-\cos(2x)}{x^2} = \lim_{x \to 0} \frac{2\sin^2(x)}{x^2} = 2 \left( \lim_{x \to 0} \frac{\sin x}{x} \right)^2 = 2 \times 1^2 = 2 $$。

---

## 二、填充題詳解

**5. 答案：2** [Medium]
*   解析：分子有理化。
    $$ \lim_{x \to \infty} \frac{(\sqrt{x^2+4x+1}-x)(\sqrt{x^2+4x+1}+x)}{\sqrt{x^2+4x+1}+x} = \lim_{x \to \infty} \frac{x^2+4x+1-x^2}{\sqrt{x^2+4x+1}+x} $$
    $$ = \lim_{x \to \infty} \frac{4x+1}{\sqrt{x^2(1+4/x+1/x^2)}+x} = \lim_{x \to \infty} \frac{x(4+1/x)}{x(\sqrt{1+4/x+1/x^2}+1)} = \frac{4}{1+1} = 2 $$。

**6. 答案：$e^{3/2}$** [Hard]
*   解析：這屬於 $1^\infty$ 型。
    令 $L = \lim_{x \to 0^+} (1+\sin(3x))^{\frac{1}{2x}}$。
    $\lim_{x \to 0^+} \frac{1}{2x} \ln(1+\sin(3x)) = \lim_{x \to 0^+} \frac{\ln(1+\sin(3x))}{\sin(3x)} \cdot \frac{\sin(3x)}{3x} \cdot \frac{3x}{2x} = 1 \cdot 1 \cdot \frac{3}{2} = \frac{3}{2}$。
    所以 $L = e^{3/2}$。

**7. 答案：$(-1, -1)$** [Medium]
*   解析：需檢查分段點 $x=0$ 和 $x=1$ 的連續性。
    在 $x=0$：$\lim_{x \to 0^-} \frac{\sin(ax)}{x} = a$。$\lim_{x \to 0^+} (x^2+2x+b) = b$。且 $f(0)=b$。故 $a = b$。
    在 $x=1$：$\lim_{x \to 1^-} (x^2+2x+b) = 1+2+b = 3+b$。
    $\lim_{x \to 1^+} \frac{x^2-1}{x-1} = \lim_{x \to 1^+} (x+1) = 2$。且 $f(1) = 3+b$。故 $3+b = 2 \implies b = -1$。
    所以 $a = -1, b = -1$。

**8. 答案：$-1/2$** [Hard]
*   解析：令 $u = 1/x$，當 $x \to \infty, u \to 0^+$。
    原式 $= \lim_{u \to 0^+} \frac{\cos u - 1}{u^2}$。
    利用 L'Hopital 兩次：$\lim_{u \to 0} \frac{-\sin u}{2u} = \frac{-1}{2}$。
    或泰勒展開：$\cos u \approx 1 - \frac{u^2}{2}$，得 $\frac{1 - u^2/2 - 1}{u^2} = -1/2$。

**9. 答案：30** [Medium]
*   解析：由 $\lim_{x \to 2} \frac{f(x)-5}{x-2} = 3$ 存在，可知分子極限必為 $0$，故 $\lim_{x \to 2} f(x) = 5$。
    原式 $= \lim_{x \to 2} \frac{(f(x)-5)(f(x)+5)}{x-2} = \lim_{x \to 2} \left[ \frac{f(x)-5}{x-2} \cdot (f(x)+5) \right] = 3 \cdot (\lim_{x \to 2} f(x) + 5) = 3 \cdot (5+5) = 30$。

**10. 答案：$-2$** [Hard]
*   解析：利用泰勒展開最快。
    $\sin x \approx x - \frac{x^3}{6}$。
    $\tan x \approx x + \frac{x^3}{3}$。
    分子：$x - (x + x^3/3) = -x^3/3$。
    分母：$x - (x - x^3/6) = x^3/6$。
    極限為 $\frac{-1/3}{1/6} = -2$。

---

## 三、計算與證明題詳解

**11.** [Hard]
*   **答案：$\frac{1}{4}$**
*   **解析：**
    利用泰勒展開式 (Taylor Series) 是最有效率的解法。
    已知 $\sqrt{1+u} \approx 1 + \frac{1}{2}u - \frac{1}{8}u^2 + \frac{1}{16}u^3 + \cdots$
    $\tan x \approx x + \frac{x^3}{3}$ 且 $\sin x \approx x - \frac{x^3}{6}$。
    
    將 $u = \tan x$ 代入：
    $\sqrt{1+\tan x} \approx 1 + \frac{1}{2}\left(x + \frac{x^3}{3}\right) - \frac{1}{8}(x)^2 + \frac{1}{16}(x)^3$
    $= 1 + \frac{1}{2}x - \frac{1}{8}x^2 + \left(\frac{1}{6} + \frac{1}{16}\right)x^3 = 1 + \frac{1}{2}x - \frac{1}{8}x^2 + \frac{11}{48}x^3$
    
    將 $u = \sin x$ 代入：
    $\sqrt{1+\sin x} \approx 1 + \frac{1}{2}\left(x - \frac{x^3}{6}\right) - \frac{1}{8}(x)^2 + \frac{1}{16}(x)^3$
    $= 1 + \frac{1}{2}x - \frac{1}{8}x^2 + \left(-\frac{1}{12} + \frac{1}{16}\right)x^3 = 1 + \frac{1}{2}x - \frac{1}{8}x^2 - \frac{1}{48}x^3$
    
    將兩者相減：
    $\sqrt{1+\tan x} - \sqrt{1+\sin x} \approx \left(\frac{11}{48} - \left(-\frac{1}{48}\right)\right)x^3 = \frac{12}{48}x^3 = \frac{1}{4}x^3$
    
    因此，原極限：
    $\lim_{x \to 0} \frac{\frac{1}{4}x^3}{x^3} = \frac{1}{4}$。

**12.** [Medium-Hard]
*   **答案：$y = x - 2$ (當 $x \to \infty$) 以及 $y = -x + 2$ (當 $x \to -\infty$)**
*   **解析：**
    求斜漸近線 $y = mx + c$：
    
    **(1) 當 $x \to \infty$ 時：**
    $m = \lim_{x \to \infty} \frac{f(x)}{x} = \lim_{x \to \infty} \frac{\sqrt{x^2-4x+5}}{x} = \lim_{x \to \infty} \sqrt{1 - \frac{4}{x} + \frac{5}{x^2}} = 1$。
    
    $c = \lim_{x \to \infty} (f(x) - mx) = \lim_{x \to \infty} (\sqrt{x^2-4x+5} - x)$
    (有理化) $= \lim_{x \to \infty} \frac{x^2-4x+5 - x^2}{\sqrt{x^2-4x+5} + x} = \lim_{x \to \infty} \frac{-4x+5}{\sqrt{x^2-4x+5} + x}$
    上下同除以 $x$：$= \lim_{x \to \infty} \frac{-4 + \frac{5}{x}}{\sqrt{1-\frac{4}{x}+\frac{5}{x^2}} + 1} = \frac{-4}{1+1} = -2$。
    所以，當 $x \to \infty$ 時的斜漸近線為 **$y = x - 2$**。

    **(2) 當 $x \to -\infty$ 時：**
    $m = \lim_{x \to -\infty} \frac{f(x)}{x} = \lim_{x \to -\infty} \frac{\sqrt{x^2-4x+5}}{x}$
    (注意：當 $x < 0$ 時，$\sqrt{x^2} = |x| = -x$，故將 $x$ 提進根號會多一個負號)
    $= \lim_{x \to -\infty} -\sqrt{1 - \frac{4}{x} + \frac{5}{x^2}} = -1$。
    
    $c = \lim_{x \to -\infty} (f(x) - mx) = \lim_{x \to -\infty} (\sqrt{x^2-4x+5} - (-x)) = \lim_{x \to -\infty} (\sqrt{x^2-4x+5} + x)$
    (有理化) $= \lim_{x \to -\infty} \frac{x^2-4x+5 - x^2}{\sqrt{x^2-4x+5} - x} = \lim_{x \to -\infty} \frac{-4x+5}{\sqrt{x^2-4x+5} - x}$
    上下同除以 $|x| = -x$ (因為 $x < 0$)：
    $= \lim_{x \to -\infty} \frac{4 - \frac{5}{x}}{\sqrt{1-\frac{4}{x}+\frac{5}{x^2}} + 1} = \frac{4}{1+1} = 2$。
    所以，當 $x \to -\infty$ 時的斜漸近線為 **$y = -x + 2$**。
    
    *(另解：可利用配方 $f(x) = \sqrt{(x-2)^2 + 1}$，當 $|x|$ 很大時，$\sqrt{(x-2)^2 + 1} \approx \sqrt{(x-2)^2} = |x-2|$。當 $x \to \infty$，漸近線為 $y = x-2$；當 $x \to -\infty$，漸近線為 $y = -(x-2) = -x+2$。)*
