---
title: "Answers for Vector Analysis Mock Exam"
date: "2026-06-11"
subject: "微積分 (Calculus)"
---

# 詳解與評分標準：Vector Analysis 模擬測驗解答

## 🎯 考點分佈總表 (Topic Analysis)
| 題號 | 核心考點 (Key Concepts) | 難度 | 針對弱點打擊重點 |
|:---:|:---|:---:|:---|
| 1 | Gradient & Directional Derivative | [Medium] | 提醒求極值方向時，必須將向量轉為**單位向量** |
| 2 | Green's Theorem with Singularity | [Hard] | 處理包含奇點 $(0,0)$ 的向量場，利用**變形路徑 (Deformation of Path)** |
| 3 | Surface Integral (Flux) | [Medium] | 釐清 $d\mathbf{S} = \hat{n} dS = (-\frac{\partial z}{\partial x}\mathbf{i} - \frac{\partial z}{\partial y}\mathbf{j} + \mathbf{k}) dA$ |
| 4 | Divergence Theorem | [Medium] | 體積分時，辨識 $x^2+y^2+z^2=\rho^2$ (球座標) 而非 $r^2$ |
| 5 | Stokes' Theorem | [Medium] | 面積分與邊界曲線的關係 |
| 6 | Conservative Vector Fields | [Easy] | 判斷保守場與尋找位勢函數 (Potential function) |
| 7 | Green's Theorem | [Easy] | 封閉路徑的標準線積分轉雙重積分 |
| 8 | Scalar Surface Integral | [Medium] | 標量面積分 $dS$ 與球座標參數化的應用 |
| 9 | Line Integral (Work Done) | [Easy] | 參數曲線的路徑積分計算 |
| 10 | Divergence Theorem | [Easy] | 柱體封閉曲面的散度定理應用 |

---

## 📝 解題步驟 (Step-by-step Solutions)

### Q1. (Directional Derivative)
**Step 1: 計算偏導數與梯度向量 (Gradient Vector)**
$f(x, y, z) = x^2 y^3 z^4$
- $f_x = 2xy^3z^4$
- $f_y = 3x^2y^2z^4$
- $f_z = 4x^2y^3z^3$

代入點 $P(1, -1, 1)$：
$f_x(P) = 2(1)(-1)^3(1)^4 = -2$
$f_y(P) = 3(1)^2(-1)^2(1)^4 = 3$
$f_z(P) = 4(1)^2(-1)^3(1)^3 = -4$
故 $\nabla f(P) = \langle -2, 3, -4 \rangle$

**Step 2: 求最大變化率 (Maximum rate of change)**
最大變化率即為梯度向量的長度：
$|\nabla f| = \sqrt{(-2)^2 + 3^2 + (-4)^2} = \sqrt{4 + 9 + 16} = \sqrt{29}$

**Step 3: 求方向的單位向量 (Unit Vector) ⚠️易錯點**
最大值發生的方向與梯度同向，必須將其標準化為「單位向量」：
$\mathbf{u} = \frac{\nabla f}{|\nabla f|} = \frac{1}{\sqrt{29}} \langle -2, 3, -4 \rangle$

---

### Q2. (Green's Theorem with Singularity) ⚠️重點考題
**Step 1: 檢查向量場的散度與旋度**
設 $\mathbf{F}(x,y) = P\mathbf{i} + Q\mathbf{j} = \frac{-y}{x^2 + y^2}\mathbf{i} + \frac{x}{x^2 + y^2}\mathbf{j}$
計算 $\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y}$：
$\frac{\partial Q}{\partial x} = \frac{1 \cdot (x^2+y^2) - x \cdot 2x}{(x^2+y^2)^2} = \frac{y^2-x^2}{(x^2+y^2)^2}$
$\frac{\partial P}{\partial y} = \frac{-1 \cdot (x^2+y^2) - (-y) \cdot 2y}{(x^2+y^2)^2} = \frac{y^2-x^2}{(x^2+y^2)^2}$
因此 $\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} = 0$，除了在原點 $(0,0)$ 沒有定義 (Singularity)。

**Step 2: 變形路徑 (Deformation of Path)**
由於原點包圍在橢圓 $C$ 內，不能直接在 $C$ 的內部區域使用 Green 定理。我們在原點周圍構造一個很小的逆時針圓 $C_\epsilon: x^2+y^2=\epsilon^2$。
根據多連通區域的 Green 定理，$\oint_C \mathbf{F} \cdot d\mathbf{r} = \oint_{C_\epsilon} \mathbf{F} \cdot d\mathbf{r}$。

**Step 3: 計算小圓上的積分**
參數化 $C_\epsilon$: $x = \epsilon \cos t, y = \epsilon \sin t$，$0 \le t \le 2\pi$。
$dx = -\epsilon \sin t dt$
$dy = \epsilon \cos t dt$
$\oint_{C_\epsilon} \frac{-y dx + x dy}{x^2+y^2} = \int_0^{2\pi} \frac{-\epsilon \sin t (-\epsilon \sin t) + \epsilon \cos t (\epsilon \cos t)}{\epsilon^2} dt$
$= \int_0^{2\pi} \frac{\epsilon^2(\sin^2 t + \cos^2 t)}{\epsilon^2} dt = \int_0^{2\pi} 1 dt = 2\pi$

**答案：$2\pi$**

---

### Q3. (Surface Integral - Flux) ⚠️易錯點
**Step 1: 確定 $d\mathbf{S}$ 的轉換**
曲面 $S$: $z = g(x,y) = 1 - x^2 - y^2$。因為是向上定向 (upward)，法向量的 $z$ 分量為正：
$d\mathbf{S} = \hat{n} dS = \langle -g_x, -g_y, 1 \rangle dA = \langle 2x, 2y, 1 \rangle dA$

**Step 2: 計算 $\mathbf{F} \cdot d\mathbf{S}$**
$\mathbf{F} = \langle x, y, z^2 \rangle = \langle x, y, (1-x^2-y^2)^2 \rangle$
$\mathbf{F} \cdot d\mathbf{S} = (x)(2x) + (y)(2y) + (1-x^2-y^2)^2(1) = 2x^2 + 2y^2 + (1-(x^2+y^2))^2$

**Step 3: 轉換為極座標進行投影 $dA$ 的積分**
投影區域 $D$ 為 $xy$ 平面上的圓：$x^2+y^2 \le 1$。令 $x^2+y^2 = r^2$。
積分式 $= \iint_D [2r^2 + (1-r^2)^2] r dr d\theta = \int_0^{2\pi} d\theta \int_0^1 (2r^2 + 1 - 2r^2 + r^4) r dr$
$= 2\pi \int_0^1 (1 + r^4) r dr = 2\pi \int_0^1 (r + r^5) dr$
$= 2\pi [\frac{r^2}{2} + \frac{r^6}{6}]_0^1 = 2\pi (\frac{1}{2} + \frac{1}{6}) = 2\pi (\frac{4}{6}) = \frac{4\pi}{3}$

**答案：$\frac{4\pi}{3}$**

---

### Q4. (Divergence Theorem & Spherical Coordinates) ⚠️易錯點
**Step 1: 使用散度定理**
$\iint_S \mathbf{F} \cdot d\mathbf{S} = \iiint_V (\nabla \cdot \mathbf{F}) dV$
計算散度：$\nabla \cdot \mathbf{F} = \frac{\partial}{\partial x}(x^3) + \frac{\partial}{\partial y}(y^3) + \frac{\partial}{\partial z}(z^3) = 3x^2 + 3y^2 + 3z^2$

**Step 2: 轉換為球座標 (Spherical Coordinates)**
**⚠️ 注意：** 在三維空間中 $x^2+y^2+z^2 = \rho^2$ (不可寫成 $r^2$)。
$V$ 為單位球 $\rho \le 1$。體積元素 $dV = \rho^2 \sin\phi d\rho d\phi d\theta$。
$\iiint_V 3(x^2+y^2+z^2) dV = \int_0^{2\pi} d\theta \int_0^\pi d\phi \int_0^1 (3\rho^2) (\rho^2 \sin\phi) d\rho$
$= \left( \int_0^{2\pi} d\theta \right) \left( \int_0^\pi \sin\phi d\phi \right) \left( \int_0^1 3\rho^4 d\rho \right)$
$= (2\pi) \times [-\cos\phi]_0^\pi \times [ \frac{3}{5}\rho^5 ]_0^1 = (2\pi) \times (2) \times (\frac{3}{5}) = \frac{12\pi}{5}$

**答案：$\frac{12\pi}{5}$**

---

### Q5. (Stokes' Theorem)
**Step 1: 計算旋度 (Curl)**
$\nabla \times \mathbf{F} = \begin{vmatrix} \mathbf{i} & \mathbf{j} & \mathbf{k} \\ \frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\ -y^2 & x & z^2 \end{vmatrix} = \langle 0, 0, 1 - (-2y) \rangle = \langle 0, 0, 1+2y \rangle$

**Step 2: 設置面積分**
$S$ 為平面 $z = 2-y$ 在圓柱 $x^2+y^2 \le 1$ 內的部分。向上法向：$d\mathbf{S} = \langle -g_x, -g_y, 1 \rangle dA = \langle 0, 1, 1 \rangle dA$
$\iint_S (\nabla \times \mathbf{F}) \cdot d\mathbf{S} = \iint_D \langle 0, 0, 1+2y \rangle \cdot \langle 0, 1, 1 \rangle dA = \iint_D (1+2y) dA$

**Step 3: 計算極座標積分**
$= \int_0^{2\pi} \int_0^1 (1+2r\sin\theta) r dr d\theta = \int_0^{2\pi} [\frac{r^2}{2} + \frac{2}{3}r^3\sin\theta]_0^1 d\theta$
$= \int_0^{2\pi} (\frac{1}{2} + \frac{2}{3}\sin\theta) d\theta = [\frac{1}{2}\theta - \frac{2}{3}\cos\theta]_0^{2\pi} = \pi$

**答案：$\pi$**

---

### Q6. (Conservative Vector Field)
**Step 1: 檢查是否保守 (Check Curl)**
$\nabla \times \mathbf{F} = \langle \frac{\partial(3xz^2)}{\partial y} - \frac{\partial(x^2)}{\partial z}, \frac{\partial(2xy+z^3)}{\partial z} - \frac{\partial(3xz^2)}{\partial x}, \frac{\partial(x^2)}{\partial x} - \frac{\partial(2xy+z^3)}{\partial y} \rangle$
$= \langle 0 - 0, 3z^2 - 3z^2, 2x - 2x \rangle = \langle 0,0,0 \rangle$ (保守場)

**Step 2: 找位勢函數 $f$**
$f_x = 2xy + z^3 \implies f = x^2y + xz^3 + g(y,z)$
$f_y = x^2 + g_y = x^2 \implies g_y = 0 \implies g(y,z) = h(z)$
$f_z = 3xz^2 + h'(z) = 3xz^2 \implies h'(z) = 0 \implies h(z) = C$
位勢函數 $f(x,y,z) = x^2y + xz^3$

**Step 3: 使用微積分基本定理求線積分**
$\int_C \mathbf{F} \cdot d\mathbf{r} = f(3, 1, 4) - f(1, -2, 1)$
$= [ (3)^2(1) + (3)(4)^3 ] - [ (1)^2(-2) + (1)(1)^3 ] = (9 + 192) - (-2 + 1) = 201 - (-1) = 202$

**答案：位勢函數 $f(x,y,z) = x^2y + xz^3 + C$；線積分值 $202$**

---

### Q7. (Green's Theorem - Standard)
**Step 1: 應用 Green 定理**
$P = e^x - y^3, \quad Q = \cos y + x^3$
$\frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} = 3x^2 - (-3y^2) = 3(x^2 + y^2)$

**Step 2: 轉換為極座標雙重積分**
區域 $D$ 為 $x^2+y^2 \le 9$ (半徑 $R=3$ 的圓)。
$\iint_D 3(x^2+y^2) dA = \int_0^{2\pi} \int_0^3 3r^2 (r) dr d\theta = 2\pi \left[ \frac{3r^4}{4} \right]_0^3 = 2\pi (\frac{3 \cdot 81}{4}) = \frac{243\pi}{2}$

**答案：$\frac{243\pi}{2}$**

---

### Q8. (Scalar Surface Integral)
**Step 1: 標量面積分參數化 (球座標)**
曲面 $S$: $x^2+y^2+z^2=4 \implies \rho = 2$。
上半球 $z \ge 0 \implies 0 \le \phi \le \pi/2$。
球面的面積元素 $dS = \rho^2 \sin\phi d\phi d\theta = 4 \sin\phi d\phi d\theta$。
$z = \rho \cos\phi = 2\cos\phi$。

**Step 2: 積分計算**
$\iint_S z dS = \int_0^{2\pi} d\theta \int_0^{\pi/2} (2\cos\phi)(4\sin\phi) d\phi = 2\pi \int_0^{\pi/2} 8\cos\phi\sin\phi d\phi$
利用 $2\cos\phi\sin\phi = \sin(2\phi)$：
$= 2\pi \int_0^{\pi/2} 4\sin(2\phi) d\phi = 8\pi \left[ -\frac{1}{2}\cos(2\phi) \right]_0^{\pi/2} = 8\pi (-\frac{1}{2}(-1) - (-\frac{1}{2}(1))) = 8\pi (\frac{1}{2} + \frac{1}{2}) = 8\pi$

**答案：$8\pi$**

---

### Q9. (Line Integral - Work)
**Step 1: 代入參數式**
$\mathbf{r}(t) = \langle t, t^2, t^3 \rangle \implies d\mathbf{r} = \langle 1, 2t, 3t^2 \rangle dt$
$\mathbf{F}(\mathbf{r}(t)) = \langle y, z, x \rangle = \langle t^2, t^3, t \rangle$

**Step 2: 計算內積與定積分**
$\mathbf{F} \cdot d\mathbf{r} = (t^2)(1) + (t^3)(2t) + (t)(3t^2) = t^2 + 2t^4 + 3t^3$
$W = \int_0^1 (2t^4 + 3t^3 + t^2) dt = \left[ \frac{2}{5}t^5 + \frac{3}{4}t^4 + \frac{1}{3}t^3 \right]_0^1 = \frac{2}{5} + \frac{3}{4} + \frac{1}{3} = \frac{24 + 45 + 20}{60} = \frac{89}{60}$

**答案：$\frac{89}{60}$**

---

### Q10. (Divergence Theorem - Cylinder)
**Step 1: 散度定理**
$\mathbf{F} = \langle x, y, z \rangle$
$\nabla \cdot \mathbf{F} = 1 + 1 + 1 = 3$

**Step 2: 體積分**
$\iint_S \mathbf{F} \cdot d\mathbf{S} = \iiint_V 3 dV = 3 \times (\text{Volume of Cylinder})$
圓柱半徑 $r=2$，高 $h=3$。
體積 $V = \pi r^2 h = \pi (2)^2 (3) = 12\pi$
總通量 = $3 \times 12\pi = 36\pi$

**答案：$36\pi$**
