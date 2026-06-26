# 微積分 錯題與觀念復盤 (Calculus Review)

此檔案用於紀錄每次模擬考與練習題的錯題復盤、核心觀念釐清與速記公式，以便考前快速複習。

---

## Mock Exam F 復盤 (2026-06-20)

### 📌 考場失誤紀錄：梯度與方向導數代值計算

- **錯誤點**：在計算最大變動率與梯度方向時，將題目給定的座標點 $(1, 2, 1/2)$ 誤抄為 $(2, 1, 1/2)$。
- **提醒**：在考場上若遇到多變數函數 $f(x,y,z)$ 代入座標點時，請務必再三核對 $(x,y,z)$ 的對應位置，避免因粗心而失分。該題型觀念上無盲區，純屬抄寫失誤，下次多加注意即可。

---

## Mock Exam G 復盤 (2026-06-20)

### 📌 複雜極限求法：局部代入極限值的危險性 (L'Hopital 陷阱)

- **錯誤點**：在處理 $\frac{0}{0}$ 型極限時，於運算中途將局部的 $\frac{\sin x}{x}$ 視為 $1$，導致算式直接變形為 $\cos x - 1$。
- **觀念釐清**：
  - **極限不可局部求值**：在一個包含加減運算的複合式中，**絕對不能**只對其中一部分（如 $\frac{\sin x}{x}$）先取極限並代入常數，而保留其他變數 $x$ 繼續算。這會破壞原本無窮小的階次（Order of magnitude），導致結果完全錯誤。只有在「純乘除」的獨立因式且其極限不為 $0$ 時，才能提前代入極限值。
  - **安全做法**：遇到需要多次羅必達法則的複雜極限時，若微分離譜，請優先改用**泰勒展開式 (Taylor Series)**。例如 $\sin x \approx x - \frac{x^3}{6}$，代入原式後透過比較最低次方係數來求解，往往比連續微分更安全、精準。

### 📌 空間幾何表面積：全方位對稱性檢查 (Viviani's Curve 題型)

- **錯誤點**：計算球面 $x^2+y^2+z^2=a^2$ 落在圓柱 $x^2+y^2=ax$ 內部的表面積時，只計算了 $z \ge 0$ 的上半部表面積，忘記空間立體包含上下卦限。
- **觀念釐清**：
  - **多重卦限檢查**：當題目給定完整曲面方程式而沒有額外加上 $z \ge 0$ 的限制條件時，立體圖形必然穿過 $xy$ 平面，存在上下兩半部。
  - **對稱性 SOP 拆解**：
    1. **$z$ 軸對稱性**：上半球與下半球完全對稱 $\rightarrow$ 面積需 $\times 2$。
    2. **$xy$ 平面對稱性**：圓柱 $x^2+y^2=ax$ 在極座標為 $r = a\cos\theta$，其圖形跨越第一 ($y>0$) 與第四 ($y<0$) 象限，對 $x$ 軸對稱 $\rightarrow$ 面積需再 $\times 2$。
    3. **結論**：若為求簡化計算，只取第一卦限（First Octant, $x,y,z \ge 0$）進行雙重積分，最後**務必乘以 4** 才會是正確的總表面積。

---

## 📌 核心觀念：旋轉體表面積 (Surface Area of Revolution)

旋轉體表面積的核心概念是將曲線切成無限多段極短的弧長 $ds$，每一小段弧長繞軸旋轉會形成一個圓柱側面的微小圓環帶（Frustum of a cone），其表面積為 $2\pi R \, ds$，其中 $R$ 為該弧段到旋轉軸的垂直距離。

**通用公式：** 

$$
S = \int 2\pi R \, ds
$$

### 1. 繞 $x$ 軸旋轉 ($x$-axis)

此時旋轉半徑 $R = |y|$。

* **(a) 卡氏座標 $y=f(x)$**, $a \le x \le b$

  $$
  ds = \sqrt{1 + [f'(x)]^2} \, dx
  $$

  $$
  S = \int_a^b 2\pi |f(x)| \sqrt{1 + [f'(x)]^2} \, dx
  $$
* **(b) 卡氏座標 $x=g(y)$**, $c \le y \le d$

  $$
  ds = \sqrt{1 + [g'(y)]^2} \, dy
  $$

  $$
  S = \int_c^d 2\pi |y| \sqrt{1 + [g'(y)]^2} \, dy
  $$
* **(c) 參數式 $x=x(t), y=y(t)$**, $\alpha \le t \le \beta$

  $$
  ds = \sqrt{[x'(t)]^2 + [y'(t)]^2} \, dt
  $$

  $$
  S = \int_\alpha^\beta 2\pi |y(t)| \sqrt{[x'(t)]^2 + [y'(t)]^2} \, dt
  $$
* **(d) 極座標 $r=r(\theta)$**, $\alpha \le \theta \le \beta$
  $y = r\sin\theta$, 且 $ds = \sqrt{r^2 + (\frac{dr}{d\theta})^2} \, d\theta$

  $$
  S = \int_\alpha^\beta 2\pi |r(\theta)\sin\theta| \sqrt{r(\theta)^2 + [r'(\theta)]^2} \, d\theta
  $$

### 2. 繞 $y$ 軸旋轉 ($y$-axis)

此時旋轉半徑 $R = |x|$。

* **(a) 卡氏座標 $y=f(x)$**, $a \le x \le b$

  $$
  ds = \sqrt{1 + [f'(x)]^2} \, dx
  $$

  $$
  S = \int_a^b 2\pi |x| \sqrt{1 + [f'(x)]^2} \, dx
  $$
* **(b) 卡氏座標 $x=g(y)$**, $c \le y \le d$

  $$
  ds = \sqrt{1 + [g'(y)]^2} \, dy
  $$

  $$
  S = \int_c^d 2\pi |g(y)| \sqrt{1 + [g'(y)]^2} \, dy
  $$
* **(c) 參數式 $x=x(t), y=y(t)$**, $\alpha \le t \le \beta$

  $$
  ds = \sqrt{[x'(t)]^2 + [y'(t)]^2} \, dt
  $$

  $$
  S = \int_\alpha^\beta 2\pi |x(t)| \sqrt{[x'(t)]^2 + [y'(t)]^2} \, dt
  $$
* **(d) 極座標 $r=r(\theta)$**, $\alpha \le \theta \le \beta$
  $x = r\cos\theta$, 且 $ds = \sqrt{r^2 + (\frac{dr}{d\theta})^2} \, d\theta$

  $$
  S = \int_\alpha^\beta 2\pi |r(\theta)\cos\theta| \sqrt{r(\theta)^2 + [r'(\theta)]^2} \, d\theta
  $$

### 3. 繞任意斜直線 $L: Ax+By+C=0$ 旋轉

此時旋轉半徑 $R$ 為曲線上點 $(x,y)$ 到直線 $L$ 的垂直距離：

$$
R = \frac{|Ax+By+C|}{\sqrt{A^2+B^2}}
$$

$$
S = \int 2\pi \frac{|Ax+By+C|}{\sqrt{A^2+B^2}} \, ds
$$

（$ds$ 的選用則視曲線方程式型態而定）

### 4. 補充：帕普斯定理 (Pappus's Centroid Theorem)

若平面曲線段長度為 $L$，其 **形心（Centroid）** 到某一不與曲線相交之旋轉軸的垂直距離為 $\bar{r}$，則該曲線繞該軸旋轉所得之表面積 $S$ 為：

$$
S = 2\pi \bar{r} \times L
$$

（即**形心繞行一周的路徑長**乘以**曲線長度**，這在處理圓形、線段等幾何圖形的旋轉時非常快速好用）。

---

*(未來進行微積分錯題檢討時，將會統一將觀念與解題技巧整理於此)*
