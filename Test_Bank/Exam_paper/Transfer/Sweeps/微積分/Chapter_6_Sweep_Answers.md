# 微積分 Chapter 6 掃題測驗 - 積分技巧 - 解答與詳解

### **Question 1**
**解答：$\frac{1}{3}x^2 e^{3x} - \frac{2}{9}x e^{3x} + \frac{2}{27}e^{3x} + C$**
**詳解**：
使用表格法 (Tabular Integration) 或連續兩次分部積分。
令 $u$ 為多項式，$dv$ 為指數：
| 符號 | 微分 (D) | 積分 (I) |
| :---: | :---: | :---: |
| $+$ | $x^2$ | $e^{3x}$ |
| $-$ | $2x$ | $\frac{1}{3}e^{3x}$ |
| $+$ | $2$ | $\frac{1}{9}e^{3x}$ |
| $-$ | $0$ | $\frac{1}{27}e^{3x}$ |

依斜線相乘並加上符號：
$+(x^2)(\frac{1}{3}e^{3x}) - (2x)(\frac{1}{9}e^{3x}) + (2)(\frac{1}{27}e^{3x}) + C$
$= \frac{1}{3}x^2 e^{3x} - \frac{2}{9}x e^{3x} + \frac{2}{27}e^{3x} + C$。

---

### **Question 2**
**解答：$\frac{1}{5}e^{2x} (2\sin x - \cos x) + C$**
**詳解**：
令 $I = \int e^{2x} \sin(x) dx$。使用分部積分：
令 $u = \sin x \implies du = \cos x dx$；$dv = e^{2x} dx \implies v = \frac{1}{2}e^{2x}$。
$I = \frac{1}{2}e^{2x}\sin x - \int \frac{1}{2}e^{2x}\cos x dx$。
再對後面的積分作一次分部：
令 $u = \cos x \implies du = -\sin x dx$；$dv = e^{2x} dx \implies v = \frac{1}{2}e^{2x}$。
$\int e^{2x}\cos x dx = \frac{1}{2}e^{2x}\cos x - \int \frac{1}{2}e^{2x}(-\sin x) dx = \frac{1}{2}e^{2x}\cos x + \frac{1}{2} I$。
將此結果代回第一個方程式：
$I = \frac{1}{2}e^{2x}\sin x - \frac{1}{2} \left[ \frac{1}{2}e^{2x}\cos x + \frac{1}{2} I \right]$
$I = \frac{1}{2}e^{2x}\sin x - \frac{1}{4}e^{2x}\cos x - \frac{1}{4} I$
移項得 $\frac{5}{4} I = \frac{1}{4}e^{2x} (2\sin x - \cos x)$
所以 $I = \frac{1}{5}e^{2x} (2\sin x - \cos x) + C$。

---

### **Question 3**
**解答：$\frac{2}{15}$**
**詳解**：
因為 $\sin(x)$ 的次方為奇數，提出一個 $\sin(x)$：
$\int_{0}^{\pi/2} \sin^2(x) \cos^2(x) \sin(x) dx = \int_{0}^{\pi/2} (1-\cos^2(x)) \cos^2(x) \sin(x) dx$。
令 $u = \cos(x) \implies du = -\sin(x) dx$。
當 $x=0 \implies u=1$；$x=\pi/2 \implies u=0$。
原式變為：$\int_{1}^{0} (1-u^2)u^2 (-du) = \int_{0}^{1} (u^2 - u^4) du$
$= \left[ \frac{u^3}{3} - \frac{u^5}{5} \right]_0^1 = \frac{1}{3} - \frac{1}{5} = \frac{2}{15}$。

---

### **Question 4**
**解答：$-\frac{\sqrt{9-x^2}}{x} - \arcsin(\frac{x}{3}) + C$**
**詳解**：
看到 $\sqrt{a^2 - x^2}$ 型式，令 $x = 3\sin\theta \implies dx = 3\cos\theta d\theta$。
$\sqrt{9-x^2} = \sqrt{9 - 9\sin^2\theta} = 3\cos\theta$。
代入積分：
$\int \frac{3\cos\theta}{(3\sin\theta)^2} (3\cos\theta d\theta) = \int \frac{9\cos^2\theta}{9\sin^2\theta} d\theta = \int \cot^2\theta d\theta$
利用恆等式 $\cot^2\theta = \csc^2\theta - 1$：
$\int (\csc^2\theta - 1) d\theta = -\cot\theta - \theta + C$。
將 $\theta$ 換回 $x$：
因為 $\sin\theta = \frac{x}{3}$，畫直角三角形，對邊為 $x$，斜邊為 $3$，鄰邊為 $\sqrt{9-x^2}$。
因此 $\cot\theta = \frac{\text{鄰邊}}{\text{對邊}} = \frac{\sqrt{9-x^2}}{x}$，且 $\theta = \arcsin(\frac{x}{3})$。
最終答案為：$-\frac{\sqrt{9-x^2}}{x} - \arcsin(\frac{x}{3}) + C$。

---

### **Question 5**
**解答：$\ln|x| + \frac{1}{2}\ln(x^2+4) - \frac{1}{2}\arctan(\frac{x}{2}) + C$**
**詳解**：
分母可因式分解為 $x(x^2+4)$。使用部分分式分解：
$\frac{2x^2 - x + 4}{x(x^2+4)} = \frac{A}{x} + \frac{Bx+C}{x^2+4}$。
通分：$2x^2 - x + 4 = A(x^2+4) + x(Bx+C) = (A+B)x^2 + Cx + 4A$。
比較係數：
常數項：$4A = 4 \implies A = 1$。
一次項：$C = -1$。
二次項：$A+B = 2 \implies 1+B = 2 \implies B = 1$。
所以積分變為：
$\int \left( \frac{1}{x} + \frac{x-1}{x^2+4} \right) dx = \int \frac{1}{x} dx + \int \frac{x}{x^2+4} dx - \int \frac{1}{x^2+4} dx$
第一項：$\ln|x|$
第二項：令 $u = x^2+4 \implies du = 2xdx \implies \frac{1}{2} \int \frac{1}{u} du = \frac{1}{2}\ln(x^2+4)$
第三項：$-\frac{1}{2}\arctan(\frac{x}{2})$
總和：$\ln|x| + \frac{1}{2}\ln(x^2+4) - \frac{1}{2}\arctan(\frac{x}{2}) + C$。

---

### **Question 6**
**解答：$2\sqrt{x} - 2\ln(1+\sqrt{x}) + C$**
**詳解**：
令 $u = \sqrt{x} \implies x = u^2 \implies dx = 2u du$。
代入積分：
$\int \frac{1}{1+u} (2u du) = 2 \int \frac{u}{u+1} du$
利用多項式除法或技巧化簡：
$2 \int \frac{u+1-1}{u+1} du = 2 \int \left( 1 - \frac{1}{u+1} \right) du$
$= 2(u - \ln|u+1|) + C$。
代回 $u = \sqrt{x}$：
$= 2\sqrt{x} - 2\ln|\sqrt{x}+1| + C$。
因為 $\sqrt{x} \ge 0$，絕對值可拿掉，得 $2\sqrt{x} - 2\ln(1+\sqrt{x}) + C$。
