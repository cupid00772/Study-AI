# 微積分 Chapter 4 掃題測驗 - 積分 - 解答與詳解

### **Question 1**
**解答：$\frac{\pi}{4}$**
**詳解**：
將原式改寫為黎曼和的形式，提出 $\frac{1}{n}$：
$$ \lim_{n \to \infty} \sum_{i=1}^{n} \frac{n}{n^2 + i^2} = \lim_{n \to \infty} \frac{1}{n} \sum_{i=1}^{n} \frac{1}{1 + (i/n)^2} $$
此極限可視為函數 $f(x) = \frac{1}{1+x^2}$ 在區間 $[0, 1]$ 上的定積分。
$$ \int_{0}^{1} \frac{1}{1+x^2} dx = \left[ \arctan(x) \right]_0^1 = \arctan(1) - \arctan(0) = \frac{\pi}{4} $$

---

### **Question 2**
**解答：$2x\sqrt{1+x^6} - 2\sqrt{1+8x^3}$**
**詳解**：
根據微積分基本定理 (Fundamental Theorem of Calculus) 和連鎖律 (Chain Rule)：
若 $F(x) = \int_{h(x)}^{g(x)} f(t) dt$，則 $F'(x) = f(g(x))g'(x) - f(h(x))h'(x)$。
此題中 $f(t) = \sqrt{1+t^3}$，$g(x) = x^2$，$h(x) = 2x$。
$$ F'(x) = \sqrt{1+(x^2)^3} \cdot \frac{d}{dx}(x^2) - \sqrt{1+(2x)^3} \cdot \frac{d}{dx}(2x) $$
$$ F'(x) = 2x\sqrt{1+x^6} - 2\sqrt{1+8x^3} $$

---

### **Question 3**
**解答：$\frac{23}{3}$**
**詳解**：
先找出 $|x^2 - 4| = 0$ 的根，為 $x = \pm 2$。在積分區間 $[0, 3]$ 內，分界點為 $x=2$。
當 $0 \le x \le 2$ 時，$x^2 - 4 \le 0 \implies |x^2 - 4| = 4 - x^2$。
當 $2 \le x \le 3$ 時，$x^2 - 4 \ge 0 \implies |x^2 - 4| = x^2 - 4$。
拆解積分：
$$ \int_{0}^{3} |x^2 - 4| dx = \int_{0}^{2} (4 - x^2) dx + \int_{2}^{3} (x^2 - 4) dx $$
計算第一項：
$$ \left[ 4x - \frac{x^3}{3} \right]_0^2 = \left(8 - \frac{8}{3}\right) - 0 = \frac{16}{3} $$
計算第二項：
$$ \left[ \frac{x^3}{3} - 4x \right]_2^3 = \left(\frac{27}{3} - 12\right) - \left(\frac{8}{3} - 8\right) = (9 - 12) - \left(-\frac{16}{3}\right) = -3 + \frac{16}{3} = \frac{7}{3} $$
總和：
$$ \frac{16}{3} + \frac{7}{3} = \frac{23}{3} $$

---

### **Question 4**
**解答：$2e^{\sqrt{x}} + C$**
**詳解**：
令 $u = \sqrt{x} = x^{1/2}$，則 $du = \frac{1}{2\sqrt{x}} dx$，即 $dx = 2\sqrt{x} du$。
原積分變為：
$$ \int \frac{e^u}{\sqrt{x}} \cdot 2\sqrt{x} du = 2 \int e^u du = 2e^u + C $$
代回 $u = \sqrt{x}$：
$$ 2e^{\sqrt{x}} + C $$

---

### **Question 5**
**解答：$\pi$**
**詳解**：
積分區間為對稱區間 $[-\frac{\pi}{4}, \frac{\pi}{4}]$。可以利用奇偶函數性質：
$x^3 \cos x$：奇函數 (因為 $(-x)^3 \cos(-x) = -x^3 \cos x$)。
$\tan^5 x$：奇函數 (因為 $\tan(-x) = -\tan x$)。
$2$：偶函數。
對於奇函數在對稱區間的積分為 0，所以：
$$ \int_{-\frac{\pi}{4}}^{\frac{\pi}{4}} (x^3 \cos x + \tan^5 x) dx = 0 $$
剩下：
$$ \int_{-\frac{\pi}{4}}^{\frac{\pi}{4}} 2 dx = 2 \times \left( \frac{\pi}{4} - \left(-\frac{\pi}{4}\right) \right) = 2 \times \frac{\pi}{2} = \pi $$

---

### **Question 6**
**解答：平均值為 $\frac{4}{3}$，$c = \frac{16}{9}$**
**詳解**：
函數平均值公式：$f_{avg} = \frac{1}{b-a} \int_{a}^{b} f(x) dx$。
區間為 $[0, 4]$：
$$ f_{avg} = \frac{1}{4-0} \int_{0}^{4} x^{1/2} dx = \frac{1}{4} \left[ \frac{2}{3}x^{3/2} \right]_0^4 = \frac{1}{4} \left( \frac{2}{3}(4)^{3/2} - 0 \right) = \frac{1}{4} \left( \frac{2}{3} \cdot 8 \right) = \frac{1}{4} \left( \frac{16}{3} \right) = \frac{4}{3} $$
根據積分均值定理，必定存在 $c \in [0, 4]$ 使得 $f(c) = f_{avg}$。
$$ \sqrt{c} = \frac{4}{3} \implies c = \frac{16}{9} $$
(檢查 $c = \frac{16}{9} \approx 1.78$，確實落在 $[0, 4]$ 內)
