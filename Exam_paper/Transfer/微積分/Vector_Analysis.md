# 國立臺灣聯合大學系統 微積分 模擬期末考卷 - 向量微積分特訓
(Vector Analysis Mock Exam)

## 測驗說明
- **範圍**：向量微積分全單元 (向量微分、方向導數、梯度、線積分、面積分、Green's Theorem, Stokes' Theorem, Divergence Theorem)
- **難度**：中高 (Medium-Hard)
- **題數**：共 10 題 (包含基礎計算與三大定理綜合應用)
- **總分**：100 分

---

### 一、 向量微分與基本積分 (共 5 題，每題 10 分)

**1. (Directional Derivative & Gradient)**
已知純量函數 $f(x, y, z) = x^2 y + y^2 z + z^2 x$。
(a) 求 $f$ 在點 $P(1, -1, 1)$ 處，沿著方向向量 $\mathbf{v} = \langle 2, -1, 2 \rangle$ 的方向導數。
(b) 求出在該點 $P$ 處，方向導數的最大值以及發生此最大值的方向 (單位向量)。

**2. (Conservative Vector Field & Line Integral)**
給定向量場 $\mathbf{F}(x, y, z) = \langle 2xy + z^3, x^2 + 2yz, y^2 + 3xz^2 \rangle$。
(a) 證明 $\mathbf{F}$ 是一個保守向量場 (Conservative Vector Field)。
(b) 找出一勢函數 (Potential Function) $f(x, y, z)$ 使得 $\nabla f = \mathbf{F}$。
(c) 計算線積分 $\int_C \mathbf{F} \cdot d\mathbf{r}$，其中 $C$ 是從點 $(0,0,0)$ 到點 $(1,1,1)$ 的任意平滑曲線。

**3. (Surface Area)**
計算位於圓柱體 $x^2 + y^2 = 4$ 內部，且在平面 $z = 0$ 上方的拋物面 $z = x^2 + y^2$ 的表面積。

**4. (Line Integral - Direct Calculation)**
計算純量函數的線積分 $\int_C (x^2 + y^2) ds$，其中 $C$ 為螺旋線 $\mathbf{r}(t) = \langle 3\cos t, 3\sin t, 4t \rangle$，且 $0 \le t \le 2\pi$。

**5. (Green's Theorem - Area Calculation)**
利用 Green's Theorem 的面積公式 $\left( A = \frac{1}{2} \oint_C x dy - y dx \right)$ 計算由星形線 (Astroid) $x^{2/3} + y^{2/3} = a^{2/3}$ 所包圍的區域面積。
*(提示：可使用參數式 $x = a \cos^3 t, y = a \sin^3 t, 0 \le t \le 2\pi$)*

---

### 二、 三大定理綜合應用題 (共 5 題，每題 10 分)

**6. (Green's Theorem - Circulation)**
計算線積分 $\oint_C (3y - e^{\sin x}) dx + (7x + \sqrt{y^4+1}) dy$，其中 $C$ 是以 $(0,0), (3,0), (3,4)$ 為頂點的直角三角形邊界，方向為逆時針。

**7. (Stokes' Theorem)**
計算 $\iint_S (\nabla \times \mathbf{F}) \cdot d\mathbf{S}$ (即 $\iint_S (\nabla \times \mathbf{F}) \cdot \mathbf{n} \, dS$)，其中 $\mathbf{F}(x, y, z) = \langle -y, x, z^2 \rangle$。
$S$ 為球殼 $x^2 + y^2 + z^2 = 9$ 位於 $z \ge 0$ 的上半部分，且法向量 $\mathbf{n}$ 向上。

**8. (Divergence Theorem)**
計算通量 (Flux) $\iint_S \mathbf{F} \cdot d\mathbf{S}$，其中 $\mathbf{F}(x, y, z) = \langle x^3, y^3, z^3 \rangle$。
$S$ 為由球面 $x^2 + y^2 + z^2 = 1$ 所包圍的封閉曲面，法向量 $\mathbf{n}$ 向外。

**9. (Stokes' Theorem - Line Integral to Surface Integral)**
計算向量場線積分 $\oint_C \mathbf{F} \cdot d\mathbf{r}$，其中 $\mathbf{F}(x, y, z) = \langle z^2, x^2, y^2 \rangle$。
$C$ 為平面 $x + y + z = 1$ 與三個座標平面 (位於第一卦限) 交界所形成的三角形邊界，方向從上方俯視為逆時針。

**10. (Comprehensive / Divergence Theorem Variant)**
給定向量場 $\mathbf{F}(x, y, z) = \langle x y^2, y z^2, z x^2 \rangle$。
$S$ 為圓柱體封閉表面：包含側面 $x^2 + y^2 = 4$，以及上下底面 $z = 0$ 和 $z = 3$，法向量向外。
求向外的總通量 $\iint_S \mathbf{F} \cdot d\mathbf{S}$。
