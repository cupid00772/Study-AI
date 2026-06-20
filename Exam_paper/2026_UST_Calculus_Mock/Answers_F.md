# 2026 台聯大微積分模擬考 (UST Calculus Mock Exam - Comprehensive F) - 解答與評分標準

## 🎯 考點分佈總表與預期能力分析

本卷旨在全真模擬台聯大微積分考試：
1. **極限與微分應用**：微積分基本定理結合羅必達法則 (甲-1)，對數微分法 (甲-2)。
2. **積分技巧**：三角代換法 (甲-3)。
3. **無窮級數**：收斂區間求法與端點檢驗 (甲-4)。
4. **多變數微積分**：隱函數偏微分 (甲-5)，改變積分順序 (甲-6)，方向導數與梯度 (甲-7)。
5. **向量微積分與定理**：Green's Theorem (甲-8)，Divergence Theorem (乙-3)。
6. **極值與體積**：封閉區域絕對極值找法 (乙-2)，利用極座標求旋轉體積 (乙-1)。

---

## 甲、填充題 (每題 8 分，共 64 分)

### 1. 
**[難度: Easy]**
**[解題步驟]**
代入 $x=0$ 得 $\frac{0}{0}$ 型，使用羅必達法則 (L'Hopital's Rule) 與微積分第一基本定理 (Fundamental Theorem of Calculus)。
$\lim_{x \to 0} \frac{\int_0^x \sin(t^2) dt}{x^3} \stackrel{L'H}{=} \lim_{x \to 0} \frac{\sin(x^2)}{3x^2}$
再次遇到 $\frac{0}{0}$，可繼續使用羅必達，或者利用已知極限 $\lim_{u \to 0} \frac{\sin u}{u} = 1$ (令 $u = x^2$)。
原極限 = $\lim_{x \to 0} \frac{1}{3} \cdot \frac{\sin(x^2)}{x^2} = \frac{1}{3} \cdot 1 = \frac{1}{3}$。
**[答案]** $\frac{1}{3}$

### 2. 
**[難度: Medium]**
**[解題步驟]**
使用對數微分法 (Logarithmic Differentiation)。
令 $y = x^{\ln x}$，兩邊取自然對數：
$\ln y = \ln(x^{\ln x}) = (\ln x)(\ln x) = (\ln x)^2$
對 $x$ 微分：
$\frac{1}{y} \cdot y' = 2(\ln x) \cdot \frac{1}{x}$
$y' = y \cdot \frac{2\ln x}{x} = x^{\ln x} \cdot \frac{2\ln x}{x}$
當 $x = e$ 時， $\ln e = 1$。
$f'(e) = e^{\ln e} \cdot \frac{2(1)}{e} = e^1 \cdot \frac{2}{e} = 2$。
**[答案]** $2$

### 3. 
**[難度: Medium]**
**[解題步驟]**
令 $x = 3 \sin \theta$，則 $dx = 3 \cos \theta d\theta$，$\sqrt{9-x^2} = 3 \cos \theta$。
$\int \frac{9 \sin^2 \theta}{3 \cos \theta} (3 \cos \theta) d\theta = 9 \int \sin^2 \theta d\theta$
使用半角公式 $\sin^2 \theta = \frac{1-\cos(2\theta)}{2}$：
$= \frac{9}{2} \int (1 - \cos 2\theta) d\theta = \frac{9}{2} (\theta - \frac{1}{2} \sin 2\theta) + C$
將 $\sin 2\theta = 2 \sin \theta \cos \theta$ 代回：
$= \frac{9}{2} (\theta - \sin \theta \cos \theta) + C$
由 $x = 3 \sin \theta \Rightarrow \sin \theta = \frac{x}{3}$，$\theta = \arcsin(\frac{x}{3})$，$\cos \theta = \frac{\sqrt{9-x^2}}{3}$。
代回 $x$：
$= \frac{9}{2} \left( \arcsin(\frac{x}{3}) - \frac{x}{3} \cdot \frac{\sqrt{9-x^2}}{3} \right) + C = \frac{9}{2} \arcsin(\frac{x}{3}) - \frac{1}{2} x \sqrt{9-x^2} + C$
**[答案]** $\frac{9}{2} \arcsin(\frac{x}{3}) - \frac{1}{2} x \sqrt{9-x^2} + C$

### 4. 
**[難度: Medium]**
**[解題步驟]**
使用比值審斂法 (Ratio Test)：
$L = \lim_{n \to \infty} \left| \frac{a_{n+1}}{a_n} \right| = \lim_{n \to \infty} \left| \frac{(-1)^{n+1} (x-2)^{n+1}}{(n+1) 3^{n+1}} \cdot \frac{n 3^n}{(-1)^n (x-2)^n} \right|$
$L = \lim_{n \to \infty} \frac{n}{n+1} \cdot \frac{1}{3} |x-2| = \frac{1}{3} |x-2|$
若要級數收斂，需 $L < 1 \Rightarrow \frac{1}{3} |x-2| < 1 \Rightarrow |x-2| < 3$
所以收斂半徑 $R=3$，區間內部為 $-1 < x < 5$。
接下來檢驗端點：
當 $x = 5$：級數為 $\sum_{n=1}^\infty \frac{(-1)^n 3^n}{n 3^n} = \sum_{n=1}^\infty \frac{(-1)^n}{n}$，為交錯調和級數，條件收斂。
當 $x = -1$：級數為 $\sum_{n=1}^\infty \frac{(-1)^n (-3)^n}{n 3^n} = \sum_{n=1}^\infty \frac{3^n}{n 3^n} = \sum_{n=1}^\infty \frac{1}{n}$，為調和級數 (p=1)，發散。
因此，收斂區間為 $(-1, 5]$。
**[答案]** $(-1, 5]$ (或 $-1 < x \le 5$)

### 5. 
**[難度: Easy]**
**[解題步驟]**
使用隱函數微分法 (Implicit Differentiation)。
令 $F(x,y,z) = x^2 + y^2 + z^2 + x y z - 4 = 0$。
$\frac{\partial z}{\partial x} = -\frac{F_x}{F_z}$
$F_x = 2x + yz$
$F_z = 2z + xy$
代入點 $(1, 1, 1)$：
$F_x(1,1,1) = 2(1) + (1)(1) = 3$
$F_z(1,1,1) = 2(1) + (1)(1) = 3$
所以 $\frac{\partial z}{\partial x} = -\frac{3}{3} = -1$。
**[答案]** $-1$

### 6. 
**[難度: Medium]**
**[解題步驟]**
積分區域 $D$ 為 $0 \le y \le 2$，$y/2 \le x \le 1$。
改變積分順序：先對 $y$ 再對 $x$。
圖形為一個三角形，由 $y=0$ 到 $y=2x$，而 $x$ 從 $0$ 到 $1$。
$D = \{(x,y) \mid 0 \le x \le 1, 0 \le y \le 2x\}$。
原積分 $= \int_0^1 \int_0^{2x} e^{x^2} dy dx$
先對 $y$ 積分：$\int_0^{2x} e^{x^2} dy = [y \cdot e^{x^2}]_{y=0}^{y=2x} = 2x e^{x^2}$
再對 $x$ 積分：$\int_0^1 2x e^{x^2} dx$
令 $u = x^2$，$du = 2x dx$：
$= \int_0^1 e^u du = [e^u]_0^1 = e - 1$。
**[答案]** $e - 1$

### 7. 
**[難度: Medium]**
**[解題步驟]**
最大變動率為梯度的長度 $|\nabla f|$，發生方向為梯度的方向 $\frac{\nabla f}{|\nabla f|}$。
$f(x,y,z) = x \ln(yz) = x (\ln y + \ln z)$
$\nabla f = \langle f_x, f_y, f_z \rangle = \langle \ln(yz), \frac{x}{y}, \frac{x}{z} \rangle$
代入點 $(1, 2, 1/2)$：
$y z = 2 \cdot (1/2) = 1 \Rightarrow \ln(1) = 0$
$f_x = 0$
$f_y = \frac{1}{2}$
$f_z = \frac{1}{1/2} = 2$
$\nabla f(1, 2, 1/2) = \langle 0, 1/2, 2 \rangle$
最大變動率 $= |\nabla f| = \sqrt{0^2 + (1/2)^2 + 2^2} = \sqrt{1/4 + 4} = \sqrt{17/4} = \frac{\sqrt{17}}{2}$
方向 $= \frac{\nabla f}{|\nabla f|} = \frac{2}{\sqrt{17}} \langle 0, 1/2, 2 \rangle = \langle 0, \frac{1}{\sqrt{17}}, \frac{4}{\sqrt{17}} \rangle$
**[答案]** 最大變動率：$\frac{\sqrt{17}}{2}$；方向：$\langle 0, \frac{1}{\sqrt{17}}, \frac{4}{\sqrt{17}} \rangle$

### 8. 
**[難度: Hard]**
**[解題步驟]**
使用 Green's Theorem：$\oint_C P dx + Q dy = \iint_D (\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}) dA$。
$P = y + e^{\sqrt{x}} \Rightarrow \frac{\partial P}{\partial y} = 1$
$Q = 2x + \cos(y^2) \Rightarrow \frac{\partial Q}{\partial x} = 2$
$\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} = 2 - 1 = 1$
所以 $\oint_C \dots = \iint_D 1 dA = \text{Area of } D$。
區域 $D$ 是由拋物線 $y = x^2$ 和 $x = y^2$ 圍成的。交點為 $(0,0)$ 和 $(1,1)$。
面積 $= \int_0^1 (\sqrt{x} - x^2) dx = [\frac{2}{3}x^{3/2} - \frac{1}{3}x^3]_0^1 = \frac{2}{3} - \frac{1}{3} = \frac{1}{3}$。
**[答案]** $\frac{1}{3}$

---

## 乙、計算、證明題 (每題 12 分，共 36 分)

### 1. 
**[難度: Easy]**
**[解題步驟]**
交線在 $z=0$ 平面上為 $4 - x^2 - y^2 = 0 \Rightarrow x^2 + y^2 = 4$。
底面區域 $D$ 為半徑 $R=2$ 的圓盤。
體積 $V = \iint_D (4 - x^2 - y^2) dA$。
使用極座標 $x = r \cos \theta, y = r \sin \theta$，$dA = r dr d\theta$。
$V = \int_0^{2\pi} \int_0^2 (4 - r^2) r dr d\theta = \int_0^{2\pi} d\theta \int_0^2 (4r - r^3) dr$
$= 2\pi \cdot [2r^2 - \frac{1}{4}r^4]_0^2 = 2\pi \cdot (2(4) - \frac{1}{4}(16)) = 2\pi \cdot (8 - 4) = 8\pi$。
**[答案]** $8\pi$

### 2. 
**[難度: Hard]**
**[解題步驟]**
**(1) 找內部臨界點：**
$f_x = 2x + y - 6 = 0$
$f_y = x + 2y = 0 \Rightarrow x = -2y$
代入 $f_x$： $2(-2y) + y - 6 = 0 \Rightarrow -3y = 6 \Rightarrow y = -2$。
則 $x = 4$。
臨界點 $(4, -2)$ 落在區域 $D$ 內 ($0 \le 4 \le 5, -3 \le -2 \le 0$)。
計算函數值：$f(4, -2) = 16 - 8 + 4 - 24 + 2 = -10$。

**(2) 檢查四個邊界：**
- $L_1$: $y=0$, $0 \le x \le 5$。
  $f(x,0) = x^2 - 6x + 2$。這是一個開口向上的拋物線，對稱軸 $x=3$。
  臨界點：$x=3 \Rightarrow f(3,0) = 9 - 18 + 2 = -7$。
  端點：$f(0,0) = 2$，$f(5,0) = 25 - 30 + 2 = -3$。
- $L_2$: $x=5$, $-3 \le y \le 0$。
  $f(5,y) = 25 + 5y + y^2 - 30 + 2 = y^2 + 5y - 3$。
  臨界點：$f'(y) = 2y + 5 = 0 \Rightarrow y = -5/2$。
  $f(5, -5/2) = 25/4 - 25/2 - 3 = -25/4 - 12/4 = -37/4 = -9.25$。
  端點：$f(5,-3) = 9 - 15 - 3 = -9$。$f(5,0) = -3$ (已算過)。
- $L_3$: $y=-3$, $0 \le x \le 5$。
  $f(x,-3) = x^2 - 3x + 9 - 6x + 2 = x^2 - 9x + 11$。
  對稱軸 $x=4.5$。
  $f(4.5, -3) = (4.5)^2 - 9(4.5) + 11 = 20.25 - 40.5 + 11 = -9.25$。
  端點：$f(0,-3) = 11$。$f(5,-3) = -9$ (已算過)。
- $L_4$: $x=0$, $-3 \le y \le 0$。
  $f(0,y) = y^2 + 2$。
  最小值在 $y=0 \Rightarrow f(0,0) = 2$。最大值在 $y=-3 \Rightarrow f(0,-3) = 11$。

**(3) 比較所有值：**
內部點：$-10$
邊界點：$-7, 2, -3, -9.25, -9, 11$
所以最大值為 $11$，最小值為 $-10$。
**[答案]**
Absolute maximum value: $11$ (at $(0,-3)$)
Absolute minimum value: $-10$ (at $(4,-2)$)

### 3. 
**[難度: Medium]**
**[解題步驟]**
使用 Divergence Theorem：$\iint_S \mathbf{F} \cdot d\mathbf{S} = \iiint_E (\nabla \cdot \mathbf{F}) dV$。
$\nabla \cdot \mathbf{F} = \frac{\partial(x^3)}{\partial x} + \frac{\partial(y^3)}{\partial y} + \frac{\partial(z^3)}{\partial z} = 3x^2 + 3y^2 + 3z^2 = 3(x^2+y^2+z^2)$。
區域 $E$ 是球體 $x^2+y^2+z^2 \le a^2$。
轉換為球座標 (Spherical Coordinates)：
$x^2+y^2+z^2 = \rho^2$
$dV = \rho^2 \sin \phi d\rho d\phi d\theta$
積分區間：$0 \le \rho \le a$, $0 \le \theta \le 2\pi$, $0 \le \phi \le \pi$。
$\iiint_E 3\rho^2 dV = \int_0^{2\pi} \int_0^\pi \int_0^a 3\rho^2 (\rho^2 \sin \phi) d\rho d\phi d\theta$
$= \left( \int_0^{2\pi} d\theta \right) \left( \int_0^\pi \sin \phi d\phi \right) \left( \int_0^a 3\rho^4 d\rho \right)$
$= (2\pi) \cdot [-\cos \phi]_0^\pi \cdot [\frac{3}{5}\rho^5]_0^a$
$= (2\pi) \cdot (1 - (-1)) \cdot (\frac{3}{5} a^5)$
$= 2\pi \cdot 2 \cdot \frac{3}{5} a^5 = \frac{12\pi}{5} a^5$。
**[答案]** $\frac{12\pi}{5} a^5$

---
*考後分析提醒：對完答案後，請誠實告訴我你錯了哪些題目，或者是哪個步驟卡住了？我會為你做針對性解析！*
