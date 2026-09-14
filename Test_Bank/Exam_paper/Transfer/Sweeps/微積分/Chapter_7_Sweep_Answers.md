# Chapter 7: 瑕積分 (Improper Integrals) - 掃題大師 解答卷

## 第一部分：計算題

**1. (10%)** $\int_{0}^{\infty} x^2 e^{-x} \, dx$
*   **解法：** 使用瑕積分定義並結合兩次分部積分 (Integration by Parts) 或表格法。
*   $\int x^2 e^{-x} \, dx = -x^2 e^{-x} - 2x e^{-x} - 2e^{-x} + C$
*   $\lim_{b \to \infty} \left[ -e^{-x}(x^2+2x+2) \right]_0^b$
*   $\lim_{b \to \infty} -e^{-b}(b^2+2b+2) - (-e^0(0+0+2)) = 0 - (-2) = 2$
*   **答案：** Converges to **2**

**2. (10%)** $\int_{-1}^{1} \frac{1}{\sqrt{1-x^2}} \, dx$
*   **解法：** Type 2 瑕積分，瑕點在 $x=1$ 與 $x=-1$。需拆分為兩段： $\int_{-1}^{0} + \int_{0}^{1}$
*   原函數為 $\arcsin(x)$
*   $\int_{0}^{1} \frac{dx}{\sqrt{1-x^2}} = \lim_{b \to 1^-} \arcsin(b) - \arcsin(0) = \frac{\pi}{2} - 0 = \frac{\pi}{2}$
*   $\int_{-1}^{0} \frac{dx}{\sqrt{1-x^2}} = \arcsin(0) - \lim_{a \to -1^+} \arcsin(a) = 0 - (-\frac{\pi}{2}) = \frac{\pi}{2}$
*   $\frac{\pi}{2} + \frac{\pi}{2} = \pi$
*   **答案：** Converges to **$\pi$**

**3. (10%)** $\int_{0}^{3} \frac{1}{x-1} \, dx$
*   **解法：** Type 2 瑕積分，瑕點在區間內部 $x=1$。必須拆成 $\int_{0}^{1} + \int_{1}^{3}$。
*   $\int_{0}^{1} \frac{dx}{x-1} = \lim_{b \to 1^-} [\ln|x-1|]_0^b = \lim_{b \to 1^-} \ln|b-1| - \ln 1 = -\infty$
*   因為其中一部份發散，所以整體瑕積分發散。
*   *(常犯錯誤：直接積成 $[\ln|x-1|]_0^3 = \ln 2 - 0 = \ln 2$，完全忽略 $x=1$ 的瑕點。)*
*   **答案：** **Diverges** (發散)

**4. (15%)** $\int_{-\infty}^{\infty} \frac{x}{1+x^2} \, dx$
*   **解法：** Type 1 瑕積分，兩端皆為無窮大。必須拆開計算，例如 $\int_{-\infty}^{0} + \int_{0}^{\infty}$。
*   $\int_{0}^{\infty} \frac{x}{1+x^2} \, dx = \lim_{b \to \infty} [\frac{1}{2}\ln(1+x^2)]_0^b = \infty$
*   因為右半邊發散，所以原積分即發散。
*   *(常犯錯誤：直接寫 $\lim_{R \to \infty} \int_{-R}^{R} \frac{x}{1+x^2} dx = 0$。瑕積分定義不允許綁定上下限一起趨近無窮大，那是 Cauchy Principal Value 的定義，而非標準瑕積分。)*
*   **答案：** **Diverges** (發散)

**5. (15%)** $\int_{2}^{\infty} \frac{1}{x \ln x (\ln(\ln x))^2} \, dx$
*   **解法：** 變數代換。令 $u = \ln(\ln x)$，則 $du = \frac{1}{\ln x} \cdot \frac{1}{x} dx$。
*   當 $x \to \infty$ 時，$u \to \infty$。當 $x = 2$ 時，$u = \ln(\ln 2)$。
*   原積分變為 $\int_{\ln(\ln 2)}^{\infty} \frac{1}{u^2} \, du$
*   $\lim_{b \to \infty} [-\frac{1}{u}]_{\ln(\ln 2)}^b = 0 - (-\frac{1}{\ln(\ln 2)}) = \frac{1}{\ln(\ln 2)}$
*   *(注意：$\ln 2 \approx 0.693 < 1$，所以 $\ln(\ln 2)$ 為負數，故最終答案 $\frac{1}{\ln(\ln 2)}$ 實為正數的倒數加上負號，結果為負。這與被積函數在該區間的符號相符！)*
*   **答案：** Converges to **$\frac{1}{\ln(\ln 2)}$**

## 第二部分：收斂性判定

**6. (10%)** $\int_{1}^{\infty} \frac{\sin^2(x)}{x^2} \, dx$
*   **解法：** 使用比較審斂法 (Comparison Test)。
*   因為 $0 \le \sin^2(x) \le 1$ 對所有 $x$ 成立。
*   所以 $0 \le \frac{\sin^2(x)}{x^2} \le \frac{1}{x^2}$
*   已知 $\int_{1}^{\infty} \frac{1}{x^2} \, dx$ 是一個 $p$-積分，且 $p=2 > 1$，故收斂。
*   由 Comparison Test 可知原積分收斂。
*   **答案：** **Converges** (收斂)

**7. (15%)** $\int_{1}^{\infty} \frac{3x^2 + \sqrt{x}}{x^4 + 2x^2 + 1} \, dx$
*   **解法：** 使用極限比較審斂法 (Limit Comparison Test)。
*   觀察當 $x \to \infty$ 時，分子支配項為 $x^2$，分母支配項為 $x^4$。
*   取比較函數 $g(x) = \frac{x^2}{x^4} = \frac{1}{x^2}$。
*   $\lim_{x \to \infty} \frac{f(x)}{g(x)} = \lim_{x \to \infty} \frac{3x^2 + \sqrt{x}}{x^4 + 2x^2 + 1} \cdot x^2 = \lim_{x \to \infty} \frac{3x^4 + x^{2.5}}{x^4 + 2x^2 + 1} = 3$
*   因為極限值 $3$ 為非零的有限正數，且 $\int_{1}^{\infty} \frac{1}{x^2} \, dx$ 是一個收斂的 $p$-積分 ($p=2 > 1$)。
*   故由 LCT 可知，原積分收斂。
*   **答案：** **Converges** (收斂)

**8. (15%)** $\int_{0}^{1} \frac{e^{-x}}{\sqrt{x}} \, dx$
*   **解法：** Type 2 瑕積分，瑕點在 $x=0$。使用極限比較審斂法 (LCT) 或直接比較法 (Comparison Test)。
*   **直接比較法：** 在 $(0, 1]$ 區間內，$e^{-x} \le e^0 = 1$。
    所以 $0 \le \frac{e^{-x}}{\sqrt{x}} \le \frac{1}{\sqrt{x}}$。
    已知 $\int_{0}^{1} \frac{1}{\sqrt{x}} \, dx = \int_{0}^{1} x^{-1/2} \, dx = [2x^{1/2}]_0^1 = 2$ (收斂)。
    由 Comparison Test，原積分收斂。
*   **極限比較法：** 設 $g(x) = \frac{1}{\sqrt{x}}$。
    $\lim_{x \to 0^+} \frac{\frac{e^{-x}}{\sqrt{x}}}{\frac{1}{\sqrt{x}}} = \lim_{x \to 0^+} e^{-x} = 1 > 0$。
    因為 $\int_{0}^{1} \frac{1}{\sqrt{x}} \, dx$ (p積分，$p=1/2 < 1$) 收斂，故原積分收斂。
*   **答案：** **Converges** (收斂)
