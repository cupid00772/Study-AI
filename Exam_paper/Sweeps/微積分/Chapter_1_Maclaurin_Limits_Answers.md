# 微積分 Chapter 1 掃題測驗 - Maclaurin Series - 解答與詳解

### **Question 1**
**解答：$1/6$**
**詳解**：
使用 $\sin x$ 的 Maclaurin 級數展開：
$$ \sin x = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \dots $$
代入原式：
$$ \lim_{x \to 0} \frac{x - \left( x - \frac{x^3}{6} + O(x^5) \right)}{x^3} = \lim_{x \to 0} \frac{\frac{x^3}{6} - O(x^5)}{x^3} = \frac{1}{6} $$

---

### **Question 2**
**解答：$1/3$**
**詳解**：
使用 $\ln(1+x)$ 的展開式：
$$ \ln(1+x) = x - \frac{x^2}{2} + \frac{x^3}{3} - \frac{x^4}{4} + \dots $$
代入原式：
$$ \lim_{x \to 0} \frac{\left( x - \frac{x^2}{2} + \frac{x^3}{3} - \dots \right) - x + \frac{x^2}{2}}{x^3} = \lim_{x \to 0} \frac{\frac{x^3}{3} - O(x^4)}{x^3} = \frac{1}{3} $$

---

### **Question 3**
**解答：$1/2$**
**詳解**：
使用二項式展開 $(1+u)^p = 1 + pu + \frac{p(p-1)}{2!}u^2 + \frac{p(p-1)(p-2)}{3!}u^3 + \dots$
令 $u = 2x, p = 1/2$：
$$ \sqrt{1+2x} = 1 + \frac{1}{2}(2x) + \frac{(1/2)(-1/2)}{2}(2x)^2 + \frac{(1/2)(-1/2)(-3/2)}{6}(2x)^3 + \dots $$
$$ = 1 + x - \frac{1}{2}x^2 + \frac{1}{2}x^3 + \dots $$
代入原式：
$$ \lim_{x \to 0} \frac{\left( 1 + x - \frac{1}{2}x^2 + \frac{1}{2}x^3 + \dots \right) - 1 - x + \frac{1}{2}x^2}{x^3} = \lim_{x \to 0} \frac{\frac{1}{2}x^3 + O(x^4)}{x^3} = \frac{1}{2} $$

---

### **Question 4**
**解答：$-1/3$**
**詳解**：
展開 $e^x$ 與 $\cos x$ 到 $x^3$ 項並相乘：
$$ e^x \approx 1 + x + \frac{x^2}{2} + \frac{x^3}{6} $$
$$ \cos x \approx 1 - \frac{x^2}{2} $$
相乘：
$$ e^x \cos x \approx \left( 1 + x + \frac{x^2}{2} + \frac{x^3}{6} \right) \left( 1 - \frac{x^2}{2} \right) = 1 - \frac{x^2}{2} + x - \frac{x^3}{2} + \frac{x^2}{2} + \frac{x^3}{6} + \dots $$
$$ = 1 + x + \left( \frac{1}{6} - \frac{1}{2} \right)x^3 = 1 + x - \frac{x^3}{3} + \dots $$
代入原式：
$$ \lim_{x \to 0} \frac{\left( 1 + x - \frac{x^3}{3} + \dots \right) - 1 - x}{x^3} = -\frac{1}{3} $$

---

### **Question 5**
**解答：$-1/3$**
**詳解**：
利用合成函數展開。已知 $\sin u \approx u - \frac{u^3}{6}$。令 $u = \sin x \approx x - \frac{x^3}{6}$。
$$ \sin(\sin x) \approx \sin\left( x - \frac{x^3}{6} \right) \approx \left( x - \frac{x^3}{6} \right) - \frac{1}{6}\left( x - \frac{x^3}{6} \right)^3 $$
只需保留到 $x^3$ 即可，後面的展開式中 $(x - \dots)^3 \approx x^3$。
$$ \sin(\sin x) \approx x - \frac{x^3}{6} - \frac{x^3}{6} = x - \frac{x^3}{3} + \dots $$
代入原式：
$$ \lim_{x \to 0} \frac{\left( x - \frac{x^3}{3} \right) - x}{x^3} = -\frac{1}{3} $$

---

### **Question 6**
**解答：$1/3$**
**詳解**：
先通分：
$$ \frac{1}{x^2} - \frac{1}{x \tan x} = \frac{\tan x - x}{x^2 \tan x} $$
已知 $\tan x = x + \frac{x^3}{3} + \dots$
分子部分：$\tan x - x = \frac{x^3}{3} + O(x^5)$
分母部分：當 $x \to 0$ 時，$\tan x \approx x$，所以 $x^2 \tan x \approx x^3$。
$$ \lim_{x \to 0} \frac{\frac{x^3}{3}}{x^3} = \frac{1}{3} $$

---

### **Question 7**
**解答：$-1/12$**
**詳解**：
首先展開 $\cos x$ 到 $x^4$：
$$ \cos x \approx 1 - \frac{x^2}{2} + \frac{x^4}{24} $$
接著利用 $\ln(1+u) \approx u - \frac{u^2}{2}$，令 $u = - \frac{x^2}{2} + \frac{x^4}{24}$：
$$ \ln(\cos x) = \ln(1 + u) \approx \left( - \frac{x^2}{2} + \frac{x^4}{24} \right) - \frac{1}{2} \left( - \frac{x^2}{2} + \frac{x^4}{24} \right)^2 $$
展開平方項，我們只需要 $x^4$：$\left( - \frac{x^2}{2} \right)^2 = \frac{x^4}{4}$。
$$ \ln(\cos x) \approx - \frac{x^2}{2} + \frac{x^4}{24} - \frac{1}{2}\left( \frac{x^4}{4} \right) = - \frac{x^2}{2} + x^4 \left( \frac{1}{24} - \frac{1}{8} \right) = - \frac{x^2}{2} - \frac{x^4}{12} $$
代入原式：
$$ \lim_{x \to 0} \frac{\left( - \frac{x^2}{2} - \frac{x^4}{12} \right) + \frac{x^2}{2}}{x^4} = -\frac{1}{12} $$

---

### **Question 8**
**解答：$3/2$**
**詳解**：
展開 $\cos x$ 與 $\sqrt{\cos 2x}$。
$$ \cos 2x \approx 1 - \frac{(2x)^2}{2} = 1 - 2x^2 $$
使用二項式展開 $\sqrt{1+u} \approx 1 + \frac{1}{2}u$，令 $u = -2x^2$：
$$ \sqrt{\cos 2x} \approx 1 + \frac{1}{2}(-2x^2) = 1 - x^2 $$
接著與 $\cos x$ 相乘：
$$ \cos x \sqrt{\cos 2x} \approx \left( 1 - \frac{x^2}{2} \right)(1 - x^2) \approx 1 - x^2 - \frac{x^2}{2} = 1 - \frac{3}{2}x^2 $$
代入原式：
$$ \lim_{x \to 0} \frac{1 - \left( 1 - \frac{3}{2}x^2 \right)}{x^2} = \frac{3}{2} $$

---

### **Question 9**
**解答：$-1/12$**
**詳解**：
將兩個函數展開至 $x^4$。
$$ \cos x \approx 1 - \frac{x^2}{2} + \frac{x^4}{24} $$
將 $u = -\frac{x^2}{2}$ 代入 $e^u \approx 1 + u + \frac{u^2}{2}$：
$$ e^{-x^2/2} \approx 1 + \left( -\frac{x^2}{2} \right) + \frac{1}{2} \left( -\frac{x^2}{2} \right)^2 = 1 - \frac{x^2}{2} + \frac{x^4}{8} $$
分子相減：
$$ \cos x - e^{-x^2/2} \approx \left( 1 - \frac{x^2}{2} + \frac{x^4}{24} \right) - \left( 1 - \frac{x^2}{2} + \frac{x^4}{8} \right) = \left( \frac{1}{24} - \frac{1}{8} \right)x^4 = -\frac{1}{12}x^4 $$
因此極限值為 $-1/12$。

---

### **Question 10**
**解答：$a = 1, b = -1, c = 1/2$**
**詳解**：
展開 $\ln(1+ax)$ 到三次項：
$$ \ln(1+ax) = ax - \frac{(ax)^2}{2} + \frac{(ax)^3}{3} - \dots = ax - \frac{a^2}{2}x^2 + \frac{a^3}{3}x^3 - \dots $$
將分子整理合併：
$$ \ln(1+ax) + bx + cx^2 = (ax - \frac{a^2}{2}x^2 + \frac{a^3}{3}x^3) + bx + cx^2 $$
$$ = (a+b)x + \left(c - \frac{a^2}{2}\right)x^2 + \frac{a^3}{3}x^3 + O(x^4) $$
為了讓極限 $\lim_{x \to 0} \frac{\text{分子}}{x^3}$ 存在且等於 $1/3$，分子中 $x$ 與 $x^2$ 的係數必須為 $0$，且 $x^3$ 的係數必須為 $1/3$。
我們建立方程式：
1. $a + b = 0$
2. $c - \frac{a^2}{2} = 0$
3. $\frac{a^3}{3} = \frac{1}{3}$
由第 (3) 式解出 $a^3 = 1 \implies a = 1$。
代入第 (1) 式得到 $1 + b = 0 \implies b = -1$。
代入第 (2) 式得到 $c - \frac{1}{2} = 0 \implies c = \frac{1}{2}$。
