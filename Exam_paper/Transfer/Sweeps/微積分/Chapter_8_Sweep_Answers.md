# Chapter 8: 數列與無窮級數 (Sequences and Series) - 掃題大師 解答卷

## 第一部分：數列與級數收斂性判定

**1. (10%)** $a_n = \sqrt{n^2 + 3n} - n$
*   **解法：** 分子分母同乘共軛。
    $$ \lim_{n \to \infty} (\sqrt{n^2+3n} - n) \cdot \frac{\sqrt{n^2+3n} + n}{\sqrt{n^2+3n} + n} = \lim_{n \to \infty} \frac{n^2+3n - n^2}{\sqrt{n^2+3n} + n} = \lim_{n \to \infty} \frac{3n}{\sqrt{n^2(1+3/n)} + n} $$
    分子分母同除以 $n$：
    $$ \lim_{n \to \infty} \frac{3}{\sqrt{1+3/n} + 1} = \frac{3}{\sqrt{1+0} + 1} = \frac{3}{2} $$
*   **答案：** **Converges to $\frac{3}{2}$**

**2. (10%)** $\sum_{n=1}^{\infty} \frac{\ln n}{n^2}$
*   **解法：** 使用比較審斂法 (Comparison Test) 或積分審斂法 (Integral Test)。
    **方法一 (比較法)：** 當 $n$ 很大時，$\ln n$ 成長非常慢。對於所有 $n \ge 1$，可以知道 $\ln n < \sqrt{n}$。
    因此 $\frac{\ln n}{n^2} < \frac{\sqrt{n}}{n^2} = \frac{1}{n^{1.5}}$。
    因為 $\sum \frac{1}{n^{1.5}}$ 是一個 $p$-級數且 $p = 1.5 > 1$，所以它收斂。
    由比較審斂法可知，原級數收斂。
    **方法二 (積分法)：** $\int_1^\infty \frac{\ln x}{x^2} dx$ 藉由分部積分，令 $u = \ln x, dv = x^{-2}dx$，可得其極限存在，故原級數收斂。
*   **答案：** **Converges** (收斂)

**3. (10%)** $\sum_{n=1}^{\infty} (-1)^n \frac{n}{n^2 + 1}$
*   **解法：** 
    **第一步 (判斷絕對收斂)：** 取絕對值後為 $\sum \frac{n}{n^2+1}$。使用極限比較審斂法 (Limit Comparison Test)，與 $1/n$ 比較：
    $\lim_{n \to \infty} \frac{\frac{n}{n^2+1}}{\frac{1}{n}} = \lim_{n \to \infty} \frac{n^2}{n^2+1} = 1 > 0$。
    因為調和級數 $\sum \frac{1}{n}$ 發散，所以 $\sum \frac{n}{n^2+1}$ 發散。因此它**不**絕對收斂。
    **第二步 (判斷條件收斂)：** 使用交錯級數審斂法 (Alternating Series Test)。
    設 $b_n = \frac{n}{n^2+1}$。
    (1) $\lim_{n \to \infty} b_n = 0$ 成立。
    (2) 遞減性：設 $f(x) = \frac{x}{x^2+1}$，則 $f'(x) = \frac{1(x^2+1) - x(2x)}{(x^2+1)^2} = \frac{1-x^2}{(x^2+1)^2}$。
    當 $x \ge 1$ 時，$f'(x) \le 0$，所以 $b_n$ 為遞減數列。
    由於滿足 AST 條件，級數收斂。
*   **答案：** **Conditionally Convergent** (條件收斂)

**4. (15%)** $\sum_{n=1}^{\infty} \left( \frac{2n^2 + 1}{3n^2 - 1} \right)^n$
*   **解法：** 使用根值審斂法 (Root Test)。
    令 $a_n = \left( \frac{2n^2 + 1}{3n^2 - 1} \right)^n$。
    $\lim_{n \to \infty} \sqrt[n]{|a_n|} = \lim_{n \to \infty} \frac{2n^2 + 1}{3n^2 - 1} = \frac{2}{3}$
    因為極限值 $L = \frac{2}{3} < 1$，由根值審斂法可知，該級數絕對收斂。
*   **答案：** **Converges** (收斂)

## 第二部分：冪級數與泰勒級數應用

**5. (15%)** $\sum_{n=1}^{\infty} \frac{(x-3)^n}{n \cdot 2^n}$
*   **解法：**
    **第一步 (求收斂半徑)：** 使用比值審斂法 (Ratio Test)。
    $L = \lim_{n \to \infty} \left| \frac{a_{n+1}}{a_n} \right| = \lim_{n \to \infty} \left| \frac{(x-3)^{n+1}}{(n+1)2^{n+1}} \cdot \frac{n 2^n}{(x-3)^n} \right| = \lim_{n \to \infty} \frac{n}{n+1} \frac{|x-3|}{2} = \frac{|x-3|}{2}$
    令 $L < 1 \implies \frac{|x-3|}{2} < 1 \implies |x-3| < 2$。
    故**收斂半徑 $R = 2$**。
    區間初步為 $-2 < x - 3 < 2 \implies 1 < x < 5$。
    **第二步 (檢查端點)：**
    當 $x = 5$ 時：代入原式得 $\sum_{n=1}^\infty \frac{2^n}{n \cdot 2^n} = \sum_{n=1}^\infty \frac{1}{n}$，這是調和級數，**發散**。
    當 $x = 1$ 時：代入原式得 $\sum_{n=1}^\infty \frac{(-2)^n}{n \cdot 2^n} = \sum_{n=1}^\infty \frac{(-1)^n}{n}$，這是交錯調和級數，由 AST 可知**收斂**。
*   **答案：** Radius of Convergence: **$R=2$** ; Interval of Convergence: **$[1, 5)$** (或 $1 \le x < 5$)

**6. (15%)** $f(x) = x \cos(x^2)$ 的 Maclaurin Series
*   **解法：** 已知 $\cos(t)$ 的 Maclaurin 展開式為 $\cos(t) = \sum_{n=0}^{\infty} \frac{(-1)^n t^{2n}}{(2n)!}$，其收斂半徑為 $R=\infty$。
    將 $t$ 替換為 $x^2$：
    $\cos(x^2) = \sum_{n=0}^{\infty} \frac{(-1)^n (x^2)^{2n}}{(2n)!} = \sum_{n=0}^{\infty} \frac{(-1)^n x^{4n}}{(2n)!}$
    再將整體乘上 $x$：
    $x \cos(x^2) = x \sum_{n=0}^{\infty} \frac{(-1)^n x^{4n}}{(2n)!} = \sum_{n=0}^{\infty} \frac{(-1)^n x^{4n+1}}{(2n)!}$
    因為基本的 cosine 展開式收斂半徑是無限大，經過代換與乘積後，收斂半徑不變。
*   **答案：** Maclaurin Series: **$\sum_{n=0}^{\infty} \frac{(-1)^n x^{4n+1}}{(2n)!}$** ; 收斂半徑 **$R = \infty$**

**7. (10%)** $\sum_{n=0}^{\infty} \frac{(-1)^n \pi^{2n+1}}{4^{2n+1} (2n+1)!}$
*   **解法：** 注意到分子的 $\pi^{2n+1}$ 與分母的 $4^{2n+1}$ 可以合併為 $(\frac{\pi}{4})^{2n+1}$。
    原式可改寫為：$\sum_{n=0}^{\infty} \frac{(-1)^n}{(2n+1)!} \left( \frac{\pi}{4} \right)^{2n+1}$
    回想正弦函數的 Maclaurin 展開式：$\sin(x) = \sum_{n=0}^{\infty} \frac{(-1)^n}{(2n+1)!} x^{2n+1}$。
    很明顯，這正是 $x = \frac{\pi}{4}$ 時的 $\sin(x)$ 級數展開。
    因此其總和等於 $\sin(\frac{\pi}{4})$。
*   **答案：** **$\frac{\sqrt{2}}{2}$**

**8. (15%)** $\int_{0}^{0.1} e^{-x^2} \, dx$ 估計與誤差
*   **解法：**
    (a) 首先寫出 $e^t = 1 + t + \frac{t^2}{2!} + \frac{t^3}{3!} + \dots$
    代入 $t = -x^2$，得到 $e^{-x^2} = 1 - x^2 + \frac{x^4}{2} - \frac{x^6}{6} + \dots$
    前三個非零項為 $1 - x^2 + \frac{x^4}{2}$。
    將其積分：
    $\int_0^{0.1} \left( 1 - x^2 + \frac{x^4}{2} \right) dx = \left[ x - \frac{x^3}{3} + \frac{x^5}{10} \right]_0^{0.1}$
    $= 0.1 - \frac{(0.1)^3}{3} + \frac{(0.1)^5}{10} = \frac{1}{10} - \frac{1}{3000} + \frac{1}{1000000}$
    $= 0.1 - 0.0003333... + 0.000001 = 0.09966766... \approx 0.099668$ (使用分數或小數皆可)
    (b) 根據交錯級數估計定理 (Alternating Series Estimation Theorem)，誤差小於或等於「下一個被忽略項的絕對值」(即第四項的積分值)。
    第四項為 $-\frac{x^6}{6}$。
    其積分值絕對值為：$\int_0^{0.1} \frac{x^6}{6} \, dx = \left[ \frac{x^7}{42} \right]_0^{0.1} = \frac{(0.1)^7}{42} = \frac{10^{-7}}{42}$。
*   **答案：**
    (a) 估計值為 **$\frac{1}{10} - \frac{1}{3000} + \frac{1}{1000000}$** (約為 $0.099668$)
    (b) 誤差上界為 **$\frac{10^{-7}}{42}$** (即 $\frac{1}{420000000}$)
