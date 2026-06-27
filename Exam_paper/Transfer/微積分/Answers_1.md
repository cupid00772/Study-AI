# 國立臺灣聯合大學系統 114學年度 微積分 模擬試題 解答卷 (Answers 1)

**難易度分佈：** 包含 [Easy], [Medium], [Hard] 標籤。

---

### 甲、填充題：共 8 題，每題 8 分，共 64 分。

**1. Answer: `1/3`**
- **難度：** [Easy]
- **核心概念：** 羅必達法則 (L'Hôpital's Rule)、微積分基本定理 (Fundamental Theorem of Calculus)。
- **解題步驟：**
  1. 帶入 $x=0$，得到 $\frac{0}{0}$ 的未定型。
  2. 使用羅必達法則，對分子分母分別微分：
     $$ \lim_{x \rightarrow 0} \frac{\frac{d}{dx}\int_{0}^{x} t \sin(t) d t}{\frac{d}{dx}(x^3)} = \lim_{x \rightarrow 0} \frac{x \sin(x)}{3x^2} $$
  3. 化簡得 $\lim_{x \rightarrow 0} \frac{\sin(x)}{3x} = \frac{1}{3} \lim_{x \rightarrow 0} \frac{\sin(x)}{x} = \frac{1}{3} \cdot 1 = \frac{1}{3}$。
- **常見錯誤陷阱：** 忘記微積分基本定理的用法，或是微分時少算 $t$ 變成 $x$ 的那一次方。

**2. Answer: `1/4`**
- **難度：** [Medium]
- **核心概念：** 瑕積分 (Improper Integral)、分部積分 (Integration by Parts) 或 Gamma 函數。
- **解題步驟：**
  1. 方法一：連續使用兩次分部積分法 $\int u dv = uv - \int v du$。
  2. 方法二（推薦）：使用變數代換 $u = 2x \Rightarrow dx = \frac{1}{2} du$，當 $x \to \infty, u \to \infty$。
     $$ \int_{0}^{\infty} \left(\frac{u}{2}\right)^2 e^{-u} \frac{1}{2} du = \frac{1}{8} \int_{0}^{\infty} u^2 e^{-u} du $$
  3. 利用 Gamma 函數 $\Gamma(n) = \int_0^\infty t^{n-1} e^{-t} dt = (n-1)!$，此處 $n=3$：
     $$ \frac{1}{8} \Gamma(3) = \frac{1}{8} \cdot 2! = \frac{1}{4} $$。

**3. Answer: `\sqrt{3}(e^\pi - 1)`**
- **難度：** [Medium]
- **核心概念：** 空間曲線的弧長 (Arc Length of Space Curve)。
- **解題步驟：**
  1. 曲線方程式為 $\mathbf{r}(t) = \langle e^t \cos t, e^t \sin t, e^t \rangle$。
  2. 求導數 $\mathbf{r}'(t) = \langle e^t(\cos t - \sin t), e^t(\sin t + \cos t), e^t \rangle$。
  3. 計算長度平方 $|\mathbf{r}'(t)|^2 = e^{2t}[(\cos t - \sin t)^2 + (\sin t + \cos t)^2 + 1] = e^{2t}[(\cos^2t-2\sin t\cos t+\sin^2t) + (\sin^2t+2\sin t\cos t+\cos^2t) + 1] = e^{2t}[1 + 1 + 1] = 3e^{2t}$。
  4. 弧長 $L = \int_0^\pi |\mathbf{r}'(t)| dt = \int_0^\pi \sqrt{3}e^t dt = \sqrt{3}[e^t]_0^\pi = \sqrt{3}(e^\pi - 1)$。
- **常見錯誤陷阱：** 對乘積法則微分時出錯，或化簡三角函數平方和時忘記加上 $z$ 分量的 $1$。

**4. Answer: `\frac{\pi}{4}(1 - e^{-4})`**
- **難度：** [Easy]
- **核心概念：** 重積分的極座標變換 (Polar Coordinates)。
- **解題步驟：**
  1. 積分區域 $D$ 是第一象限半徑為 2 的四分之一圓。極座標範圍：$0 \le r \le 2$，$0 \le \theta \le \pi/2$。
  2. 轉換為極座標，記得乘上 Jacobian 行列式 $r$：
     $$ \iint_{D} e^{-x^2-y^2} dA = \int_0^{\pi/2} \int_0^2 e^{-r^2} r dr d\theta $$
  3. 內層積分：設 $u = -r^2 \Rightarrow du = -2r dr$。
     $$ \int_0^2 e^{-r^2} r dr = \left[-\frac{1}{2} e^{-r^2}\right]_0^2 = -\frac{1}{2}(e^{-4} - 1) = \frac{1}{2}(1 - e^{-4}) $$
  4. 外層積分：$\int_0^{\pi/2} \frac{1}{2}(1 - e^{-4}) d\theta = \frac{\pi}{4}(1 - e^{-4})$。

**5. Answer: `19/3`**
- **難度：** [Medium]
- **核心概念：** 方向導數 (Directional Derivative)、梯度向量 (Gradient Vector)。
- **解題步驟：**
  1. 求梯度 $\nabla f(x, y, z) = \langle 2xy, x^2+2yz, y^2 \rangle$。
  2. 代入點 $P(1, 2, -1)$ 得 $\nabla f(1, 2, -1) = \langle 2(1)(2), 1^2+2(2)(-1), 2^2 \rangle = \langle 4, -3, 4 \rangle$。
  3. 將方向向量 $\mathbf{v}$ 單位化：$|\mathbf{v}| = \sqrt{2^2 + (-1)^2 + 2^2} = \sqrt{9} = 3$。單位向量 $\mathbf{u} = \langle 2/3, -1/3, 2/3 \rangle$。
  4. 方向導數 $D_{\mathbf{u}}f = \nabla f \cdot \mathbf{u} = 4(2/3) + (-3)(-1/3) + 4(2/3) = \frac{8}{3} + \frac{3}{3} + \frac{8}{3} = \frac{19}{3}$。
- **常見錯誤陷阱：** 忘記將方向向量 $\mathbf{v}$ 標準化為單位向量 $\mathbf{u}$。

**6. Answer: `2`**
- **難度：** [Medium]
- **核心概念：** 線積分的保守場 (Conservative Vector Field) 與位勢函數 (Potential Function)。
- **解題步驟：**
  1. 觀察向量場 $\mathbf{F}(x,y) = \langle y^2 + 2xy, x^2 + 2xy \rangle = \langle P, Q \rangle$。
  2. 檢查是否保守：$P_y = 2y + 2x$, $Q_x = 2x + 2y \Rightarrow P_y = Q_x$，故為保守場。
  3. 尋找位勢函數 $f(x,y)$ 使得 $\nabla f = \mathbf{F}$：
     $f_x = y^2 + 2xy \Rightarrow f(x,y) = xy^2 + x^2y + g(y)$。
     對 $y$ 偏微：$f_y = 2xy + x^2 + g'(y)$。對照 $Q$ 得 $g'(y) = 0 \Rightarrow g(y) = C$。
     取 $f(x,y) = xy^2 + x^2y$。
  4. 根據線積分基本定理：$\int_C \mathbf{F} \cdot d\mathbf{r} = f(1,1) - f(0,0) = (1+1) - 0 = 2$。

**7. Answer: `2`**
- **難度：** [Hard]
- **核心概念：** 雙變數函數的局部極值 (Local Extrema) 與二階導數測試 (Second Derivative Test)。
- **解題步驟：**
  1. 找臨界點 (Critical points)：
     $f_x = 3x^2 - 3 + 3y^2 = 0 \Rightarrow x^2+y^2=1$
     $f_y = 6xy = 0 \Rightarrow x=0$ 或 $y=0$
  2. 若 $x=0$，則 $0^2+y^2=1 \Rightarrow y=\pm1$。得到臨界點 $(0,1), (0,-1)$。
     若 $y=0$，則 $x^2+0^2=1 \Rightarrow x=\pm1$。得到臨界點 $(1,0), (-1,0)$。
  3. 二階導數：$f_{xx} = 6x, f_{yy} = 6x, f_{xy} = 6y$。判別式 $D = f_{xx}f_{yy} - (f_{xy})^2 = (6x)(6x) - (6y)^2 = 36(x^2-y^2)$。
  4. 測試各點：
     $(0,1): D = -36 < 0$ (鞍點 Saddle point)
     $(0,-1): D = -36 < 0$ (鞍點 Saddle point)
     $(1,0): D = 36 > 0$ 且 $f_{xx} = 6 > 0$ (局部極小值 Local minimum)
     $(-1,0): D = 36 > 0$ 且 $f_{xx} = -6 < 0$ (局部極大值 Local maximum)
  5. 題目求 local maximum value：$f(-1,0) = (-1)^3 - 3(-1) + 3(-1)(0)^2 = -1 + 3 = 2$。

**8. Answer: `17\pi/8`**
- **難度：** [Medium]
- **核心概念：** 三重積分與柱狀座標 (Cylindrical Coordinates)。
- **解題步驟：**
  1. 將積分區域 $E$ 轉換為柱狀座標：底面為 $x^2+y^2 \le 1$ ($0 \le r \le 1, 0 \le \theta \le 2\pi$)，高度為 $0 \le z \le x+2 \Rightarrow 0 \le z \le r\cos\theta+2$。
  2. 積分式：$\int_0^{2\pi} \int_0^1 \int_0^{r\cos\theta+2} z dz \cdot r dr d\theta$。
  3. 對 $z$ 積分：$\int_0^{r\cos\theta+2} z dz = \frac{1}{2}(r\cos\theta+2)^2$。
  4. 展開平方：$\frac{1}{2}(r^2\cos^2\theta + 4r\cos\theta + 4)$。
  5. 對 $\theta$ 積分：由於 $\int_0^{2\pi} \cos\theta d\theta = 0$ 且 $\int_0^{2\pi} \cos^2\theta d\theta = \pi$，可得：
     $\frac{1}{2} \int_0^{2\pi} (r^2\cos^2\theta + 4r\cos\theta + 4) d\theta = \frac{1}{2} (r^2\pi + 0 + 4(2\pi)) = \frac{\pi r^2}{2} + 4\pi$。
  6. 對 $r$ 積分並別忘了外層還有一個 Jacobian $r$（剛剛還沒乘進去）：
     前述是對 $\frac{1}{2}(r\cos\theta+2)^2$ 積分，別忘記體積元素是 $r dz dr d\theta$。
     重新對齊：$ \int_0^1 \int_0^{2\pi} \frac{1}{2}(r\cos\theta+2)^2 r d\theta dr $
     對 $\theta$ 的積分 $\int_0^{2\pi} (r^2\cos^2\theta + 4r\cos\theta + 4) d\theta = \pi r^2 + 8\pi$。
     最後對 $r$ 積分：$ \frac{1}{2} \int_0^1 (\pi r^3 + 8\pi r) dr = \frac{1}{2} \left[ \frac{\pi r^4}{4} + 4\pi r^2 \right]_0^1 = \frac{1}{2} \left( \frac{\pi}{4} + 4\pi \right) = \frac{1}{2} \left( \frac{17\pi}{4} \right) = \frac{17\pi}{8} $。

---

### 乙、計算、證明題：共 3 題，每題 12 分，共 36 分。

**1. (a)** [Medium]
**解題步驟：**
1. 設 $a_n = \frac{(-1)^n (x-2)^n}{n 3^n}$。使用比值審斂法 (Ratio Test)：
   $$ \lim_{n \to \infty} \left| \frac{a_{n+1}}{a_n} \right| = \lim_{n \to \infty} \left| \frac{(x-2)^{n+1}}{(n+1)3^{n+1}} \cdot \frac{n 3^n}{(x-2)^n} \right| = \lim_{n \to \infty} \left| \frac{x-2}{3} \cdot \frac{n}{n+1} \right| = \frac{|x-2|}{3} $$
2. 收斂條件為 $\frac{|x-2|}{3} < 1 \Rightarrow |x-2| < 3$。所以**收斂半徑 $R = 3$**。
3. 檢查端點：$|x-2| = 3 \Rightarrow x = -1$ 或 $x = 5$。
   - 當 $x=5$：級數為 $\sum_{n=1}^\infty \frac{(-1)^n 3^n}{n 3^n} = \sum_{n=1}^\infty \frac{(-1)^n}{n}$。這是交錯調和級數，由交錯級數審斂法可知**收斂**。
   - 當 $x=-1$：級數為 $\sum_{n=1}^\infty \frac{(-1)^n (-3)^n}{n 3^n} = \sum_{n=1}^\infty \frac{(-1)^n (-1)^n 3^n}{n 3^n} = \sum_{n=1}^\infty \frac{1}{n}$。這是調和級數 (p=1)，**發散**。
4. **收斂區間 (Interval of Convergence) 為 $(-1, 5]$**。

**1. (b)** [Easy]
**解題步驟：**
1. 考慮積分審斂法 (Integral Test)。令 $f(x) = \frac{1}{x \ln x}$，在 $[2, \infty)$ 上連續、正值且遞減。
2. 評估瑕積分：
   $$ \int_2^\infty \frac{1}{x \ln x} dx = \lim_{t \to \infty} \int_2^t \frac{1}{x \ln x} dx $$
3. 令 $u = \ln x \Rightarrow du = \frac{1}{x} dx$：
   $$ \lim_{t \to \infty} \int_{\ln 2}^{\ln t} \frac{1}{u} du = \lim_{t \to \infty} \left[ \ln|u| \right]_{\ln 2}^{\ln t} = \lim_{t \to \infty} (\ln(\ln t) - \ln(\ln 2)) = \infty $$
4. 積分發散，故原級數**發散 (Divergent)**。

**2. (a)** [Medium]
**解題步驟：**
1. 要證明極限不存在，可從不同路徑逼近 $(0,0)$。
2. 沿路徑 $y=x$ 逼近：
   $$ \lim_{x \to 0} \frac{x^2 x^2}{x^4 + x^4} = \lim_{x \to 0} \frac{x^4}{2x^4} = \frac{1}{2} $$
3. 沿路徑 $y=0$ 逼近：
   $$ \lim_{x \to 0} \frac{x^2 (0)}{x^4 + 0} = \lim_{x \to 0} 0 = 0 $$
4. 由於不同路徑得到不同的極限值（$1/2 \neq 0$），所以 $\lim_{(x,y) \to (0,0)} f(x,y)$ 不存在。
5. 極限不存在即代表 $f(x,y)$ 在 $(0,0)$ 不連續。

**2. (b)** [Medium]
**解題步驟：**
1. 依據偏導數的定義：
   $$ f_x(0,0) = \lim_{h \to 0} \frac{f(h, 0) - f(0,0)}{h} $$
2. 代入函數定義，$f(h, 0) = \frac{h^2 \cdot 0^2}{h^4 + 0^4} = 0$。
   $$ f_x(0,0) = \lim_{h \to 0} \frac{0 - 0}{h} = 0 $$
3. 同理，對於 $y$：
   $$ f_y(0,0) = \lim_{k \to 0} \frac{f(0, k) - f(0,0)}{k} = \lim_{k \to 0} \frac{0 - 0}{k} = 0 $$
4. 得 $f_x(0,0) = 0, f_y(0,0) = 0$。

**3.** [Hard]
**核心概念：** 拉格朗日乘子法 (Lagrange Multipliers)。
**解題步驟：**
1. 設目標函數 $f(x,y,z) = x+2y-z$，限制條件 $g(x,y,z) = x^2+y^2+2z^2 = 8$。
2. 建立方程式 $\nabla f = \lambda \nabla g$ 與 $g(x,y,z)=8$：
   - $1 = \lambda (2x) \Rightarrow x = \frac{1}{2\lambda}$
   - $2 = \lambda (2y) \Rightarrow y = \frac{1}{\lambda}$
   - $-1 = \lambda (4z) \Rightarrow z = -\frac{1}{4\lambda}$
3. 將上述 $x,y,z$ 代入限制條件：
   $$ \left(\frac{1}{2\lambda}\right)^2 + \left(\frac{1}{\lambda}\right)^2 + 2\left(-\frac{1}{4\lambda}\right)^2 = 8 $$
   $$ \frac{1}{4\lambda^2} + \frac{1}{\lambda^2} + 2\left(\frac{1}{16\lambda^2}\right) = 8 $$
   $$ \frac{4 + 16 + 2}{16\lambda^2} = 8 \Rightarrow \frac{22}{16\lambda^2} = 8 \Rightarrow \frac{11}{8\lambda^2} = 8 \Rightarrow \lambda^2 = \frac{11}{64} \Rightarrow \lambda = \pm \frac{\sqrt{11}}{8} $$
4. 代回求解極值點與極值：
   - 當 $\lambda = \frac{\sqrt{11}}{8}$ 時：$x = \frac{4}{\sqrt{11}}, y = \frac{8}{\sqrt{11}}, z = -\frac{2}{\sqrt{11}}$。
     極大值 $f = x+2y-z = \frac{4}{\sqrt{11}} + \frac{16}{\sqrt{11}} - \left(-\frac{2}{\sqrt{11}}\right) = \frac{22}{\sqrt{11}} = 2\sqrt{11}$。
   - 當 $\lambda = -\frac{\sqrt{11}}{8}$ 時：$x = -\frac{4}{\sqrt{11}}, y = -\frac{8}{\sqrt{11}}, z = \frac{2}{\sqrt{11}}$。
     極小值 $f = x+2y-z = -\frac{4}{\sqrt{11}} - \frac{16}{\sqrt{11}} - \frac{2}{\sqrt{11}} = -\frac{22}{\sqrt{11}} = -2\sqrt{11}$。
5. **Absolute maximum value: $2\sqrt{11}$**
   **Absolute minimum value: $-2\sqrt{11}$**

---

### 配分建議與評分標準 (Marking Scheme)
- **甲、填充題 (64%)**：每題 8 分，錯一個字、符號或正負號皆全錯，無部分給分。
- **乙、計算、證明題 (36%)**：每題 12 分。
  - **題 1 (12%)**：(a) 收斂半徑 3 分，收斂區間 3 分。(b) 判別正確 2 分，說明理由完整 4 分。
  - **題 2 (12%)**：(a) 舉出兩個不同路徑得不同極限 6 分。(b) 偏導數定義式寫出各得 2 分，求得正確值各得 1 分。
  - **題 3 (12%)**：列出 Lagrange 方程式得 4 分，解出 $\lambda$ 或 $x,y,z$ 關係得 4 分，最後求得正確極大極小值各得 2 分。

---
> 💡 **考後檢討互動：**
> 如果你寫完了這份考卷並核對完解答，請告訴我：「你錯了哪幾題？具體遇到了什麼問題或卡在哪個觀念？」我會幫你釐清弱點，作為下次出題的參考！
