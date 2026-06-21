# 國立臺灣大學 112 學年度轉學生招生考試 微積分(B) 參考解答

## PART I. Fill in the blanks

### 1. 
**題目：** Evaluate $\lim_{x\to 0} \left( \frac{\sqrt{x+4}-2}{\tan^{-1}(\pi x)} \right)$

**解析：**
代入 $x=0$ 得到 $\frac{0}{0}$ 型未定式，可使用羅必達法則 (L'Hôpital's rule)：
分子微分：$\frac{d}{dx}(\sqrt{x+4}-2) = \frac{1}{2\sqrt{x+4}}$
分母微分：$\frac{d}{dx}(\tan^{-1}(\pi x)) = \frac{1}{1+(\pi x)^2} \cdot \pi$
計算極限：
$$ \lim_{x\to 0} \frac{\frac{1}{2\sqrt{x+4}}}{\frac{\pi}{1+(\pi x)^2}} = \frac{\frac{1}{4}}{\pi} = \frac{1}{4\pi} $$

**解答 (1)：** $\frac{1}{4\pi}$

---

### 2.
**題目：** 曲線 $x - \sqrt{xy} + y = 3$ 通過點 $(4,1)$，求在 $(4,1)$ 的切線方程式。

**解析：**
對 $x$ 隱微分：
$$ 1 - \frac{1}{2\sqrt{xy}}\left(1\cdot y + x \cdot y'\right) + y' = 0 $$
代入 $(x, y) = (4, 1)$，此時 $\sqrt{xy} = \sqrt{4} = 2$：
$$ 1 - \frac{1}{4}(1 + 4y') + y' = 0 \implies 1 - \frac{1}{4} - y' + y' = 0 \implies \frac{3}{4} = 0 $$
等式出現矛盾！這代表 $y'$ 在該點的係數為 $0$，意即斜率為無限大（切線為鉛直線）。
進一步整理隱微分式：
$$ (1 - \frac{x}{2\sqrt{xy}})y' = \frac{y}{2\sqrt{xy}} - 1 $$
代入 $(4,1)$：$(1 - \frac{4}{4})y' = \frac{1}{4} - 1 \implies 0 \cdot y' = -\frac{3}{4}$，故切線斜率不存在（垂直切線）。
切線通過 $x=4$，故方程式為 $x=4$。

**解答 (2)：** $x = 4$

---

### 3.
**題目：** 求函數 $f(x) = x^6 e^{-2x^2}$ 的絕對極大值。

**解析：**
求導：
$$ f'(x) = 6x^5 e^{-2x^2} + x^6 e^{-2x^2} (-4x) = 2x^5 e^{-2x^2} (3 - 2x^2) $$
令 $f'(x) = 0$，得 $x=0$ 或 $x^2 = \frac{3}{2}$。
因為 $f(x) \ge 0$ 且 $f(0)=0$，極大值必發生在 $x^2 = \frac{3}{2}$ 處。
代回原函數：
$$ f\left(\pm\sqrt{\frac{3}{2}}\right) = \left(\frac{3}{2}\right)^3 e^{-2(3/2)} = \frac{27}{8} e^{-3} $$

**解答 (3)：** $\frac{27}{8e^3}$

---

### 4.
**題目：** 函數 $g(x) = \frac{\ln(x^3)}{\sqrt{x}}$ 的反曲點發生在 $x = ?$

**解析：**
簡化函數：$g(x) = 3 x^{-1/2} \ln x$
一階導數：
$$ g'(x) = 3 \left( -\frac{1}{2}x^{-3/2} \ln x + x^{-1/2} \cdot \frac{1}{x} \right) = 3 x^{-3/2} \left( 1 - \frac{1}{2}\ln x \right) $$
二階導數：
$$ g''(x) = 3 \left[ -\frac{3}{2}x^{-5/2} \left(1 - \frac{1}{2}\ln x\right) + x^{-3/2} \left(-\frac{1}{2x}\right) \right] $$
$$ = 3 x^{-5/2} \left( -\frac{3}{2} + \frac{3}{4}\ln x - \frac{1}{2} \right) = 3 x^{-5/2} \left( \frac{3}{4}\ln x - 2 \right) $$
令 $g''(x) = 0 \implies \frac{3}{4}\ln x = 2 \implies \ln x = \frac{8}{3} \implies x = e^{8/3}$。

**解答 (4)：** $e^{8/3}$

---

### 5.
**題目：** 求解滿足 $\int_{\sqrt{x}}^4 \frac{f(t^2)}{\ln t} dt = e^{(x-16)^2} - \frac{x}{16}$ 的函數 $f(x)$。

**解析：**
兩邊對 $x$ 微分（利用微積分基本定理與連鎖律）：
左式微分：
$$ \frac{d}{dx} \left( -\int_4^{\sqrt{x}} \frac{f(t^2)}{\ln t} dt \right) = -\frac{f((\sqrt{x})^2)}{\ln(\sqrt{x})} \cdot \frac{d}{dx}(\sqrt{x}) = -\frac{f(x)}{\frac{1}{2}\ln x} \cdot \frac{1}{2\sqrt{x}} = -\frac{f(x)}{\sqrt{x}\ln x} $$
右式微分：
$$ \frac{d}{dx} \left( e^{(x-16)^2} - \frac{x}{16} \right) = 2(x-16)e^{(x-16)^2} - \frac{1}{16} $$
兩式相等：
$$ -\frac{f(x)}{\sqrt{x}\ln x} = 2(x-16)e^{(x-16)^2} - \frac{1}{16} $$
移項解得 $f(x)$：
$$ f(x) = \sqrt{x}\ln x \left( \frac{1}{16} - 2(x-16)e^{(x-16)^2} \right) $$

**解答 (5)：** $\sqrt{x}\ln x \left( \frac{1}{16} - 2(x-16)e^{(x-16)^2} \right)$

---

### 6.
**題目：** 求曲線 $y = \frac{1}{\sqrt{x}(\sqrt{x}+1)}$ 從 $x=1$ 到 $x=4$ 繞 $x$ 軸旋轉所產生的體積。

**解析：**
體積公式：$V = \pi \int_1^4 y^2 dx = \pi \int_1^4 \frac{1}{x(\sqrt{x}+1)^2} dx$
令 $u = \sqrt{x} \implies du = \frac{1}{2\sqrt{x}} dx \implies dx = 2u du$。上下限變為 $1$ 到 $2$。
$$ V = \pi \int_1^2 \frac{1}{u^2(u+1)^2} \cdot 2u du = 2\pi \int_1^2 \frac{1}{u(u+1)^2} du $$
使用部分分式：$\frac{1}{u(u+1)^2} = \frac{1}{u} - \frac{1}{u+1} - \frac{1}{(u+1)^2}$。
$$ \int \left( \frac{1}{u} - \frac{1}{u+1} - \frac{1}{(u+1)^2} \right) du = \ln|u| - \ln|u+1| + \frac{1}{u+1} $$
代入上下限 $1$ 到 $2$：
$$ \left( \ln 2 - \ln 3 + \frac{1}{3} \right) - \left( 0 - \ln 2 + \frac{1}{2} \right) = 2\ln 2 - \ln 3 - \frac{1}{6} = \ln\frac{4}{3} - \frac{1}{6} $$
最後乘回 $2\pi$：
$$ V = 2\pi \left( \ln\frac{4}{3} - \frac{1}{6} \right) = 2\pi\ln\left(\frac{4}{3}\right) - \frac{\pi}{3} $$

**解答 (6)：** $2\pi\ln\left(\frac{4}{3}\right) - \frac{\pi}{3}$

---

### 7.
**題目：** 判斷瑕積分 $\int_2^\infty \frac{dx}{x(x^2-1)^{3/2}}$ 是否收斂，若收斂則求值。

**解析：**
令 $x = \sec\theta \implies dx = \sec\theta\tan\theta d\theta$。
上下限：$x=2 \implies \theta = \frac{\pi}{3}$；$x\to\infty \implies \theta \to \frac{\pi}{2}$。
$$ \int_{\pi/3}^{\pi/2} \frac{\sec\theta\tan\theta}{\sec\theta (\tan^2\theta)^{3/2}} d\theta = \int_{\pi/3}^{\pi/2} \frac{\tan\theta}{\tan^3\theta} d\theta = \int_{\pi/3}^{\pi/2} \cot^2\theta d\theta $$
利用 $\cot^2\theta = \csc^2\theta - 1$：
$$ \int (\csc^2\theta - 1) d\theta = -\cot\theta - \theta $$
代入上下限：
$$ \left( -\cot\frac{\pi}{2} - \frac{\pi}{2} \right) - \left( -\cot\frac{\pi}{3} - \frac{\pi}{3} \right) = \left( 0 - \frac{\pi}{2} \right) - \left( -\frac{1}{\sqrt{3}} - \frac{\pi}{3} \right) = \frac{1}{\sqrt{3}} - \frac{\pi}{6} $$

**解答 (7)：** Convergent, $\frac{1}{\sqrt{3}} - \frac{\pi}{6}$

---

### 8.
**題目：** 找出曲面 $\sqrt{x} + \sqrt{8y} + \sqrt{27z} = 14$ 上距離原點最近的點。

**解析：**
即最小化 $f(x,y,z) = x^2+y^2+z^2$，限制條件為 $g(x,y,z) = x^{1/2} + \sqrt{8}y^{1/2} + \sqrt{27}z^{1/2} = 14$。
Lagrange Multipliers: $\nabla f = \lambda \nabla g$
$$ \langle 2x, 2y, 2z \rangle = \lambda \langle \frac{1}{2\sqrt{x}}, \frac{\sqrt{8}}{2\sqrt{y}}, \frac{\sqrt{27}}{2\sqrt{z}} \rangle $$
- $2x = \frac{\lambda}{2\sqrt{x}} \implies 4x^{3/2} = \lambda \implies x^{1/2} = (\frac{\lambda}{4})^{1/3}$
- $2y = \frac{\sqrt{8}\lambda}{2\sqrt{y}} \implies 4y^{3/2} = \sqrt{8}\lambda \implies y^{1/2} = 2^{-1/6}\lambda^{1/3}$
- $2z = \frac{\sqrt{27}\lambda}{2\sqrt{z}} \implies 4z^{3/2} = \sqrt{27}\lambda \implies z^{1/2} = \frac{\sqrt{3}}{4^{1/3}}\lambda^{1/3}$

將 $x, y, z$ 代回限制條件 $g(x,y,z) = 14$：
$$ \lambda^{1/3} \left[ 4^{-1/3} + \sqrt{8}(2^{-1/6}) + \sqrt{27}\left(\frac{\sqrt{3}}{4^{1/3}}\right) \right] = 14 $$
化簡係數：
$\sqrt{8} \cdot 2^{-1/6} = 2^{3/2} \cdot 2^{-1/6} = 2^{4/3} = 4 \cdot 4^{-1/3}$
$\sqrt{27} \cdot \sqrt{3} \cdot 4^{-1/3} = 9 \cdot 4^{-1/3}$
總和為 $\lambda^{1/3} 4^{-1/3} (1 + 4 + 9) = 14 \cdot \lambda^{1/3} 4^{-1/3} = 14 \implies \lambda^{1/3} = 4^{1/3} \implies \lambda = 4$。
代回求 $x,y,z$：
$x^{1/2} = (4/4)^{1/3} = 1 \implies x = 1$
$y^{1/2} = 2^{2/3} 2^{-1/6} = 2^{1/2} \implies y = 2$
$z^{1/2} = \frac{\sqrt{3}}{4^{1/3}} 4^{1/3} = \sqrt{3} \implies z = 3$

**解答 (8)：** $(1, 2, 3)$

---

### 9.
**題目：** Evaluate $\int_0^2 \int_0^{\sqrt{4-x^2}} \int_{2-\sqrt{4-x^2-y^2}}^{2+\sqrt{4-x^2-y^2}} \sqrt{x^2+y^2+z^2} dz dy dx$

**解析：**
觀察 $z$ 的範圍：$2-\sqrt{4-x^2-y^2} \le z \le 2+\sqrt{4-x^2-y^2}$
平方後得到 $(z-2)^2 \le 4 - x^2 - y^2 \implies x^2+y^2+(z-2)^2 \le 4$。
這是一個半徑為 2，球心在 $(0,0,2)$ 的球體。
又 $0 \le y \le \sqrt{4-x^2}$ 且 $0 \le x \le 2$，代表積分區域位於第一卦限 ($x \ge 0, y \ge 0$)。
轉換為球座標系 $(\rho, \phi, \theta)$：
球面方程式為 $\rho^2 = 4\rho\cos\phi \implies \rho = 4\cos\phi$。
積分範圍：$0 \le \theta \le \frac{\pi}{2}$, $0 \le \phi \le \frac{\pi}{2}$, $0 \le \rho \le 4\cos\phi$。
被積函數為 $\rho$，$dV = \rho^2 \sin\phi d\rho d\phi d\theta$。
$$ \int_0^{\pi/2} \int_0^{\pi/2} \int_0^{4\cos\phi} \rho^3 \sin\phi d\rho d\phi d\theta $$
$$ = \int_0^{\pi/2} d\theta \int_0^{\pi/2} \sin\phi \left[ \frac{\rho^4}{4} \right]_0^{4\cos\phi} d\phi = \frac{\pi}{2} \int_0^{\pi/2} 64\cos^4\phi\sin\phi d\phi $$
令 $u = \cos\phi \implies du = -\sin\phi d\phi$：
$$ 32\pi \left[ -\frac{\cos^5\phi}{5} \right]_0^{\pi/2} = 32\pi \left(0 - \left(-\frac{1}{5}\right)\right) = \frac{32\pi}{5} $$

**解答 (9)：** $\frac{32\pi}{5}$

---

### 10.
**題目：** 求解初值問題 $x \frac{dy}{dx} = 3x^2 - 2y, y(1)=2$。

**解析：**
整理方程式為一階線性微分方程型式：
$$ xy' + 2y = 3x^2 $$
同乘 $x$ 得到：
$$ x^2y' + 2xy = 3x^3 \implies \frac{d}{dx}(x^2 y) = 3x^3 $$
兩邊積分：
$$ x^2 y = \frac{3}{4}x^4 + C \implies y = \frac{3}{4}x^2 + \frac{C}{x^2} $$
代入初值 $y(1) = 2$：
$$ \frac{3}{4} + C = 2 \implies C = \frac{5}{4} $$

**解答 (10)：** $y = \frac{3}{4}x^2 + \frac{5}{4x^2}$

---

## PART II. Show ALL your work

### 11.
**題目：** 計算 $\iint_R \left[ \cos\left(\frac{y-x}{y+x}\right) \right]^2 dA$，區域 $R$ 為頂點 $(2,0), (3,0), (0,3), (0,2)$ 的梯形。

**解析：**
使用變數變換法，令 $u = y-x, v = y+x$。
解出 $x, y$：$x = \frac{v-u}{2}, y = \frac{v+u}{2}$。
計算 Jacobian 行列式：
$$ J(u,v) = \begin{vmatrix} \frac{\partial x}{\partial u} & \frac{\partial x}{\partial v} \\ \frac{\partial y}{\partial u} & \frac{\partial y}{\partial v} \end{vmatrix} = \begin{vmatrix} -1/2 & 1/2 \\ 1/2 & 1/2 \end{vmatrix} = -\frac{1}{4} - \frac{1}{4} = -\frac{1}{2} $$
故 $dxdy = |J| dudv = \frac{1}{2} dudv$。
映射邊界：
原本四頂點對應到 $(u,v)$ 空間為：$(-2,2), (-3,3), (3,3), (2,2)$。
因此 $v$ 的範圍為 $[2, 3]$，對於固定的 $v$，$u$ 的範圍為 $[-v, v]$。
轉換積分式：
$$ \int_2^3 \int_{-v}^v \cos^2\left(\frac{u}{v}\right) \cdot \frac{1}{2} du dv $$
內部對 $u$ 積分，令 $t = \frac{u}{v} \implies du = v dt$，積分範圍從 $[-v, v]$ 變為 $[-1, 1]$：
$$ \frac{1}{2} \int_2^3 \left( v \int_{-1}^1 \cos^2(t) dt \right) dv $$
利用半角公式 $\cos^2 t = \frac{1+\cos(2t)}{2}$：
$$ \int_{-1}^1 \frac{1+\cos(2t)}{2} dt = \left[ \frac{t}{2} + \frac{\sin(2t)}{4} \right]_{-1}^1 = 1 + \frac{\sin 2}{2} $$
外部對 $v$ 積分：
$$ \frac{1}{2} \left( 1 + \frac{\sin 2}{2} \right) \int_2^3 v dv = \frac{1}{2} \left( 1 + \frac{\sin 2}{2} \right) \left[ \frac{v^2}{2} \right]_2^3 = \frac{1}{2} \left( 1 + \frac{\sin 2}{2} \right) \frac{9-4}{2} = \frac{5}{4} \left( 1 + \frac{\sin 2}{2} \right) $$
展開即為 $\frac{5}{4} + \frac{5\sin 2}{8}$。

**解答：** $\frac{5}{4} + \frac{5\sin 2}{8}$

---

### 12.
**題目：** 描繪函數 $f(x) = x^{2/3}(12-x)^{1/3}$ 的圖形。標出漸近線、局部極值、增減區間、凹凸區間。

**解析：**
**1. 函數重寫與一階導數：**
$f(x) = (12x^2 - x^3)^{1/3}$
$$ f'(x) = \frac{1}{3} (12x^2 - x^3)^{-2/3} (24x - 3x^2) = \frac{x(8-x)}{x^{4/3}(12-x)^{2/3}} = \frac{8-x}{x^{1/3}(12-x)^{2/3}} $$
臨界點為：$x=8$ (導數為0) 及 $x=0, 12$ (導數不存在，具垂直切線)。
判斷增減性（$f'(x)$ 的正負）：
- $(-\infty, 0)$: $f' < 0$ (遞減)
- $(0, 8)$: $f' > 0$ (遞增)
- $(8, 12)$: $f' < 0$ (遞減)
- $(12, \infty)$: $f' < 0$ (遞減)

**極值分析：**
- $x=0$ 由減轉增，有局部極小值 $f(0) = 0$ (圖形為尖點 Cusp)。
- $x=8$ 由增轉減，有局部極大值 $f(8) = 8^{2/3}(4)^{1/3} = 4\sqrt[3]{4}$。

**2. 二階導數與凹凸性：**
經過整理後，二階導數為：
$$ f''(x) = \frac{-32}{x^{4/3}(12-x)^{5/3}} $$
分母的 $x^{4/3}$ 恆為正，故正負號由 $(12-x)^{5/3}$ 決定。
- 當 $x < 12$ 時 $(x\neq 0)$，$(12-x) > 0 \implies f''(x) < 0$ (凹向下)。
- 當 $x > 12$ 時，$(12-x) < 0 \implies f''(x) > 0$ (凹向上)。

**3. 漸近線：**
無垂直或水平漸近線。檢查斜漸近線：
$$ f(x) = -x \left(1 - \frac{12}{x}\right)^{1/3} $$
當 $x \to \pm\infty$ 時，利用泰勒展開式：$(1 - u)^{1/3} \approx 1 - \frac{u}{3}$。
$$ f(x) \approx -x \left(1 - \frac{1}{3}\frac{12}{x}\right) = -x + 4 $$
故 $y = -x + 4$ 為斜漸近線 (Slant Asymptote)。

**總結 (Label Objectives)：**
(a) **Asymptotes:** Slant asymptote $y = -x + 4$.
(b) **Local extrema:** Local minimum at $(0,0)$, local maximum at $(8, 4\sqrt[3]{4})$.
(c) **Intervals of increase/decrease:** Increasing on $(0,8)$, Decreasing on $(-\infty, 0)$ and $(8, \infty)$.
(d) **Concave up/down intervals:** Concave up on $(12, \infty)$, Concave down on $(-\infty, 0) \cup (0, 12)$. Inflection point at $x=12$.
