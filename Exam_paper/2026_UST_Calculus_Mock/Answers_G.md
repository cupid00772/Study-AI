# 2026 台聯大微積分模擬考 (UST Calculus Mock Exam - Targeted G) - 解答與評分標準

## 🎯 考點分佈總表與預期能力分析

本卷專為你指定的弱點與進階題型（複雜的極限、旋轉體積、表面積）所設計：
1. **複雜極限 ($1^\infty$ 型與羅必達法則)**：多次運用羅必達法則與對數極限的計算技巧 (甲-1)。
2. **複雜極限 (黎曼和轉定積分)**：觀察數列極限並轉化為積分，考驗對基本定義的熟悉度 (甲-2)。
3. **複雜極限 (微積分基本定理與 L'Hopital)**：將積分型極限與泰勒展開/羅必達法則結合 (甲-3)。
4. **表面積 (曲面方程式)**：利用雙重積分與曲面面積公式 $\iint \sqrt{1+f_x^2+f_y^2} dA$ 計算拋物面 (甲-4)。
5. **旋轉體積 (Washer Method)**：繞非座標軸的水平線旋轉，考驗外半徑與內半徑的設定 (乙-1)。
6. **複雜表面積 (Viviani's Curve 相關)**：求球面在圓柱面內部的表面積，考驗極座標轉換與對稱性觀察 (乙-2)。

---

## 甲、填充題 (每題 15 分，共 60 分)

### 1. 
**[難度: Hard]**
**[解題步驟]**
這是 $1^\infty$ 型不定式極限。令 $y = \left( \frac{\sin x}{x} \right)^{\frac{1}{x^2}}$，兩邊取自然對數：
$\ln y = \frac{1}{x^2} \ln\left( \frac{\sin x}{x} \right)$
要求 $\lim_{x \to 0} \ln y = \lim_{x \to 0} \frac{\ln(\sin x) - \ln x}{x^2}$。
這是一個 $\frac{0}{0}$ 型極限，使用羅必達法則 (L'Hopital's Rule)：
(第 1 次 L'H): $\lim_{x \to 0} \frac{\frac{\cos x}{\sin x} - \frac{1}{x}}{2x} = \lim_{x \to 0} \frac{x \cos x - \sin x}{2x^2 \sin x}$
(這仍然是 $\frac{0}{0}$，繼續第 2 次 L'H): 
分子微分：$\cos x - x \sin x - \cos x = -x \sin x$
分母微分：$4x \sin x + 2x^2 \cos x$
所以式子變為：$\lim_{x \to 0} \frac{-x \sin x}{4x \sin x + 2x^2 \cos x}$。
分子分母同除以 $x$ (因為 $x \neq 0$)：
$\lim_{x \to 0} \frac{-\sin x}{4\sin x + 2x \cos x}$
(還是 $\frac{0}{0}$，使用第 3 次 L'H):
$\lim_{x \to 0} \frac{-\cos x}{4\cos x + 2\cos x - 2x\sin x} = \frac{-1}{4(1) + 2(1) - 0} = -\frac{1}{6}$。
既然 $\lim_{x \to 0} \ln y = -\frac{1}{6}$，因此原極限 $\lim_{x \to 0} y = e^{-1/6}$。
*(另解：可用泰勒展開式 $\sin x \approx x - \frac{x^3}{6}$ 求解會更快。)*
**[答案]** $e^{-1/6}$

### 2. 
**[難度: Medium]**
**[解題步驟]**
將極限式改寫為黎曼和 (Riemann Sum) 的形式：
$\sum_{i=1}^n \frac{i^3}{n^4 + i^4} = \sum_{i=1}^n \frac{(i/n)^3 n^3}{n^4(1 + (i/n)^4)} = \sum_{i=1}^n \frac{1}{n} \cdot \frac{(i/n)^3}{1 + (i/n)^4}$
當 $n \to \infty$ 時，這正是函數 $f(x) = \frac{x^3}{1+x^4}$ 在區間 $[0, 1]$ 上的定積分。
原式 $= \int_0^1 \frac{x^3}{1+x^4} dx$
令 $u = 1+x^4$，$du = 4x^3 dx \Rightarrow x^3 dx = \frac{1}{4} du$。
積分範圍：$x=0 \Rightarrow u=1$；$x=1 \Rightarrow u=2$。
$= \frac{1}{4} \int_1^2 \frac{1}{u} du = \frac{1}{4} [\ln |u|]_1^2 = \frac{1}{4} (\ln 2 - \ln 1) = \frac{1}{4} \ln 2$。
**[答案]** $\frac{1}{4} \ln 2$ (或 $\ln(2^{1/4})$)

### 3. 
**[難度: Hard]**
**[解題步驟]**
代入 $x=0$ 得 $\frac{0}{0}$ 型，使用微積分第一基本定理與羅必達法則：
$\lim_{x \to 0^+} \frac{\frac{d}{dx} \int_0^{x^2} (e^t - 1) dt}{\frac{d}{dx} (x^3 \sin x)}$
分子為：$(e^{x^2} - 1) \cdot 2x$
分母為：$3x^2 \sin x + x^3 \cos x$
原極限 $= \lim_{x \to 0^+} \frac{2x(e^{x^2} - 1)}{x^3(3 \frac{\sin x}{x} + \cos x)} = \lim_{x \to 0^+} \frac{2(e^{x^2} - 1)/x^2}{3 \frac{\sin x}{x} + \cos x}$
我們知道 $\lim_{x \to 0} \frac{\sin x}{x} = 1$，且 $\cos(0) = 1$。
對於分子，可再用一次羅必達或代換 $u=x^2$：$\lim_{u \to 0} \frac{e^u - 1}{u} = 1$。
所以極限值為 $\frac{2(1)}{3(1) + 1} = \frac{2}{4} = \frac{1}{2}$。
**[答案]** $\frac{1}{2}$

### 4. 
**[難度: Medium]**
**[解題步驟]**
曲面為 $z = f(x,y) = x^2 + y^2$。偏微分為 $f_x = 2x, f_y = 2y$。
面積分元素 $dS = \sqrt{1 + f_x^2 + f_y^2} dA = \sqrt{1 + 4x^2 + 4y^2} dA$。
曲面在 $z=4$ 下方，其投影至 $xy$ 平面的區域 $D$ 是圓盤 $x^2 + y^2 \le 4$ (半徑 $r=2$)。
表面積 $S = \iint_D \sqrt{1+4(x^2+y^2)} dA$。
使用極座標轉換：$x^2+y^2=r^2, dA = r dr d\theta$。
$S = \int_0^{2\pi} \int_0^2 \sqrt{1+4r^2} r dr d\theta$
$= 2\pi \int_0^2 \sqrt{1+4r^2} r dr$
令 $u = 1+4r^2 \Rightarrow du = 8r dr \Rightarrow r dr = \frac{1}{8} du$。
當 $r=0, u=1$；當 $r=2, u=17$。
$S = 2\pi \cdot \frac{1}{8} \int_1^{17} u^{1/2} du = \frac{\pi}{4} \left[ \frac{2}{3} u^{3/2} \right]_1^{17} = \frac{\pi}{6} (17^{3/2} - 1) = \frac{\pi}{6}(17\sqrt{17} - 1)$。
**[答案]** $\frac{\pi}{6}(17\sqrt{17} - 1)$

---

## 乙、計算、證明題 (每題 20 分，共 40 分)

### 1. 
**[難度: Medium]**
**[解題步驟]**
**(1) 確定旋轉區域與方法：**
區域由 $y=e^x$ (上方)、$y=0$ (下方)、$x=0$、$x=1$ 所包圍。旋轉軸為水平線 $y=-1$。
由於旋轉軸是水平的，且我們知道上下邊界是 $x$ 的函數，使用**圓環法 (Washer Method)** 最為直接。積分變數為 $dx$。
**(2) 找出外半徑與內半徑：**
對於區間 $[0, 1]$ 內的每一個 $x$，
外半徑 $R(x)$ 是從旋轉軸 $y=-1$ 到外層邊界 $y=e^x$ 的距離：
$R(x) = e^x - (-1) = e^x + 1$
內半徑 $r(x)$ 是從旋轉軸 $y=-1$ 到內層邊界 $y=0$ 的距離：
$r(x) = 0 - (-1) = 1$
**(3) 設立積分式：**
$V = \pi \int_0^1 [ (R(x))^2 - (r(x))^2 ] dx = \pi \int_0^1 [ (e^x + 1)^2 - 1^2 ] dx$
**(4) 展開並積分：**
$V = \pi \int_0^1 (e^{2x} + 2e^x + 1 - 1) dx = \pi \int_0^1 (e^{2x} + 2e^x) dx$
$= \pi \left[ \frac{1}{2} e^{2x} + 2e^x \right]_0^1$
代入上下限：
上限 $(x=1)$： $\frac{1}{2} e^2 + 2e$
下限 $(x=0)$： $\frac{1}{2} e^0 + 2e^0 = \frac{1}{2} + 2 = \frac{5}{2}$
$V = \pi \left( \frac{1}{2} e^2 + 2e - \frac{5}{2} \right)$。

**[答案]** $V = \pi (\frac{1}{2} e^2 + 2e - \frac{5}{2})$

### 2. 
**[難度: Hard]**
**[解題步驟]**
**(1) 了解幾何形狀與對稱性：**
要求的是球面 $x^2+y^2+z^2=a^2$ 落在圓柱 $x^2+y^2=ax$ 內部的表面積。
由對稱性可知，該表面積在上半部 ($z>0$) 與下半部 ($z<0$) 相等；同時對於 $x$ 軸上下 ($y>0$ 與 $y<0$) 也是對稱的。
我們可以計算第一卦限 (First Octant, $x>0, y>0, z>0$) 的表面積，最後再乘以 $4$ 即可。
**(2) 設定曲面函數：**
在上半部，球面方程式為 $z = \sqrt{a^2 - x^2 - y^2}$。
計算偏導數：$z_x = \frac{-x}{\sqrt{a^2-x^2-y^2}}$, $z_y = \frac{-y}{\sqrt{a^2-x^2-y^2}}$。
表面積元素：$dS = \sqrt{1 + z_x^2 + z_y^2} dA = \sqrt{1 + \frac{x^2+y^2}{a^2-x^2-y^2}} dA = \frac{a}{\sqrt{a^2-x^2-y^2}} dA$。
**(3) 定義積分區域 $D$ (極座標)：**
積分區域 $D$ 在 $xy$ 平面是由圓柱 $x^2+y^2 \le ax$ 決定的。
轉換為極座標：$r^2 \le a (r \cos \theta) \Rightarrow 0 \le r \le a \cos \theta$。
在第一卦限內，$\theta$ 的範圍是 $0 \le \theta \le \frac{\pi}{2}$。
**(4) 計算雙重積分：**
第一卦限表面積 $S_1 = \int_0^{\pi/2} \int_0^{a\cos\theta} \frac{a}{\sqrt{a^2-r^2}} r dr d\theta$。
先對 $r$ 積分：$\int \frac{r}{\sqrt{a^2-r^2}} dr = -\sqrt{a^2-r^2}$。
$\left[ -\sqrt{a^2-r^2} \right]_0^{a\cos\theta} = -\sqrt{a^2 - a^2\cos^2\theta} - (-\sqrt{a^2})$
$= -a\sqrt{1-\cos^2\theta} + a = -a\sin\theta + a = a(1 - \sin\theta)$ (因為 $\theta \in [0, \pi/2]$，所以 $\sin\theta \ge 0$)
代回外層積分：
$S_1 = \int_0^{\pi/2} a \cdot a(1 - \sin\theta) d\theta = a^2 \int_0^{\pi/2} (1 - \sin\theta) d\theta$
$S_1 = a^2 \left[ \theta + \cos\theta \right]_0^{\pi/2} = a^2 ( (\frac{\pi}{2} + 0) - (0 + 1) ) = a^2 (\frac{\pi}{2} - 1)$。
總表面積 $S = 4 \times S_1 = 4a^2 (\frac{\pi}{2} - 1) = 2a^2(\pi - 2)$。

**[答案]** $S = 2a^2(\pi - 2)$

---
*考後分析提醒：對完答案後，請誠實告訴我你錯了哪些題目，或者是哪個步驟卡住了？我會為你做針對性解析！*
