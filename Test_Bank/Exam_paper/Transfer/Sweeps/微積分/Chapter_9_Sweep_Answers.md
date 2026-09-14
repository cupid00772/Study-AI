# Chapter 9: 參數方程式與極座標 - 掃題大師 解答卷

## 第一部分：參數方程式

**1. (15%)**
*   **解法：**
    (a) 首先計算對 $t$ 的微分：
    $\frac{dx}{dt} = 2t + 1$
    $\frac{dy}{dt} = 2t - 1$
    切線斜率 $\frac{dy}{dx} = \frac{dy/dt}{dx/dt} = \frac{2t - 1}{2t + 1}$。
    當 $t = 2$ 時，$\frac{dy}{dx} = \frac{3}{5}$。
    (b) 計算二階導數：
    $\frac{d^2y}{dx^2} = \frac{\frac{d}{dt}\left(\frac{dy}{dx}\right)}{\frac{dx}{dt}}$
    先求分子：$\frac{d}{dt}\left(\frac{2t - 1}{2t + 1}\right) = \frac{2(2t + 1) - (2t - 1)2}{(2t + 1)^2} = \frac{4t + 2 - 4t + 2}{(2t + 1)^2} = \frac{4}{(2t + 1)^2}$
    所以 $\frac{d^2y}{dx^2} = \frac{\frac{4}{(2t + 1)^2}}{2t + 1} = \frac{4}{(2t + 1)^3}$。
    當 $t = 2$ 時，$\frac{d^2y}{dx^2} = \frac{4}{5^3} = \frac{4}{125}$。
*   **答案：** (a) **$3/5$**  (b) **$4/125$**

**2. (15%)** $x = 1 + 3t^2$, $y = 4 + 2t^3$
*   **解法：**
    $x' = 6t$, $y' = 6t^2$
    弧長公式 $L = \int_0^1 \sqrt{(x')^2 + (y')^2} dt = \int_0^1 \sqrt{(6t)^2 + (6t^2)^2} dt = \int_0^1 \sqrt{36t^2 + 36t^4} dt$
    提出公因式 $36t^2$：$= \int_0^1 6t\sqrt{1 + t^2} dt$ (因為 $t \ge 0$, $\sqrt{t^2}=t$)
    令 $u = 1 + t^2$，則 $du = 2t dt \implies 6t dt = 3 du$。
    上下限：$t=0 \to u=1$; $t=1 \to u=2$。
    $L = \int_1^2 3 \sqrt{u} du = 3 \left[ \frac{2}{3} u^{3/2} \right]_1^2 = 2 \left( 2^{3/2} - 1^{3/2} \right) = 2(2\sqrt{2} - 1) = 4\sqrt{2} - 2$。
*   **答案：** **$4\sqrt{2} - 2$**

**3. (20%)** $x = 3t - t^3$, $y = 3t^2$ 繞 $x$ 軸
*   **解法：**
    表面積公式 $S = \int 2\pi y \sqrt{(x')^2 + (y')^2} dt$
    $x' = 3 - 3t^2$, $y' = 6t$
    計算 $(x')^2 + (y')^2 = (3 - 3t^2)^2 + (6t)^2 = 9 - 18t^2 + 9t^4 + 36t^2 = 9 + 18t^2 + 9t^4 = (3 + 3t^2)^2$
    因此 $\sqrt{(x')^2 + (y')^2} = 3 + 3t^2$ (因為 $t \ge 0$ 且為平方和)
    $S = \int_0^1 2\pi (3t^2) (3 + 3t^2) dt = \int_0^1 18\pi (t^2 + t^4) dt = 18\pi \left[ \frac{t^3}{3} + \frac{t^5}{5} \right]_0^1$
    $= 18\pi \left( \frac{1}{3} + \frac{1}{5} \right) = 18\pi \left( \frac{8}{15} \right) = \frac{144\pi}{15} = \frac{48\pi}{5}$。
*   **答案：** **$48\pi / 5$**

## 第二部分：極座標

**4. (10%)** $r = 2 \sin \theta$
*   **解法：**
    兩邊同乘 $r$：$r^2 = 2r \sin \theta$。
    代入轉換公式 $r^2 = x^2 + y^2$ 以及 $y = r \sin \theta$。
    得到：$x^2 + y^2 = 2y$。
    移項並配方：$x^2 + y^2 - 2y = 0 \implies x^2 + (y - 1)^2 = 1$。
*   **答案：** 直角座標方程式為 **$x^2 + (y - 1)^2 = 1$**。該圖形為**圓心在 $(0, 1)$，半徑為 $1$ 的圓**。

**5. (20%)** $r = \cos(2\theta)$ 一個葉片的面積
*   **解法：**
    首先決定積分上下限。$\cos(2\theta)$ 畫出的玫瑰線在 $\theta = 0$ 時達到最大距離 $r=1$。
    回到原點 $r=0$ 的時候是 $\cos(2\theta) = 0 \implies 2\theta = \pm \pi/2 \implies \theta = \pm \pi/4$。
    因此一個葉片的區間為 $[-\pi/4, \pi/4]$。
    極座標面積公式：$A = \frac{1}{2} \int r^2 d\theta$。
    $A = \frac{1}{2} \int_{-\pi/4}^{\pi/4} \cos^2(2\theta) d\theta$
    使用半角公式 $\cos^2(x) = \frac{1 + \cos(2x)}{2}$：
    $A = \frac{1}{2} \int_{-\pi/4}^{\pi/4} \frac{1 + \cos(4\theta)}{2} d\theta = \frac{1}{4} \left[ \theta + \frac{\sin(4\theta)}{4} \right]_{-\pi/4}^{\pi/4}$
    代入上限 $\pi/4$：$\pi/4 + \frac{\sin(\pi)}{4} = \pi/4 + 0$
    代入下限 $-\pi/4$：$-\pi/4 + \frac{\sin(-\pi)}{4} = -\pi/4 + 0$
    $A = \frac{1}{4} \left( \frac{\pi}{4} - (-\frac{\pi}{4}) \right) = \frac{1}{4} \left( \frac{2\pi}{4} \right) = \frac{\pi}{8}$。
*   **答案：** **$\pi/8$**

**6. (20%)** $r = \theta^2$ 在 $0 \le \theta \le \sqrt{5}$ 的弧長
*   **解法：**
    極座標弧長公式：$L = \int \sqrt{r^2 + (\frac{dr}{d\theta})^2} d\theta$。
    $r = \theta^2 \implies \frac{dr}{d\theta} = 2\theta$。
    $L = \int_0^{\sqrt{5}} \sqrt{(\theta^2)^2 + (2\theta)^2} d\theta = \int_0^{\sqrt{5}} \sqrt{\theta^4 + 4\theta^2} d\theta$
    提出 $\theta^2$ 開根號 (因為 $\theta \ge 0$, $\sqrt{\theta^2}=\theta$)：
    $L = \int_0^{\sqrt{5}} \theta \sqrt{\theta^2 + 4} d\theta$
    令 $u = \theta^2 + 4$，則 $du = 2\theta d\theta \implies \theta d\theta = \frac{1}{2} du$。
    上下限：$\theta=0 \to u=4$; $\theta=\sqrt{5} \to u = (\sqrt{5})^2 + 4 = 9$。
    $L = \int_4^9 \frac{1}{2} \sqrt{u} du = \frac{1}{2} \left[ \frac{2}{3} u^{3/2} \right]_4^9 = \frac{1}{3} \left( 9^{3/2} - 4^{3/2} \right) = \frac{1}{3} (27 - 8) = \frac{19}{3}$。
*   **答案：** **$19/3$**
