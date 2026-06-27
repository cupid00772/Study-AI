# 115學年度 台聯大轉學考 詳解 (微積分、計算機概論、英文)

## 微積分 (Calculus)

**甲、填充題**
1. **(1) \(y = 2x - 1\) 及 (2) \(y = -10x - 25\)**
   *詳解：* 設切點分別在 \(f(x)\) 的 \(x=a\) 與 \(g(x)\) 的 \(x=b\)。\(f(x)\) 切線為 \(y = 2ax - a^2\)，\(g(x)\) 切線為 \(y = (b-2)x - \frac{1}{2}b^2 + 7\)。比較斜率與截距可得 \(2a = b-2\) 且 \(-a^2 = -\frac{1}{2}b^2 + 7\)。解聯立得 \(a=1, -5\)。代回即得兩切線方程式。
2. **\(-(4+\pi)/(1+2\pi)\)**
   *詳解：* 對方程式兩邊隱微分：\(2xy + x^2 y' + \cos(\pi xy) \cdot \pi(y + x y') = 3y^2 y'\)。將 \((x,y)=(2,1)\) 代入得 \(4 + 4y' + \pi(1 + 2y') = 3y'\)，解得 \(y' = \frac{-(4+\pi)}{1+2\pi}\)。
3. **\(1/9\)**
   *詳解：* 利用二項式展開近似：\((x^{27} + 3x^{26} + \dots)^{1/27} = x(1 + 3/x + \dots)^{1/27} \approx x(1 + \frac{1}{27}\cdot \frac{3}{x}) = x + \frac{1}{9}\)。極限即為 \(1/9\)。
4. **\(\ln(2/(1+e^{-1}))\)**
   *詳解：* \(\int_0^1 \frac{1}{1+e^x} dx = \int_0^1 \frac{e^{-x}}{e^{-x}+1} dx = [-\ln(e^{-x}+1)]_0^1 = -\ln(1+e^{-1}) + \ln 2 = \ln\left(\frac{2}{1+e^{-1}}\right)\)。
5. **\(16/5\)**
   *詳解：* 兩邊對 \(x\) 微分：\(\frac{1}{1+x^2} = \frac{f(x^2)}{(x^2)^3} \cdot 2x\)。整理得 \(f(x^2) = \frac{x^5}{2(1+x^2)}\)。欲求 \(f(4)\)，取 \(x^2=4 \implies x=2\)。代入得 \(f(4) = \frac{32}{2(5)} = \frac{16}{5}\)。
6. **\(1/2\)**
   *詳解：* \(f(0) = 0\)，且 \(f'(x) = 1 + \cos x \implies f'(0) = 2\)。故 \((f^{-1})'(0) = \frac{1}{f'(0)} = \frac{1}{2}\)。
7. **\([e^{-2}, e^2)\)**
   *詳解：* 由比值審斂法，\(\lim \left| \frac{a_{n+1}}{a_n} \right| = \left| \frac{\ln x}{2} \right| < 1 \implies -2 < \ln x < 2 \implies e^{-2} < x < e^2\)。代入端點：\(x=e^2\) 發散，\(x=e^{-2}\) 收斂（交錯級數）。
8. **\(\frac{\ln 33}{10}\)**
   *詳解：* 交換積分次序：\(\int_0^2 \int_0^{y^2} \frac{x}{y^5 + 1} dx dy = \int_0^2 \frac{y^4}{2(y^5 + 1)} dy = \left[ \frac{1}{10} \ln(y^5+1) \right]_0^2 = \frac{\ln 33}{10}\)。
9. **Local maximum: \((-1,0)\), Local minimum: \((1,0)\), Saddle points: \((0, \pm \sqrt{3})\)**
   *詳解：* 解 \(\nabla f = 0\) 得臨界點 \((1,0), (-1,0), (0, \pm\sqrt{3})\)。判別式 \(D = 12x^2 - 4y^2\)。代入後可判斷極值與鞍點。
10. **\((1, 1, \pm\sqrt{2})\) 及 \((-1, -1, \pm\sqrt{2})\)**
    *詳解：* 使用拉格朗日乘數法或算幾不等式。求 \(M^2 = x^2 y^2 z^4\) 在 \(x^2+y^2+z^2=4\) 條件下之極大值。由算幾得 \(x^2 = y^2 = z^2/2 = 1\)，故最強點為 \(xy>0\) 的上述四點。

**乙、計算題**
I. **\(\frac{1}{2}(e^3 - e - 2)\)**
   *詳解：* 令 \(u = x+y, v = x-y\)，範圍為 \(1 \le u \le 3, 0 \le v \le 1\)，Jacobian \(J = 1/2\)。積分變為 \(\frac{1}{2} \int_1^3 \int_0^1 u e^{uv} dv du = \frac{1}{2} \int_1^3 (e^u - 1) du = \frac{1}{2}(e^3 - e - 2)\)。
II. **Absolute maximum: \(1\), Absolute minimum: \(-1/8\)**
    *詳解：* 內部臨界點 \((0, 1/4)\) 函數值 \(-1/8\)。邊界一（直線 \(y=0\)）：最大值 \(1\) (於 \(\pm 1\))。邊界二（圓弧）：代入 \(x^2 = 1-y^2\) 得最大值 \(-1/8\) 至 \(1\)。綜合比較即得。

---

## 計算機概論 (Computer Science)
1. **(C)** -6.5 = -110.1(2) = -1.101 x 2^2。符號 1，指數 127+2=129 (10000001)，尾數 1010。
2. **(B)** (A+B)*(A+C) 展開為 AA + AC + BA + BC = A(1+C+B) + BC = A + BC，對應 (B) A + B*C。
3. **(E)** Cache line=16B 可存4個整數。讀 A[0] (Miss) 載入 A[0]-A[3]。隨後 A[1]-A[3] (Hit)。讀 A[4] (Miss)。故 M, H, H, H, M。
4. **(D)** 16 GB = 2^34 bytes，需 34 bits。
5. **(B)** I/O 完成後，進程從 Waiting (或 Blocked) 轉為 Ready 狀態等待 CPU。
6. **(C)** 要求執行前取得所有資源，這破壞了 Hold and wait (佔有並等待) 條件。
7. **(A)** 乙太網路 Preamble 的主要用途是讓接收端時鐘同步。
8. **(C)** 插入節點 C 於 B 和 D 之間，應先將 newNode->next 指向 p->next (即D)，再將 p->next 指向 newNode。
9. **(B)** h(26)=5，發生碰撞。線性探測依序檢查 6, 0, 1，皆滿。接著檢查 2，為空位，存入 slot 2。
10. **(A)** 對於已接近排序好的陣列，Insertion Sort 表現接近 O(n)，最為合適。
11. **(D)** 插入建樹後，刪除20並以中序後繼者25取代。新樹的 preorder 為 30, 25, 10, 40, 35, 50。
12. **(C)** Page offset = 13 bits (8KB)，Page number = 32-13=19 bits。2^19 個 entries * 4 bytes = 2 MB。
13. **(B)** update 函式透過指標修改陣列：a[2] 先加3變7，指標前移後 a[2] 再加 a[3](即5) 變12。列印出 2, 3, 12, 5, 12。
14. **(D)** 依 Banker's Algorithm，可用資源 (2,1) 先滿足 P1。P1 歸還後可用 (4,2)，再滿足 P0，最後 P2。故為 P1, P0, P2。
15. **(E)** 外迴圈 O(n)，內迴圈 O(log n)，結合遞迴 \(F(n) = 2F(n/2) + n\log n\)。由 Master Theorem 延伸情況得 \(\Theta(n \log^2 n)\)。
16. **(C)** GROUP BY 後符合筆數>=2 且總和>100 的有 Ann, Bob, Cara。Dora 只有1筆被過濾。
17. **(A)** Hybrid encryption 標準做法：生成 session key 做對稱式加密檔案，並用收件者(Bob)的 public key 加密 session key。
18. **(C)** 經過 NAT 後，前往外部伺服器的封包，Source IP 已經被轉換為 NAT 的 Public IP (203.0.113.8)。
19. **(B)** P 包含於 NP 中，故所有 P 問題皆是 NP 問題。NP 指的是 Nondeterministic Polynomial。
20. **(E)** 即時影像串流 (Live video streaming) 強調低延遲且容許少量掉包，故最適合 UDP。

---

## 英文 (English)
(以簡明答案為主)
1. D (impervious: 不受影響的)
2. B (erode: 侵蝕、削弱信心)
3. A (lucid: 清晰的，或 ambiguous/unequivocal 依題意；此處題意為 sufficiently _ to permit multiple interpretations，故選 ambiguous C，但前有 sufficiently 應為曖昧不明，正確答案應為 C。Wait, 讓我們重新評估：permit multiple interpretations 應該是 ambiguous (C)。)
4. B (isolate: 獨立/分離變因)
5. B (addresses: 處理問題 rather than 解決)
6. B (representative: 具代表性的)
7. D (stimulate: 刺激經濟)
8. A (obscure: 晦澀難懂)
9. B (skeptical: 起初被懷疑)
10. D (prudent: 謹慎的策略)
11. B (methodological bias: 方法學上的偏差)
12. A (Had the data been..., the error would have been detected)
13. D (requires that every applicant submit - 祈使語氣省略 should)
14. A (supports: The study 是單數主詞)
15. C (Only after... was the manuscript accepted - 倒裝句)
16. C (making it difficult...)
17. A (impose: 實施法規)
18. B (profitable: 保持獲利)
19. D (mitigate: 減輕/緩和差距)
20. C (investigate: 調查因素)
21. A (breakthrough: 突破)
22. C (compelling: 有說服力的論點)
23. A (unforeseen: 未預見的困難)
24. D (empirical: 實證的證據)
25. C (had been completed)
26. D (is: The book 單數主詞)
27. B (will have been working on - 未來完成進行式)
28. B (provide - 祈使語氣)
29. B (was - data 在此常作單數不可數或特定情況，但嚴格說 data 是複數，應為 were。若以單數計算為 was)
30. D (be revised - 祈使語氣)
31. A (Passage 1主旨：教育目標)
32. D (分界線不如傳統認為的明顯)
33. A (Cultivate broader intellectual capacities)
34. C (Mutually exclusive: 無法共存/結合)
35. A (Technical expertise, communication, adaptability, independent thought)
36. C (Balanced)
37. D (Educational goals can be integrated)
38. C (Cumulative - 累積的)
39. D (Progress may involve major disruptions)
40. D (Research conducted within an accepted framework)
41. A (When anomalies accumulate)
42. A (Advancement requires abandoning established assumptions)
43. D (They remain influential)
44. A (Explain and evaluate Kuhn's theory)
45. C (Discuss benefits and challenges of open-access)
46. D (Broader access)
47. B (Expanding access while maintaining quality)
48. C (Analytical and evidence-based)
49. B (Valuable if quality maintained)
50. C (Financial barriers shift from readers to researchers)
