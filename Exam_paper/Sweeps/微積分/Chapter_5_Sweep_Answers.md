# 微積分 Chapter 5 掃題測驗 - 積分的應用 - 解答與詳解

### **Question 1**
**解答：$\frac{9}{2}$**
**詳解**：
首先找出兩曲線的交點：
$2 - x^2 = -x \implies x^2 - x - 2 = 0 \implies (x-2)(x+1) = 0$。
交點在 $x = -1$ 與 $x = 2$。
在區間 $[-1, 2]$ 內，$2 - x^2 \ge -x$ (上方曲線為 $y = 2-x^2$，下方為 $y=-x$)。
面積 $A = \int_{-1}^{2} [(2 - x^2) - (-x)] dx = \int_{-1}^{2} (2 + x - x^2) dx$
$A = \left[ 2x + \frac{x^2}{2} - \frac{x^3}{3} \right]_{-1}^2$
代入上限 $2$：$4 + 2 - \frac{8}{3} = 6 - \frac{8}{3} = \frac{10}{3}$
代入下限 $-1$：$-2 + \frac{1}{2} - \left(-\frac{1}{3}\right) = -2 + \frac{1}{2} + \frac{1}{3} = -\frac{7}{6}$
相減：$A = \frac{10}{3} - \left(-\frac{7}{6}\right) = \frac{20}{6} + \frac{7}{6} = \frac{27}{6} = \frac{9}{2}$。

---

### **Question 2**
**解答：$\frac{64\pi}{15}$**
**詳解**：
找出交點：$x^2 = 2x \implies x(x-2) = 0 \implies x = 0, 2$。
在區間 $[0, 2]$ 內，直線 $y=2x$ 在上方 ($R(x) = 2x$)，拋物線 $y=x^2$ 在下方 ($r(x) = x^2$)。
繞 $x$ 軸旋轉，使用圓環法 (Washer Method)：
$V = \pi \int_{0}^{2} [R(x)^2 - r(x)^2] dx = \pi \int_{0}^{2} [(2x)^2 - (x^2)^2] dx = \pi \int_{0}^{2} (4x^2 - x^4) dx$
$V = \pi \left[ \frac{4}{3}x^3 - \frac{1}{5}x^5 \right]_0^2 = \pi \left( \frac{32}{3} - \frac{32}{5} \right) = 32\pi \left( \frac{5 - 3}{15} \right) = \frac{64\pi}{15}$。

---

### **Question 3**
**解答：$2\pi^2$**
**詳解**：
使用圓柱殼法 (Cylindrical Shells)，半徑為 $x$，高度為 $y = \sin(x)$。
體積 $V = \int_{a}^{b} 2\pi (\text{radius})(\text{height}) dx = \int_{0}^{\pi} 2\pi x \sin(x) dx$。
利用分部積分 (Integration by Parts)：
令 $u = x \implies du = dx$；$dv = \sin(x) dx \implies v = -\cos(x)$。
$\int x \sin(x) dx = -x \cos(x) - \int -\cos(x) dx = -x \cos(x) + \sin(x)$。
代入上下限：
$V = 2\pi \left[ -x \cos(x) + \sin(x) \right]_0^\pi$
$V = 2\pi \left( (-\pi \cos(\pi) + \sin(\pi)) - (0 + 0) \right) = 2\pi (-\pi(-1) + 0) = 2\pi(\pi) = 2\pi^2$。

---

### **Question 4**
**解答：$\frac{46}{3}$**
**詳解**：
弧長公式 $L = \int_{a}^{b} \sqrt{1 + (y')^2} dx$。
$y' = \frac{2}{3} \cdot \frac{3}{2} (x^2 - 1)^{1/2} \cdot (2x) = 2x \sqrt{x^2 - 1}$。
$(y')^2 = 4x^2(x^2 - 1) = 4x^4 - 4x^2$。
$1 + (y')^2 = 1 - 4x^2 + 4x^4 = (2x^2 - 1)^2$。
因為 $x \in [1, 3]$，$2x^2 - 1 > 0$，所以 $\sqrt{1 + (y')^2} = 2x^2 - 1$。
弧長 $L = \int_{1}^{3} (2x^2 - 1) dx = \left[ \frac{2}{3}x^3 - x \right]_1^3$
$L = \left( \frac{2}{3}(27) - 3 \right) - \left( \frac{2}{3} - 1 \right) = (18 - 3) - \left( -\frac{1}{3} \right) = 15 + \frac{1}{3} = \frac{46}{3}$。

---

### **Question 5**
**解答：$\frac{\pi}{6} (17\sqrt{17} - 5\sqrt{5})$**
**詳解**：
旋轉曲面面積公式 (繞 $x$ 軸)：$S = \int_{a}^{b} 2\pi y \sqrt{1 + (y')^2} dx$。
$y = \sqrt{x} \implies y' = \frac{1}{2\sqrt{x}}$。
$1 + (y')^2 = 1 + \frac{1}{4x} = \frac{4x+1}{4x}$。
$S = \int_{1}^{4} 2\pi \sqrt{x} \sqrt{\frac{4x+1}{4x}} dx = 2\pi \int_{1}^{4} \sqrt{x} \frac{\sqrt{4x+1}}{2\sqrt{x}} dx = \pi \int_{1}^{4} \sqrt{4x+1} dx$。
令 $u = 4x+1 \implies du = 4 dx \implies dx = \frac{du}{4}$。
$x=1 \implies u=5$；$x=4 \implies u=17$。
$S = \pi \int_{5}^{17} u^{1/2} \frac{du}{4} = \frac{\pi}{4} \left[ \frac{2}{3} u^{3/2} \right]_{5}^{17} = \frac{\pi}{6} (17^{3/2} - 5^{3/2}) = \frac{\pi}{6} (17\sqrt{17} - 5\sqrt{5})$。

---

### **Question 6**
**解答：$(0, \frac{4r}{3\pi})$**
**詳解**：
由對稱性可知，圖形對稱於 $y$ 軸，因此質心的 $x$ 座標 $\bar{x} = 0$。
計算 $\bar{y}$：
總面積 $A = \frac{1}{2}\pi r^2$。
$\bar{y} = \frac{1}{A} \int_{a}^{b} \frac{1}{2} [f(x)]^2 dx = \frac{1}{\frac{1}{2}\pi r^2} \int_{-r}^{r} \frac{1}{2} (\sqrt{r^2 - x^2})^2 dx$
$\bar{y} = \frac{1}{\pi r^2} \int_{-r}^{r} (r^2 - x^2) dx$
利用偶函數性質：
$\bar{y} = \frac{2}{\pi r^2} \int_{0}^{r} (r^2 - x^2) dx = \frac{2}{\pi r^2} \left[ r^2x - \frac{x^3}{3} \right]_0^r = \frac{2}{\pi r^2} \left( r^3 - \frac{r^3}{3} \right) = \frac{2}{\pi r^2} \left( \frac{2r^3}{3} \right) = \frac{4r}{3\pi}$。
質心為 $(0, \frac{4r}{3\pi})$。
