# 微積分 Chapter 2 掃題測驗 - 導數與微分 - 解答與詳解

### **Question 1**
**解答：$\frac{\sqrt{3}}{2}$**
**詳解**：
這題考察導數的極限定義：$f'(a) = \lim_{h \to 0} \frac{f(a+h) - f(a)}{h}$。
令 $f(x) = \sin x$，則 $f\left(\frac{\pi}{6}\right) = \sin\left(\frac{\pi}{6}\right) = \frac{1}{2}$。
原式即為求 $f'(x)$ 在 $x = \frac{\pi}{6}$ 處的值。
因為 $f'(x) = \cos x$，所以所求極限為：
$f'\left(\frac{\pi}{6}\right) = \cos\left(\frac{\pi}{6}\right) = \frac{\sqrt{3}}{2}$。

---

### **Question 2**
**解答：$\frac{e-3}{2-e}$**
**詳解**：
對原方程式 $x^2 y^3 - e^{xy} + \sin(x-y) = -1$ 兩邊對 $x$ 微分（將 $y$ 視為 $x$ 的函數，使用連鎖律與乘法規則）：
$$ 2x y^3 + x^2 \cdot 3y^2 y' - e^{xy}(y + x y') + \cos(x-y) \cdot (1 - y') = 0 $$
將點 $(x, y) = (1, 1)$ 代入方程式中：
$$ 2(1)(1) + (1)(3)(1) y' - e^1(1 + 1 \cdot y') + \cos(0)(1 - y') = 0 $$
$$ 2 + 3y' - e(1+y') + 1(1 - y') = 0 $$
$$ 2 + 3y' - e - e y' + 1 - y' = 0 $$
合併同類項：
$$ (3 - e - 1)y' + (3 - e) = 0 \implies (2 - e)y' = e - 3 $$
解得：$y' = \frac{e-3}{2-e}$。

---

### **Question 3**
**解答：$0$**
**詳解**：
令 $y = (\sin x)^{\cos x}$，兩邊取自然對數：
$$ \ln y = \cos x \cdot \ln(\sin x) $$
對兩邊對 $x$ 微分（對數微分法）：
$$ \frac{1}{y} y' = (-\sin x) \cdot \ln(\sin x) + \cos x \cdot \left( \frac{1}{\sin x} \cdot \cos x \right) $$
$$ \frac{1}{y} y' = -\sin x \ln(\sin x) + \frac{\cos^2 x}{\sin x} $$
所以 $y' = (\sin x)^{\cos x} \left[ -\sin x \ln(\sin x) + \frac{\cos^2 x}{\sin x} \right]$。
將 $x = \frac{\pi}{2}$ 代入，此時 $\sin\left(\frac{\pi}{2}\right) = 1, \cos\left(\frac{\pi}{2}\right) = 0$：
$$ y'\left(\frac{\pi}{2}\right) = (1)^0 \left[ -1 \cdot \ln(1) + \frac{0}{1} \right] = 1 \cdot (0 + 0) = 0 $$。

---

### **Question 4**
**解答：$\frac{1}{14}$**
**詳解**：
根據反函數導數公式：$(f^{-1})'(y) = \frac{1}{f'(x)}$，其中 $y = f(x)$。
首先找出對應於 $y = 5$ 的 $x$ 值：
$$ x^5 + 2x^3 + 3x - 1 = 5 \implies x^5 + 2x^3 + 3x - 6 = 0 $$
觀察可發現當 $x=1$ 時，$1 + 2 + 3 - 6 = 0$，故 $x=1$ 是解。因為 $f'(x)>0$ 函數為遞增，所以這是唯一的實數解。
接著計算 $f'(x)$：
$$ f'(x) = 5x^4 + 6x^2 + 3 $$
代入 $x=1$：
$$ f'(1) = 5(1)^4 + 6(1)^2 + 3 = 14 $$
因此，$(f^{-1})'(5) = \frac{1}{f'(1)} = \frac{1}{14}$。

---

### **Question 5**
**解答：$\frac{1}{1+x^2}$**
**詳解**：
**方法一（直接微分）：**
使用連鎖律與除法規則：
$$ g'(x) = \frac{1}{1 + \left(\frac{1+x}{1-x}\right)^2} \cdot \frac{d}{dx}\left(\frac{1+x}{1-x}\right) $$
$$ = \frac{1}{\frac{(1-x)^2 + (1+x)^2}{(1-x)^2}} \cdot \frac{(1)(1-x) - (1+x)(-1)}{(1-x)^2} $$
$$ = \frac{(1-x)^2}{(1-x)^2 + (1+x)^2} \cdot \frac{1-x+1+x}{(1-x)^2} $$
$$ = \frac{2}{(1-2x+x^2) + (1+2x+x^2)} = \frac{2}{2+2x^2} = \frac{1}{1+x^2} $$
**方法二（三角代換）：**
令 $x = \tan \theta$，則 $\frac{1+x}{1-x} = \frac{1+\tan\theta}{1-\tan\theta} = \tan\left(\frac{\pi}{4} + \theta\right)$。
所以 $g(x) = \tan^{-1}\left( \tan\left(\frac{\pi}{4} + \theta\right) \right) = \frac{\pi}{4} + \theta = \frac{\pi}{4} + \tan^{-1} x$。
因此 $g'(x) = \frac{1}{1+x^2}$。

---

### **Question 6**
**解答：$2^{n-2} e^{2x} \left[ 4x^2 + 4nx + n(n-1) \right]$**
**詳解**：
根據萊布尼茲法則 (Leibniz Rule)：$(uv)^{(n)} = \sum_{k=0}^n \binom{n}{k} u^{(k)} v^{(n-k)}$。
令 $u(x) = x^2, v(x) = e^{2x}$。
因為 $u(x)$ 是二次多項式，其高於二階的導數均為 $0$：
$u^{(0)} = x^2, \quad u^{(1)} = 2x, \quad u^{(2)} = 2, \quad u^{(k)} = 0 \text{ for } k \ge 3$。
$v(x)$ 的各階導數為：$v^{(k)}(x) = 2^k e^{2x}$。
因此，級數只剩下前三項：
$$ h^{(n)}(x) = \binom{n}{0} (x^2) (2^n e^{2x}) + \binom{n}{1} (2x) (2^{n-1} e^{2x}) + \binom{n}{2} (2) (2^{n-2} e^{2x}) $$
$$ = e^{2x} \left[ 2^n x^2 + n(2x)(2^{n-1}) + \frac{n(n-1)}{2}(2)(2^{n-2}) \right] $$
提出公因式 $2^{n-2} e^{2x}$：
$$ = 2^{n-2} e^{2x} \left[ 4x^2 + 4nx + n(n-1) \right] $$

---

### **Question 7**
**解答：$\frac{15}{32}$**
**詳解**：
首先求一階導數 $\frac{dy}{dx}$：
$$ \frac{dx}{dt} = 2t, \quad \frac{dy}{dt} = 3t^2 - 3 $$
$$ \frac{dy}{dx} = \frac{\frac{dy}{dt}}{\frac{dx}{dt}} = \frac{3t^2 - 3}{2t} = \frac{3}{2}t - \frac{3}{2}t^{-1} $$
接著求二階導數 $\frac{d^2 y}{dx^2}$：
$$ \frac{d^2 y}{dx^2} = \frac{\frac{d}{dt}\left(\frac{dy}{dx}\right)}{\frac{dx}{dt}} $$
$$ \frac{d}{dt}\left(\frac{dy}{dx}\right) = \frac{d}{dt}\left(\frac{3}{2}t - \frac{3}{2}t^{-1}\right) = \frac{3}{2} + \frac{3}{2}t^{-2} = \frac{3}{2}\left(1 + \frac{1}{t^2}\right) = \frac{3(t^2+1)}{2t^2} $$
$$ \frac{d^2 y}{dx^2} = \frac{\frac{3(t^2+1)}{2t^2}}{2t} = \frac{3(t^2+1)}{4t^3} $$
將 $t=2$ 代入：
$$ \left. \frac{d^2 y}{dx^2} \right|_{t=2} = \frac{3(2^2+1)}{4(2^3)} = \frac{3(5)}{4(8)} = \frac{15}{32} $$

---

### **Question 8**
**解答：**
(a) 連續：$\lim_{x \to 0} x^2 \sin\left(\frac{1}{x}\right)$。因為 $-1 \le \sin\left(\frac{1}{x}\right) \le 1$，所以 $-x^2 \le x^2 \sin\left(\frac{1}{x}\right) \le x^2$。
由夾擠定理 (Squeeze Theorem)，當 $x \to 0$ 時極限為 $0$，等於 $f(0)$，故在 $x=0$ 連續。
(b) 可微：根據導數定義 $f'(0) = \lim_{h \to 0} \frac{f(h)-f(0)}{h} = \lim_{h \to 0} \frac{h^2 \sin(1/h) - 0}{h} = \lim_{h \to 0} h \sin\left(\frac{1}{h}\right)$。
同樣由夾擠定理 $-|h| \le h \sin\left(\frac{1}{h}\right) \le |h|$，極限為 $0$。故在 $x=0$ 可微且 $f'(0) = 0$。
(c) 不連續：當 $x \neq 0$ 時，使用乘法和連鎖律計算 $f'(x)$：
$$ f'(x) = 2x \sin\left(\frac{1}{x}\right) + x^2 \cos\left(\frac{1}{x}\right) \left(-\frac{1}{x^2}\right) = 2x \sin\left(\frac{1}{x}\right) - \cos\left(\frac{1}{x}\right) $$
探討 $\lim_{x \to 0} f'(x)$。前半部 $\lim_{x \to 0} 2x \sin(1/x) = 0$，但後半部 $\lim_{x \to 0} \cos(1/x)$ 不存在（會在 -1 到 1 之間震盪）。
因為極限 $\lim_{x \to 0} f'(x)$ 不存在，所以 $f'(x)$ 在 $x=0$ 處 **不連續**。
