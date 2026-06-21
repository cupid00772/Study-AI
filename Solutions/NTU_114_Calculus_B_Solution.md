# 國立臺灣大學 114 學年度轉學生招生考試 微積分(B) 參考解答

## 填空題 (Fill in the blanks)

### 1. 
**題目：** $\lim_{x\rightarrow0^{+}}\left(1-\frac{\sin x}{x}\right)^{\frac{1}{\ln x}}$

**解析：**
設 $L = \lim_{x\rightarrow0^{+}}\left(1-\frac{\sin x}{x}\right)^{\frac{1}{\ln x}}$，兩邊取自然對數：
$$ \ln L = \lim_{x\rightarrow0^{+}} \frac{\ln\left(1-\frac{\sin x}{x}\right)}{\ln x} $$
利用泰勒展開式：$\frac{\sin x}{x} \approx 1 - \frac{x^2}{6} + \frac{x^4}{120} - \dots$
所以 $1 - \frac{\sin x}{x} \approx \frac{x^2}{6}$。
代入對數中：
$$ \ln\left(1-\frac{\sin x}{x}\right) \approx \ln\left(\frac{x^2}{6}\right) = 2\ln x - \ln 6 $$
求極限：
$$ \ln L = \lim_{x\rightarrow0^{+}} \frac{2\ln x - \ln 6}{\ln x} = \lim_{x\rightarrow0^{+}} \left(2 - \frac{\ln 6}{\ln x}\right) $$
因為 $x \to 0^+$ 時 $\ln x \to -\infty$，所以 $\frac{\ln 6}{\ln x} \to 0$。
故 $\ln L = 2 \implies L = e^2$。

**解答 (1)：** $e^2$

---

### 2.
**題目：** $f(x)=\int_{1}^{x-1}e^{-(t-1)^{2}}dt$
(a) 求 $e^{-x^{2}}$ 在 $a=0$ 的泰勒級數。
(b) 求 $f(x)$ 在 $a=2$ 的泰勒級數。
(c) 求 $\lim_{x\rightarrow2}\frac{f(x)-\arctan(x-2)}{(x-2)^{4}\ln(2x-3)}$。

**解析：**
**(a)** 由 $e^u = \sum_{n=0}^{\infty} \frac{u^n}{n!}$，代入 $u = -x^2$ 得：
$$ e^{-x^2} = \sum_{n=0}^{\infty} \frac{(-1)^n x^{2n}}{n!} $$

**(b)** 令 $u = x-2$，則 $x-1 = u+1$。
$$ f(x) = f(u+2) = \int_{1}^{u+1} e^{-(t-1)^2} dt $$
令 $v = t-1$，$dv = dt$。積分上下限變為 $0$ 到 $u$：
$$ f(x) = \int_{0}^{u} e^{-v^2} dv = \int_{0}^{x-2} \sum_{n=0}^{\infty} \frac{(-1)^n v^{2n}}{n!} dv $$
逐項積分得：
$$ f(x) = \sum_{n=0}^{\infty} \frac{(-1)^n (x-2)^{2n+1}}{n!(2n+1)} = (x-2) - \frac{(x-2)^3}{3} + \frac{(x-2)^5}{10} - \dots $$

**(c)** 令 $u = x-2$，$x \to 2$ 等價於 $u \to 0$。
分母為 $u^4 \ln(2(u+2)-3) = u^4 \ln(1+2u)$。
泰勒展開 $\ln(1+2u) \approx 2u$，故分母約為 $2u^5$。
分子為 $f(x) - \arctan(u)$。
已知 $\arctan(u) = u - \frac{u^3}{3} + \frac{u^5}{5} - \dots$
兩者相減：
$$ f(x) - \arctan(u) = \left( u - \frac{u^3}{3} + \frac{u^5}{10} \right) - \left( u - \frac{u^3}{3} + \frac{u^5}{5} \right) + O(u^7) = \left(\frac{1}{10} - \frac{1}{5}\right)u^5 = -\frac{1}{10}u^5 $$
計算極限：
$$ \lim_{u\to 0} \frac{-\frac{1}{10}u^5}{2u^5} = -\frac{1}{20} $$

**解答 (2), (3)：** (過程如上)
**解答 (4)：** $-1/20$

---

### 3.
**題目：** $e^{x^{2}+y}-\ln\left(\frac{x}{y^{2}}\right)=1$ 在 $(1,-1)$ 附近定義 $y(x)$。
(a) 求 $y(x)$ 在 $x=1$ 的線性化。
(b) 求 $y''(1)$。

**解析：**
先將原式改寫為 $e^{x^2+y} - \ln x + 2\ln|y| = 1$（因為在 $y=-1$ 附近 $y<0$，$\ln(y^2) = 2\ln|y|$）。
對 $x$ 隱微分：
$$ e^{x^2+y}(2x + y') - \frac{1}{x} + \frac{2}{y}y' = 0 \quad \cdots (i) $$
代入 $(x, y) = (1, -1)$：
$$ e^0(2 + y') - 1 + \frac{2}{-1}y' = 0 \implies 2 + y' - 1 - 2y' = 0 \implies y'(1) = 1 $$
(a) 線性化方程式：$L(x) = y(1) + y'(1)(x-1) = -1 + 1(x-1) = x - 2$。

(b) 對 $(i)$ 式再次對 $x$ 微分：
$$ e^{x^2+y}(2x+y')^2 + e^{x^2+y}(2+y'') + \frac{1}{x^2} + \frac{2y''y - 2(y')^2}{y^2} = 0 $$
代入 $x=1, y=-1, y'=1$：
$$ e^0(2+1)^2 + e^0(2+y'') + 1 + \frac{2y''(-1) - 2(1)^2}{(-1)^2} = 0 $$
$$ 9 + 2 + y'' + 1 - 2y'' - 2 = 0 \implies 10 - y'' = 0 \implies y''(1) = 10 $$

**解答 (5)：** $x - 2$
**解答 (6)：** $10$

---

### 4.
**題目：** $\int_{0}^{2}\sqrt{\frac{4-x}{x}}dx$

**解析：**
令 $x = 4\sin^2\theta$，則 $dx = 8\sin\theta\cos\theta d\theta$。
上下限：$x=0 \implies \theta=0$；$x=2 \implies 4\sin^2\theta=2 \implies \sin\theta=\frac{1}{\sqrt{2}} \implies \theta=\frac{\pi}{4}$。
根號內：$\sqrt{\frac{4-4\sin^2\theta}{4\sin^2\theta}} = \sqrt{\frac{\cos^2\theta}{\sin^2\theta}} = \frac{\cos\theta}{\sin\theta}$ （在 $[0, \pi/4]$ 內皆為正）。
代入積分：
$$ \int_{0}^{\pi/4} \frac{\cos\theta}{\sin\theta} \cdot 8\sin\theta\cos\theta d\theta = \int_{0}^{\pi/4} 8\cos^2\theta d\theta $$
利用半角公式 $\cos^2\theta = \frac{1+\cos 2\theta}{2}$：
$$ 4 \int_{0}^{\pi/4} (1+\cos 2\theta) d\theta = 4 \left[ \theta + \frac{1}{2}\sin 2\theta \right]_{0}^{\pi/4} = 4\left(\frac{\pi}{4} + \frac{1}{2}\sin\frac{\pi}{2}\right) = \pi + 2 $$

**解答 (7)：** $\pi + 2$

---

### 5.
**解答 (8)：** $-2x + 3y + 2z = 7$ (詳解同前對話紀錄)
**解答 (9)：** $-\frac{2\pi}{5\sqrt{17}}$ (詳解同前對話紀錄)

**(c) 解析：**
題目要求在 $h(x,y,z)=0.9$ 附近的最大值估計。
已知在 $h(x,y,z)=1$ 時，最大值發生在 $(0,1,2)$，且 $f(0,1,2)=10$。
根據 Lagrange Multiplier 法則，在極值點有 $\nabla f = \lambda \nabla h$。
取 $x$ 分量比較：$f_x(0,1,2) = \lambda h_x(0,1,2)$。
已知 $f_x(0,1,2) = -1$ 且 $h_x(0,1,2) = 6$，故 $-1 = 6\lambda \implies \lambda = -1/6$。
根據約束條件極值的靈敏度定理（Sensitivity Analysis），最大值函數 $M(c)$ 滿足 $\frac{dM}{dc} = \lambda$。
利用線性近似：
$$ M(0.9) \approx M(1) + \lambda \cdot (0.9 - 1) = 10 + \left(-\frac{1}{6}\right)(-0.1) = 10 + \frac{1}{60} = \frac{601}{60} $$

**解答 (10)：** $\frac{601}{60}$

---

## 計算與證明題 (Computation and Proofs)

### 6.
*(註：原卷的 (a) 到 (d) 題需要依賴圖形 $y=f'(x)$ 來判斷，以下解答是根據對話中建立的 $f'(x)$ 分段函數特徵所推導的結果。)*
已知 $f'(x)$ 的分段定義如下：
- $0 < x < 1$: $f'(x) = x$
- $1 < x < 2$: $f'(x) = -(x-1)^2 - 1$
- $2 < x < 4$: $f'(x) = \frac{4}{4-x} - 4$
- $4 < x \le 6$: $f'(x) = \frac{-2(x-5)^2}{x-4}$

**(a) 求 $x=2$ 兩側的差商極限並判斷可微性**
根據均值定理 (Mean Value Theorem)，對於 $x > 2$，存在 $c \in (2, x)$ 使得 $\frac{f(x)-f(2)}{x-2} = f'(c)$。當 $x \to 2^+$ 時，$c \to 2^+$。
$$ \lim_{x\rightarrow2^{+}}\frac{f(x)-f(2)}{x-2} = \lim_{c\rightarrow2^{+}} f'(c) = \lim_{c\rightarrow2^{+}} \left(\frac{4}{4-c}-4\right) = \frac{4}{2}-4 = -2 $$
同理，對於 $x < 2$，存在 $d \in (x, 2)$，當 $x \to 2^-$ 時，$d \to 2^-$。
$$ \lim_{x\rightarrow2^{-}}\frac{f(x)-f(2)}{x-2} = \lim_{d\rightarrow2^{-}} f'(d) = \lim_{d\rightarrow2^{-}} \left(-(d-1)^2-1\right) = -1-1 = -2 $$
**結論：** 因為左極限等於右極限（均為 $-2$），故 $f(x)$ 在 $x=2$ 處**可微 (differentiable)**，且 $f'(2) = -2$。

**(b) 找出所有臨界點 (Critical numbers) 與局部極值 (Local extrema)**
臨界點發生在 $f'(x) = 0$ 或 $f'(x)$ 不存在的地方。
1. $f'(x) = 0$ 的點：
   - $(2, 4)$ 區間：$\frac{4}{4-x} - 4 = 0 \implies 4-x = 1 \implies x = 3$。
   - $(4, 6)$ 區間：$\frac{-2(x-5)^2}{x-4} = 0 \implies x = 5$。
2. $f'(x)$ 不存在的點：
   - $x = 1$：左極限 $\lim_{x\to 1^-}x=1$，右極限 $\lim_{x\to 1^+}(-(x-1)^2-1)=-1$，極限不相等。
   - $x = 4$：極限為 $\pm\infty$。
故臨界點為 **$x = 1, 3, 4, 5$**。

利用一階導數檢定法判斷極值：
- $x=1$：$f'(x)$ 由正變負，故在 **$x=1$ 有局部極大值 (Local maximum)**。
- $x=3$：$f'(x)$ 由負變正，故在 **$x=3$ 有局部極小值 (Local minimum)**。
- $x=4$：$f'(x)$ 由正變負（$\lim_{x\to 4^-}f'(x)=+\infty$, $x>4$ 時 $f'(x)<0$），故在 **$x=4$ 有局部極大值 (Local maximum)**。
- $x=5$：$f'(x)$ 在 $x=5$ 兩側皆為負，不變號，故非極值。

**(c) 凹凸性與反曲點 (Concavity and Inflection points)**
計算二次導數 $f''(x)$：
- $0 < x < 1$: $f''(x) = 1 > 0$ （凹向上）
- $1 < x < 2$: $f''(x) = -2(x-1) < 0$ （凹向下）
- $2 < x < 4$: $f''(x) = \frac{4}{(4-x)^2} > 0$ （凹向上）
- $4 < x < 6$: $f''(x) = \frac{-2(x-3)(x-5)}{(x-4)^2}$。在 $(4,5)$ 為正（凹向上），在 $(5,6)$ 為負（凹向下）。

**結論：**
- **Concave upward (凹向上) 區間：** $(0, 1), (2, 4), (4, 5)$
- **Concave downward (凹向下) 區間：** $(1, 2), (5, 6)$
- **Inflection points (反曲點)：** 發生在凹凸性改變的點，即 **$x = 1, 2, 5$**。（$x=4$ 雖為分界點，但兩側皆凹向上，故非反曲點）。

**(d) 描繪 $f(x)$ 於 $x \in [0,6]$ 的圖形 (Sketch)**
*(文字描述繪圖重點)*
- 起點 $(0,0)$ 與終點之一 $(4,0)$ 在 x 軸上。
- 在 $x=1$ 達到第一個波峰（尖點，不可微）。
- 在 $x=2$ 反曲點，斜率為 -2。
- 在 $x=3$ 達到波谷（平滑局部極小）。
- 接近 $x=4$ 時，因為 $\lim_{x\to 4^-}f'(x)=\infty$ 且 $\lim_{x\to 4^+}f'(x)=-\infty$，圖形在 $x=4$ 處有一個垂直切線的「尖峰」(Cusp)，此即第二個局部極大點，且 $f(4)=0$。
- 在 $x=5$ 有另一個反曲點，斜率為 0 但非極值（類似鞍點停頓）。
- 曲線終結於 $x=6$。

**(e) 題目：** 若 $f'(x) = -\frac{32}{x^2+2x} - \frac{6}{x^2-6x+18}$ 對 $x > 6$ 成立，求 $\lim_{x\rightarrow\infty}(f(x)-f(6))$。

**解析：**
由微積分基本定理，要求的值即為瑕積分 $\int_{6}^{\infty} f'(x) dx$。
我們將積分拆成兩項分別計算：
第一項：$-\int \frac{32}{x(x+2)} dx$
利用部分分式分解：$\frac{32}{x(x+2)} = 16\left(\frac{1}{x} - \frac{1}{x+2}\right)$。
其反導數為 $16(\ln|x| - \ln|x+2|) = 16\ln\left|\frac{x}{x+2}\right|$。
代入上下限：
$$ \lim_{R\to\infty} \left[ -16\ln\left(\frac{x}{x+2}\right) \right]_{6}^{R} = -16\ln(1) - \left(-16\ln\left(\frac{6}{8}\right)\right) = 16\ln\left(\frac{3}{4}\right) $$

第二項：$-\int \frac{6}{x^2-6x+18} dx$
配方分母：$x^2-6x+18 = (x-3)^2 + 9$。
利用公式 $\int \frac{1}{u^2+a^2} du = \frac{1}{a}\arctan\left(\frac{u}{a}\right)$，這裡 $a=3, u=x-3$：
$$ -\int \frac{6}{(x-3)^2+3^2} dx = -6 \cdot \frac{1}{3} \arctan\left(\frac{x-3}{3}\right) = -2\arctan\left(\frac{x-3}{3}\right) $$
代入上下限：
$$ \lim_{R\to\infty} \left[ -2\arctan\left(\frac{x-3}{3}\right) \right]_{6}^{R} = -2\left(\frac{\pi}{2}\right) - \left(-2\arctan\left(\frac{3}{3}\right)\right) = -\pi + 2\left(\frac{\pi}{4}\right) = -\frac{\pi}{2} $$

兩項相加即為極限值：
$$ \lim_{x\rightarrow\infty}(f(x)-f(6)) = 16\ln\left(\frac{3}{4}\right) - \frac{\pi}{2} $$

---

### 7.
**題目：** 設 $S$ 為曲面 $z=\cos x\sin y$, $0\le y\le\pi$ 且方向向上。向量場 $F(x,y,z)=z\mathbf{i}+yz\mathbf{k}$。
(a) 參數化 $S$ 並直接計算 $\iint_{S}\text{curl}\mathbf{F}\cdot d\mathbf{S}$。
(b) 參數化邊界 $C$，計算線積分並驗證 Stokes' Theorem。

*(註：原題 OCR 中遺漏了 $x$ 的範圍限制。為了展現解答的完整性與 Stokes' Theorem 的普適性，以下解法假設 $x$ 的範圍為 $a \le x \le b$。若考試原圖中有具體範圍（如 $0 \le x \le 2\pi$），將其代入 $a, b$ 即可得出特定數值。)*

**(a) 曲面積分 (Surface Integral)**
首先計算旋度 $\text{curl}\mathbf{F} = \nabla \times \mathbf{F}$：
$$ \text{curl}\mathbf{F} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ \partial_x & \partial_y & \partial_z \\ z & 0 & yz \end{vmatrix} = \langle z, 1, 0 \rangle $$
參數化曲面 $S$ 為 $\mathbf{r}(x,y) = \langle x, y, \cos x\sin y \rangle$，其中 $a \le x \le b, 0 \le y \le \pi$。
計算偏導數：
$\mathbf{r}_x = \langle 1, 0, -\sin x\sin y \rangle$
$\mathbf{r}_y = \langle 0, 1, \cos x\cos y \rangle$
法向量 $d\mathbf{S} = (\mathbf{r}_x \times \mathbf{r}_y) dx dy = \langle \sin x\sin y, -\cos x\cos y, 1 \rangle dx dy$ （此方向朝上，符合題意）。
代入曲面積分：
$$ \iint_{S} \langle z, 1, 0 \rangle \cdot \langle \sin x\sin y, -\cos x\cos y, 1 \rangle dx dy = \iint_{S} (z\sin x\sin y - \cos x\cos y) dx dy $$
將 $z = \cos x\sin y$ 代入：
$$ = \int_{a}^{b} \int_{0}^{\pi} (\cos x\sin^2 y \sin x - \cos x\cos y) dy dx = \int_{a}^{b} \int_{0}^{\pi} \left(\frac{1}{2}\sin(2x)\sin^2 y - \cos x\cos y\right) dy dx $$
對 $y$ 積分：
$\int_{0}^{\pi} \sin^2 y dy = \frac{\pi}{2}$，$\int_{0}^{\pi} \cos y dy = 0$。
故曲面積分為：
$$ \int_{a}^{b} \frac{1}{2}\sin(2x) \cdot \frac{\pi}{2} dx = \frac{\pi}{4} \int_{a}^{b} \sin(2x) dx = \frac{\pi}{4} \left[ -\frac{1}{2}\cos(2x) \right]_{a}^{b} = \mathbf{\frac{\pi}{8} (\cos 2a - \cos 2b)} $$

**(b) 線積分與驗證 (Line Integral & Stokes' Theorem)**
邊界 $C$ 包含四個線段（逆時針方向）：
*   $C_1$: $y=0$, $x$ 從 $a$ 到 $b$。$z = \cos x \sin 0 = 0$。
    $\mathbf{r}(x) = \langle x, 0, 0 \rangle$, $d\mathbf{r} = \langle 1, 0, 0 \rangle dx$。
    $\mathbf{F} = \langle 0, 0, 0 \rangle \implies \int_{C_1} \mathbf{F}\cdot d\mathbf{r} = 0$。
*   $C_2$: $x=b$, $y$ 從 $0$ 到 $\pi$。$z = \cos b \sin y$。
    $\mathbf{r}(y) = \langle b, y, \cos b\sin y \rangle$, $d\mathbf{r} = \langle 0, 1, \cos b\cos y \rangle dy$。
    $\mathbf{F} = \langle z, 0, yz \rangle$。
    $\mathbf{F}\cdot d\mathbf{r} = yz \cos b \cos y = y(\cos b\sin y)\cos b\cos y = \frac{1}{2}y \cos^2 b \sin(2y)$。
    積分：$\int_{0}^{\pi} \frac{1}{2} \cos^2 b (y\sin(2y)) dy = \frac{1}{2} \cos^2 b \left[ -\frac{y}{2}\cos(2y) + \frac{1}{4}\sin(2y) \right]_{0}^{\pi} = \frac{1}{2} \cos^2 b \left(-\frac{\pi}{2}\right) = -\frac{\pi}{4}\cos^2 b$。
*   $C_3$: $y=\pi$, $x$ 從 $b$ 到 $a$。$z = \cos x \sin \pi = 0$。
    與 $C_1$ 同理，$\mathbf{F} = \langle 0, 0, 0 \rangle \implies \int_{C_3} \mathbf{F}\cdot d\mathbf{r} = 0$。
*   $C_4$: $x=a$, $y$ 從 $\pi$ 到 $0$。$z = \cos a \sin y$。
    $\mathbf{r}(y) = \langle a, y, \cos a\sin y \rangle$。
    $\mathbf{F}\cdot d\mathbf{r} = \frac{1}{2}y \cos^2 a \sin(2y)$。
    積分：$\int_{\pi}^{0} \frac{1}{2} \cos^2 a (y\sin(2y)) dy = - \left(-\frac{\pi}{4}\cos^2 a\right) = \frac{\pi}{4}\cos^2 a$。

加總四段線積分：
$$ \oint_{C} \mathbf{F}\cdot d\mathbf{r} = 0 - \frac{\pi}{4}\cos^2 b + 0 + \frac{\pi}{4}\cos^2 a = \frac{\pi}{4}(\cos^2 a - \cos^2 b) $$
利用半角公式 $\cos^2 \theta = \frac{1+\cos 2\theta}{2}$：
$$ \frac{\pi}{4} \left( \frac{1+\cos 2a}{2} - \frac{1+\cos 2b}{2} \right) = \mathbf{\frac{\pi}{8} (\cos 2a - \cos 2b)} $$
**結論：** 線積分結果等於曲面積分結果，成功驗證了 Stokes' Theorem。
