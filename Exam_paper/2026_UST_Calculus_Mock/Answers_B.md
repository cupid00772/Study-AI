# 2026 台聯大微積分模擬考 (UST Calculus Mock Exam - Comprehensive B) 解答卷

## 考點分佈總表與預期能力分析
本卷參照台聯大格式，並刻意針對前次測驗的「粗心盲點」設計複雜陷阱：
*   **第 1, 2 題**：極限與級數極限 (針對弱點：$1^\infty$ 形式極限變形、$\lim (1+1/n)^n=e$ 應用)。
*   **第 3, 5 題**：特殊積分與多重積分 (針對技巧：King's Property、積分順序交換)。
*   **第 4 題**：極座標圖形面積 (針對弱點：圖形對稱性、積分上下限取值陷阱)。
*   **第 8 題**：級數收斂半徑 (針對弱點：複雜階乘的 Ratio test)。
*   **第 6, 7, 2, 3 題**：向量微積分與三重積分 (針對弱點：保守場判斷、散度定理中「封閉曲面」的陷阱、球座標圓錐角 $\phi$ 的計算)。
*   **第 1 題 (乙)**：有界區域絕對極值 (針對致命弱點：忘記計算內部臨界點)。

---

## 甲、填充題詳解

**1.** [Medium]
*   **解答：** $-\frac{1}{3}$
*   **解題步驟：**
    此為 $\frac{0}{0}$ 形式，使用羅必達法則 (L'Hopital's Rule) 並結合微積分基本定理。
    $\lim_{x \to 0} \frac{x - \int_0^x e^{t^2} dt}{x^3} \overset{L'H}{=} \lim_{x \to 0} \frac{1 - e^{x^2}}{3x^2}$。
    仍然是 $\frac{0}{0}$，再次使用羅必達法則：
    $\lim_{x \to 0} \frac{-e^{x^2} \cdot 2x}{6x} = \lim_{x \to 0} \frac{-2 e^{x^2}}{6} = -\frac{1}{3}$。
*   **核心公式或定理：** L'Hopital's Rule、微積分基本定理 $\frac{d}{dx} \int_a^x f(t) dt = f(x)$。
*   **常見錯誤陷阱：** 微分積分上限函數時，漏乘連鎖律（若上限是 $x^2$ 時），但本題上限為 $x$ 較單純。

**2.** [Hard]
*   **解答：** $e^3$
*   **解題步驟：**
    這是一個 $1^\infty$ 形式的極限。將底數化為 $(1 + \dots)$ 的形式：
    $\frac{n^2+2n+3}{n^2-n+1} = 1 + \frac{3n+2}{n^2-n+1}$。
    原極限變形為：$\lim_{n \to \infty} \left( 1 + \frac{3n+2}{n^2-n+1} \right)^n$。
    利用指數極限定理 $\lim (1 + u)^{1/u} = e$ (當 $u \to 0$)，我們直接計算次方極限：
    $\lim_{n \to \infty} n \cdot \frac{3n+2}{n^2-n+1} = \lim_{n \to \infty} \frac{3n^2+2n}{n^2-n+1} = 3$。
    故原極限值為 $e^3$。
*   **核心公式或定理：** 自然對數極限 $\lim_{n \to \infty} (1+\frac{a}{n})^n = e^a$ 或 $\lim f(x)^{g(x)} = \exp(\lim g(x)(f(x)-1))$。
*   **常見錯誤陷阱：** 直接代入無窮大，誤寫為 $1^\infty = 1$ (前次測驗的錯誤)。

**3.** [Hard]
*   **解答：** $\frac{\pi}{4}$
*   **解題步驟：**
    利用 King's Property (積分區間反射性質)：$\int_0^a f(x) dx = \int_0^a f(a-x) dx$。
    令 $I = \int_0^{\pi/2} \frac{\sqrt{\sin x}}{\sqrt{\sin x} + \sqrt{\cos x}} dx$。
    利用性質，代換 $x \to \frac{\pi}{2} - x$，則 $\sin(\frac{\pi}{2}-x) = \cos x$，$\cos(\frac{\pi}{2}-x) = \sin x$。
    $I = \int_0^{\pi/2} \frac{\sqrt{\cos x}}{\sqrt{\cos x} + \sqrt{\sin x}} dx$。
    將兩式相加：
    $2I = \int_0^{\pi/2} \frac{\sqrt{\sin x} + \sqrt{\cos x}}{\sqrt{\sin x} + \sqrt{\cos x}} dx = \int_0^{\pi/2} 1 \, dx = \frac{\pi}{2}$。
    故 $I = \frac{\pi}{4}$。
*   **核心公式或定理：** King's Property $\int_a^b f(x) dx = \int_a^b f(a+b-x) dx$。

**4.** [Hard]
*   **解答：** $\pi - \frac{3\sqrt{3}}{2}$
*   **解題步驟：**
    找內圈的 $\theta$ 範圍，令 $r = 0 \implies 1 + 2\cos\theta = 0 \implies \cos\theta = -\frac{1}{2}$。
    在 $0 \sim 2\pi$ 間，$\theta = \frac{2\pi}{3}, \frac{4\pi}{3}$。內圈就是從 $\frac{2\pi}{3}$ 繞到 $\frac{4\pi}{3}$。
    面積 $A = \frac{1}{2} \int_{2\pi/3}^{4\pi/3} (1+2\cos\theta)^2 d\theta$。
    利用圖形對上下對稱，我們可以算上半部內圈再乘以 $2$：$A = 2 \times \frac{1}{2} \int_{2\pi/3}^{\pi} (1+2\cos\theta)^2 d\theta$。
    $A = \int_{2\pi/3}^\pi (1 + 4\cos\theta + 4\cos^2\theta) d\theta = \int_{2\pi/3}^\pi (1 + 4\cos\theta + 2(1+\cos 2\theta)) d\theta$
    $= \int_{2\pi/3}^\pi (3 + 4\cos\theta + 2\cos 2\theta) d\theta = \left[ 3\theta + 4\sin\theta + \sin 2\theta \right]_{2\pi/3}^\pi$
    代入上界 $\pi$：$3\pi + 0 + 0 = 3\pi$。
    代入下界 $2\pi/3$：$3(\frac{2\pi}{3}) + 4(\frac{\sqrt{3}}{2}) + \sin(\frac{4\pi}{3}) = 2\pi + 2\sqrt{3} - \frac{\sqrt{3}}{2} = 2\pi + \frac{3\sqrt{3}}{2}$。
    相減得：$3\pi - (2\pi + \frac{3\sqrt{3}}{2}) = \pi - \frac{3\sqrt{3}}{2}$。
*   **核心公式或定理：** 極座標面積 $A = \frac{1}{2} \int r^2 d\theta$。半角公式。
*   **常見錯誤陷阱：** 積分上下限找錯（例如積成 $\pi/2 \sim \pi$），這就是你前次粗心的點。繪圖找 $r \le 0$ 的區域才是內圈。

**5.** [Medium]
*   **解答：** $\frac{2}{3}\ln 3$  (或 $\frac{1}{3}\ln 9$)
*   **解題步驟：**
    原積分區域為：$\sqrt{x} \le y \le 2$，$0 \le x \le 4$。
    畫圖可知這是由 $y=\sqrt{x} \implies x=y^2$、$y=2$、$x=0$ 圍成的區域。
    改變積分順序（先對 $x$ 積分）：$x$ 從 $0$ 變動到 $y^2$，$y$ 從 $0$ 變動到 $2$。
    $\int_0^2 \int_0^{y^2} \frac{1}{y^3+1} dx dy = \int_0^2 \left[ \frac{x}{y^3+1} \right]_{x=0}^{x=y^2} dy = \int_0^2 \frac{y^2}{y^3+1} dy$
    令 $u = y^3+1, du = 3y^2 dy$。
    $= \left[ \frac{1}{3} \ln|y^3+1| \right]_0^2 = \frac{1}{3} \ln(9) - \frac{1}{3}\ln(1) = \frac{2}{3}\ln 3$。
*   **核心公式或定理：** 改變積分順序 (Fubini's Theorem)。

**6.** [Medium]
*   **解答：** $1$
*   **解題步驟：**
    檢查向量場是否為保守場 (Conservative Field)：
    判斷 $\nabla \times \mathbf{F} = \mathbf{0}$ 或者找位勢函數 (Potential Function) $f$ 使得 $\nabla f = \mathbf{F}$。
    $f_x = 2xy + z \implies f(x,y,z) = x^2 y + xz + g(y,z)$
    $f_y = x^2 + g_y = x^2 \implies g_y = 0 \implies g(y,z) = h(z)$
    $f_z = x + h'(z) = x \implies h'(z) = 0 \implies h(z) = C$
    取位勢函數 $f(x,y,z) = x^2 y + xz$。因 $\mathbf{F}$ 為保守場，線積分與路徑無關。
    由線積分基本定理 (Fundamental Theorem of Line Integrals)：
    $W = \int_C \nabla f \cdot d\mathbf{r} = f(1,1,1) - f(0,0,0) = (1+1) - 0 = 2$。
    *(修正解答)*：題目給定 $(1,1,1)$ 代入 $1^2\cdot 1 + 1\cdot 1 = 2$。
    **正解為 $2$。** *(草稿中原誤植為 1，此處更正)*。
*   **常見錯誤陷阱：** 若傻傻地將某路徑參數化代入，不僅浪費時間還容易算錯。

**7.** [Hard]
*   **解答：** $24\pi$
*   **解題步驟：**
    這是典型「非封閉曲面」使用散度定理的陷阱題。
    讓 $S_1$ 為底部的圓盤 $z=0, x^2+y^2 \le 4$，法向量朝下 $(0,0,-1)$。
    $S \cup S_1$ 構成一個封閉曲面，包圍立體區域 $E$。
    由散度定理：$\iint_{S \cup S_1} \mathbf{F} \cdot d\mathbf{S} = \iiint_E (\nabla \cdot \mathbf{F}) dV$。
    $\nabla \cdot \mathbf{F} = 1+1+1 = 3$。
    體積分：$\iiint_E 3 dV = 3 \times \int_0^{2\pi} \int_0^2 \int_0^{4-r^2} r \, dz dr d\theta = 3 \times 2\pi \int_0^2 r(4-r^2) dr$
    $= 6\pi \left[ 2r^2 - \frac{r^4}{4} \right]_0^2 = 6\pi (8 - 4) = 24\pi$。
    計算底部曲面 $S_1$ 的通量：
    在 $z=0$ 平面上，$\mathbf{F} = (x, y, 0)$。法向量 $\mathbf{n} = (0,0,-1)$。
    $\iint_{S_1} \mathbf{F} \cdot \mathbf{n} dS = \iint_{S_1} (x,y,0) \cdot (0,0,-1) dA = \iint 0 dA = 0$。
    故 $\iint_S \mathbf{F} \cdot d\mathbf{S} = 24\pi - 0 = 24\pi$。
*   **常見錯誤陷阱：** 直接把散度定理的體積結果當作答案，沒有扣除底部的通量。本題恰好底部通量為 0，若不是 0 就會大錯特錯。

**8.** [Hard]
*   **解答：** $\frac{4}{27}$
*   **解題步驟：**
    令 $a_n = \frac{(3n)!}{n!(2n)!}$。使用 Ratio Test 求收斂半徑 $R$：
    $L = \lim_{n \to \infty} \left| \frac{a_{n+1}}{a_n} x \right| = \lim_{n \to \infty} \frac{(3(n+1))!}{(n+1)!(2(n+1))!} \frac{n!(2n)!}{(3n)!} |x| = \lim_{n \to \infty} \frac{(3n+3)!}{(3n)!} \frac{n!}{(n+1)!} \frac{(2n)!}{(2n+2)!} |x|$
    化簡階乘：$\frac{(3n+3)!}{(3n)!} = (3n+3)(3n+2)(3n+1)$。$\frac{n!}{(n+1)!} = \frac{1}{n+1}$。$\frac{(2n)!}{(2n+2)!} = \frac{1}{(2n+2)(2n+1)}$。
    $L = \lim_{n \to \infty} \frac{(3n+3)(3n+2)(3n+1)}{(n+1)(2n+2)(2n+1)} |x| = \lim_{n \to \infty} \frac{3(n+1)(3n+2)(3n+1)}{(n+1) \cdot 2(n+1)(2n+1)} |x| = \lim_{n \to \infty} \frac{3(3n+2)(3n+1)}{2(n+1)(2n+1)} |x|$
    取最高次項係數：$\frac{3 \cdot 3 \cdot 3}{2 \cdot 1 \cdot 2} = \frac{27}{4}$。所以 $L = \frac{27}{4}|x|$。
    收斂條件為 $L < 1 \implies \frac{27}{4}|x| < 1 \implies |x| < \frac{4}{27}$。故 $R = \frac{4}{27}$。
*   **常見錯誤陷阱：** $(3(n+1))! = (3n+3)!$ 容易錯誤展開為 $(3n+1)!$。

---

## 乙、計算、證明題詳解

**1.** [Hard]
*   **解答：絕對最大值為 $3$，絕對最小值為 $-\frac{1}{8}$。**
    *   **解題步驟：**
        **(1) 尋找內部臨界點 (Interior Critical Points)：**
        解 $\nabla f = \mathbf{0} \implies f_x = 4x-1 = 0 \implies x=1/4$；$f_y = 2y = 0 \implies y=0$。
        得到內部臨界點 $(1/4, 0)$。因為 $(1/4)^2 + 0^2 < 1$，此點在圓盤內，必須考慮。
        計算函數值：$f(1/4, 0) = 2(1/16) + 0 - 1/4 = 1/8 - 1/4 = -1/8$。
        
        **(2) 尋找邊界極值 (Boundary Points)：**
        邊界為 $x^2+y^2=1$。我們可以將 $y^2 = 1-x^2$ 代入原函數化為單變數函數。
        $g(x) = f(x, \pm\sqrt{1-x^2}) = 2x^2 + (1-x^2) - x = x^2 - x + 1$。
        因為點必須在圓上，故 $x$ 的定義域為 $[-1, 1]$。
        找 $g(x)$ 的極值：$g'(x) = 2x - 1 = 0 \implies x = 1/2$。
        計算函數值：$g(1/2) = (1/2)^2 - 1/2 + 1 = 1/4 - 1/2 + 1 = 3/4$。
        檢查邊界端點：$x=1 \implies g(1) = 1-1+1 = 1$。$x=-1 \implies g(-1) = 1 - (-1) + 1 = 3$。
        
        **(3) 綜合比較：**
        所有可能極值點的值有：$-1/8$, $3/4$, $1$, $3$。
        最大值為 $3$ (發生在 $(-1, 0)$)。
        最小值為 $-1/8$ (發生在內部點 $(1/4, 0)$)。
    *   **常見錯誤陷阱：** 忘記執行步驟 (1)，這是你上一次考試完全沒算到 $f(0, -1/3)$ 的致命傷！**有界區域極值必定要「內部臨界點」與「邊界極值」一起拿來比大小。**

**2.** [Medium-Hard]
*   **解答：$-\frac{15\pi}{4}$**
    *   **解題步驟：**
        1. 根據 Stokes' Theorem：$\oint_C \mathbf{F} \cdot d\mathbf{r} = \iint_S (\nabla \times \mathbf{F}) \cdot d\mathbf{S}$。
        2. 計算旋度：
           $\nabla \times \mathbf{F} = \left|\begin{matrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ \partial_x & \partial_y & \partial_z \\ y+\sin x & z^2+\cos y & x^3+e^z \end{matrix}\right| = (0 - 2z)\mathbf{i} - (3x^2 - 0)\mathbf{j} + (0 - 1)\mathbf{k} = (-2z, -3x^2, -1)$。
        3. 選擇曲面 $S$：原曲線 $C$ 為平面 $x+y+z=1$ 與圓柱體 $x^2+y^2=1$ 的交線。我們選擇由該曲線圍起的「平面部分」作為 $S$。
           $S$ 方程式：$z = 1-x-y$，定義在投影區域 $D: x^2+y^2 \le 1$ 上。
           向上的法向量元素 $d\mathbf{S} = (-\partial_x z, -\partial_y z, 1) dxdy = (-(-1), -(-1), 1) dxdy = (1, 1, 1) dA$。
        4. 代入面積分計算：
           $\iint_S (\nabla \times \mathbf{F}) \cdot d\mathbf{S} = \iint_D (-2z, -3x^2, -1) \cdot (1, 1, 1) dA = \iint_D (-2z - 3x^2 - 1) dA$。
           將 $z = 1-x-y$ 代入消去 $z$：
           $\iint_D [-2(1-x-y) - 3x^2 - 1] dA = \iint_D (2x + 2y - 3x^2 - 3) dA$。
        5. 在單位圓 $x^2+y^2 \le 1$ 上積分：
           利用對稱性，奇函數在對稱區間積分為 0，故 $\iint_D 2x \, dA = 0$，$\iint_D 2y \, dA = 0$。
           剩下 $\iint_D (-3x^2 - 3) dA = -3 \iint_D (x^2 + 1) dA$。
           利用極座標：$x = r\cos\theta, dA = r \, dr \, d\theta$。
           $\iint_D x^2 dA = \int_0^{2\pi} \int_0^1 (r^2 \cos^2\theta) r \, dr \, d\theta = \left( \int_0^{2\pi} \cos^2\theta d\theta \right) \left( \int_0^1 r^3 dr \right) = (\pi) \left( \frac{1}{4} \right) = \frac{\pi}{4}$。
           $\iint_D 1 dA = \pi \times 1^2 = \pi$。
           總和：$-3 \left( \frac{\pi}{4} + \pi \right) = -3 \left( \frac{5\pi}{4} \right) = -\frac{15\pi}{4}$。
    *   **常見錯誤陷阱：** 參數化曲面法向量時出錯，或者忘記將旋度中的 $z$ 代換為 $1-x-y$。

**3.** [Medium]
*   **解答：$\frac{8\pi}{3}$**
    *   **解題步驟：**
        1. 確定範圍，使用球座標 (Spherical Coordinates)。
           球面方程式 $x^2+y^2+z^2=4 \implies \rho^2=4 \implies \rho=2$。
           圓錐面方程式 $z = \sqrt{\frac{1}{3}(x^2+y^2)}$。代入球座標 $z = \rho\cos\phi$, $x^2+y^2 = \rho^2\sin^2\phi$：
           $\rho\cos\phi = \sqrt{\frac{1}{3} \rho^2\sin^2\phi} = \frac{1}{\sqrt{3}} \rho\sin\phi \implies \tan\phi = \sqrt{3}$。
           在第一卦限及上方，$\phi = \frac{\pi}{3}$。
        2. 立體區域 $E$ 的球座標範圍：
           $0 \le \theta \le 2\pi$
           $0 \le \phi \le \pi/3$
           $0 \le \rho \le 2$
        3. 計算體積 $V = \iiint_E dV$：
           $V = \int_0^{2\pi} \int_0^{\pi/3} \int_0^2 \rho^2 \sin\phi \, d\rho \, d\phi \, d\theta$
           $= \left(\int_0^{2\pi} d\theta\right) \left(\int_0^{\pi/3} \sin\phi d\phi\right) \left(\int_0^2 \rho^2 d\rho\right)$
           $= (2\pi) \times \left[ -\cos\phi \right]_0^{\pi/3} \times \left[ \frac{\rho^3}{3} \right]_0^2$
           $= 2\pi \times (-\cos(\pi/3) - (-\cos 0)) \times (\frac{8}{3}) = 2\pi \times (-\frac{1}{2} + 1) \times \frac{8}{3} = 2\pi \times \frac{1}{2} \times \frac{8}{3} = \frac{8\pi}{3}$。
    *   **核心公式或定理：** 球座標轉換與體積元素 $dV = \rho^2\sin\phi \, d\rho d\phi d\theta$。

---

## 配分建議與評分標準 (Marking Scheme)
*   **甲、填充題 (64%)**：每題 8 分。
    *   必須化簡至最後答案，例如 $e^3$, $\frac{\pi}{4}$。不看計算過程。
    *   第 6 題若寫出 $2$ 給 8 分（原解析筆誤草稿，最終核對為2）。
*   **乙、計算、證明題 (36%)**：每題 12 分。
    *   **第 1 題 (12分)**：算出內部臨界點並求值 (4分)，算出邊界最大最小值 (4分)，最終比較選出正確解答 (4分)。若只算邊界，最多只給 4 分。
    *   **第 2 題 (12分)**：求出正確的旋度 $\nabla \times \mathbf{F}$ (4分)，寫出等價的曲面面積分形式與正確代換 (4分)，正確積出答案 $-\frac{15\pi}{4}$ (4分)。
    *   **第 3 題 (12分)**：求出圓錐的夾角 $\phi=\pi/3$ (4分)，正確寫出球座標三重積分式 (4分)，正確計算出 $\frac{8\pi}{3}$ (4分)。
