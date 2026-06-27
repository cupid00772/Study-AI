# 國立臺灣聯合大學系統 114學年度 微積分 模擬試題 解答卷 (Answers 2)

**難易度分佈：** 包含 [Easy], [Medium], [Hard] 標籤。本卷針對**方向導數、Lagrange乘子法**加強出題。

---

### 甲、填充題：共 8 題，每題 8 分，共 64 分。

**1. Answer: `1/2`**
- **難度：** [Easy]
- **核心概念：** 羅必達法則 (L'Hôpital's Rule) 或 泰勒級數 (Taylor Series)。
- **解題步驟：**
  使用羅必達法則：$\lim_{x \to 0} \frac{e^x - 1}{2x}$ (0/0型)，再微一次 $\lim_{x \to 0} \frac{e^x}{2} = \frac{1}{2}$。
  或用泰勒級數：$e^x = 1 + x + \frac{x^2}{2!} + \dots$，代入得 $\lim_{x \to 0} \frac{\frac{x^2}{2!} + \dots}{x^2} = \frac{1}{2}$。

**2. Answer: `1/4`**
- **難度：** [Easy]
- **核心概念：** 變數代換積分法 (Integration by Substitution)。
- **解題步驟：**
  令 $u = \tan x \Rightarrow du = \sec^2 x dx$。
  當 $x=0, u=0$；$x=\pi/4, u=1$。
  $\int_0^1 u^3 du = \left[\frac{1}{4}u^4\right]_0^1 = \frac{1}{4}$。

**3. Answer: `\ln(\sqrt{2}+1)`**
- **難度：** [Medium]
- **核心概念：** 曲線弧長 (Arc Length)。
- **解題步驟：**
  $y' = \frac{-\sin x}{\cos x} = -\tan x$。
  $1 + (y')^2 = 1 + \tan^2 x = \sec^2 x$。
  弧長 $L = \int_0^{\pi/4} \sqrt{\sec^2 x} dx = \int_0^{\pi/4} \sec x dx$。
  積分結果為 $\left[\ln|\sec x + \tan x|\right]_0^{\pi/4} = \ln(\sqrt{2}+1) - \ln(1+0) = \ln(\sqrt{2}+1)$。

**4. Answer: `2/3`**
- **難度：** [Medium] (針對弱點)
- **核心概念：** 梯度 (Gradient) 與最大方向導數。
- **解題步驟：**
  求梯度：$\nabla f = \langle \frac{2x}{x^2+y^2+z^2}, \frac{2y}{x^2+y^2+z^2}, \frac{2z}{x^2+y^2+z^2} \rangle$。
  在 $P(1,-2,2)$ 處，$x^2+y^2+z^2 = 1+4+4 = 9$。
  $\nabla f(1,-2,2) = \langle \frac{2}{9}, \frac{-4}{9}, \frac{4}{9} \rangle$。
  最大變化率即為梯度向量的長度：$|\nabla f| = \frac{1}{9} \sqrt{2^2 + (-4)^2 + 4^2} = \frac{\sqrt{36}}{9} = \frac{6}{9} = \frac{2}{3}$。

**5. Answer: `\frac{1}{2}(1-\cos 1)`**
- **難度：** [Medium]
- **核心概念：** 二重積分 (Double Integral) 與 Fubini 定理。
- **解題步驟：**
  積分區域 $D$ 由 $y=0$ 到 $y=x^2$，$x$ 從 $0$ 到 $1$。
  $\int_0^1 \int_0^{x^2} x \cos(y) dy dx = \int_0^1 [x \sin(y)]_0^{x^2} dx = \int_0^1 x \sin(x^2) dx$。
  令 $u = x^2 \Rightarrow du = 2x dx$：
  $\frac{1}{2} \int_0^1 \sin(u) du = \frac{1}{2}[-\cos(u)]_0^1 = \frac{1}{2}(1 - \cos 1)$。

**6. Answer: `-1`**
- **難度：** [Medium]
- **核心概念：** 隱函數微分 (Implicit Differentiation)。
- **解題步驟：**
  令 $F(x,y,z) = x^2 + y^2 + z^2 - 3xyz = 0$。
  $\frac{\partial z}{\partial x} = -\frac{F_x}{F_z} = -\frac{2x - 3yz}{2z - 3xy}$。
  代入 $(1,1,1)$，得 $-\frac{2(1) - 3(1)(1)}{2(1) - 3(1)(1)} = -\frac{-1}{-1} = -1$。

**7. Answer: `5`**
- **難度：** [Easy]
- **核心概念：** 保守場與線積分基本定理 (Fundamental Theorem for Line Integrals)。
- **解題步驟：**
  判斷保守場：$P_y = 2x, Q_x = 2x$，因此是保守場。
  求位勢函數 $f(x,y)$ 使得 $\nabla f = \mathbf{F}$。
  $f_x = 2xy \Rightarrow f(x,y) = x^2y + g(y)$。
  $f_y = x^2 + g'(y) = x^2 + 3y^2 \Rightarrow g'(y) = 3y^2 \Rightarrow g(y) = y^3$。
  所以 $f(x,y) = x^2y + y^3$。
  線積分 $= f(2,1) - f(0,0) = (4(1) + 1^3) - 0 = 5$。

**8. Answer: `$\infty$`**
- **難度：** [Easy]
- **核心概念：** 冪級數的收斂半徑 (Radius of Convergence)、比值審斂法 (Ratio Test)。
- **解題步驟：**
  $\lim_{n \to \infty} \left| \frac{2^{n+1} x^{n+1}}{(n+1)!} \cdot \frac{n!}{2^n x^n} \right| = \lim_{n \to \infty} \left| \frac{2x}{n+1} \right| = 0$。
  因為極限值恆為 $0 < 1$，對所有實數 $x$ 皆收斂，故收斂半徑 $R = \infty$。

---

### 乙、計算、證明題：共 3 題，每題 12 分，共 36 分。

**1.** [Medium] (針對弱點：Lagrange Multipliers)
**解題步驟：**
1. 設目標函數 $f(x,y) = xy$，限制條件 $g(x,y) = \frac{x^2}{8} + \frac{y^2}{2} = 1$。
2. 建立 Lagrange 方程式 $\nabla f = \lambda \nabla g$：
   - $y = \lambda (\frac{x}{4})$  (1)
   - $x = \lambda y$  (2)
3. 將 (2) 代入 (1)：
   $y = \lambda (\frac{\lambda y}{4}) \Rightarrow y(1 - \frac{\lambda^2}{4}) = 0$。
4. 若 $y=0$，由 (2) 推得 $x=0$，但 $(0,0)$ 不滿足限制條件 $\frac{x^2}{8} + \frac{y^2}{2} = 1$，故捨棄。
5. 因此 $1 - \frac{\lambda^2}{4} = 0 \Rightarrow \lambda^2 = 4 \Rightarrow \lambda = \pm 2$。
6. 當 $\lambda = 2$ 時：$x = 2y$。代入限制條件：
   $\frac{(2y)^2}{8} + \frac{y^2}{2} = 1 \Rightarrow \frac{4y^2}{8} + \frac{y^2}{2} = 1 \Rightarrow \frac{y^2}{2} + \frac{y^2}{2} = 1 \Rightarrow y^2 = 1 \Rightarrow y = \pm 1$。
   對應的點為 $(2, 1)$ 與 $(-2, -1)$。此時函數值 $f = xy = 2$。
7. 當 $\lambda = -2$ 時：$x = -2y$。代入限制條件：
   $\frac{(-2y)^2}{8} + \frac{y^2}{2} = 1 \Rightarrow y^2 = 1 \Rightarrow y = \pm 1$。
   對應的點為 $(-2, 1)$ 與 $(2, -1)$。此時函數值 $f = xy = -2$。
8. 比較函數值：
   **Absolute maximum value is 2**
   **Absolute minimum value is -2**

**2.** [Medium]
**解題步驟：**
1. 此為瑕積分，寫成極限形式：$\lim_{t \to \infty} \int_1^t \frac{\ln x}{x^2} dx$。
2. 使用分部積分法 (Integration by Parts)：令 $u = \ln x, dv = \frac{1}{x^2} dx$。
   則 $du = \frac{1}{x} dx, v = -\frac{1}{x}$。
3. 原積分 $\int \frac{\ln x}{x^2} dx = -\frac{\ln x}{x} - \int (-\frac{1}{x^2}) dx = -\frac{\ln x}{x} - \frac{1}{x}$。
4. 代入上下界並取極限：
   $\lim_{t \to \infty} \left[ -\frac{\ln t}{t} - \frac{1}{t} \right] - \left( -\frac{\ln 1}{1} - \frac{1}{1} \right)$
5. 評估極限 $\lim_{t \to \infty} \frac{\ln t}{t}$，因爲是 $\frac{\infty}{\infty}$ 型，使用羅必達法則：
   $\lim_{t \to \infty} \frac{1/t}{1} = 0$。而 $\lim_{t \to \infty} \frac{1}{t} = 0$。
6. 最終結果：$(0 - 0) - (0 - 1) = 1$。
   因為積分值存在且為有限值，故此瑕積分**收斂 (Convergent)**，其值為 **1**。

**3.** [Easy]
**解題步驟：**
1. 觀察線積分形式 $\oint_C P dx + Q dy$，其中 $P = 3y - e^{\sin x}, Q = 7x + \sqrt{y^4+1}$。
2. 檢查 Green's Theorem 的條件：$P, Q$ 有連續的偏導數，且 $C$ 是一封閉、正向(逆時針)的曲線。
3. 計算偏導數：
   $\frac{\partial Q}{\partial x} = 7$
   $\frac{\partial P}{\partial y} = 3$
4. 應用 Green's Theorem：
   $\oint_C P dx + Q dy = \iint_D \left( \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} \right) dA = \iint_D (7 - 3) dA = \iint_D 4 dA$
5. 雙重積分 $\iint_D 4 dA$ 代表區域 $D$ 面積的 4 倍。
   區域 $D$ 是圓 $x^2+y^2=9$，半徑為 3，面積為 $\pi(3^2) = 9\pi$。
6. 計算結果：$4 \times 9\pi = 36\pi$。

---
### 配分建議與評分標準 (Marking Scheme)
- **甲、填充題 (64%)**：每題 8 分，錯一個字、符號或正負號皆全錯，無部分給分。
- **乙、計算、證明題 (36%)**：每題 12 分。
  - **題 1 (12%)**：列出 Lagrange 方程式得 4 分，推導出 $y(1-\lambda^2/4)=0$ 或 $\lambda=\pm 2$ 得 4 分，求出極大極小值各 2 分。
  - **題 2 (12%)**：正確使用分部積分積出不定積分得 5 分，寫出極限式並正確求得極限值得 5 分，給出結論(收斂及值為1)得 2 分。
  - **題 3 (12%)**：計算偏導數並列出 Green's Theorem 的雙重積分式得 6 分，算出面積及最終答案得 6 分。

---
> 💡 **考後檢討互動：**
> 這份考卷特別為你設計了一題 2D 的 Lagrange 題目，幫助你重新熟悉這個方法的運作！寫完後一樣告訴我錯了哪裡，我們繼續突破！
