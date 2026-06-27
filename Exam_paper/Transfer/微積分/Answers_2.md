# 國立臺灣聯合大學系統 114學年度 微積分 模擬測驗 解答卷 (Answers 2)

## 考點分佈總表

| 題號 | 測驗考點 / 知識領域 | 難度標籤 | 弱點針對 (Targeted) |
| :--- | :--- | :---: | :---: |
| 甲-1 | L'Hôpital's Rule & Indeterminate Forms | [Medium] | |
| 甲-2 | Double Integrals: Reversing Order of Integration | [Medium] | |
| 甲-3 | Arc Length of Space Curves | [Easy] | |
| 甲-4 | Triple Integrals in Spherical Coordinates | [Hard] | |
| 甲-5 | Vector Calculus: Stokes' Theorem | [Hard] | |
| 甲-6 | Definite Integrals as Limit of Riemann Sums | [Medium] | |
| 甲-7 | Directional Derivatives & Fundamental Theorem | [Medium] | |
| 甲-8 | Maclaurin Series via Algebraic Manipulation | [Hard] | |
| 乙-1 | Power Series, Ratio Test, Endpoint Convergence | [Medium] | ✅ Ratio Test 收斂判斷與區間 |
| 乙-2 | Lagrange Multipliers (Extrema with Constraints) | [Hard] | ✅ 代數替換與解聯立方程式 |
| 乙-3 | Definition of Partial Derivatives & Clairaut's Thm | [Hard] | |

---

## 評分標準與建議 (Marking Scheme)
- **總分：** 100 分
- **配分：** 填充題每題 8 分；計算證明題每題 12 分。
- **實力評估：**
  - **80分以上：** 觀念極度扎實，計算能力優秀，具備台聯大頂尖科系錄取水準。
  - **65 - 79分：** 基本功良好，但在複雜幾何（如球座標、Stokes' Theorem）或長計算中容易失誤。
  - **50 - 64分：** 針對計算題 (乙大題) 的弱點必須再次檢討，特別是 ✅ 標記的弱點題。
  - **50分以下：** 多變數微積分與無窮級數觀念尚未穩固，建議從課本基礎習題重新出發。

---

## 詳細解說 (Detailed Solutions)

### 甲、填充題 (每題 8 分)

**1. Answer: `1/√e` or `e^{-1/2}`**
- **解析：** 這是一個 $1^\infty$ 的未定式。令 $y = (\cos x)^{\frac{1}{x^2}}$，則 $\ln y = \frac{\ln(\cos x)}{x^2}$。
利用 L'Hôpital's Rule 求極限：$\lim_{x \to 0^+} \frac{\ln(\cos x)}{x^2} = \lim_{x \to 0^+} \frac{-\tan x}{2x} = -\frac{1}{2}$。
因此 $\lim_{x \to 0^+} y = e^{-1/2} = \frac{1}{\sqrt{e}}$。

**2. Answer: `(1 - e^{-1})/2`**
- **解析：** 原積分無法直接積 $e^{-x^2}$，必須改變積分順序。
範圍是 $0 \le y \le 1, y \le x \le 1$。畫出區域後可知等價於 $0 \le x \le 1, 0 \le y \le x$。
$\int_0^1 \int_0^x e^{-x^2} dy dx = \int_0^1 x e^{-x^2} dx = \left[-\frac{1}{2} e^{-x^2}\right]_0^1 = \frac{1}{2} - \frac{1}{2e} = \frac{1 - e^{-1}}{2}$。

**3. Answer: `√3`**
- **解析：** 弧長公式 $L = \int_0^{\ln 2} \|\mathbf{r}'(t)\| dt$。
$\mathbf{r}'(t) = \langle e^t(\cos t - \sin t), e^t(\sin t + \cos t), e^t \rangle$。
$\|\mathbf{r}'(t)\| = \sqrt{e^{2t}(\cos t - \sin t)^2 + e^{2t}(\sin t + \cos t)^2 + e^{2t}} = \sqrt{e^{2t}(1 - 2\sin t\cos t + 1 + 2\sin t\cos t + 1)} = \sqrt{3e^{2t}} = \sqrt{3}e^t$。
$L = \int_0^{\ln 2} \sqrt{3} e^t dt = \sqrt{3}[e^t]_0^{\ln 2} = \sqrt{3}(2 - 1) = \sqrt{3}$。

**4. Answer: `8π(2 - √2)/3`**
- **解析：** 使用球座標 (Spherical Coordinates)。
圓錐 $z = \sqrt{x^2+y^2}$ 對應到 $\phi = \pi/4$。球體 $x^2+y^2+z^2=4$ 對應到 $\rho = 2$。
體積 $V = \int_0^{2\pi} \int_0^{\pi/4} \int_0^2 \rho^2 \sin\phi \, d\rho \, d\phi \, d\theta$
$= \left(\int_0^{2\pi} d\theta\right) \left(\int_0^{\pi/4} \sin\phi \, d\phi\right) \left(\int_0^2 \rho^2 \, d\rho\right) = 2\pi \cdot \left[-\cos\phi\right]_0^{\pi/4} \cdot \left[\frac{1}{3}\rho^3\right]_0^2$
$= 2\pi \cdot (1 - \frac{\sqrt{2}}{2}) \cdot \frac{8}{3} = \frac{16\pi}{3} \left(\frac{2-\sqrt{2}}{2}\right) = \frac{8\pi(2-\sqrt{2})}{3}$。

**5. Answer: `-4π`**
- **解析：** 根據 Stokes' Theorem，$\iint_S (\nabla \times \mathbf{F}) \cdot \mathbf{n} dS = \oint_C \mathbf{F} \cdot d\mathbf{r}$。
邊界曲線 $C$ 是 $z=9-x^2-y^2$ 與 $z=5$ 的交線，即 $x^2+y^2=4$ 位於 $z=5$ 的平面上。因法向量朝上，由上方俯視 $C$ 為逆時針。
參數化 $C$: $\mathbf{r}(t) = \langle 2\cos t, 2\sin t, 5 \rangle, 0 \le t \le 2\pi$。
$d\mathbf{r} = \langle -2\sin t, 2\cos t, 0 \rangle dt$。
$\mathbf{F}(\mathbf{r}(t)) = \langle 2\sin t, 5, 2\cos t \rangle$。
$\oint_C \mathbf{F} \cdot d\mathbf{r} = \int_0^{2\pi} (2\sin t)(-2\sin t) + (5)(2\cos t) + 0 \, dt = \int_0^{2\pi} (-4\sin^2 t + 10\cos t) dt = -4(\pi) + 0 = -4\pi$。

**6. Answer: `π/4`**
- **解析：** $\lim_{n \to \infty} \sum_{i=1}^n \frac{n}{n^2 + i^2} = \lim_{n \to \infty} \frac{1}{n} \sum_{i=1}^n \frac{1}{1 + (i/n)^2}$。
這是一個黎曼和 (Riemann Sum)，對應的定積分為 $\int_0^1 \frac{1}{1+x^2} dx = \left[\tan^{-1} x\right]_0^1 = \frac{\pi}{4}$。

**7. Answer: `7e/5`**
- **解析：** 由微積分基本定理，$\nabla f = \langle f_x, f_y \rangle = \langle e^{x^2}, -e^{y^2} \rangle$。
在點 $(1,1)$ 的梯度為 $\nabla f(1,1) = \langle e, -e \rangle$。
方向向量 $\mathbf{v} = \langle 3, -4 \rangle$，其單位向量 $\mathbf{u} = \langle \frac{3}{5}, -\frac{4}{5} \rangle$。
方向導數 $D_{\mathbf{u}}f(1,1) = \nabla f(1,1) \cdot \mathbf{u} = e(\frac{3}{5}) + (-e)(-\frac{4}{5}) = \frac{3e}{5} + \frac{4e}{5} = \frac{7e}{5}$。

**8. Answer: `-1`**
- **解析：** 巧妙的代數操作：$f(x) = \frac{1}{1-x+x^2} = \frac{1+x}{(1+x)(1-x+x^2)} = \frac{1+x}{1+x^3}$。
利用幾何級數展開 $\frac{1}{1 - (-x^3)} = 1 - x^3 + x^6 - x^9 + \cdots$。
$f(x) = (1+x)(1 - x^3 + x^6 - \cdots) = 1 + x - x^3 - x^4 + x^6 + x^7 - \cdots$。
因此 $x^4$ 的係數為 $-1$。

---

### 乙、計算、證明題 (每題 12 分)

**1. 解析與給分指引：**
**(a) 求收斂半徑 (6 分)**
設 $a_n = \frac{(x-2)^n}{n \cdot 4^n}$。根據 Ratio Test (比值審斂法)：
$$ \lim_{n \to \infty} \left| \frac{a_{n+1}}{a_n} \right| = \lim_{n \to \infty} \left| \frac{(x-2)^{n+1}}{(n+1) 4^{n+1}} \cdot \frac{n \cdot 4^n}{(x-2)^n} \right| = \lim_{n \to \infty} \frac{n}{n+1} \cdot \frac{|x-2|}{4} = \frac{|x-2|}{4} $$
為了保證絕對收斂，必須 $\frac{|x-2|}{4} < 1 \implies |x-2| < 4$。
由此可得收斂半徑 $R = 4$。 *(寫出比值極限給 3 分，得出 $R=4$ 給 3 分)*

**(b) 判斷端點收斂性 (6 分)**
區間為 $(2-4, 2+4) = (-2, 6)$。我們需要測試端點 $x=6$ 與 $x=-2$。
1. **當 $x=6$ 時**：級數變為 $\sum_{n=1}^\infty \frac{4^n}{n \cdot 4^n} = \sum_{n=1}^\infty \frac{1}{n}$。
這是一個 $p$-series (調和級數)，其中 $p=1 \le 1$，所以此級數**發散 (Diverges)**。 *(3 分)*
2. **當 $x=-2$ 時**：級數變為 $\sum_{n=1}^\infty \frac{(-4)^n}{n \cdot 4^n} = \sum_{n=1}^\infty \frac{(-1)^n}{n}$。
這是一個交錯級數 (Alternating Series)。由於 $\frac{1}{n}$ 恆正、遞減且 $\lim_{n \to \infty} \frac{1}{n} = 0$，根據交錯級數審斂法，此級數收斂。
但因為其絕對值級數 $\sum \left| \frac{(-1)^n}{n} \right| = \sum \frac{1}{n}$ 發散，因此在 $x=-2$ 時為**條件收斂 (Conditionally Convergent)**。 *(3 分)*

**2. 解析與給分指引：**
使用 Lagrange Multipliers。目標函數 $f(x, y) = xy$，限制條件 $g(x, y) = x^2 + 4y^2 - 16 = 0$。
建立方程式系統：$\nabla f = \lambda \nabla g \implies \langle y, x \rangle = \lambda \langle 2x, 8y \rangle$。
這產生三個方程式：
(1) $y = 2\lambda x$
(2) $x = 8\lambda y$
(3) $x^2 + 4y^2 = 16$
將 (1) 代入 (2) 得到：$x = 8\lambda (2\lambda x) = 16\lambda^2 x \implies x(1 - 16\lambda^2) = 0$。 *(4 分)*
如果 $x=0$，則由 (1) 得 $y=0$。但 $(0,0)$ 不滿足條件 $0^2 + 4(0)^2 \neq 16$，所以 $x \neq 0$。
因此 $1 - 16\lambda^2 = 0 \implies \lambda^2 = \frac{1}{16} \implies \lambda = \pm \frac{1}{4}$。 *(2 分)*
**情況一：$\lambda = \frac{1}{4}$**
由 (1) 得 $y = \frac{1}{2}x \implies x = 2y$。*(這就是上次作答時代數替換容易出錯的地方！)*
代入 (3) 中：$(2y)^2 + 4y^2 = 16 \implies 4y^2 + 4y^2 = 16 \implies 8y^2 = 16 \implies y^2 = 2 \implies y = \pm \sqrt{2}$。
對應的點為 $(2\sqrt{2}, \sqrt{2})$ 與 $(-2\sqrt{2}, -\sqrt{2})$。這兩點的函數值 $f(x,y) = xy = 4$。 *(3 分)*
**情況二：$\lambda = -\frac{1}{4}$**
由 (1) 得 $y = -\frac{1}{2}x \implies x = -2y$。
代入 (3) 中：$(-2y)^2 + 4y^2 = 16 \implies 4y^2 + 4y^2 = 16 \implies 8y^2 = 16 \implies y = \pm \sqrt{2}$。
對應的點為 $(-2\sqrt{2}, \sqrt{2})$ 與 $(2\sqrt{2}, -\sqrt{2})$。這兩點的函數值 $f(x,y) = xy = -4$。 *(2 分)*
結論：**Absolute Maximum is 4, Absolute Minimum is -4.** *(1 分)*

**3. 解析與給分指引：**
這題是探討 Clairaut's Theorem (偏微分交換律) 失效的經典反例。
**(a) 偏導數 (6 分)**
依據極限定義：
$f_x(0, y) = \lim_{h \to 0} \frac{f(h, y) - f(0, y)}{h}$。
當 $y \neq 0$ 時，$\lim_{h \to 0} \frac{\frac{h^3 y - h y^3}{h^2 + y^2} - 0}{h} = \lim_{h \to 0} \frac{h^2 y - y^3}{h^2 + y^2} = \frac{-y^3}{y^2} = -y$。當 $y=0$ 時 $f_x(0,0)=0$ 同樣成立。因此 $f_x(0, y) = -y$。 *(3 分)*
$f_y(x, 0) = \lim_{k \to 0} \frac{f(x, k) - f(x, 0)}{k}$。
當 $x \neq 0$ 時，$\lim_{k \to 0} \frac{\frac{x^3 k - x k^3}{x^2 + k^2} - 0}{k} = \lim_{k \to 0} \frac{x^3 - x k^2}{x^2 + k^2} = \frac{x^3}{x^2} = x$。當 $x=0$ 時 $f_y(0,0)=0$ 同樣成立。因此 $f_y(x, 0) = x$。 *(3 分)*

**(b) 混合偏導數 (6 分)**
依據極限定義計算在 $(0,0)$ 的混合偏導數：
$f_{xy}(0,0) = \frac{\partial}{\partial y}(f_x)(0,0) = \lim_{k \to 0} \frac{f_x(0, k) - f_x(0,0)}{k} = \lim_{k \to 0} \frac{-k - 0}{k} = -1$。 *(3 分)*
$f_{yx}(0,0) = \frac{\partial}{\partial x}(f_y)(0,0) = \lim_{h \to 0} \frac{f_y(h, 0) - f_y(0,0)}{h} = \lim_{h \to 0} \frac{h - 0}{h} = 1$。 *(2 分)*
因為 $-1 \neq 1$，故證明 $f_{xy}(0,0) \neq f_{yx}(0,0)$。 *(1 分)*
*(註：這代表此函數的混合偏導數在原點不連續，因此 Clairaut's Theorem 在此不適用。)*
