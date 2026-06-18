# 2026 台聯大微積分模擬考 (UST Calculus Mock Exam - Comprehensive D) 解答卷

## 考點分佈總表與預期能力分析

本卷延續了 C 卷的高鑑別度，融合 B 卷易錯的盲點，考驗考生綜合運用不同章節技巧的能力：

* **第 1 題**：極限與羅必達/泰勒展開 (弱點：微積分基礎的熟練度)。
* **第 2 題**：定積分 (弱點：King's Property 的進階運用，消去非對稱項 $x$)。
* **第 3 題**：級數求和 (弱點：辨識自然對數的泰勒展開式)。
* **第 4 題**：重積分順序交換與極座標 (弱點：給定非矩形範圍的極座標圖形辨識)。
* **第 5 題**：向量微積分 (弱點：辨識保守場與位勢函數，秒殺複雜路徑積分)。
* **第 6 題**：數列極限與黎曼和 (弱點：分子分母同除高次項化為定積分的技巧)。
* **第 7, 8 題**：曲面積分與多重積分 (弱點：表面積公式，球座標中「偏移球心」方程式的處理)。
* **第 1 題 (乙)**：有界區域絕對極值 (弱點：連鎖律求偏導，以及圓周邊界的參數化比較)。
* **第 2, 3 題 (乙)**：散度定理與斯托克斯定理 (弱點：利用球座標處理體積分、善用「等價底面」取代複雜平面的法向量計算)。

---

## 甲、填充題詳解

**1.** [Medium]

* **解答：** $-\frac{1}{3}$
* **解題步驟：**
  原極限為 $\frac{0}{0}$ 型，可使用羅必達法則 (L'Hopital's Rule)。
  $\lim_{x \to 0} \frac{x \cos x - \sin x}{x^3} \overset{L'H}{=} \lim_{x \to 0} \frac{(\cos x - x \sin x) - \cos x}{3x^2}$
  $= \lim_{x \to 0} \frac{-x \sin x}{3x^2} = \lim_{x \to 0} \frac{-\sin x}{3x} = -\frac{1}{3} \cdot 1 = -\frac{1}{3}$。
* **常見錯誤陷阱：** 第一次微分時，分子 $x\cos x$ 忘記使用乘法規則 (Product Rule)。

**2.** [Hard]

* **解答：** $\frac{\pi^2}{4}$
* **解題步驟：**
  看到 $0 \sim \pi$ 與 $x f(\sin x, \cos x)$ 形式，必須秒想到 King's Property：$\int_0^a f(x)dx = \int_0^a f(a-x)dx$。
  令 $I = \int_0^{\pi} \frac{x \sin x}{1+\cos^2 x} dx$。
  替換 $x \to \pi - x$，得到 $I = \int_0^{\pi} \frac{(\pi-x) \sin(\pi-x)}{1+\cos^2(\pi-x)} dx$。
  因為 $\sin(\pi-x) = \sin x$，$\cos(\pi-x) = -\cos x \implies \cos^2(\pi-x) = \cos^2 x$。
  $I = \int_0^{\pi} \frac{(\pi-x) \sin x}{1+\cos^2 x} dx = \pi \int_0^{\pi} \frac{\sin x}{1+\cos^2 x} dx - I$。
  移項得 $2I = \pi \int_0^{\pi} \frac{\sin x}{1+\cos^2 x} dx$。
  現在令 $u = \cos x, du = -\sin x dx$。當 $x=0 \implies u=1$，當 $x=\pi \implies u=-1$。
  $2I = \pi \int_{1}^{-1} \frac{-du}{1+u^2} = \pi \int_{-1}^{1} \frac{1}{1+u^2} du = \pi \left[ \arctan u \right]_{-1}^1 = \pi \left( \frac{\pi}{4} - (-\frac{\pi}{4}) \right) = \pi (\frac{\pi}{2}) = \frac{\pi^2}{2}$。
  故 $I = \frac{\pi^2}{4}$。
* **核心公式或定理：** King's Property。這是解決多出一個 $x$ 乘在前面的終極殺招。

**3.** [Medium]

* **解答：** $\ln(\frac{3}{2})$
* **解題步驟：**
  回想自然對數的 Maclaurin 級數展開：
  $\ln(1+x) = \sum_{n=1}^\infty \frac{(-1)^{n-1} x^n}{n} = x - \frac{x^2}{2} + \frac{x^3}{3} - \dots$
  原題式子為 $\sum_{n=1}^\infty \frac{(-1)^{n-1}}{n} (\frac{1}{2})^n$。
  這正好是將 $x = \frac{1}{2}$ 代入上述級數。
  因此總和為 $\ln(1 + \frac{1}{2}) = \ln(\frac{3}{2})$。
* **常見錯誤陷阱：** 把分母的 $n$ 跟階乘 $n!$ 搞混，誤以為是 $e^x$ 的某種變形。

**4.** [Medium-Hard]

* **解答：** $\frac{\pi}{8}(1 - e^{-4})$
* **解題步驟：**
  無法直接對 $x$ 積分 $e^{-x^2}$，需改變為極座標。
  積分區域為：$y \le x \le \sqrt{4-y^2}$ 且 $0 \le y \le \sqrt{2}$。
  $x = \sqrt{4-y^2} \implies x^2+y^2=4$ (圓半徑 2)。
  $x = y$ 是一條斜率為 1 的直線，極角為 $\theta = \frac{\pi}{4}$。
  畫圖可知這是第一象限內，夾在 $x$ 軸 ($\theta=0$) 與直線 $y=x$ ($\theta=\pi/4$) 之間的四分之一圓弧區塊。
  轉換為極座標：
  $0 \le \theta \le \frac{\pi}{4}$， $0 \le r \le 2$。
  $\int_0^{\pi/4} \int_0^2 e^{-r^2} r dr d\theta = \left( \int_0^{\pi/4} d\theta \right) \left( \int_0^2 r e^{-r^2} dr \right)$
  $= (\frac{\pi}{4}) \times \left[ -\frac{1}{2} e^{-r^2} \right]_0^2 = \frac{\pi}{4} \left( -\frac{1}{2}e^{-4} - (-\frac{1}{2}) \right) = \frac{\pi}{8} (1 - e^{-4})$。

**5.** [Medium]

* **解答：** $1$
* **解題步驟：**
  看到複雜的路徑函數，首先懷疑 $\mathbf{F}$ 是否為保守場 (Conservative Field)。
  尋找位勢函數 $f(x,y,z)$ 使得 $\nabla f = \mathbf{F}$：
  $f_x = 2xy^3 + z^2 \implies f = x^2y^3 + xz^2 + g(y,z)$
  $f_y = 3x^2y^2 + 2yz \implies f = x^2y^3 + y^2z + h(x,z)$
  $f_z = 2xz + y^2 \implies f = xz^2 + y^2z + k(x,y)$
  整合三者可得位勢函數：$f(x,y,z) = x^2y^3 + y^2z + xz^2$。
  這是一個保守場，作功與路徑無關，只與起終點有關！
  起點 $t=0$：$\mathbf{r}(0) = (\sin 0, -1, 0) = (0, -1, 0)$。
  終點 $t=1$：$\mathbf{r}(1) = (\sin(\pi/2), 0, 1) = (1, 0, 1)$。
  Work $= f(1, 0, 1) - f(0, -1, 0) = (0 + 0 + 1) - (0 + 0 + 0) = 1$。
* **常見錯誤陷阱：** 企圖硬生生把 $\mathbf{r}(t)$ 丟進去線積分裡算，不僅會花上 20 分鐘，而且極易算錯。

**6.** [Hard]

* **解答：** $2(\sqrt{2}-1)$
* **解題步驟：**
  將極限式整理為黎曼和 (Riemann Sum) 形式。將根號內提出 $n^2$：
  $\sum_{k=1}^n \frac{1}{\sqrt{n^2(1 + k/n)}} = \sum_{k=1}^n \frac{1}{n \sqrt{1 + k/n}} = \frac{1}{n} \sum_{k=1}^n \frac{1}{\sqrt{1 + k/n}}$。
  這是一個函數 $f(x) = \frac{1}{\sqrt{1+x}}$ 在區間 $[0, 1]$ 的黎曼和（間隔為 $1/n$）。
  極限等同於定積分：$\int_0^1 \frac{1}{\sqrt{1+x}} dx$。
  令 $u = 1+x, du=dx$，積分 $= \left[ 2\sqrt{1+x} \right]_0^1 = 2\sqrt{2} - 2\sqrt{1} = 2(\sqrt{2}-1)$。

**7.** [Medium]

* **解答：** $\frac{\pi}{6}(5\sqrt{5} - 1)$
* **解題步驟：**
  求表面積，使用公式 $SA = \iint_D \sqrt{1 + f_x^2 + f_y^2} dA$。
  $z = f(x,y) = 1 - x^2 - y^2$。
  $f_x = -2x$，$f_y = -2y$。
  曲面在 $z \ge 0$ 的部分，其在 $xy$ 平面的投影區域 $D$ 為 $x^2+y^2 \le 1$ (單位圓)。
  $SA = \iint_D \sqrt{1 + (-2x)^2 + (-2y)^2} dA = \iint_D \sqrt{1 + 4(x^2+y^2)} dA$。
  轉換為極座標：
  $= \int_0^{2\pi} \int_0^1 \sqrt{1+4r^2} \cdot r dr d\theta = 2\pi \int_0^1 r(1+4r^2)^{1/2} dr$。
  令 $u = 1+4r^2, du = 8r dr \implies rdr = \frac{1}{8}du$。
  $= 2\pi \left[ \frac{1}{8} \cdot \frac{2}{3} (1+4r^2)^{3/2} \right]_0^1 = 2\pi \cdot \frac{1}{12} \left[ 5^{3/2} - 1^{3/2} \right] = \frac{\pi}{6}(5\sqrt{5} - 1)$。

**8.** [Hard]

* **解答：** $\pi$
* **解題步驟：**
  利用球座標 (Spherical Coordinates)。
  球面方程式：$x^2+y^2+z^2=2z \implies \rho^2 = 2\rho\cos\phi \implies \rho = 2\cos\phi$。
  圓錐面：$z = \sqrt{x^2+y^2}$，這代表 $\phi = \pi/4$ 的圓錐。
  立體區域由 $\theta \in [0, 2\pi]$， $\phi \in [0, \pi/4]$， $\rho \in [0, 2\cos\phi]$ 所圍成。
  體積 $V = \int_0^{2\pi} \int_0^{\pi/4} \int_0^{2\cos\phi} \rho^2 \sin\phi d\rho d\phi d\theta$
  $= \int_0^{2\pi} d\theta \times \int_0^{\pi/4} \sin\phi \left[ \frac{\rho^3}{3} \right]_0^{2\cos\phi} d\phi = 2\pi \int_0^{\pi/4} \sin\phi \left( \frac{8}{3}\cos^3\phi \right) d\phi$
  $= \frac{16\pi}{3} \int_0^{\pi/4} \cos^3\phi \sin\phi d\phi$。
  令 $u = \cos\phi, du = -\sin\phi d\phi$：
  $= \frac{16\pi}{3} \left[ -\frac{1}{4} \cos^4\phi \right]_0^{\pi/4} = \frac{16\pi}{3} \left( -\frac{1}{4} (\frac{1}{\sqrt{2}})^4 - (-\frac{1}{4} (1)^4) \right)$
  $= \frac{16\pi}{3} \left( -\frac{1}{4} \cdot \frac{1}{4} + \frac{1}{4} \right) = \frac{16\pi}{3} \left( -\frac{1}{16} + \frac{4}{16} \right) = \frac{16\pi}{3} \cdot \frac{3}{16} = \pi$。

---

## 乙、計算、證明題詳解

**1.** [Hard]

* **解答：絕對最大值為 $1/e$，絕對最小值為 $-1/e$。**
  * **解題步驟：**
    這是一道典型的有界區域絕對極值問題，必須分別檢查「內部臨界點」與「邊界點」。

    **(1) 尋找內部臨界點 (Interior Critical Points)：**
    解 $\nabla f = \mathbf{0}$。
    $f_x = y \cdot e^{-(x^2+y^2)/2} + (xy) \cdot e^{-(x^2+y^2)/2} (-x) = y(1-x^2)e^{-(x^2+y^2)/2} = 0$。
    $f_y = x \cdot e^{-(x^2+y^2)/2} + (xy) \cdot e^{-(x^2+y^2)/2} (-y) = x(1-y^2)e^{-(x^2+y^2)/2} = 0$。
    因為 $e^{-\dots}$ 永遠大於 0，所以：
    由 $f_x=0 \implies y=0$ 或 $x=\pm 1$。

    - 若 $y=0$，代入 $f_y=0 \implies x(1-0)=0 \implies x=0$。得點 $(0,0)$。
    - 若 $x=1$，代入 $f_y=0 \implies 1(1-y^2)=0 \implies y=\pm 1$。得點 $(1,1), (1,-1)$。
    - 若 $x=-1$，代入 $f_y=0 \implies -1(1-y^2)=0 \implies y=\pm 1$。得點 $(-1,1), (-1,-1)$。
      所有這 5 個臨界點都在圓盤 $x^2+y^2 \le 4$ 內部，故皆須計算函數值：
      $f(0,0) = 0$
      $f(1,1) = 1 \cdot e^{-1} = 1/e$
      $f(-1,-1) = 1 \cdot e^{-1} = 1/e$
      $f(1,-1) = -1 \cdot e^{-1} = -1/e$
      $f(-1,1) = -1 \cdot e^{-1} = -1/e$

    **(2) 尋找邊界極值 (Boundary Points)：**
    邊界為圓 $x^2+y^2=4$。在邊界上，函數可簡化為：
    $f(x,y) = xy e^{-4/2} = xy e^{-2}$。
    我們要找 $g(x,y) = xy$ 在圓 $x^2+y^2=4$ 上的極值。
    參數化：$x = 2\cos\theta, y = 2\sin\theta$。
    $g(\theta) = (2\cos\theta)(2\sin\theta) = 4\sin\theta\cos\theta = 2\sin(2\theta)$。
    因為 $\sin(2\theta)$ 的最大值是 $1$，最小值是 $-1$，
    所以邊界上 $f(x,y)$ 的最大值為 $2e^{-2} = \frac{2}{e^2}$，最小值為 $-\frac{2}{e^2}$。

    **(3) 綜合比較大小：**
    我們有候選值：$0, \frac{1}{e}, -\frac{1}{e}, \frac{2}{e^2}, -\frac{2}{e^2}$。
    比較正數部分：$\frac{1}{e}$ 與 $\frac{2}{e^2}$。
    因為 $e \approx 2.718 > 2$，所以 $\frac{1}{e} = \frac{e}{e^2} > \frac{2}{e^2}$。
    故絕對最大值為 $1/e$。
    同理，絕對最小值為 $-1/e$。
  * **常見錯誤陷阱：** 微分時忘記 Chain Rule，或者在邊界參數化時漏掉半徑 $R=2$。

**2.** [Medium-Hard]

* **解答：$\frac{208\pi}{5}$**
  * **解題步驟：**
    根據散度定理 (Divergence Theorem)：$\iint_S \mathbf{F} \cdot d\mathbf{S} = \iiint_E (\nabla \cdot \mathbf{F}) dV$。
    首先計算散度：
    $\nabla \cdot \mathbf{F} = \frac{\partial}{\partial x}(x^3 + y\sin z) + \frac{\partial}{\partial y}(y^3 + z\sin x) + \frac{\partial}{\partial z}(3z + x\cos y)$
    $= 3x^2 + 3y^2 + 3 = 3(x^2+y^2+1)$。

    區域 $E$ 是半徑為 2 的上半球。使用球座標轉換：
    $x^2+y^2 = \rho^2\sin^2\phi\cos^2\theta + \rho^2\sin^2\phi\sin^2\theta = \rho^2\sin^2\phi$。
    $\nabla \cdot \mathbf{F} = 3(\rho^2\sin^2\phi + 1)$。
    體積元素 $dV = \rho^2\sin\phi \, d\rho \, d\phi \, d\theta$。
    範圍為：$0 \le \theta \le 2\pi$，$0 \le \phi \le \pi/2$ (因為是上半球)，$0 \le \rho \le 2$。

    $\iiint_E 3(x^2+y^2+1) dV = \int_0^{2\pi} \int_0^{\pi/2} \int_0^2 3(\rho^2\sin^2\phi + 1) \rho^2\sin\phi d\rho d\phi d\theta$
    $= 3 \int_0^{2\pi} d\theta \times \left[ \int_0^{\pi/2} \int_0^2 (\rho^4\sin^3\phi + \rho^2\sin\phi) d\rho d\phi \right]$
    $= 6\pi \left[ \int_0^{\pi/2} \sin^3\phi d\phi \cdot \int_0^2 \rho^4 d\rho + \int_0^{\pi/2} \sin\phi d\phi \cdot \int_0^2 \rho^2 d\rho \right]$。

    分別計算各項積分：

    - $\int_0^2 \rho^4 d\rho = \frac{32}{5}$。
    - $\int_0^2 \rho^2 d\rho = \frac{8}{3}$。
    - $\int_0^{\pi/2} \sin^3\phi d\phi = \int_0^{\pi/2} (1-\cos^2\phi)\sin\phi d\phi$。令 $u = \cos\phi$，積分為 $\int_0^1 (1-u^2)du = 1 - \frac{1}{3} = \frac{2}{3}$。
    - $\int_0^{\pi/2} \sin\phi d\phi = [-\cos\phi]_0^{\pi/2} = 1$。

    代回原式：
    $= 6\pi \left[ (\frac{2}{3})(\frac{32}{5}) + (1)(\frac{8}{3}) \right] = 6\pi \left[ \frac{64}{15} + \frac{40}{15} \right] = 6\pi \left( \frac{104}{15} \right) = 2\pi \left( \frac{104}{5} \right) = \frac{208\pi}{5}$。

**3.** [Medium]

* **解答：$\frac{3\pi}{2}$**
  * **解題步驟：**
    根據 Stokes' Theorem：$\oint_C \mathbf{F} \cdot d\mathbf{r} = \iint_S (\nabla \times \mathbf{F}) \cdot \mathbf{n} dS$。
    首先計算旋度：
    $\nabla \times \mathbf{F} = \left|\begin{matrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ \partial_x & \partial_y & \partial_z \\ -y^3 & x^3 & -z^3 \end{matrix}\right| = (0 - 0)\mathbf{i} - (0 - 0)\mathbf{j} + (3x^2 - (-3y^2))\mathbf{k} = (0, 0, 3x^2+3y^2)$。

    **【聰明解法：替換曲面】**
    此邊界曲線 $C$ 為圓柱面與平面的交線。任何以 $C$ 為邊界的曲面，其 Curl 通量皆相同！
    與其使用傾斜平面 $z=1-x-y$，我們可以使用「在傾斜平面上的這塊橢圓區域」。
    既然法向量朝上，曲面 $S$ 參數化為 $z = 1-x-y$，$D$ 為單位圓 $x^2+y^2 \le 1$。
    向上的法向量元素 $d\mathbf{S} = (-\partial_x z, -\partial_y z, 1) dxdy = (1, 1, 1) dA$。
    面積分：$\iint_S (\nabla \times \mathbf{F}) \cdot d\mathbf{S} = \iint_D (0, 0, 3x^2+3y^2) \cdot (1, 1, 1) dA$
    $= \iint_D 3(x^2+y^2) dA$。

    這就回歸到單位圓盤的二重積分。轉換極座標：
    $= 3 \int_0^{2\pi} \int_0^1 r^2 \cdot r dr d\theta = 3(2\pi) \left[ \frac{r^4}{4} \right]_0^1 = 6\pi (\frac{1}{4}) = \frac{3\pi}{2}$。

---

## 配分建議與評分標準 (Marking Scheme)

* **甲、填充題 (64%)**：每題 8 分。
  * 必須化簡至最後答案。不看計算過程，答案正確即給分。
* **乙、計算、證明題 (36%)**：每題 12 分。
  * **第 1 題**：求出內部臨界點並得到 $1/e$ 與 $-1/e$ 得 5 分；正確處理邊界條件找出邊界極值 $2/e^2$ 得 5 分；最後比較大小寫出正確答案得 2 分。
  * **第 2 題**：正確計算出散度 $3(x^2+y^2+1)$ 得 4 分；正確寫出球座標系範圍與體積轉換公式得 4 分；最後各項積分計算正確並得到最終答案得 4 分。
  * **第 3 題**：求出旋度 $(0,0,3x^2+3y^2)$ 得 4 分；正確設定曲面並寫出曲面積分式 (或使用 $d\mathbf{S}=(1,1,1)dA$) 得 4 分；轉換極座標並算出正確答案得 4 分。
