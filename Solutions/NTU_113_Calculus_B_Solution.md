# 國立臺灣大學 113 學年度轉學生招生考試 微積分(B) 參考解答

## PART 1: Fill in the blanks

### 1.
**(a) 題目：** $\lim_{x\to0} |x - \tan x|^{\frac{1}{\ln|x|}}$

**解析：**
設 $L = \lim_{x\to0} |x - \tan x|^{\frac{1}{\ln|x|}}$，兩邊取自然對數：
$$ \ln L = \lim_{x\to0} \frac{\ln|x - \tan x|}{\ln|x|} $$
利用泰勒展開式，當 $x \to 0$ 時，$\tan x \approx x + \frac{x^3}{3}$，所以 $x - \tan x \approx -\frac{x^3}{3}$。
代入對數中：
$$ \ln|x - \tan x| \approx \ln\left|-\frac{x^3}{3}\right| = \ln\left(\frac{|x|^3}{3}\right) = 3\ln|x| - \ln 3 $$
計算極限：
$$ \ln L = \lim_{x\to0} \frac{3\ln|x| - \ln 3}{\ln|x|} = \lim_{x\to0} \left(3 - \frac{\ln 3}{\ln|x|}\right) $$
因為 $x \to 0$ 時 $\ln|x| \to -\infty$，所以 $\frac{\ln 3}{\ln|x|} \to 0$。
故 $\ln L = 3 \implies L = e^3$。

**解答 (1)：** $e^3$

**(b) 題目：** The 3rd degree Taylor polynomial of $(1+3x)^e$ at $x=0$. 及 $\lim_{x\to\infty} \left(x^2\left(1+\frac{3}{x}\right)^e - x^2 - 3ex\right)$

**解析：**
設 $f(x) = (1+3x)^e$。
$f(0) = 1$
$f'(x) = 3e(1+3x)^{e-1} \implies f'(0) = 3e$
$f''(x) = 9e(e-1)(1+3x)^{e-2} \implies f''(0) = 9e(e-1)$
$f'''(x) = 27e(e-1)(e-2)(1+3x)^{e-3} \implies f'''(0) = 27e(e-1)(e-2)$
三階泰勒多項式為：
$$ P_3(x) = 1 + 3ex + \frac{9e(e-1)}{2!}x^2 + \frac{27e(e-1)(e-2)}{3!}x^3 $$
化簡得：$1 + 3ex + \frac{9}{2}e(e-1)x^2 + \frac{9}{2}e(e-1)(e-2)x^3$。

計算極限：令 $t = \frac{1}{x}$，當 $x\to\infty$ 時 $t\to 0^+$。極限式變為：
$$ \lim_{t\to 0^+} \frac{(1+3t)^e - 1 - 3et}{t^2} $$
利用前面的泰勒展開：$(1+3t)^e \approx 1 + 3et + \frac{9}{2}e(e-1)t^2$。
分子：$\left(1 + 3et + \frac{9}{2}e(e-1)t^2\right) - 1 - 3et = \frac{9}{2}e(e-1)t^2$。
極限值為 $\frac{9}{2}e(e-1)$。

**解答 (2)：** $1 + 3ex + \frac{9}{2}e(e-1)x^2 + \frac{9}{2}e(e-1)(e-2)x^3$
**解答 (3)：** $\frac{9}{2}e(e-1)$

---

### 2.
**(a) 題目：** $2y^x = x+y$ 定義了隱函數 $y = f(x)$ 於點 $(0, 2)$。求 $f'(0)$。

**解析：**
將方程式改寫為 $2e^{x\ln y} = x+y$。對 $x$ 隱微分：
$$ 2e^{x\ln y} \left( 1 \cdot \ln y + x \cdot \frac{y'}{y} \right) = 1 + y' $$
將 $(x, y) = (0, 2)$ 代入：
$$ 2e^0 (\ln 2 + 0) = 1 + y' \implies 2\ln 2 = 1 + y' \implies y' = 2\ln 2 - 1 $$

**解答 (4)：** $2\ln 2 - 1$

**(b) 題目：** 求 $g(x,y) = 2y^x - x - y + 1$ 在點 $(0, 2, 1)$ 的切平面。

**解析：**
計算偏導數：
$g_x = 2y^x \ln y - 1$。在 $(0, 2)$ 處，$g_x(0, 2) = 2\ln 2 - 1$。
$g_y = 2xy^{x-1} - 1$。在 $(0, 2)$ 處，$g_y(0, 2) = 0 - 1 = -1$。
切平面方程式為 $z - g(0,2) = g_x(0,2)(x-0) + g_y(0,2)(y-2)$：
$$ z - 1 = (2\ln 2 - 1)x - 1(y - 2) \implies z = (2\ln 2 - 1)x - y + 3 $$

**解答 (5)：** $z = (2\ln 2 - 1)x - y + 3$

---

### 3.
**(a) 題目：** $\int \frac{1}{\sqrt{4x^2+4x}} dx$

**解析：**
配方：$4x^2+4x = 4(x^2+x+\frac{1}{4}) - 1 = (2x+1)^2 - 1$。
令 $u = 2x+1 \implies du = 2dx \implies dx = \frac{du}{2}$。
$$ \frac{1}{2} \int \frac{1}{\sqrt{u^2-1}} du = \frac{1}{2} \ln|u + \sqrt{u^2-1}| + C $$
代回 $x$：
$$ \frac{1}{2} \ln|2x+1 + \sqrt{4x^2+4x}| + C $$

**解答 (6)：** $\frac{1}{2} \ln|2x+1 + \sqrt{4x^2+4x}| + C$

**(b) 題目：** $\int_0^1 \frac{x^2}{(x^2+1)^2} dx$

**解析：**
令 $x = \tan\theta \implies dx = \sec^2\theta d\theta$。上下限由 $[0, 1]$ 變為 $[0, \frac{\pi}{4}]$。
$$ \int_0^{\pi/4} \frac{\tan^2\theta}{\sec^4\theta} \sec^2\theta d\theta = \int_0^{\pi/4} \frac{\tan^2\theta}{\sec^2\theta} d\theta = \int_0^{\pi/4} \sin^2\theta d\theta $$
利用半角公式：
$$ \int_0^{\pi/4} \frac{1-\cos 2\theta}{2} d\theta = \left[ \frac{\theta}{2} - \frac{\sin 2\theta}{4} \right]_0^{\pi/4} = \frac{\pi}{8} - \frac{1}{4} $$

**解答 (7)：** $\frac{\pi}{8} - \frac{1}{4}$

**(c) 題目：** $\iint_D \frac{y}{x} dA$，區域 $D$ 位於第一象限，界於 $x^2+y^2 = \frac{1}{4}$, $x^2+y^2 = x$, $y=x$, 且 $y=0$。

**解析：**
轉為極座標 $x=r\cos\theta, y=r\sin\theta$：
- $x^2+y^2 = \frac{1}{4} \implies r = \frac{1}{2}$
- $x^2+y^2 = x \implies r^2 = r\cos\theta \implies r = \cos\theta$
- $y=x \implies \theta = \frac{\pi}{4}$， $y=0 \implies \theta = 0$
積分範圍：$0 \le \theta \le \frac{\pi}{4}$, $\frac{1}{2} \le r \le \cos\theta$。
被積函數 $\frac{y}{x} = \tan\theta$，$dA = r dr d\theta$。
$$ \int_0^{\pi/4} \int_{1/2}^{\cos\theta} \tan\theta \cdot r dr d\theta = \int_0^{\pi/4} \tan\theta \left[ \frac{r^2}{2} \right]_{1/2}^{\cos\theta} d\theta $$
$$ = \frac{1}{2} \int_0^{\pi/4} \tan\theta \left( \cos^2\theta - \frac{1}{4} \right) d\theta = \frac{1}{2} \int_0^{\pi/4} \left( \sin\theta\cos\theta - \frac{1}{4}\tan\theta \right) d\theta $$
分別積分：
$\int \sin\theta\cos\theta d\theta = \frac{1}{2}\sin^2\theta$，$\int \tan\theta d\theta = -\ln|\cos\theta|$。
$$ = \frac{1}{2} \left[ \frac{1}{2}\sin^2\theta + \frac{1}{4}\ln(\cos\theta) \right]_0^{\pi/4} = \frac{1}{2} \left( \left(\frac{1}{4} + \frac{1}{4}\ln\frac{1}{\sqrt{2}}\right) - (0+0) \right) $$
$$ = \frac{1}{2} \left( \frac{1}{4} - \frac{1}{8}\ln 2 \right) = \frac{1}{8} - \frac{1}{16}\ln 2 $$

**解答 (8)：** $\frac{1}{8} - \frac{1}{16}\ln 2$

---

### 4.
**題目：** $\mathbf{F} = xz\mathbf{i} + yz\mathbf{j} + (-z + ey^2)\mathbf{k}$，$S$ 為圓柱 $x^2+y^2=1$ 在 $z=0$ 與 $z=2+x$ 之間朝外的部分。

**解析：**
參數化曲面 $S$：使用圓柱座標。
$x = \cos\theta$, $y = \sin\theta$, $z = z$。
因為介於 $z=0$ 與 $z=2+x$，故 $0 \le z \le 2+\cos\theta$。
參數化：$\mathbf{r}(\theta, z) = (\cos\theta, \sin\theta, z)$，參數範圍 $0 \le \theta \le 2\pi$, $0 \le z \le 2+\cos\theta$。

計算 Flux（通量）：
朝外的單位法向量為 $\mathbf{n} = \langle \cos\theta, \sin\theta, 0 \rangle$。
$d\mathbf{S} = \mathbf{n} dz d\theta$。
$\mathbf{F} \cdot \mathbf{n} = (xz)(\cos\theta) + (yz)(\sin\theta) + 0 = z(\cos^2\theta + \sin^2\theta) = z$。
通量 $\iint_S \mathbf{F} \cdot d\mathbf{S} = \int_0^{2\pi} \int_0^{2+\cos\theta} z dz d\theta$。
$$ \int_0^{2\pi} \left[ \frac{z^2}{2} \right]_0^{2+\cos\theta} d\theta = \frac{1}{2} \int_0^{2\pi} (2+\cos\theta)^2 d\theta = \frac{1}{2} \int_0^{2\pi} (4 + 4\cos\theta + \cos^2\theta) d\theta $$
對一週期積分，$4 \to 8\pi$，$4\cos\theta \to 0$，$\cos^2\theta \to \pi$。
$$ = \frac{1}{2} (8\pi + 0 + \pi) = \frac{9\pi}{2} $$

**解答 (9)：** $\mathbf{r}(\theta, z) = (\cos\theta, \sin\theta, z)$ for $0 \le \theta \le 2\pi$ and $0 \le z \le 2+\cos\theta$
**解答 (10)：** $\frac{9\pi}{2}$

---

## PART 2: Computation and Proofs

### 1.
已知：
(i) $|f(x) - f(0) - 3x| \le x^2$ for $|x| \le 1$
(ii) $f(x+y) = f(x) + f(y) + xy(x+y)$

**(a) Find $f(0)$ and $f'(0)$**
在 (ii) 式中代入 $x=0, y=0$：
$$ f(0) = f(0) + f(0) + 0 \implies f(0) = 0 $$
利用 (i) 式，當 $x \neq 0$ 且 $|x| \le 1$ 時，除以 $|x|$：
$$ \left|\frac{f(x)}{x} - 3\right| \le |x| $$
由夾擠定理，當 $x \to 0$ 時，$|x| \to 0$，故 $\lim_{x\to 0} \frac{f(x)}{x} = 3$。
因為 $f(0)=0$，此極限即為導數定義：$f'(0) = 3$。

**(b) Show that $f(x)$ is differentiable and find $f'(x)$**
利用導數定義：
$$ f'(x) = \lim_{h\to 0} \frac{f(x+h) - f(x)}{h} $$
由 (ii) 式展開 $f(x+h)$：
$$ f(x+h) = f(x) + f(h) + xh(x+h) \implies f(x+h) - f(x) = f(h) + x^2 h + xh^2 $$
代入極限：
$$ f'(x) = \lim_{h\to 0} \left( \frac{f(h)}{h} + x^2 + xh \right) = f'(0) + x^2 + 0 = 3 + x^2 $$
由於極限對所有實數 $x$ 均存在，故 $f(x)$ 處處可微，且 $f'(x) = x^2 + 3$。

**(c) Show that $f(x)$ is one-to-one and find $\frac{d}{dx}f^{-1}(x)|_{x=10/3}$**
因為 $f'(x) = x^2 + 3 \ge 3 > 0$ 恆成立，可知 $f(x)$ 在實數系上為嚴格遞增函數。
嚴格遞增函數必為一對一 (one-to-one) 函數。
積分 $f'(x)$ 得 $f(x) = \frac{x^3}{3} + 3x + C$，代入 $f(0)=0$ 得 $C=0$。
令 $f(x) = \frac{10}{3} \implies x^3 + 9x - 10 = 0$。
觀察可知 $x=1$ 為一解 ($1+9-10=0$)，故 $f(1) = \frac{10}{3}$。
利用反函數求導定理：
$$ \frac{d}{dx}f^{-1}(x) \bigg|_{x=10/3} = \frac{1}{f'(1)} = \frac{1}{1^2+3} = \frac{1}{4} $$

**(d) Prove the integral identity and evaluate $\int_0^{10/3} f^{-1}(x) dx$**
利用換元積分法，令 $x = f(t) \implies dx = f'(t) dt$。
當 $x = f(a)$ 時 $t = a$，當 $x = f(b)$ 時 $t = b$。
$$ \int_{f(a)}^{f(b)} f^{-1}(x) dx = \int_a^b t f'(t) dt $$
使用分部積分 (Integration by parts)，令 $u=t, dv=f'(t)dt \implies du=dt, v=f(t)$：
$$ \int_a^b t f'(t) dt = \left[ t f(t) \right]_a^b - \int_a^b f(t) dt = b f(b) - a f(a) - \int_a^b f(x) dx $$
得證。

應用此公式求 $\int_0^{10/3} f^{-1}(x) dx$：
此處 $f(a) = 0 \implies a=0$，$f(b) = \frac{10}{3} \implies b=1$。
$$ \int_0^{10/3} f^{-1}(x) dx = 1 \cdot f(1) - 0 \cdot f(0) - \int_0^1 \left(\frac{x^3}{3} + 3x\right) dx $$
$$ = \frac{10}{3} - \left[ \frac{x^4}{12} + \frac{3x^2}{2} \right]_0^1 = \frac{10}{3} - \left(\frac{1}{12} + \frac{3}{2}\right) = \frac{40}{12} - \frac{19}{12} = \frac{21}{12} = \frac{7}{4} $$

---

### 2.
**(a) Find max value of $z$ subject to $x+y+z=1$ and $x^2+y^2+z^2=3$**
利用 Lagrange Multipliers，令目標函數 $f=z$。
限制條件：$g = x+y+z = 1$, $h = x^2+y^2+z^2 = 3$。
$\nabla f = \lambda \nabla g + \mu \nabla h$
$\langle 0, 0, 1 \rangle = \lambda \langle 1, 1, 1 \rangle + \mu \langle 2x, 2y, 2z \rangle$
(1) $0 = \lambda + 2\mu x$
(2) $0 = \lambda + 2\mu y$
(3) $1 = \lambda + 2\mu z$
由 (1), (2) 得 $2\mu x = 2\mu y$。若 $\mu=0$ 則 $\lambda=0$，代入 (3) 得 $1=0$ (矛盾)，故 $\mu \neq 0$，從而 $x=y$。
代入限制條件：
$2x+z=1 \implies z = 1-2x$
$2x^2+(1-2x)^2=3 \implies 6x^2-4x-2=0 \implies 3x^2-2x-1=0 \implies (3x+1)(x-1)=0$
- 若 $x=1$，則 $y=1, z=-1$。
- 若 $x=-\frac{1}{3}$，則 $y=-\frac{1}{3}, z = 1-2(-\frac{1}{3}) = \frac{5}{3}$。
比較 $z$ 值，最大值為 $\frac{5}{3}$。

**(b) Show $\Delta f \approx \mu \cdot \epsilon$**
利用線性近似 (Linear Approximation)：
設極值變化量為 $\Delta f = f(x_1,y_1,z_1) - f(x_0,y_0,z_0)$。
位移向量 $\Delta \mathbf{x} = \langle \Delta x, \Delta y, \Delta z \rangle$。
$$ \Delta f \approx \nabla f(x_0,y_0,z_0) \cdot \Delta \mathbf{x} $$
根據 Lagrange Multiplier 條件：$\nabla f = \lambda \nabla g + \mu \nabla h$。代入得：
$$ \Delta f \approx (\lambda \nabla g + \mu \nabla h) \cdot \Delta \mathbf{x} = \lambda (\nabla g \cdot \Delta \mathbf{x}) + \mu (\nabla h \cdot \Delta \mathbf{x}) $$
限制條件變化量：
對於 $g$ 函數，前後均為 $c$，故 $\Delta g = 0 \implies \nabla g \cdot \Delta \mathbf{x} \approx 0$。
對於 $h$ 函數，新值為 $k+\epsilon$，舊值為 $k$，故 $\Delta h = \epsilon \implies \nabla h \cdot \Delta \mathbf{x} \approx \epsilon$。
代回原式可得：
$$ \Delta f \approx \lambda(0) + \mu(\epsilon) = \mu \epsilon $$

**(c) Estimate max value when $x^2+y^2+z^2=3.02$**
在此題中 $c=1, k=3, \epsilon=0.02$。
由 (a) 可知原極大值點為 $(x_0, y_0, z_0) = (-\frac{1}{3}, -\frac{1}{3}, \frac{5}{3})$。
我們需要求出對應的 $\mu$：
由 (1) 式 $0 = \lambda + 2\mu(-\frac{1}{3}) \implies \lambda = \frac{2\mu}{3}$。
代入 (3) 式 $1 = \lambda + 2\mu(\frac{5}{3}) \implies 1 = \frac{2\mu}{3} + \frac{10\mu}{3} = \frac{12\mu}{3} = 4\mu \implies \mu = \frac{1}{4}$。
由 (b) 小題結論可知最大值的增量 $\Delta f \approx \mu \epsilon = \frac{1}{4} \cdot 0.02 = 0.005$。
新的最大值估計為：
$$ f_{\text{max}} \approx \frac{5}{3} + 0.005 = \frac{5}{3} + \frac{1}{200} = \frac{1000}{600} + \frac{3}{600} = \frac{1003}{600} $$
