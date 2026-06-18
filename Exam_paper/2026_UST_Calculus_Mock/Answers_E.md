# 2026 台聯大微積分模擬考 (UST Calculus Mock Exam - Comprehensive E) - 解答與評分標準

## 🎯 考點分佈總表與預期能力分析

本卷專為打擊 D 卷所暴露出的弱點而設計：
1. **Maclaurin 級數與常數求和**：強化對 $\ln(1+x)$ 與 $\ln(1-x)$ 的熟練度 (甲-1)。
2. **多重積分之變數變換**：訓練尋找 $u, v$ 代換上下限的邏輯與雅可比行列式 (甲-2)。
3. **絕對極值與常數比較**：延續 D 卷乙-1，在找完極值後加入無理數/指數常數的大小比較 (乙-1)。
4. **斯托克斯定理與散度定理**：強化向量微積分在面積分與線積分之間的轉換 (甲-8, 乙-2)。
5. **重積分次序交換與極座標應用**：(甲-4, 乙-3)。

---

## 甲、填充題 (每題 8 分，共 64 分)

### 1. 
**[難度: Medium]**
**[解題步驟]**
已知 $\ln(1+x) = x - \frac{x^2}{2} + \frac{x^3}{3} - \frac{x^4}{4} + \cdots$
已知 $\ln(1-x) = -x - \frac{x^2}{2} - \frac{x^3}{3} - \frac{x^4}{4} - \cdots$
兩式相減得：
$f(x) = \ln\left(\frac{1+x}{1-x}\right) = \ln(1+x) - \ln(1-x) = 2 \left( x + \frac{x^3}{3} + \frac{x^5}{5} + \cdots \right) = 2 \sum_{n=0}^\infty \frac{x^{2n+1}}{2n+1}$
題目要求級數為 $\sum_{n=0}^\infty \frac{1}{(2n+1) 3^{2n+1}}$，這正好是將 $x = \frac{1}{3}$ 代入上述展開式的結果。
所以 $2 \sum_{n=0}^\infty \frac{1}{(2n+1) 3^{2n+1}} = f\left(\frac{1}{3}\right) = \ln\left(\frac{1+1/3}{1-1/3}\right) = \ln(2)$
因此該級數和為 $\frac{1}{2} \ln 2$。
**[答案]** $\frac{1}{2} \ln 2$ (或 $\ln \sqrt{2}$)

### 2. 
**[難度: Hard]**
**[解題步驟]**
令 $u = x+y$，$v = x-y$。
邊界 $x-y=0 \Rightarrow v=0$， $x-y=2 \Rightarrow v=2$。
邊界 $x+y=1 \Rightarrow u=1$， $x+y=3 \Rightarrow u=3$。
計算 Jacobian： $\frac{\partial(u,v)}{\partial(x,y)} = \begin{vmatrix} 1 & 1 \\ 1 & -1 \end{vmatrix} = -2$。
所以 $|J| = \left|\frac{\partial(x,y)}{\partial(u,v)}\right| = \frac{1}{2}$。
原式 $\iint_R (x+y) e^{(x+y)(x-y)} dA = \int_1^3 \int_0^2 u e^{uv} \frac{1}{2} dv du$。
先對 $v$ 積分：$\int_0^2 u e^{uv} dv = \left[ e^{uv} \right]_{v=0}^{v=2} = e^{2u} - 1$。
再對 $u$ 積分：$\frac{1}{2} \int_1^3 (e^{2u} - 1) du = \frac{1}{2} \left[ \frac{1}{2} e^{2u} - u \right]_1^3 = \frac{1}{2} \left( (\frac{1}{2} e^6 - 3) - (\frac{1}{2} e^2 - 1) \right) = \frac{1}{4} e^6 - \frac{1}{4} e^2 - 1$。
**[答案]** $\frac{1}{4}e^6 - \frac{1}{4}e^2 - 1$

### 3. 
**[難度: Easy]**
**[解題步驟]**
令 $u = x^2$，則 $du = 2x dx \Rightarrow x dx = \frac{1}{2} du$。
$\int_0^\infty \frac{x}{1+x^4} dx = \frac{1}{2} \int_0^\infty \frac{1}{1+u^2} du = \frac{1}{2} \left[ \arctan u \right]_0^\infty = \frac{1}{2} \left( \frac{\pi}{2} - 0 \right) = \frac{\pi}{4}$。
**[答案]** $\frac{\pi}{4}$

### 4. 
**[難度: Medium]**
**[解題步驟]**
原積分區域為 $0 \le x \le 1$，$x \le y \le 1$。
畫出圖形可知，這是一個頂點為 $(0,0), (1,1), (0,1)$ 的三角形區域。
改變積分順序：水平看，對於固定的 $y$， $x$ 的範圍是從 $0$ 到 $y$。$y$ 的範圍是 $0$ 到 $1$。
所以 $\int_0^1 \int_0^y \sin(y^2) dx dy = \int_0^1 y \sin(y^2) dy$。
令 $u = y^2$，$du = 2y dy$。
積分變為 $\frac{1}{2} \int_0^1 \sin(u) du = \frac{1}{2} [-\cos u]_0^1 = \frac{1}{2} (1 - \cos 1)$。
**[答案]** $\frac{1}{2} (1 - \cos 1)$

### 5. 
**[難度: Medium]**
**[解題步驟]**
圓柱面 $x^2+y^2=4$ 的參數式為 $\mathbf{r}(\theta, z) = (2\cos\theta, 2\sin\theta, z)$。
其面積元素 $dS = R d\theta dz = 2 d\theta dz$。
對於每個給定的 $\theta$， $z$ 的範圍從 $0$ 到 $x+y+4 = 2\cos\theta + 2\sin\theta + 4$。
表面積 $A = \int_0^{2\pi} \int_0^{2\cos\theta+2\sin\theta+4} 2 dz d\theta = 2 \int_0^{2\pi} (2\cos\theta+2\sin\theta+4) d\theta$。
計算得 $2 \left[ 2\sin\theta - 2\cos\theta + 4\theta \right]_0^{2\pi} = 2 ( 4(2\pi) ) = 16\pi$。
**[答案]** $16\pi$

### 6. 
**[難度: Easy]**
**[解題步驟]**
使用長除法將分子除以分母：
$2x^3 - 3x^2 + 1 = (2x - 3)(x^2 + 1) + (-2x + 4)$
所以 $y = 2x - 3 + \frac{-2x+4}{x^2+1}$。
當 $x \to \pm\infty$ 時，後項趨近於 $0$，所以斜漸近線為 $y = 2x - 3$。
**[答案]** $y = 2x - 3$

### 7. 
**[難度: Hard]**
**[解題步驟]**
使用 Green's Theorem：建立一個封閉路徑，包含 $C$ 與 $x$ 軸上的線段 $C_1$ (由 $(-2,0)$ 到 $(2,0)$)。
$C \cup C_1$ 構成一個逆時針方向的半圓形封閉路徑 $\partial D$。
$\oint_{\partial D} y^2 dx - x^2 dy = \iint_D \left( \frac{\partial(-x^2)}{\partial x} - \frac{\partial(y^2)}{\partial y} \right) dA = \iint_D (-2x - 2y) dA$。
使用極座標：$\int_0^\pi \int_0^2 (-2r\cos\theta - 2r\sin\theta) r dr d\theta = -2 \int_0^\pi (\cos\theta+\sin\theta) d\theta \int_0^2 r^2 dr$。
$\int_0^\pi \cos\theta d\theta = 0$，$\int_0^\pi \sin\theta d\theta = 2$。
所以 $-2 (2) \times [\frac{r^3}{3}]_0^2 = -4 \times \frac{8}{3} = -\frac{32}{3}$。
而 $C_1$ 上的積分： $y=0 \Rightarrow dy=0$，$x$ 從 $-2$ 到 $2$： $\int_{C_1} 0 dx - x^2 (0) = 0$。
所以 $\int_C + \int_{C_1} = -\frac{32}{3} \Rightarrow \int_C = -\frac{32}{3}$。
**[答案]** $-\frac{32}{3}$

### 8. 
**[難度: Medium]**
**[解題步驟]**
由 Stokes' Theorem：$\iint_S (\nabla \times \mathbf{F}) \cdot d\mathbf{S} = \oint_{\partial S} \mathbf{F} \cdot d\mathbf{r}$。
曲面 $S$ 是圓錐 $z=\sqrt{x^2+y^2}$ 在 $z \le 1$ 的部分，法向量朝下。
此時的邊界 $\partial S$ 為 $z=1$ 上的圓 $x^2+y^2=1$。
由於法向量朝下，用右手定則可知，從上方看 $\partial S$ 必須是順時針方向 (Clockwise)。
參數化邊界 $C$: $x = \cos t, y = -\sin t, z = 1$, $0 \le t \le 2\pi$。
$d\mathbf{r} = (-\sin t, -\cos t, 0) dt$。
$\mathbf{F}(x,y,z) = (\cos^2 t, \cos t \sin t, 0)$。
$\mathbf{F} \cdot d\mathbf{r} = -\cos^2 t \sin t - \cos^2 t \sin t = -2\cos^2 t \sin t$。
$\oint_{\partial S} \mathbf{F} \cdot d\mathbf{r} = \int_0^{2\pi} -2\cos^2 t \sin t dt = \left[ \frac{2}{3}\cos^3 t \right]_0^{2\pi} = \frac{2}{3} - \frac{2}{3} = 0$。
**[答案]** $0$

---

## 乙、計算、證明題 (每題 12 分，共 36 分)

### 1.
**[難度: Hard]**
**[解題步驟]**
**(1) 尋找內部臨界點：**
要求 $f(x,y) = e^{-x^2-y^2}(x^2+2y^2)$ 在 $x^2+y^2 < 4$ 的臨界點。
$f_x = 2x e^{-x^2-y^2} (1 - x^2 - 2y^2) = 0$
$f_y = 2y e^{-x^2-y^2} (2 - x^2 - 2y^2) = 0$
由上述兩式可得幾種可能：
- 若 $x=0, y=0 \Rightarrow (0,0)$ 為臨界點，$f(0,0) = 0$。
- 若 $x=0, 2-x^2-2y^2=0 \Rightarrow y=\pm 1$。點 $(0,\pm 1)$，$f(0,\pm 1) = 2e^{-1}$。
- 若 $y=0, 1-x^2-2y^2=0 \Rightarrow x=\pm 1$。點 $(\pm 1,0)$，$f(\pm 1,0) = e^{-1}$。

**(2) 檢查邊界 $x^2+y^2=4$：**
在邊界上，代入 $x^2 = 4 - y^2$ 到 $f(x,y)$。
$f = e^{-4} ( (4-y^2) + 2y^2 ) = e^{-4} (4 + y^2)$。
因為 $x^2+y^2=4$，所以 $-2 \le y \le 2$。
所以 $4+y^2$ 的最大值在 $y=\pm 2$ 時發生，此時 $x=0$，值為 $8e^{-4}$。
最小值在 $y=0$ 時發生，此時 $x=\pm 2$，值為 $4e^{-4}$。

**(3) 比較所有候選值大小：**
候選值為： $0, \quad 2e^{-1}, \quad e^{-1}, \quad 8e^{-4}, \quad 4e^{-4}$。
其中最小值為 $0$。
比較最大值：因為 $e \approx 2.718$，
$2e^{-1} \approx \frac{2}{2.718} \approx 0.73$。
$8e^{-4} \approx \frac{8}{54.6} \approx 0.14$。
所以 $2e^{-1} > 8e^{-4}$。

**[答案]**
Absolute Maximum value: $2e^{-1}$ (發生在 $(0,\pm 1)$)
Absolute Minimum value: $0$ (發生在 $(0,0)$)

### 2.
**[難度: Medium]**
**[解題步驟]**
由 Stokes' Theorem：$\iint_S (\nabla \times \mathbf{F}) \cdot d\mathbf{S} = \oint_C \mathbf{F} \cdot d\mathbf{r}$。
邊界 $C$ 是球面 $x^2+y^2+z^2=9$ 與平面 $z=2$ 的交線，即 $x^2+y^2=5$。
因 $S$ 開口朝上，邊界曲線 $C$ 在平面 $z=2$ 上應以逆時針方向 (Counterclockwise) 參數化。
參數化 $C$： $x = \sqrt{5}\cos t$, $y = \sqrt{5}\sin t$, $z = 2$， $0 \le t \le 2\pi$。
$d\mathbf{r} = (-\sqrt{5}\sin t, \sqrt{5}\cos t, 0) dt$。
在 $C$ 上，$\mathbf{F} = (\sqrt{5}\sin t \cos 2, \sqrt{5}\cos t e^2, 5)$。
$\mathbf{F} \cdot d\mathbf{r} = -5\sin^2 t \cos 2 + 5\cos^2 t e^2$。
$\oint_C \mathbf{F} \cdot d\mathbf{r} = \int_0^{2\pi} (-5\sin^2 t \cos 2 + 5\cos^2 t e^2) dt = -5\pi \cos 2 + 5\pi e^2$。

**[答案]**
Flux = $5\pi(e^2 - \cos 2)$

### 3.
**[難度: Hard]**
**[解題步驟]**
此題為具有兩個限制條件的 Lagrange Multiplier 問題。
目標函數：$f(x,y,z) = x+2y+3z$
限制條件 1：$g(x,y,z) = x^2+y^2-2 = 0$
限制條件 2：$h(x,y,z) = y+z-1 = 0$
$\nabla f = \lambda \nabla g + \mu \nabla h \Rightarrow (1, 2, 3) = \lambda(2x, 2y, 0) + \mu(0, 1, 1)$
(1) $1 = 2\lambda x$
(2) $2 = 2\lambda y + \mu$
(3) $3 = \mu$
由 (3) 知 $\mu=3$，代入 (2) 得 $2 = 2\lambda y + 3 \Rightarrow 2\lambda y = -1$。
由 (1) 和 (2') 可知 $\lambda \ne 0$，因此 $x = \frac{1}{2\lambda}$， $y = -\frac{1}{2\lambda}$。
代入 $x^2+y^2 = 2 \Rightarrow \frac{1}{4\lambda^2} + \frac{1}{4\lambda^2} = 2 \Rightarrow \frac{1}{2\lambda^2} = 2 \Rightarrow \lambda^2 = \frac{1}{4} \Rightarrow \lambda = \pm \frac{1}{2}$。

情況一：$\lambda = \frac{1}{2}$
$x = 1, y = -1$。代入 $y+z=1 \Rightarrow z=2$。
點 $(1, -1, 2)$，$f = 1 - 2 + 6 = 5$。

情況二：$\lambda = -\frac{1}{2}$
$x = -1, y = 1$。代入 $y+z=1 \Rightarrow z=0$。
點 $(-1, 1, 0)$，$f = -1 + 2 + 0 = 1$。

比較得最大值為 5，最小值為 1。

**[答案]**
Maximum value: $5$
Minimum value: $1$

---
*考後分析提醒：對完答案後，請誠實告訴我你錯了哪些題目，或者是哪個步驟卡住了？我會為你做針對性解析！*
