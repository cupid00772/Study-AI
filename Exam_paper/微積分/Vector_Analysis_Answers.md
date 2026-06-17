# 國立臺灣聯合大學系統 微積分 模擬期末考卷 - 向量微積分特訓 解答卷
(Vector Analysis Mock Exam - Answers)

## 考點分佈總表

| 題號 | 測驗考點 / 知識領域 | 難度標籤 |
| :--- | :--- | :---: |
| 1 | Directional Derivative & Gradient | [Easy] |
| 2 | Conservative Vector Field & Line Integral | [Medium] |
| 3 | Surface Area (Parametric/Cartesian) | [Medium] |
| 4 | Line Integral with respect to arc length ($ds$) | [Medium] |
| 5 | Green's Theorem (Area Calculation) | [Hard] |
| 6 | Green's Theorem (Circulation/Work) | [Medium] |
| 7 | Stokes' Theorem (Line integral to Surface) | [Medium] |
| 8 | Divergence Theorem (Flux over Sphere) | [Easy] |
| 9 | Stokes' Theorem (Surface to Line/Direct) | [Hard] |
| 10 | Divergence Theorem (Flux over Cylinder) | [Hard] |

---

## 評分標準與建議 (Marking Scheme)
- **總分：** 100 分
- **配分：** 每題 10 分。
- **實力評估：**
  - **85分以上：** 向量微積分觀念極度扎實，計算精準，具備期末考/轉學考頂標水準。
  - **70 - 84分：** 觀念正確，但可能在積分換元或三大定理的法向量判斷上偶有失誤，請檢查是哪個定理的題型出錯。
  - **50 - 69分：** 對於如何挑選適合的定理（例如何時用 Stokes', 何時用 Divergence）還不夠熟悉，建議回去複習定理的適用條件 (封閉/開放曲面)。

---

## 詳細解說 (Detailed Solutions)

### 一、 向量微分與基本積分

**1. (10 points)**
**(a)** $\nabla f = \langle 2xy+z^2, x^2+2yz, y^2+2zx \rangle$。
代入 $P(1, -1, 1)$，得 $\nabla f(1, -1, 1) = \langle -2+1, 1-2, 1+2 \rangle = \langle -1, -1, 3 \rangle$。
方向向量 $\mathbf{v} = \langle 2, -1, 2 \rangle$，單位向量 $\mathbf{u} = \frac{\mathbf{v}}{|\mathbf{v}|} = \frac{\langle 2, -1, 2 \rangle}{\sqrt{4+1+4}} = \langle \frac{2}{3}, \frac{-1}{3}, \frac{2}{3} \rangle$。
方向導數 $D_{\mathbf{u}} f(P) = \nabla f(P) \cdot \mathbf{u} = (-1)(\frac{2}{3}) + (-1)(\frac{-1}{3}) + (3)(\frac{2}{3}) = \frac{-2+1+6}{3} = \frac{5}{3}$。
**(b)** 最大方向導數值為梯度的長度：$|\nabla f| = \sqrt{(-1)^2 + (-1)^2 + 3^2} = \sqrt{11}$。
發生此最大值的方向為梯度方向的單位向量：$\frac{\nabla f}{|\nabla f|} = \langle \frac{-1}{\sqrt{11}}, \frac{-1}{\sqrt{11}}, \frac{3}{\sqrt{11}} \rangle$。

**2. (10 points)**
**(a)** 計算旋度 $\nabla \times \mathbf{F}$：
$\nabla \times \mathbf{F} = \langle \frac{\partial}{\partial y}(y^2+3xz^2) - \frac{\partial}{\partial z}(x^2+2yz), \frac{\partial}{\partial z}(2xy+z^3) - \frac{\partial}{\partial x}(y^2+3xz^2), \frac{\partial}{\partial x}(x^2+2yz) - \frac{\partial}{\partial y}(2xy+z^3) \rangle$
$= \langle (2y - 2y), (3z^2 - 3z^2), (2x - 2x) \rangle = \langle 0, 0, 0 \rangle$。
因定義域為 $\mathbb{R}^3$ (單連通)，故 $\mathbf{F}$ 為保守向量場。
**(b)** 求勢函數 $f$：
$f_x = 2xy + z^3 \implies f(x,y,z) = x^2y + xz^3 + g(y,z)$。
$f_y = x^2 + g_y(y,z)$。比對題目得 $g_y(y,z) = 2yz \implies g(y,z) = y^2z + h(z)$。此時 $f = x^2y + xz^3 + y^2z + h(z)$。
$f_z = 3xz^2 + y^2 + h'(z)$。比對題目得 $h'(z) = 0 \implies h(z) = C$。
故勢函數 $f(x,y,z) = x^2y + y^2z + z^3x + C$ (寫 $C=0$ 即可)。
**(c)** 利用線積分基本定理：
$\int_C \mathbf{F} \cdot d\mathbf{r} = f(1,1,1) - f(0,0,0) = (1+1+1) - 0 = 3$。

**3. (10 points)**
曲面為 $z = f(x,y) = x^2 + y^2$。
$f_x = 2x, f_y = 2y$。面積微小元素 $dS = \sqrt{1 + f_x^2 + f_y^2} dA = \sqrt{1 + 4x^2 + 4y^2} dA$。
投影區域 $D$ 為 $x^2 + y^2 \le 4$。
使用極座標計算：$\iint_D \sqrt{1 + 4(x^2+y^2)} dA = \int_0^{2\pi} \int_0^2 \sqrt{1 + 4r^2} \, r \, dr \, d\theta$。
令 $u = 1 + 4r^2 \implies du = 8r \, dr$。
積分值 $= 2\pi \cdot \frac{1}{8} \int_{1}^{17} u^{1/2} du = \frac{\pi}{4} \left[ \frac{2}{3} u^{3/2} \right]_1^{17} = \frac{\pi}{6} (17\sqrt{17} - 1)$。

**4. (10 points)**
曲線 $\mathbf{r}(t) = \langle 3\cos t, 3\sin t, 4t \rangle$，$t \in [0, 2\pi]$。
速度向量 $\mathbf{r}'(t) = \langle -3\sin t, 3\cos t, 4 \rangle$。
弧長微小元素 $ds = |\mathbf{r}'(t)| dt = \sqrt{(-3\sin t)^2 + (3\cos t)^2 + 4^2} dt = \sqrt{9+16} dt = 5 dt$。
在曲線上，$x^2 + y^2 = (3\cos t)^2 + (3\sin t)^2 = 9$。
$\int_C (x^2 + y^2) ds = \int_0^{2\pi} 9 \cdot 5 dt = \int_0^{2\pi} 45 dt = 90\pi$。

**5. (10 points)**
參數式 $x = a \cos^3 t, y = a \sin^3 t$，$t \in [0, 2\pi]$。
$dx = -3a \cos^2 t \sin t \, dt$，$dy = 3a \sin^2 t \cos t \, dt$。
代入 Green's Theorem 面積公式：
$x dy - y dx = (a \cos^3 t)(3a \sin^2 t \cos t) - (a \sin^3 t)(-3a \cos^2 t \sin t)$
$= 3a^2 \cos^4 t \sin^2 t + 3a^2 \sin^4 t \cos^2 t = 3a^2 \sin^2 t \cos^2 t (\cos^2 t + \sin^2 t) = 3a^2 \sin^2 t \cos^2 t$。
Area $= \frac{1}{2} \int_0^{2\pi} (x dy - y dx) = \frac{1}{2} \int_0^{2\pi} 3a^2 \sin^2 t \cos^2 t \, dt$。
利用 $\sin t \cos t = \frac{1}{2} \sin(2t)$：
$= \frac{3a^2}{2} \int_0^{2\pi} \frac{1}{4} \sin^2(2t) \, dt = \frac{3a^2}{8} \int_0^{2\pi} \frac{1 - \cos(4t)}{2} \, dt = \frac{3a^2}{16} \left[ t - \frac{1}{4}\sin(4t) \right]_0^{2\pi} = \frac{3a^2}{16} \cdot 2\pi = \frac{3\pi a^2}{8}$。

---

### 二、 三大定理綜合應用題

**6. (10 points)**
設 $P = 3y - e^{\sin x}, Q = 7x + \sqrt{y^4+1}$。
由 Green's Theorem：$\oint_C P dx + Q dy = \iint_D \left( \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} \right) dA$。
$\frac{\partial Q}{\partial x} = 7$；$\frac{\partial P}{\partial y} = 3$。
被積函數為 $7 - 3 = 4$。
$\iint_D 4 \, dA = 4 \times (\text{三角形面積})$。
三角形頂點 $(0,0), (3,0), (3,4)$，底為 $3$，高為 $4$，面積 $= \frac{1}{2} \times 3 \times 4 = 6$。
答案為 $4 \times 6 = 24$。

**7. (10 points)**
使用 Stokes' Theorem：$\iint_S (\nabla \times \mathbf{F}) \cdot d\mathbf{S} = \oint_C \mathbf{F} \cdot d\mathbf{r}$。
$S$ 為上半球殼 $z = \sqrt{9-x^2-y^2}$，邊界 $C$ 為圓 $x^2+y^2=9, z=0$。法向量向上，故 $C$ 方向為逆時針。
參數化 $C$: $\mathbf{r}(t) = \langle 3\cos t, 3\sin t, 0 \rangle$，$t \in [0, 2\pi]$。
$d\mathbf{r} = \langle -3\sin t, 3\cos t, 0 \rangle dt$。
在 $C$ 上，$\mathbf{F} = \langle -y, x, z^2 \rangle = \langle -3\sin t, 3\cos t, 0 \rangle$。
$\oint_C \mathbf{F} \cdot d\mathbf{r} = \int_0^{2\pi} \langle -3\sin t, 3\cos t, 0 \rangle \cdot \langle -3\sin t, 3\cos t, 0 \rangle \, dt$
$= \int_0^{2\pi} (9\sin^2 t + 9\cos^2 t) dt = \int_0^{2\pi} 9 \, dt = 18\pi$。

**8. (10 points)**
使用 Divergence Theorem：$\iint_S \mathbf{F} \cdot d\mathbf{S} = \iiint_V (\nabla \cdot \mathbf{F}) dV$。
$\nabla \cdot \mathbf{F} = \frac{\partial}{\partial x}(x^3) + \frac{\partial}{\partial y}(y^3) + \frac{\partial}{\partial z}(z^3) = 3x^2 + 3y^2 + 3z^2$。
使用球座標計算體積分，單位球體 $V$: $0 \le \rho \le 1, 0 \le \phi \le \pi, 0 \le \theta \le 2\pi$。
$\iiint_V 3\rho^2 \, dV = \int_0^{2\pi} \int_0^\pi \int_0^1 (3\rho^2) \cdot (\rho^2 \sin\phi) \, d\rho \, d\phi \, d\theta$
$= \left( \int_0^{2\pi} d\theta \right) \left( \int_0^\pi \sin\phi \, d\phi \right) \left( \int_0^1 3\rho^4 \, d\rho \right)$
$= (2\pi) \cdot (2) \cdot \left( \frac{3}{5} \right) = \frac{12\pi}{5}$。

**9. (10 points)**
直接計算線積分很繁瑣，使用 Stokes' Theorem：$\oint_C \mathbf{F} \cdot d\mathbf{r} = \iint_S (\nabla \times \mathbf{F}) \cdot \mathbf{n} \, dS$。
$\nabla \times \mathbf{F} = \langle 2y, 2z, 2x \rangle$。
選擇 $C$ 所包圍的平面區域作為曲面 $S$：$x+y+z=1$ 位於第一卦限的部分。
可看成 $z = f(x,y) = 1 - x - y$。向上的法向量投影：$\mathbf{N} \, dxdy = \langle -f_x, -f_y, 1 \rangle \, dxdy = \langle 1, 1, 1 \rangle \, dxdy$。
$(\nabla \times \mathbf{F}) \cdot \mathbf{N} = \langle 2y, 2z, 2x \rangle \cdot \langle 1, 1, 1 \rangle = 2y + 2z + 2x$。
因為在平面上，$x+y+z=1$，所以 $2x+2y+2z = 2(1) = 2$。
因此，面積分變成 $\iint_D 2 \, dxdy$，其中 $D$ 是 $S$ 在 $xy$-平面的投影 (頂點為 $(0,0),(1,0),(0,1)$ 的三角形)。
$\iint_D 2 \, dxdy = 2 \times (\text{三角形 } D \text{ 的面積}) = 2 \times \left( \frac{1}{2} \cdot 1 \cdot 1 \right) = 1$。

**10. (10 points)**
使用 Divergence Theorem：$\iint_S \mathbf{F} \cdot d\mathbf{S} = \iiint_V (\nabla \cdot \mathbf{F}) dV$。
$\nabla \cdot \mathbf{F} = y^2 + z^2 + x^2 = x^2 + y^2 + z^2$。
積分區域 $V$ 為圓柱體 $x^2+y^2 \le 4, 0 \le z \le 3$。
使用圓柱座標：$x^2+y^2=r^2$，$dV = r \, dr \, d\theta \, dz$。範圍：$0 \le r \le 2, 0 \le \theta \le 2\pi, 0 \le z \le 3$。
被積函數轉換為 $r^2 + z^2$。
$\iiint_V (r^2+z^2) r \, dr \, d\theta \, dz = \int_0^{2\pi} d\theta \int_0^3 \int_0^2 (r^3 + z^2 r) \, dr \, dz$
$= 2\pi \int_0^3 \left[ \frac{1}{4}r^4 + \frac{1}{2}z^2 r^2 \right]_{r=0}^{r=2} dz = 2\pi \int_0^3 (4 + 2z^2) \, dz$
$= 2\pi \left[ 4z + \frac{2}{3}z^3 \right]_0^3 = 2\pi \left( 12 + \frac{2}{3}(27) \right) = 2\pi (12 + 18) = 60\pi$。
