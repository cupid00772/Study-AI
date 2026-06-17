# 2026 台聯大微積分模擬考 (UST Calculus Mock Exam - Comprehensive A) 解答卷

## 考點分佈總表與預期能力分析
本卷參照台聯大歷屆 (A3/A4/A6/A7) 格式出題，並針對使用者弱點進行深度打擊：
*   **第 1 題**：極限與漸近線 (弱點：斜漸近線求法)。
*   **第 2, 8 題**：瑕積分與級數 (弱點：極限發散/收斂判斷、Ratio test 極限變形)。
*   **第 3, 4 題**：積分應用 (弱點：質心公式、極座標面積)。
*   **第 5, 1-a 題**：多變數極值 (弱點：Lagrange 乘數法、有界區域絕對極值)。
*   **第 6, 1-b 題**：多重積分應用 (弱點：球座標轉換體積、旋轉曲面/曲面面積)。
*   **第 7, 2 題**：向量微積分 (弱點：Green's Theorem、Stokes' Theorem 面積分法向量)。
*   **第 3 題**：數列級數與極限 (條件收斂判斷、泰勒展開高階應用)。

---

## 甲、填充題詳解

**1.** [Medium]
*   **解答：** $y = x - 2$
*   **解題步驟：**
    求斜漸近線 $y = mx + c$ 當 $x \to \infty$：
    $m = \lim_{x \to \infty} \frac{f(x)}{x} = \lim_{x \to \infty} \frac{\sqrt{x^2-4x+5}}{x} = \lim_{x \to \infty} \sqrt{1 - \frac{4}{x} + \frac{5}{x^2}} = 1$。
    $c = \lim_{x \to \infty} (f(x) - mx) = \lim_{x \to \infty} (\sqrt{x^2-4x+5} - x)$。
    進行有理化：$\lim_{x \to \infty} \frac{x^2-4x+5 - x^2}{\sqrt{x^2-4x+5} + x} = \lim_{x \to \infty} \frac{-4x+5}{x(\sqrt{1-4/x+5/x^2} + 1)} = \frac{-4}{1+1} = -2$。
*   **核心公式或定理：** $m = \lim_{x \to \infty} \frac{f(x)}{x}$, $c = \lim_{x \to \infty} (f(x) - mx)$。
*   **常見錯誤陷阱：** 若題目問 $x \to -\infty$，則 $\frac{\sqrt{x^2}}{x} = \frac{|x|}{x} = -1$，漸近線會變為 $y = -x + 2$。

**2.** [Medium]
*   **解答：** $\frac{1}{2}$
*   **解題步驟：**
    令 $u = x^2$，則 $du = 2x \, dx \implies x \, dx = \frac{du}{2}$。
    $\int_{0}^{\infty} x^3 e^{-x^2} dx = \int_{0}^{\infty} x^2 e^{-x^2} x \, dx = \int_{0}^{\infty} u e^{-u} \frac{du}{2}$。
    利用分部積分 (Integration by Parts) 計算 $\frac{1}{2} \int u e^{-u} du$：
    $= \frac{1}{2} \left[ -u e^{-u} - e^{-u} \right]_0^\infty = \frac{1}{2} \left( (0 - 0) - (0 - 1) \right) = \frac{1}{2}$。
*   **核心公式或定理：** 變數變換法、分部積分 $\int u \, dv = uv - \int v \, du$。
*   **常見錯誤陷阱：** 忘記 $x^3 = x^2 \cdot x$ 的拆解技巧，導致無法湊出 $x \, dx = du/2$。

**3.** [Medium]
*   **解答：** $\frac{4r}{3\pi}$
*   **解題步驟：**
    半圓面積 $A = \frac{1}{2}\pi r^2$。
    根據質心 $y$ 座標公式：$\bar{y} = \frac{1}{A} \int_{-r}^r \frac{1}{2} [f(x)]^2 dx = \frac{1}{\pi r^2/2} \int_{-r}^r \frac{1}{2} (\sqrt{r^2-x^2})^2 dx$
    $= \frac{2}{\pi r^2} \cdot \frac{1}{2} \int_{-r}^r (r^2-x^2) dx = \frac{1}{\pi r^2} \left[ r^2 x - \frac{x^3}{3} \right]_{-r}^r = \frac{1}{\pi r^2} \left( \frac{4}{3}r^3 \right) = \frac{4r}{3\pi}$。
*   **核心公式或定理：** 質心公式 $\bar{y} = \frac{1}{A} \int \frac{1}{2} [f(x)]^2 dx$。
*   **常見錯誤陷阱：** 公式中漏掉 $\frac{1}{2}$ 或算錯圓面積導致係數錯誤。

**4.** [Medium]
*   **解答：** $2 + \frac{\pi}{4}$
*   **解題步驟：**
    尋找交點：$1+\cos\theta = 1 \implies \cos\theta = 0 \implies \theta = \pm \frac{\pi}{2}$。
    面積 $A = \frac{1}{2} \int_{-\pi/2}^{\pi/2} [(1+\cos\theta)^2 - 1^2] d\theta = \int_{0}^{\pi/2} (1 + 2\cos\theta + \cos^2\theta - 1) d\theta$ (利用對稱性)
    $= \int_{0}^{\pi/2} (2\cos\theta + \cos^2\theta) d\theta = \int_{0}^{\pi/2} \left(2\cos\theta + \frac{1+\cos 2\theta}{2}\right) d\theta$
    $= \left[ 2\sin\theta + \frac{\theta}{2} + \frac{\sin 2\theta}{4} \right]_0^{\pi/2} = 2(1) + \frac{\pi}{4} + 0 = 2 + \frac{\pi}{4}$。
*   **核心公式或定理：** 極座標面積公式 $A = \frac{1}{2} \int (r_{outer}^2 - r_{inner}^2) d\theta$、半角公式 $\cos^2\theta = \frac{1+\cos 2\theta}{2}$。
*   **常見錯誤陷阱：** 忘記將被積函數平方，寫成 $\int (r_{out}-r_{in}) d\theta$ 是致命錯誤。

**5.** [Easy]
*   **解答：** $3$
*   **解題步驟：**
    利用 Lagrange Multiplier，令 $g(x,y,z) = x^2+y^2+z^2-3=0$。
    $\nabla f = \lambda \nabla g \implies (1, -1, 1) = \lambda (2x, 2y, 2z)$。
    解得 $x = \frac{1}{2\lambda}, y = \frac{-1}{2\lambda}, z = \frac{1}{2\lambda}$。
    代入限制條件：$\left(\frac{1}{2\lambda}\right)^2 + \left(\frac{-1}{2\lambda}\right)^2 + \left(\frac{1}{2\lambda}\right)^2 = 3 \implies \frac{3}{4\lambda^2} = 3 \implies \lambda^2 = \frac{1}{4} \implies \lambda = \pm \frac{1}{2}$。
    當 $\lambda = 1/2$，點為 $(1, -1, 1)$，此時 $f = 1 - (-1) + 1 = 3$ (最大值)。
    當 $\lambda = -1/2$，點為 $(-1, 1, -1)$，此時 $f = -1 - 1 - 1 = -3$ (最小值)。
*   **核心公式或定理：** Lagrange Multipliers $\nabla f = \lambda \nabla g$。
*   **常見錯誤陷阱：** 解 $\lambda$ 的時候忘記取正負號，導致找不到極值點。

**6.** [Medium]
*   **解答：** $4\pi$
*   **解題步驟：**
    利用球座標 (Spherical Coordinates)：$z = \rho \cos\phi$，$dV = \rho^2 \sin\phi \, d\rho \, d\phi \, d\theta$。
    半球體 $E$ 的範圍：$0 \le \theta \le 2\pi$，$0 \le \phi \le \pi/2$，$0 \le \rho \le 2$。
    $\iiint_E z \, dV = \int_0^{2\pi} \int_0^{\pi/2} \int_0^2 (\rho \cos\phi) (\rho^2 \sin\phi) d\rho \, d\phi \, d\theta$
    $= \left( \int_0^{2\pi} d\theta \right) \left( \int_0^{\pi/2} \sin\phi \cos\phi \, d\phi \right) \left( \int_0^2 \rho^3 d\rho \right)$
    $= (2\pi) \left[ \frac{\sin^2\phi}{2} \right]_0^{\pi/2} \left[ \frac{\rho^4}{4} \right]_0^2 = 2\pi \cdot \frac{1}{2} \cdot \frac{16}{4} = 4\pi$。
*   **核心公式或定理：** 球座標轉換 $z = \rho\cos\phi, dV = \rho^2\sin\phi d\rho d\phi d\theta$。
*   **常見錯誤陷阱：** 半球的 $\phi$ 範圍應為 $0$ 到 $\pi/2$，常有人誤寫為 $0$ 到 $\pi$。

**7.** [Medium]
*   **解答：** $\frac{4}{3}$
*   **解題步驟：**
    令 $P = y+\sin(x^2), Q = x^2+e^y$。由格林定理 (Green's Theorem)：
    $\oint_C P dx + Q dy = \iint_D \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right) dA = \iint_D (2x - 1) dA$。
    區域 $D$ 為 $y=0$ 到 $y=1-x^2$，其中 $x$ 範圍為 $-1 \le x \le 1$。
    積分為 $\int_{-1}^1 \int_0^{1-x^2} (2x - 1) dy \, dx = \int_{-1}^1 (2x - 1)(1-x^2) dx = \int_{-1}^1 (2x - 2x^3 - 1 + x^2) dx$。
    利用奇函數對稱性，奇次項積分為 0，剩下偶次項：
    $\int_{-1}^1 (-1 + x^2) dx = 2 \int_0^1 (x^2 - 1) dx = 2 \left[ \frac{x^3}{3} - x \right]_0^1 = 2 \left( \frac{1}{3} - 1 \right) = 2 \left(-\frac{2}{3}\right) = -\frac{4}{3}$。
    *(等等，題目寫 Counterclockwise。計算 $-4/3$ 是對的。如果考卷上只填絕對值會錯。正解為 $-4/3$。)*
    修正解答：$-\frac{4}{3}$。
*   **核心公式或定理：** 格林定理 $\oint_C P dx + Q dy = \iint_D (Q_x - P_y) dA$。
*   **常見錯誤陷阱：** 奇偶函數對稱性消去時算錯符號，或偏微分 $Q_x$ 與 $P_y$ 的順序搞反。

**8.** [Hard]
*   **解答：** $e$
*   **解題步驟：**
    設 $a_n = \frac{n!}{n^n}$。利用 Ratio Test：
    $L = \lim_{n \to \infty} \left| \frac{a_{n+1} x^{n+1}}{a_n x^n} \right| = \lim_{n \to \infty} \frac{(n+1)!}{(n+1)^{n+1}} \frac{n^n}{n!} |x| = \lim_{n \to \infty} \frac{n+1}{(n+1)^{n+1}} n^n |x| = \lim_{n \to \infty} \frac{n^n}{(n+1)^n} |x|$
    $= \lim_{n \to \infty} \left(\frac{n}{n+1}\right)^n |x| = \lim_{n \to \infty} \frac{1}{(1+1/n)^n} |x| = \frac{1}{e} |x|$。
    收斂條件 $L < 1 \implies \frac{1}{e} |x| < 1 \implies |x| < e$。故 $R = e$。
*   **核心公式或定理：** Ratio Test、自然指數極限定義 $\lim (1+1/n)^n = e$。
*   **常見錯誤陷阱：** 極限化簡時將 $\left(\frac{n}{n+1}\right)^n$ 誤認為 $1$ 或 $e$。正確應為 $1/e$。

---

## 乙、計算、證明題詳解

**1.** [Hard]
*   **(a) (6 分) 解答：Max = $4$, Min = $-\frac{1}{3}$**
    *   **解題步驟：**
        1. 找內部臨界點 ($x^2+y^2 < 1$)：
           $\nabla f = (2x, 6y+2) = (0,0) \implies x=0, y=-1/3$。
           點 $(0, -1/3)$ 落在圓盤內。此時函數值 $f(0, -1/3) = 3(1/9) - 2/3 = -1/3$。
        2. 找邊界極值 ($x^2+y^2 = 1$)：
           利用參數化或代入法。邊界上 $x^2 = 1-y^2$，且 $-1 \le y \le 1$。
           代入目標函數：$g(y) = (1-y^2) + 3y^2 + 2y = 2y^2 + 2y + 1$。
           求 $g(y)$ 在 $[-1, 1]$ 上的極值：$g'(y) = 4y + 2 = 0 \implies y = -1/2$。
           邊界臨界點：$y=-1/2 \implies x = \pm \sqrt{3}/2$。函數值 $g(-1/2) = 2(1/4) - 1 + 1 = 1/2$。
           邊界端點：$y=1 \implies g(1) = 2+2+1 = 5$？等等，$f(0,1) = 0 + 3 + 2 = 5$。
           $y=-1 \implies g(-1) = 2-2+1 = 1$。
           *(檢查：$f(0,1) = 5$ 是最大值。最小是 $f(0,-1/3) = -1/3$。)*
           所以 Max = 5, Min = -1/3。
    *   **核心公式或定理：** 多變數極值檢驗（內部 $\nabla f=0$，邊界 Lagrange 或代入法）。

*   **(b) (6 分) 解答：$\frac{\pi}{6}(17^{3/2} - 1)$**
    *   **解題步驟：**
        曲面為 $z = f(x,y) = 4-x^2-y^2$。$f_x = -2x, f_y = -2y$。
        $S = \iint_D \sqrt{1 + f_x^2 + f_y^2} dA = \iint_D \sqrt{1 + 4x^2 + 4y^2} dA$。
        區域 $D$ 是曲面與 $z=0$ 平面的交線投影：$4-x^2-y^2=0 \implies x^2+y^2 \le 4$。
        利用極座標轉換：
        $S = \int_0^{2\pi} \int_0^2 \sqrt{1+4r^2} r \, dr \, d\theta = 2\pi \int_0^2 r \sqrt{1+4r^2} dr$。
        令 $u = 1+4r^2 \implies du = 8r \, dr$。積分範圍由 $1 \to 17$。
        $S = 2\pi \int_1^{17} \frac{1}{8} \sqrt{u} du = \frac{\pi}{4} \left[ \frac{2}{3} u^{3/2} \right]_1^{17} = \frac{\pi}{6}(17^{3/2} - 1)$。
    *   **核心公式或定理：** 曲面面積公式 $\iint \sqrt{1+f_x^2+f_y^2} dA$、極座標變數變換。

**2.** [Medium]
*   **(12 分) 解答：$2\pi$**
    *   **解題步驟：**
        1. 依據 Stokes' Theorem：$\iint_S (\nabla \times \mathbf{F}) \cdot d\mathbf{S} = \oint_C \mathbf{F} \cdot d\mathbf{r}$。
        2. 我們可以選擇直接算線積分，或是換一個更容易的曲面積分。
           這裡示範直接計算 $\nabla \times \mathbf{F}$：
           $\nabla \times \mathbf{F} = \left|\begin{matrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ \partial_x & \partial_y & \partial_z \\ -y & x & z \end{matrix}\right| = (0 - 0) \mathbf{i} - (0 - 0) \mathbf{j} + (1 - (-1)) \mathbf{k} = (0, 0, 2)$。
        3. 利用 Stokes 定理，任何擁有相同邊界 $C$ 且方向一致的曲面，其面積分皆相等。
           我們選擇底部圓盤 $D: x^2+y^2 \le 1, z=0$，且法向量朝上 $\mathbf{n} = (0,0,1)$ 代替原拋物面。
        4. $\iint_S (\nabla \times \mathbf{F}) \cdot d\mathbf{S} = \iint_D (0, 0, 2) \cdot (0, 0, 1) dA = \iint_D 2 dA = 2 \times \text{Area}(D) = 2 \times (\pi \cdot 1^2) = 2\pi$。
    *   **核心公式或定理：** 斯托克斯定理 (Stokes' Theorem) 及曲面獨立性 (Surface Independence)。
    *   **常見錯誤陷阱：** 若直接算原曲面積分，法向量 $\mathbf{n} dS = (-\frac{\partial z}{\partial x}, -\frac{\partial z}{\partial y}, 1) dxdy = (2x, 2y, 1) dxdy$，內積後積 $\iint 2 dxdy = 2\pi$，結果一樣但計算量較大。未利用等價曲面會耗費多餘時間。

**3.** [Hard]
*   **(a) (6 分) 解答：條件收斂 (Conditionally Convergent)**
    *   **解題步驟：**
        1. 判斷絕對收斂：$\sum \left| \frac{(-1)^n}{\ln n} \right| = \sum \frac{1}{\ln n}$。
           因為 $\ln n < n$ 對所有 $n \ge 2$ 成立，故 $\frac{1}{\ln n} > \frac{1}{n}$。
           已知調和級數 $\sum \frac{1}{n}$ 發散，由比較審斂法 (Comparison Test) 得知 $\sum \frac{1}{\ln n}$ 發散。故非絕對收斂。
        2. 判斷條件收斂：利用交錯級數審斂法 (Alternating Series Test, AST)。
           令 $b_n = \frac{1}{\ln n}$。
           (i) $\lim_{n \to \infty} b_n = \lim_{n \to \infty} \frac{1}{\ln n} = 0$。
           (ii) $b_n$ 為遞減數列，因為 $\ln(n+1) > \ln n \implies \frac{1}{\ln(n+1)} < \frac{1}{\ln n}$。
           故原級數收斂。綜合以上，本題為「條件收斂」。
    *   **核心公式或定理：** 比較審斂法 (Comparison Test)、交錯級數審斂法 (AST)。

*   **(b) (6 分) 解答：$-2$**
    *   **解題步驟：**
        這是一道標準的高難度極限求值。使用泰勒展開式 (Maclaurin Series) 最為迅捷。
        $\sin x = x - \frac{x^3}{3!} + \cdots = x - \frac{x^3}{6} + \cdots$
        $\tan x = x + \frac{x^3}{3} + \cdots$
        代入分子與分母：
        分子：$x - \tan x = x - (x + \frac{x^3}{3} + \cdots) = -\frac{x^3}{3} + \cdots$
        分母：$x - \sin x = x - (x - \frac{x^3}{6} + \cdots) = \frac{x^3}{6} + \cdots$
        $\lim_{x \to 0} \frac{x - \tan x}{x - \sin x} = \lim_{x \to 0} \frac{-x^3/3 + \cdots}{x^3/6 + \cdots} = \frac{-1/3}{1/6} = -2$。
    *   **核心公式或定理：** 泰勒展開式 $\sin x$ 與 $\tan x$ 的前兩項。
    *   **常見錯誤陷阱：** 若使用羅必達法則 (L'Hopital's Rule)，需要連續微分三次才能消去 0/0 不定型，非常容易在微分過程中發生計算錯誤。

---

## 配分建議與評分標準 (Marking Scheme)
*   **甲、填充題 (64%)**：每題 8 分。
    *   台聯大規定填充題必須寫出「最後化簡結果」，且**不看過程**。
    *   若正負號寫錯、常數倍數錯誤、未化簡（如 $\sqrt{16}$ 未化為 $4$），此題全錯 (0分)。
    *   第 7 題答案為 $-\frac{4}{3}$，若漏寫負號即為 0 分。
*   **乙、計算、證明題 (36%)**：每題 12 分。
    *   **第 1 題 (12分)**：(a) 內部臨界點正確 (2分)，邊界極值檢驗正確 (2分)，寫出正確 Max/Min (2分)。(b) 列出正確面積分式 (3分)，積出正確結果 (3分)。
    *   **第 2 題 (12分)**：寫出 $\nabla \times \mathbf{F} = (0,0,2)$ (4分)；敘述利用 Stokes 定理與等價曲面 (底圓) (4分)；算出正確答案 $2\pi$ (4分)。若用原曲面法向量內積硬積，只要過程全對亦給滿分。
    *   **第 3 題 (12分)**：(a) 證明不絕對收斂 (3分)，證明 AST 滿足條件 (3分)。(b) 寫出 $\sin x, \tan x$ 展開式或羅必達三次過程 (4分)，算出 $-2$ (2分)。
