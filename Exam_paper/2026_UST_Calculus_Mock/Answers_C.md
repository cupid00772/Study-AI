# 2026 台聯大微積分模擬考 (UST Calculus Mock Exam - Weakness Targeted C) 解答卷

## 考點分佈總表與預期能力分析
本卷參照台聯大歷屆高難度鑑別題型設計，並刻意將「考生最容易忽略或卡關」的盲點集結，進行深度弱點打擊：
*   **第 1 題**：不定型極限 (弱點：指數函數極限與羅必達法則變形)。
*   **第 2 題**：定積分冷門技巧 (弱點：利用 $u = \frac{\pi}{4} - x$ 的對稱性代換)。
*   **第 3 題**：極限與黎曼和 (弱點：乘積型極限轉取 $\ln$ 後化為黎曼和積分)。
*   **第 4 題**：特殊級數求和 (弱點：泰勒展開式中的指數級數變形技巧)。
*   **第 5, 乙-2 題**：多重積分變數變換 (弱點：Jacobian 行列式的運用與區域對應)。
*   **第 6 題**：重積分順序交換 (弱點：被積函數無法直接積分時的 Fubini 定理應用)。
*   **第 7, 乙-3 題**：向量微積分 (弱點：Green's Theorem、Stokes' Theorem 的曲面替代技巧)。
*   **第 8 題**：微積分基本定理與多變數微分 (弱點：連鎖律、方向導數與單位向量的細節)。

---

## 甲、填充題詳解

**1.** [Hard]
*   **解答：** $e^{-1/2}$
*   **解題步驟：**
    令 $y = (\cos x)^{\frac{1}{x^2}}$，則 $\ln y = \frac{\ln(\cos x)}{x^2}$。
    當 $x \to 0^+$ 時，這是一個 $\frac{0}{0}$ 的不定型。使用羅必達法則：
    $\lim_{x \to 0^+} \frac{\ln(\cos x)}{x^2} = \lim_{x \to 0^+} \frac{\frac{-\sin x}{\cos x}}{2x} = \lim_{x \to 0^+} \frac{-\tan x}{2x}$。
    再次使用羅必達法則 (或已知 $\lim \frac{\tan x}{x} = 1$)：
    $= \lim_{x \to 0^+} \frac{-\sec^2 x}{2} = -\frac{1}{2}$。
    故 $\ln y \to -\frac{1}{2} \implies y \to e^{-1/2}$。
*   **核心公式或定理：** L'Hopital's Rule, $y = e^{\ln y}$。
*   **常見錯誤陷阱：** 忘記最後要把 $\ln y$ 還原回 $y$，直接寫出 $-1/2$ 是最致命也最常見的錯誤。

**2.** [Hard]
*   **解答：** $\frac{\pi}{8}\ln 2$
*   **解題步驟：**
    令 $u = \frac{\pi}{4} - x$，則 $dx = -du$。當 $x = 0$ 時 $u = \frac{\pi}{4}$；當 $x = \frac{\pi}{4}$ 時 $u = 0$。
    $\tan x = \tan(\frac{\pi}{4} - u) = \frac{\tan(\pi/4) - \tan u}{1 + \tan(\pi/4)\tan u} = \frac{1 - \tan u}{1 + \tan u}$。
    代回積分式：$I = \int_{0}^{\pi/4} \ln\left(1 + \frac{1-\tan u}{1+\tan u}\right) du = \int_{0}^{\pi/4} \ln\left(\frac{2}{1+\tan u}\right) du$
    $I = \int_{0}^{\pi/4} (\ln 2 - \ln(1+\tan u)) du = \int_{0}^{\pi/4} \ln 2 \, du - I$。
    $2I = \frac{\pi}{4} \ln 2 \implies I = \frac{\pi}{8} \ln 2$。
*   **核心公式或定理：** 定積分對稱性質 $\int_0^a f(x)dx = \int_0^a f(a-x)dx$、和角公式。
*   **常見錯誤陷阱：** 企圖用分部積分硬解，會陷入無限迴圈無法解出。

**3.** [Hard]
*   **解答：** $\frac{4}{e}$
*   **解題步驟：**
    令 $y_n = \frac{1}{n} \left( \frac{(2n)!}{n!} \right)^{1/n} = \left( \frac{(2n)!}{n! \cdot n^n} \right)^{1/n}$。
    取自然對數：
    $\ln y_n = \frac{1}{n} \ln\left( \frac{(n+1)(n+2)\cdots(n+n)}{n \cdot n \cdots n} \right) = \frac{1}{n} \sum_{k=1}^n \ln\left(1 + \frac{k}{n}\right)$。
    此為函數 $f(x) = \ln(1+x)$ 在區間 $[0, 1]$ 上的黎曼和。
    極限即為定積分：$\lim_{n \to \infty} \ln y_n = \int_{0}^{1} \ln(1+x) dx$。
    利用分部積分：$\int \ln(1+x) dx = (1+x)\ln(1+x) - x$。
    代入上下界：$[(1+x)\ln(1+x) - x]_0^1 = (2\ln 2 - 1) - (0 - 0) = \ln 4 - 1$。
    故 $\ln y \to \ln 4 - 1 \implies y = e^{\ln 4 - 1} = \frac{4}{e}$。
*   **核心公式或定理：** 黎曼和 (Riemann Sum)、分部積分。
*   **常見錯誤陷阱：** 無法看出階乘相除可以展開為連乘積並轉換為黎曼和。

**4.** [Medium]
*   **解答：** $2e$
*   **解題步驟：**
    將分子 $n^2$ 進行拆解：
    $\sum_{n=1}^\infty \frac{n^2}{n!} = \sum_{n=1}^\infty \frac{n}{(n-1)!}$。
    為了匹配分母的 $(n-1)!$，分子可寫為 $n = (n-1) + 1$：
    $= \sum_{n=1}^\infty \frac{(n-1) + 1}{(n-1)!} = \sum_{n=2}^\infty \frac{n-1}{(n-1)!} + \sum_{n=1}^\infty \frac{1}{(n-1)!}$
    $= \sum_{n=2}^\infty \frac{1}{(n-2)!} + \sum_{n=1}^\infty \frac{1}{(n-1)!}$。
    已知 $e^x = \sum_{k=0}^\infty \frac{x^k}{k!}$，當 $x=1$ 時，$e = \sum_{k=0}^\infty \frac{1}{k!}$。
    所以這兩項加總分別都是 $e$。
    $e + e = 2e$。
*   **核心公式或定理：** Taylor Series (Maclaurin Series) 展開式 $e^x = \sum \frac{x^k}{k!}$。
*   **常見錯誤陷阱：** 計算時將下標 $n$ 的起始值搞混，導致漏算項數。

**5.** [Medium]
*   **解答：** $\frac{1}{4}(e - e^{-1})$
*   **解題步驟：**
    利用變數變換，令 $u = x - y$, $v = x + y$。
    可解得 $x = \frac{u+v}{2}, y = \frac{v-u}{2}$。
    Jacobian 行列式 $J = \left| \begin{matrix} \frac{\partial x}{\partial u} & \frac{\partial x}{\partial v} \\ \frac{\partial y}{\partial u} & \frac{\partial y}{\partial v} \end{matrix} \right| = \left| \begin{matrix} 1/2 & 1/2 \\ -1/2 & 1/2 \end{matrix} \right| = \frac{1}{4} - (-\frac{1}{4}) = \frac{1}{2}$。
    積分區域 $D$ 轉換：
    $x+y \le 1 \implies v \le 1$。
    $x \ge 0 \implies u+v \ge 0 \implies u \ge -v$。
    $y \ge 0 \implies v-u \ge 0 \implies u \le v$。
    且 $v$ 必定大於等於 $0$。
    $\iint_D e^{\frac{x-y}{x+y}} dA = \int_0^1 \int_{-v}^v e^{u/v} |J| du \, dv = \int_0^1 \int_{-v}^v e^{u/v} (\frac{1}{2}) du \, dv$。
    先對 $u$ 積分：$\frac{1}{2} \int_0^1 \left[ v e^{u/v} \right]_{u=-v}^{u=v} dv = \frac{1}{2} \int_0^1 v (e^1 - e^{-1}) dv$
    $= \frac{1}{2} (e - e^{-1}) \left[ \frac{v^2}{2} \right]_0^1 = \frac{1}{4}(e - e^{-1})$。
*   **核心公式或定理：** 重積分變數變換與 Jacobian。
*   **常見錯誤陷阱：** 忘記乘上 Jacobian 行列式的值 $|J| = 1/2$。

**6.** [Easy]
*   **解答：** $\frac{2}{3}\ln 3$ 或 $\frac{1}{3}\ln 9$
*   **解題步驟：**
    原積分 $\int_0^4 \int_{\sqrt{x}}^2 \frac{1}{y^3+1} dy dx$ 無法直接對 $y$ 積分。需改變積分順序。
    原區域：$0 \le x \le 4$ 且 $\sqrt{x} \le y \le 2$。
    繪圖可知，等價於 $0 \le y \le 2$ 且 $0 \le x \le y^2$。
    改變順序後：$\int_0^2 \int_0^{y^2} \frac{1}{y^3+1} dx dy = \int_0^2 \frac{y^2}{y^3+1} dy$。
    令 $u = y^3+1 \implies du = 3y^2 dy \implies y^2 dy = \frac{1}{3}du$。
    當 $y=0, u=1$；當 $y=2, u=9$。
    $\int_1^9 \frac{1}{3u} du = \left[ \frac{1}{3}\ln u \right]_1^9 = \frac{1}{3}\ln 9 = \frac{2}{3}\ln 3$。
*   **核心公式或定理：** Fubini's Theorem (改變積分順序)。
*   **常見錯誤陷阱：** 未畫出正確區域，導致新的積分上下界寫錯。

**7.** [Medium]
*   **解答：** $\frac{3\pi}{2}$
*   **解題步驟：**
    令 $P(x,y) = e^x - y^3$，$Q(x,y) = \cos y + x^3$。
    這是封閉曲線線積分，利用格林定理 (Green's Theorem)：
    $\oint_C P dx + Q dy = \iint_D \left(\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}\right) dA$。
    $\frac{\partial Q}{\partial x} = 3x^2$，$\frac{\partial P}{\partial y} = -3y^2$。
    原式 $= \iint_D (3x^2 - (-3y^2)) dA = \iint_D 3(x^2+y^2) dA$。
    轉為極座標，$D$ 為單位圓：
    $\int_0^{2\pi} \int_0^1 3r^2 \cdot r \, dr \, d\theta = 3 \left( \int_0^{2\pi} d\theta \right) \left( \int_0^1 r^3 dr \right) = 3(2\pi)(\frac{1}{4}) = \frac{3\pi}{2}$。
*   **核心公式或定理：** 格林定理 (Green's Theorem)。
*   **常見錯誤陷阱：** 極座標面積元素 $dA = r \, dr \, d\theta$ 漏掉 $r$。

**8.** [Medium]
*   **解答：** $-\frac{14}{5e}$
*   **解題步驟：**
    要求方向導數，先求梯度 $\nabla f$。
    根據微積分基本定理與連鎖律：
    $f_x(x,y) = \frac{\partial}{\partial x} \int_{x^2}^{y^2} e^{-t^2} dt = -e^{-(x^2)^2} \cdot (2x) = -2x e^{-x^4}$。
    $f_y(x,y) = \frac{\partial}{\partial y} \int_{x^2}^{y^2} e^{-t^2} dt = e^{-(y^2)^2} \cdot (2y) = 2y e^{-y^4}$。
    在點 $(1, 1)$：$\nabla f(1,1) = (-2e^{-1}, 2e^{-1})$。
    向量 $\mathbf{v} = 3\mathbf{i} - 4\mathbf{j}$ 的長度為 $\sqrt{3^2 + (-4)^2} = 5$。
    單位方向向量 $\mathbf{u} = \frac{\mathbf{v}}{|\mathbf{v}|} = (\frac{3}{5}, -\frac{4}{5})$。
    方向導數 $D_\mathbf{u}f = \nabla f \cdot \mathbf{u} = (-2e^{-1})(\frac{3}{5}) + (2e^{-1})(-\frac{4}{5}) = \frac{-6 - 8}{5e} = -\frac{14}{5e}$。
*   **核心公式或定理：** 微積分基本定理第一部分、連鎖律、方向導數 $D_\mathbf{u}f = \nabla f \cdot \mathbf{u}$。
*   **常見錯誤陷阱：** 忘記將向量 $\mathbf{v}$ 標準化為單位向量 $\mathbf{u}$。

---

## 乙、計算、證明題詳解

**1.** [Medium]
*   **(a) (6 分) 解答：絕對收斂 (Absolutely Convergent)**
    *   **解題步驟：**
        令 $a_n = \left(1 - \frac{1}{n}\right)^{n^2}$。
        使用根值審斂法 (Root Test)：
        $\lim_{n \to \infty} \sqrt[n]{|a_n|} = \lim_{n \to \infty} \left[ \left(1 - \frac{1}{n}\right)^{n^2} \right]^{\frac{1}{n}} = \lim_{n \to \infty} \left(1 - \frac{1}{n}\right)^n$。
        根據自然指數的極限定義，$\lim_{n \to \infty} \left(1 + \frac{x}{n}\right)^n = e^x$。
        此處 $x = -1$，故極限值為 $e^{-1} = \frac{1}{e}$。
        因為 $\frac{1}{e} < 1$，由 Root Test 得知該級數絕對收斂。
*   **(b) (6 分) 解答：$\frac{1}{3}$**
    *   **解題步驟：**
        該極限型態為 $\frac{0}{0}$ 不定型，可套用羅必達法則 (L'Hopital's Rule)。
        $\lim_{x \to 0} \frac{\int_0^x \sin(t^2) dt}{x^3}$
        $= \lim_{x \to 0} \frac{\frac{d}{dx} \int_0^x \sin(t^2) dt}{\frac{d}{dx}(x^3)}$
        $= \lim_{x \to 0} \frac{\sin(x^2)}{3x^2}$
        提出常數 $\frac{1}{3}$，並令 $u = x^2$ (當 $x \to 0$ 時 $u \to 0$)：
        $= \frac{1}{3} \lim_{u \to 0} \frac{\sin u}{u} = \frac{1}{3} \cdot 1 = \frac{1}{3}$。

**2.** [Hard]
*   **(12 分) 解答：$\frac{2\pi}{\sqrt{3}}$**
    *   **解題步驟：**
        這題考驗的是非正交的配方與重積分變數變換。
        首先對指數上的二次式配方：$x^2 - xy + y^2 = \left(x - \frac{1}{2}y\right)^2 + \frac{3}{4}y^2$。
        令 $u = x - \frac{1}{2}y$, $v = \frac{\sqrt{3}}{2}y$。
        則 $u^2 + v^2 = x^2 - xy + y^2$。
        由變換關係可反求 $x, y$：
        $y = \frac{2}{\sqrt{3}}v$
        $x = u + \frac{1}{2}y = u + \frac{1}{\sqrt{3}}v$。
        計算 Jacobian 行列式 $J = \left| \begin{matrix} \frac{\partial x}{\partial u} & \frac{\partial x}{\partial v} \\ \frac{\partial y}{\partial u} & \frac{\partial y}{\partial v} \end{matrix} \right| = \left| \begin{matrix} 1 & 1/\sqrt{3} \\ 0 & 2/\sqrt{3} \end{matrix} \right| = \frac{2}{\sqrt{3}} - 0 = \frac{2}{\sqrt{3}}$。
        積分範圍從 $\mathbb{R}^2$ $(x, y)$ 映射到 $\mathbb{R}^2$ $(u, v)$ 同樣為全平面。
        積分變為：$\iint_{\mathbb{R}^2} e^{-(u^2+v^2)} |J| du dv = \frac{2}{\sqrt{3}} \iint_{\mathbb{R}^2} e^{-(u^2+v^2)} du dv$。
        轉換為極座標 $u = r\cos\theta, v = r\sin\theta, dudv = r dr d\theta$：
        $= \frac{2}{\sqrt{3}} \int_0^{2\pi} \int_0^\infty e^{-r^2} r dr d\theta = \frac{2}{\sqrt{3}} (2\pi) \left[ -\frac{1}{2}e^{-r^2} \right]_0^\infty = \frac{2}{\sqrt{3}} (2\pi) (\frac{1}{2}) = \frac{2\pi}{\sqrt{3}}$。

**3.** [Hard]
*   **(12 分) 解答：$-\pi$**
    *   **解題步驟：**
        若直接計算 $\nabla \times \mathbf{F}$ 然後做曲面積分會非常複雜。根據斯托克斯定理 (Stokes' Theorem)，
        $\iint_S (\nabla \times \mathbf{F}) \cdot \mathbf{n} dS = \oint_C \mathbf{F} \cdot d\mathbf{r}$，其中 $C$ 為曲面 $S$ 的邊界曲線。
        半球面 $x^2+y^2+z^2=1, z \ge 0$ 的邊界 $C$ 是 $xy$-平面上的單位圓：$x^2+y^2=1, z=0$。方向為逆時針 (對應向上法向量)。
        參數化 $C$：$\mathbf{r}(t) = \cos t \mathbf{i} + \sin t \mathbf{j} + 0 \mathbf{k}$，其中 $0 \le t \le 2\pi$。
        $d\mathbf{r} = (-\sin t \mathbf{i} + \cos t \mathbf{j}) dt$。
        在曲線 $C$ 上 ($z=0$)，向量場化簡為：
        $\mathbf{F}(\mathbf{r}(t)) = (\sin t + \sin(\cos t))\mathbf{i} + (0 + \cos(\sin t))\mathbf{j} + (\cos^3 t + 1)\mathbf{k}$。
        計算內積 $\mathbf{F} \cdot d\mathbf{r}$：
        $= (\sin t + \sin(\cos t))(-\sin t) + (\cos(\sin t))(\cos t) + 0$
        $= -\sin^2 t - \sin t \sin(\cos t) + \cos t \cos(\sin t)$。
        分別積分從 $0$ 到 $2\pi$：
        (1) $\int_0^{2\pi} -\sin^2 t dt = -\int_0^{2\pi} \frac{1-\cos 2t}{2} dt = -\pi$。
        (2) $\int_0^{2\pi} -\sin t \sin(\cos t) dt$：令 $u = \cos t, du = -\sin t dt$，原積分成為 $\int_{t=0}^{2\pi} \sin(\cos t) (-\sin t) dt = \left[ -\cos(\cos t) \right]_0^{2\pi} = -\cos(1) - (-\cos(1)) = 0$。
        (3) $\int_0^{2\pi} \cos t \cos(\sin t) dt$：令 $v = \sin t, dv = \cos t dt$，原積分成為 $\int_{t=0}^{2\pi} \cos(\sin t) (\cos t) dt = \left[ \sin(\sin t) \right]_0^{2\pi} = \sin(0) - \sin(0) = 0$。
        總和 $= -\pi + 0 + 0 = -\pi$。
        *(註：此題若使用等價平面 $D: x^2+y^2 \le 1, z=0, \mathbf{n}=\mathbf{k}$ 代替 $S$，則需計算 $\nabla \times \mathbf{F}$ 的 $\mathbf{k}$ 分量，$\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} = 0 - 1 = -1$。$\iint_D (-1) dA = -1 \times \text{Area} = -\pi$。此方法更為簡潔，考驗學生對 Stokes 定理曲面無關性的敏感度！若使用此法亦給滿分)*

---

## 配分建議與評分標準 (Marking Scheme)
*   **甲、填充題 (64%)**：每題 8 分。
    *   此大題完全只看最後答案，答案與正負號必須完全正確。若出現未化簡之分數或根式（如 $\frac{4e}{e^2}$ 未化簡為 $\frac{4}{e}$），視同全錯。
*   **乙、計算、證明題 (36%)**：每題 12 分。
    *   **第 1 題**：(a) 寫出 Root Test 並求對極限得 3 分，結論正確得 3 分。(b) L'Hopital 運用正確得 3 分，極限求出 $\frac{1}{3}$ 得 3 分。
    *   **第 2 題**：配方正確並寫出變數變換得 3 分，正確計算出 Jacobian $= \frac{2}{\sqrt{3}}$ 得 4 分，最後轉極座標求出正解得 5 分。
    *   **第 3 題**：若使用邊界線積分，參數化與內積式正確得 6 分，三項積分計算正確得 6 分；若使用等價底圓面，敘述 Stokes 等價性得 4 分，算出 curl 之 k 分量為 -1 得 4 分，得出 $-\pi$ 得 4 分。
