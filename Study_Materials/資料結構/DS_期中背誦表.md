ˇ

# DS 期中背誦表 (Data Structures Active Recall Sheet)

> 📚 **課程名稱**：資料結構 (Data Structures)
> 🎯 **考試範圍**：Chapter 1 ~ Chapter 3 全覆蓋 (54 核心考點)
> 💡 **互動模式**：亦可直接於瀏覽器開啟互動網頁版本：[DS_期中背誦表.html](./DS_期中背誦表.html)

---

## 📌 使用方法與導覽

1. **核心原則**：只收錄「**考卷上要寫出來的內容**」— 必背定義、英文原句、名詞解釋、公式計算、解題步驟、指標操作與重要圖解。
2. **優先級複習法**：由上到下依優先順序排序。第一優先（高頻必考大題）未完全熟練前，請勿隨意跳至後面。
3. **主動回想 (Active Recall)**：預設摺疊答案（點擊 `<details>` 展開），請務必先在腦中默背或於紙上默寫，再展開對照。
4. **精準出處標註**：每一題皆清楚附上對應的講義投影片頁碼（`📍 講義出處`），方便隨時翻閱原版簡報進行比對。

---

## 📑 目錄導覽 (Table of Contents)

### ⚡ 快速跳轉分區

- [🔥 第一優先：高頻考點、核心演算與必考圖解 (Q1 ~ Q15)](#第一優先高頻考點核心演算與必考圖解)
- [⭐ 第二優先：簡答出過的定義題與專有名詞 (Q16 ~ Q32)](#第二優先簡答出過的定義題與專有名詞)
- [💡 第三優先：其他核心列舉題、公式與特性對比 (Q33 ~ Q54)](#第三優先其他核心列舉題公式與特性對比)

### 📋 全 54 題總覽索引表

|    題號    | 優先級 | 章節 | 核心問題 / 考點摘要                                                          | 講義出處 (Slide / Page)                                                          |
| :--------: | :----: | :--: | :--------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
|  [Q1](#q1)  |   P1   | Ch3 | 單向鏈結串列插入新節點的「先連後斷」順序為何？若順序顛倒會造成什麼致命問題？ | DS_Ch3.pdf 投影片 Slide 32 (PDF p.16)                                            |
|  [Q2](#q2)  |   P1   | Ch3 | 雙向鏈結串列在前驅 pPre 與後繼 pSucc 間插入新節點 pNew 的...                 | DS_Ch3.pdf 投影片 Slide 99~100 (PDF p.50)                                        |
|  [Q3](#q3)  |   P1   | Ch3 | 雙向鏈結串列刪除節點 pCur 的指標重接步驟與記憶體釋放？                       | DS_Ch3.pdf 投影片 Slide 105~106 (PDF p.53)                                       |
|  [Q4](#q4)  |   P1   | Ch2 | 雜湊取模除法 h(k) = k mod m 為什麼除數 m 必須選質數 (P...                    | DS_Ch2.pdf 投影片 Slide 56 (PDF p.28)                                            |
|  [Q5](#q5)  |   P1   | Ch2 | 一次聚集 (Primary Clustering) vs. 二次聚集 (Se...                            | DS_Ch2.pdf 投影片 Slide 79~80 (PDF p.40)                                         |
|  [Q6](#q6)  |   P1   | Ch2 | 鍵值位移 (Key Offset / Double Hashing) 為何能...                             | DS_Ch2.pdf 投影片 Slide 89~91 (PDF p.45~46)                                     |
|  [Q7](#q7)  |   P1   | Ch2 | [⚠️ 講義未收錄/延伸題] 開放定址法刪除節點時為什麼絕對不能直接清成 N...     | ⚠️【講義未收錄／課外延伸題】相關概念見 DS_Ch2.pdf Slide 82~84 (PDF p.41~42)   |
|  [Q8](#q8)  |   P1   | Ch1 | Big-O 的嚴格數學定義 (Formal Definition) 與圖形條件？                        | DS_Ch1.pdf 投影片 Slide 40 (PDF p.20)                                            |
|  [Q9](#q9)  |   P1   | Ch1 | 常見演算法複雜度 Big-O 階層由小到大（由快到慢）的排序？                      | DS_Ch1.pdf 投影片 Slide 43~44 (PDF p.22)                                         |
| [Q10](#q10) |   P1   | Ch1 | 迴圈分析陷阱：相依二次迴圈 vs. 幾何收斂迴圈的複雜度差異？                    | DS_Ch1.pdf 投影片 Slide 36 (PDF p.18)                                            |
| [Q11](#q11) |   P1   | Ch2 | 二分搜尋法 (Binary Search) 的兩大嚴格前提條件？鏈結串列為何...               | DS_Ch2.pdf 投影片 Slide 24~26 (PDF p.12~13)                                     |
| [Q12](#q12) |   P1   | Ch3 | 單向環狀串列 (Circular List) 只保留尾指標 rear 的設計...                     | DS_Ch3.pdf 投影片 Slide 94~95 (PDF p.47~48)                                     |
| [Q13](#q13) |   P1   | Ch3 | [⚠️ 講義未收錄/延伸題] 單向鏈結串列原地反轉 (Reverse Lin...                | ⚠️【講義未收錄／實作經典大題】相關概念見 DS_Ch3.pdf Slide 60~64 (PDF p.30~32) |
| [Q14](#q14) |   P1   | Ch3 | 多重鏈結串列 (Multilinked Lists) 的設計哲學與兩大核心優勢？                  | DS_Ch3.pdf 投影片 Slide 112~115 (PDF p.56~58)                                   |
| [Q15](#q15) |   P1   | Ch2 | 鏈結串列法 (Separate Chaining) 的負載因子 α 限制與三...                     | DS_Ch2.pdf 投影片 Slide 92~94 (PDF p.46~47)                                     |
| [Q16](#q16) |   P2   | Ch1 | ADT (Abstract Data Type) 的標準英文定義與兩大要素？                          | DS_Ch1.pdf 投影片 Slide 20 (PDF p.10)                                            |
| [Q17](#q17) |   P2   | Ch1 | 資訊隱藏 (Information Hiding) 與封裝 (Encapsu...                             | DS_Ch1.pdf 投影片 Slide 20 (PDF p.10)                                            |
| [Q18](#q18) |   P2   | Ch1 | 結構化程式設計的三大基本控制結構 (Control Constructs)？                      | DS_Ch1.pdf 投影片 Slide 13~14 (PDF p.7)                                          |
| [Q19](#q19) |   P2   | Ch1 | 何謂原子資料 (Atomic Data) 與複合資料 (Composite ...                         | DS_Ch1.pdf 投影片 Slide 19~20 (PDF p.10)                                         |
| [Q20](#q20) |   P2   | Ch1 | 合格虛擬碼演算法標頭 (Algorithm Header) 的 5 大必備元素？                    | DS_Ch1.pdf 投影片 Slide 5 (PDF p.3)                                              |
| [Q21](#q21) |   P2   | Ch2 | 哨兵搜尋法 (Sentinel Search) 的原理與優點 (Knuth ...                         | DS_Ch2.pdf 投影片 Slide 12~14 (PDF p.6~7)                                       |
| [Q22](#q22) |   P2   | Ch2 | 機率搜尋法 (Probability Search / 80-20 Rule...                               | DS_Ch2.pdf 投影片 Slide 16~18 (PDF p.8~9)                                       |
| [Q23](#q23) |   P2   | Ch2 | 名詞解釋：Home Address、Collision、Synonym。                                 | DS_Ch2.pdf 投影片 Slide 46~47 (PDF p.23~24)                                     |
| [Q24](#q24) |   P2   | Ch2 | 負載因子 (Load Factor, α) 的公式、意義與建議範圍？                          | DS_Ch2.pdf 投影片 Slide 78 (PDF p.39)                                            |
| [Q25](#q25) |   P2   | Ch2 | 折疊法 (Folding Method)：Fold Shift vs. Fo...                                | DS_Ch2.pdf 投影片 Slide 62~64 (PDF p.31~32)                                     |
| [Q26](#q26) |   P2   | Ch2 | 為什麼平方取中法 (Midsquare Method) 能讓雜湊位址分佈非常...                  | DS_Ch2.pdf 投影片 Slide 60 (PDF p.30)                                            |
| [Q27](#q27) |   P2   | Ch3 | 陣列 vs. 鏈結串列在隨機存取與已知位置插入刪除的複雜度比較？                  | DS_Ch3.pdf 投影片 Slide 4~14 (PDF p.2~7)                                        |
| [Q28](#q28) |   P2   | Ch3 | 鏈結串列表頭結構 (Head Structure) 的三大元數據 (Meta...                      | DS_Ch3.pdf 投影片 Slide 20~22 (PDF p.10~11)                                     |
| [Q29](#q29) |   P2   | Ch3 | 雙向環狀鏈結串列 (Doubly Circular List) 的指標對稱性...                      | DS_Ch3.pdf 投影片 Slide 97~98 (PDF p.49)                                         |
| [Q30](#q30) |   P2   | Ch2 | 有序串列搜尋 (Ordered List Search) 的失敗提前終止機制...                     | DS_Ch2.pdf 投影片 Slide 20~22 (PDF p.10~11)                                     |
| [Q31](#q31) |   P2   | Ch1 | 虛擬碼參數傳遞模式：Pass by Value (val) vs. Pass...                          | DS_Ch1.pdf 投影片 Slide 8 (PDF p.4)                                              |
| [Q32](#q32) |   P2   | Ch3 | 單向鏈結串列走訪 (Traversal) 的標準虛擬碼寫法與終止條件？                    | DS_Ch3.pdf 投影片 Slide 60~64 (PDF p.30~32)                                     |
| [Q33](#q33) |   P3   | Ch1 | 良好變數命名 (Intelligent Data Names) 的三大禁忌與...                        | DS_Ch1.pdf 投影片 Slide 11~12 (PDF p.6)                                          |
| [Q34](#q34) |   P3   | Ch1 | 程式設計典範的三大階段演進歷史與特點？                                       | DS_Ch1.pdf 投影片 Slide 17~18 (PDF p.9)                                          |
| [Q35](#q35) |   P3   | Ch1 | n × n 矩陣相加 vs. 矩陣相乘的時間複雜度比較與推導？                         | DS_Ch1.pdf 投影片 Slide 45~50 (PDF p.23~25)                                     |
| [Q36](#q36) |   P3   | Ch1 | 為什麼漸進分析 (Big-O) 要捨棄常數係數與低階次要項？                          | DS_Ch1.pdf 投影片 Slide 40 (PDF p.20)                                            |
| [Q37](#q37) |   P3   | Ch1 | ADT 中的泛型實作：C++ Template 的語法及 TYPE 與 KT...                        | DS_Ch1.pdf 投影片 Slide 31~32 (PDF p.16)                                         |
| [Q38](#q38) |   P3   | Ch2 | 評估優良雜湊函式 (Hash Function) 的三大黃金指標？                            | DS_Ch2.pdf 投影片 Slide 50 (PDF p.25)                                            |
| [Q39](#q39) |   P3   | Ch2 | 講義所介紹的 8 種雜湊函式方法 (Hashing Methods) 名稱列舉？                   | DS_Ch2.pdf 投影片 Slide 50 (PDF p.25)                                            |
| [Q40](#q40) |   P3   | Ch2 | 二次探測 (Quadratic Probing) 的探測公式與兩大缺點限制？                      | DS_Ch2.pdf 投影片 Slide 85~86 (PDF p.43)                                         |
| [Q41](#q41) |   P3   | Ch2 | 桶子雜湊法 (Bucket Hashing) 的運作機制與主要缺點？                           | DS_Ch2.pdf 投影片 Slide 95~96 (PDF p.48)                                         |
| [Q42](#q42) |   P3   | Ch2 | 循序搜尋在最佳、最差與平均情況下的比對次數公式手算？                         | DS_Ch2.pdf 投影片 Slide 34~36 (PDF p.17~18)                                     |
| [Q43](#q43) |   P3   | Ch2 | 旋轉法 (Rotation Method) 解決連續流水號群聚的實務操作？                      | DS_Ch2.pdf 投影片 Slide 65~66 (PDF p.33)                                         |
| [Q44](#q44) |   P3   | Ch2 | 數位擷取法 (Digit-Extraction Method) 的位數選取原則？                        | DS_Ch2.pdf 投影片 Slide 59 (PDF p.30)                                            |
| [Q45](#q45) |   P3   | Ch2 | 雜湊取模除法若預期容納 70 筆資料且負載因子 α = 0.7，除數 m 應...            | DS_Ch2.pdf 投影片 Slide 56 (PDF p.28)                                            |
| [Q46](#q46) |   P3   | Ch3 | 陣列實作串列 vs. 鏈結串列實作串列的 6 大維度全方位對比？                     | DS_Ch3.pdf 投影片 Slide 4~15 (PDF p.2~8)                                        |
| [Q47](#q47) |   P3   | Ch3 | 鏈結串列刪除首節點的三部曲與常見致命錯誤 (Use-After-Free)？                  | DS_Ch3.pdf 投影片 Slide 39~40 (PDF p.20)                                         |
| [Q48](#q48) |   P3   | Ch3 | 串列附加 (Append Lists) 的步驟與有無尾指標的時間複雜度差異？                 | DS_Ch3.pdf 投影片 Slide 84~88 (PDF p.42~44)                                     |
| [Q49](#q49) |   P3   | Ch3 | 串列陣列 (Array of Lists) 的定義與兩大應用實例？                             | DS_Ch3.pdf 投影片 Slide 90~93 (PDF p.45~47)                                     |
| [Q50](#q50) |   P3   | Ch3 | 串列銷毀 (Destroy List) 為何不能只寫 head = NULL...                          | DS_Ch3.pdf 投影片 Slide 65~66 (PDF p.33)                                         |
| [Q51](#q51) |   P3   | Ch3 | 雙向鏈結串列相較於單向鏈結串列的兩大優點與兩大缺點？                         | DS_Ch3.pdf 投影片 Slide 96~98 (PDF p.48~49)                                     |
| [Q52](#q52) |   P3   | Ch3 | 單向鏈結串列插入中間節點時，為何必須維護前驅指標 pPre？                      | DS_Ch3.pdf 投影片 Slide 26 (PDF p.13)                                            |
| [Q53](#q53) |   P3   | Ch2 | 傳統循序搜尋在每次迴圈迭代時，內部進行的兩項條件檢查為何？                   | DS_Ch2.pdf 投影片 Slide 8~10 (PDF p.4~5)                                        |
| [Q54](#q54) |   P3   | Ch3 | 雙端操作在單向串列 vs. 維護 rear 的單向環狀串列效能差別？                    | DS_Ch3.pdf 投影片 Slide 94~95 (PDF p.47~48)                                     |

---

## 第一優先：高頻考點、核心演算與必考圖解

> 配分最高、歷屆必考大題、關鍵演算法步驟與指標順序

<a id="q1"></a>

### Q1. [Ch3] 單向鏈結串列插入新節點的「先連後斷」順序為何？若順序顛倒會造成什麼致命問題？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 32 (PDF p.16) [Add Node in Middle] & Slide 36 (PDF p.18) [Algorithm 3-1 Insert Node]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【先連後斷黃金法則】**

給定前驅指標 `pPre` 與待插入新節點 `pNew`：

```cpp
// 1. 先連：新節點先指向後續節點
pNew->next = pPre->next;

// 2. 後斷：前驅節點改指向新節點
pPre->next = pNew;
```

⚠️ **顛倒後果（致命錯誤）**：

若先執行 `pPre->next = pNew`，原本指向後續節點的指標直接被覆蓋，後續整條鏈結串列將永遠與前面脫鉤，造成 **Memory Leak（記憶體洩漏）** 且資料永久遺失！

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q2"></a>

### Q2. [Ch3] 雙向鏈結串列在前驅 pPre 與後繼 pSucc 間插入新節點 pNew 的 4 步指標賦值順序？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 99~100 (PDF p.50) [Doubly Linked Lists / Figure 3-23 Doubly linked list insert]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【雙向鏈結串列插入四部曲】**

```cpp
// 步驟 1: 新節點向右連後繼
pNew->next = pSucc;

// 步驟 2: 新節點向左連前驅
pNew->prev = pPre;

// 步驟 3: 前驅節點向右連新節點 (注意邊界判斷)
if (pPre != NULL)
    pPre->next = pNew;
else
    list->head = pNew; // 插入首端

// 步驟 4: 後繼節點向左連新節點 (注意邊界判斷)
if (pSucc != NULL)
    pSucc->prev = pNew;
else
    list->rear = pNew; // 插入尾端
```

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q3"></a>

### Q3. [Ch3] 雙向鏈結串列刪除節點 pCur 的指標重接步驟與記憶體釋放？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 105~106 (PDF p.53) [Doubly Linked Lists / Figure 3-24 Doubly linked list delete]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【雙向鏈結串列刪除步驟】**

```cpp
// 步驟 1: 前驅節點跨過 pCur 向右指
if (pCur->prev != NULL)
    pCur->prev->next = pCur->next;
else
    list->head = pCur->next; // 刪除首節點

// 步驟 2: 後繼節點跨過 pCur 向左指
if (pCur->next != NULL)
    pCur->next->prev = pCur->prev;
else
    list->rear = pCur->prev; // 刪除尾節點

// 步驟 3: 釋放記憶體
delete pCur;
```

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q4"></a>

### Q4. [Ch2] 雜湊取模除法 h(k) = k mod m 為什麼除數 m 必須選質數 (Prime Number)？選偶數或 2^p 會如何？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 56 (PDF p.28) [Modulo-Division Method (Prime)] & Slide 78 (PDF p.39) [Load factor α]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **選質數的原因**：質數能打破鍵值數列與表長的公因數週期性，使餘數在 `0 ~ m-1` 之間呈現最均勻的分佈，極小化碰撞。
- **若選偶數**：偶數鍵值必映射至偶數位址，奇數鍵值必映射至奇數位址。若輸入資料偏向某類，將導致一半槽位閒置、另一半槽位嚴重碰撞！
- **若選 2^p**：`k mod 2^p` 在二進位計算中等同於「直接截取鍵值的最低 p 個 bits」，高位元資訊完全未參與運算，大幅增加碰撞機率！

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q5"></a>

### Q5. [Ch2] 一次聚集 (Primary Clustering) vs. 二次聚集 (Secondary Clustering) 定義與成因差異？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 79~80 (PDF p.40) [Collision Resolution: Clustering, Primary & Secondary Clustering]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **一次聚集 (Primary Clustering)**：

  - **成因**：由**線性探測 (Linear Probing)** 引發。
  - **現象**：不同主位址的碰撞元素連續佔據相鄰槽位，形成連續大區塊；區塊越大，後續鍵值掉入該區塊的機率越高，造成探測步數雪崩式暴增。
- **二次聚集 (Secondary Clustering)**：

  - **成因**：由**二次探測 (Quadratic Probing)** 或偽亂數探測引發。
  - **現象**：擁有**相同主位址**的同義詞（Synonyms），其後續探測序列完全相同，沿著同一條路徑競爭。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q6"></a>

### Q6. [Ch2] 鍵值位移 (Key Offset / Double Hashing) 為何能同時解決一次與二次聚集？公式為何？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 89~91 (PDF p.45~46) [Open Addressing: Key Offset (Double Hashing)]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【公式】**

`h_i(k) = (h(k) + i × step(k)) mod m`

**【原理與解決機制】**

- **步長相依於鍵值**：`step(k)` 不再是常數，而是根據鍵值本身計算出的步長（例如 `step = 1 + (k mod (m-1))` 或 `floor(k/m)`）。
- **消除 Primary Clustering**：步長不是固定的 1，碰撞時以動態跨度跳躍，絕不會在相鄰槽位堆疊成區塊。
- **消除 Secondary Clustering**：即使兩個鍵值不幸擁有相同主位址 `h(k_1) = h(k_2)`，但因鍵值不同，算出的步長 `step(k_1) ≠ step(k_2)`，探測路徑徹底分流！

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q7"></a>

### Q7. [Ch2] [⚠️ 講義未收錄/延伸題] 開放定址法刪除節點時為什麼絕對不能直接清成 NULL？什麼是 Tombstone？

> 📍 **講義出處**：⚠️【講義未收錄／課外延伸題】相關概念見 DS_Ch2.pdf Slide 82~84 (PDF p.41~42) [Linear Probe]，但原投影片完全未提及刪除機制與 Tombstone

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:8px 12px;margin-bottom:10px;border-radius:4px;font-size:0.9em;color:#92400e;">⚠️ **講義收錄說明**：授課教師講義 `DS_Ch2.pdf` 投影片 Slide 82~84 (p.41~42) 僅討論了開放定址法的碰撞插入機制（Linear Probing），完全未收錄刪除操作（Deletion）與 Tombstone 概念。若期中考嚴格以老師投影片文字為唯一範圍，**本題可略過不背**；若作為觀念延伸與實作防斷鏈理解，請參考以下解答。</div>

- **原因**：開放定址法的搜尋演算法在遇到空槽位 (NULL) 時會判定「搜尋失敗並終止」。若將刪除槽位直接設為 NULL，會切斷探測路徑，導致後續曾因碰撞而探測到更後方槽位的同義詞永遠無法被找到！
- **解決方案（Tombstone / 墓碑值）**：刪除時改為標記為特殊狀態「墓碑 (Deleted)」。

  - **搜尋時**：視為「已佔用」，演算法繼續往後探測。
  - **插入時**：視為「可用空槽」，允許覆寫新資料。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q8"></a>

### Q8. [Ch1] Big-O 的嚴格數學定義 (Formal Definition) 與圖形條件？

> 📍 **講義出處**：DS_Ch1.pdf 投影片 Slide 40 (PDF p.20) [Big-O Notation: Definition & Derivation steps]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【嚴格數學定義 (必背英文句子)】**

`f(n) = O(g(n))` if and only if there exist positive constants `c` and `n_0` such that:

<div style="text-align:center;margin:8px 0;font-weight:bold;font-size:1.1em;color:#2563eb;">
f(n) ≤ c · g(n),   ∀ n ≥ n_0
</div>
**【意義】**

當問題規模 `n` 充分大（大於門檻值 `n_0`）時，`c · g(n)` 構成 `f(n)` 的漸進上界（Asymptotic Upper Bound）。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q9"></a>

### Q9. [Ch1] 常見演算法複雜度 Big-O 階層由小到大（由快到慢）的排序？

> 📍 **講義出處**：DS_Ch1.pdf 投影片 Slide 43~44 (PDF p.22) [Standard measures of efficiency / Table 1-2 Common Big-O measures]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<div style="font-size:1.15em;font-weight:bold;margin-bottom:8px;color:#059669;">
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)
</div>

- **常數時間**：O(1)
- **對數時間**：O(log n)
- **線性時間**：O(n)
- **線性對數**：O(n log n)
- **多項式時間**：O(n²), O(n³)
- **指數時間**：O(2ⁿ)
- **階乘時間**：O(n!)

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q10"></a>

### Q10. [Ch1] 迴圈分析陷阱：相依二次迴圈 vs. 幾何收斂迴圈的複雜度差異？

> 📍 **講義出處**：DS_Ch1.pdf 投影片 Slide 36 (PDF p.18) [Logarithmic loops] & Slide 38~39 (PDF p.19~20) [Nested loops / Dependent quadratic]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **相依二次迴圈 (Dependent Loop)**：

  外層 `i` 從 1 走到 n，內層 `j` 從 1 走到 `i`：

  總執行次數 = `1 + 2 + ... + n = n(n+1)/2 = O(n²)`。
- **幾何等比收斂迴圈 (Geometric Loop - 經典大考陷阱！)**：

  外層 `i` 從 n 開始每次除以 2（`i = n; i > 0; i /= 2`），內層 `j` 從 1 走到 `i`：

  總次數 = `n + n/2 + n/4 + ... ≤ 2n = O(n)`！

  ⚠️ **注意**：絕非 O(n log n)！因為內層總和為等比級數收斂至 2n。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q11"></a>

### Q11. [Ch2] 二分搜尋法 (Binary Search) 的兩大嚴格前提條件？鏈結串列為何無法做二分搜尋？複雜度？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 24~26 (PDF p.12~13) [Binary Search Concept] & Slide 30~33 (PDF p.15~17) [Algorithm 2-5 Binary search]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **兩大嚴格前提條件**：

  - 串列資料必須**已經排序 (Sorted)**。
  - 資料結構必須支援**常數時間隨機存取 (Random Access: O(1))**，即**陣列 (Array)**。
- **鏈結串列為何無法做二分搜尋**：鏈結串列不具隨機存取能力，計算出中點 `mid = (low + high)/2` 後，必須從頭走訪 O(n) 才能抵達該節點，直接破壞了二分搜尋減半的效益！
- **時間複雜度**：`O(log₂ n)`。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q12"></a>

### Q12. [Ch3] 單向環狀串列 (Circular List) 只保留尾指標 rear 的設計優勢與操作？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 94~95 (PDF p.47~48) [Circularly Linked Lists / Figure 3-21 & Figure 3-22]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【核心優勢】**

透過單一尾指標 `rear`，即可在 **O(1) 常數時間** 同時存取串列首端與尾端：

- **存取尾節點**：`rear`（O(1)）
- **存取首節點**：`rear->next`（O(1)）
- **首端插入**：新節點連向 `rear->next`，再令 `rear->next = new_node`（O(1)）
- **尾端插入**：同首端插入後，多一行 `rear = new_node`（O(1)）

大幅節省表頭結構維護兩個指標（head, tail）的開銷，非常適合作為 Queue 的底層結構。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q13"></a>

### Q13. [Ch3] [⚠️ 講義未收錄/延伸題] 單向鏈結串列原地反轉 (Reverse Linked List) 演算法三指標寫法？

> 📍 **講義出處**：⚠️【講義未收錄／實作經典大題】相關概念見 DS_Ch3.pdf Slide 60~64 (PDF p.30~32) [Traverse List]，投影片僅有走訪與附加，未收錄反轉演算法虛擬碼

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:8px 12px;margin-bottom:10px;border-radius:4px;font-size:0.9em;color:#92400e;">⚠️ **講義收錄說明**：講義 `DS_Ch3.pdf` Slide 60~64 僅收錄走訪（Traversal）與附加（Append），反轉鏈結串列（Reverse Linked List）為常見期中程式設計考題，但投影片未直接收錄虛擬碼，列為重要實作延伸。若考題僅限投影片字面，此題為實作補充。</div>
**【原地反轉（In-place Reverse，空間複雜度 O(1)）】**

```cpp
Node* reverseList(Node* head) {
    Node* pPre = NULL;
    Node* pCur = head;
    Node* pNext = NULL;

    while (pCur != NULL) {
        pNext = pCur->next; // 1. 先暫存下一個節點，防止斷鏈
        pCur->next = pPre;  // 2. 指標反轉向左指
        pPre = pCur;        // 3. 前驅指標前移
        pCur = pNext;       // 4. 當前指標前移
    }
    return pPre; // 全新反轉後的表頭指標
}
```

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q14"></a>

### Q14. [Ch3] 多重鏈結串列 (Multilinked Lists) 的設計哲學與兩大核心優勢？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 112~115 (PDF p.56~58) [Multilinked Lists / Figure 3-25 & Figure 3-26]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **設計哲學**：**單一資料實體僅存一份，節點內包含多組獨立的指標欄位**（如 `nextByID`, `nextByGPA`）。
- **兩大核心優勢**：

  - **巨幅節省記憶體**：無需為了支援多種排序方式而複製多份龐大記錄。
  - **確保資料一致性 (Data Consistency)**：更新某一筆記錄的資料內容時，所有走訪鏈結自動同步更新，絕不會產生多份複本資料不一致的異常。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q15"></a>

### Q15. [Ch2] 鏈結串列法 (Separate Chaining) 的負載因子 α 限制與三大優點？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 92~94 (PDF p.46~47) [Linked List Resolution / Figure 2-16]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **負載因子限制**：**α 可以大於 1！**（不受限於表長，例如 10 個槽位可容納 100 筆資料，α = 10）。
- **三大核心優點**：

  - **徹底杜絕聚集**：不會發生 Primary Clustering 與 Secondary Clustering。
  - **記憶體動態彈性**：節點動態配置於 Heap，容量無限擴充。
  - **刪除操作單純**：直接釋放節點記憶體，完全無需維護墓碑 (Tombstone)。
- **主要缺點**：每個節點多耗費指標空間；快取局部性較差。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

## 第二優先：簡答出過的定義題與專有名詞

> 必背英文原句、名詞解釋、單行定義題

<a id="q16"></a>

### Q16. [Ch1] ADT (Abstract Data Type) 的標準英文定義與兩大要素？

> 📍 **講義出處**：DS_Ch1.pdf 投影片 Slide 20 (PDF p.10) [The Abstract Data Type: Definition & Atomic/Composite Data]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【標準英文定義】**

<em>An Abstract Data Type is a data declaration packaged together with all meaningful operations that can be performed on the data.</em>

**【兩大核心要素】**

- **資料宣告 (Data Declaration)**：內部封裝的資料集合。
- **操作方法 (Operations)**：作用於該資料上的一組公開介面操作。

重點在於 **What it does**（外部使用者關心），而非 **How it is done**（內部實作細節）。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q17"></a>

### Q17. [Ch1] 資訊隱藏 (Information Hiding) 與封裝 (Encapsulation) 的本質差異？

> 📍 **講義出處**：DS_Ch1.pdf 投影片 Slide 20 (PDF p.10) [The Abstract Data Type] & Slide 27~28 (PDF p.14) [A Model for an ADT: Encapsulation]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **封裝 (Encapsulation)**：將資料屬性與對應的操作函式**捆綁打包**成單一模組單元（如 Class 或 ADT）。
- **資訊隱藏 (Information Hiding)**：將內部資料結構與演算法細節設為私有（Private），對外界隔離隱藏，調用端只能透過公開介面進行操作，無法直接窺探或竄改內部結構。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q18"></a>

### Q18. [Ch1] 結構化程式設計的三大基本控制結構 (Control Constructs)？

> 📍 **講義出處**：DS_Ch1.pdf 投影片 Slide 13~14 (PDF p.7) [Statement constructs: Sequence, Selection, Loop]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

根據 **Böhm-Jacopini 定理**，任何可計算之演算法皆僅需以下三種結構：

- **循序結構 (Sequence)**：由上而下無分支執行的敘述。
- **選擇結構 (Selection)**：依條件決定執行分支（如 `if-else`, `switch`）。
- **重複結構 (Iteration / Loop)**：依終止條件反覆執行區塊（如 `while`, `for`）。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q19"></a>

### Q19. [Ch1] 何謂原子資料 (Atomic Data) 與複合資料 (Composite Data)？各舉一例。

> 📍 **講義出處**：DS_Ch1.pdf 投影片 Slide 19~20 (PDF p.10) [The Abstract Data Type: Atomic data & Composite data]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **原子資料 (Atomic Data)**：被視為單一且不可再分割的實體。

  <em>範例</em>：整數 `int`、浮點數 `float`、單一字元 `char`。
- **複合資料 (Composite Data)**：由多個原子資料或其他複合資料組合而成。

  <em>範例</em>：電話號碼（國碼 + 區碼 + 本碼）、學生結構體（學號 + 姓名 + 成績列表）。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q20"></a>

### Q20. [Ch1] 合格虛擬碼演算法標頭 (Algorithm Header) 的 5 大必備元素？

> 📍 **講義出處**：DS_Ch1.pdf 投影片 Slide 5 (PDF p.3) [Algorithm header] & Slide 8~10 (PDF p.4~5) [Header in Pseudocode]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **Algorithm Name & Parameter List**（註明 `val` 傳值或 `ref` 傳參考）
- **Purpose**（簡述演算法的核心功能與任務）
- **Precondition**（執行前必須滿足的前提條件；若無寫 None）
- **Postcondition**（執行完畢後的副作用與外部狀態變更）
- **Return Condition**（回傳值的型態與代表意義）

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q21"></a>

### Q21. [Ch2] 哨兵搜尋法 (Sentinel Search) 的原理與優點 (Knuth 單一條件法則)？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 12~14 (PDF p.6~7) [Variations on Sequential Searches: Sentinel search / Algorithm 2-2]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **原理**：在陣列長度尾端額外開闢一格（`A[n]`），放入目標值作為「哨兵」。
- **優點**：將迴圈每輪的**雙重條件檢查**（邊界 `i < n` 且 `A[i] != target`）縮減為**單一條件檢查**（`A[i] != target`），免除每次迭代的邊界檢查，大幅降低 CPU 分支預測開銷與指令數。
- **判定**：迴圈結束後僅需檢查 `if (i < n)` 即知是否在真實資料中找到。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q22"></a>

### Q22. [Ch2] 機率搜尋法 (Probability Search / 80-20 Rule) 的啟發式對調機制？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 16~18 (PDF p.8~9) [Probability Search / Figure 2-3]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **背景**：現實世界資料存取強烈遵循 **80/20 法則**（20% 的熱門資料佔據 80% 的查詢量）。
- **啟發式對調機制**：每次成功搜尋到目標時，**將該元素與其前一個元素交換位置 (Swap with predecessor)**。
- **效果**：高頻被查的熱門元素會逐漸動態遷移至串列最前端，使後續搜尋平均時間顯著趨近於 `O(1)`。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q23"></a>

### Q23. [Ch2] 名詞解釋：Home Address、Collision、Synonym。

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 46~47 (PDF p.23~24) [Basic Concept of Hash Search: Synonyms, Collision, Home address, Prime Area]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **主位址 (Home Address)**：鍵值經由雜湊函式 `h(k)` 初次計算映射產生的陣列槽位索引。
- **碰撞 (Collision)**：兩個相異鍵值經雜湊後產生相同的主位址（`k₁ ≠ k₂` 但 `h(k₁) = h(k₂)`）。
- **同義詞 (Synonyms)**：映射至同一個主位址的鍵值集合（例如 `k₁` 與 `k₂` 互為同義詞）。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q24"></a>

### Q24. [Ch2] 負載因子 (Load Factor, α) 的公式、意義與建議範圍？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 78 (PDF p.39) [Collision Resolution ─ Three concepts: load factor of a hashed list]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【公式】**

`α = k / n = 已存入資料筆數 / 雜湊表總槽位數`

**【意義】**

衡量雜湊表的擁擠程度。α 越大，碰撞機率越高。

**【建議範圍】**

開放定址法通常將 α 壓制在 **0.5 ~ 0.7** 之間；若超過 0.75 通常需執行 Rehash 擴容。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q25"></a>

### Q25. [Ch2] 折疊法 (Folding Method)：Fold Shift vs. Fold Boundary 的操作差異？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 62~64 (PDF p.31~32) [Folding Method: Fold shift & Fold boundary / Figure 2-11]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

將鍵值切割為固定長度的小段後相加：

- **平移折疊 (Fold Shift)**：直接將各小段由左至右對齊相加。
- **邊界折疊 (Fold Boundary)**：如手風琴折紙，將**最左段與最右段進行左右鏡像反轉 (Reverse)** 後，再與中間段對齊相加。

<em>範例</em>：123456789 切成 123, 456, 789

Shift: `123 + 456 + 789`

Boundary: `321(反轉) + 456 + 987(反轉)`

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q26"></a>

### Q26. [Ch2] 為什麼平方取中法 (Midsquare Method) 能讓雜湊位址分佈非常均勻？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 60 (PDF p.30) [Midsquare Method]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【核心數學原理】**

因為在進行乘法（平方 `k²`）的直式計算過程中，**鍵值的每一個位數 (Every digit) 都會與其他位數交叉相乘，並全面影響到乘積中間幾個數位的數值**。

因此擷取中間數位能代表整個鍵值的綜合分佈特性，有效打散原鍵值的規律性。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q27"></a>

### Q27. [Ch3] 陣列 vs. 鏈結串列在隨機存取與已知位置插入刪除的複雜度比較？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 4~14 (PDF p.2~7) [Linear List Concepts] & Slide 17~19 (PDF p.9~10) [Linked List Concepts]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **隨機存取指定索引 (Random Access)**：

  - 陣列 (Array)：`O(1)`（記憶體位址連續，`Base + i * size` 直接計算）
  - 鏈結串列 (Linked List)：`O(n)`（必須從頭沿指標逐一走訪）
- **已知位置插入/刪除 (Insert/Delete at known location)**：

  - 陣列 (Array)：`O(n)`（需搬移後續所有元素）
  - 鏈結串列 (Linked List)：`O(1)`（只需修改相鄰指標賦值，無需搬移任何資料）

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q28"></a>

### Q28. [Ch3] 鏈結串列表頭結構 (Head Structure) 的三大元數據 (Metadata) 欄位？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 20~22 (PDF p.10~11) [Linked List Data Structure: Head structure & metadata]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- `count`：記錄串列中的節點總數量（使求串列長度由 `O(n)` 降為 `O(1)`）。
- `head`：指向串列第一個資料節點的指標。
- `rear`（可選）：指向串列最後一個資料節點的指標（使尾端插入由 `O(n)` 降為 `O(1)`）。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q29"></a>

### Q29. [Ch3] 雙向環狀鏈結串列 (Doubly Circular List) 的指標對稱性與優勢？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 97~98 (PDF p.49) [Doubly Linked Lists: Doubly linked circularly linked list / Figure 3-23]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **首尾指標指向**：

  - 首節點的 `prev` 指向**尾節點 (rear)**。
  - 尾節點的 `next` 指向**首節點 (head)**。
- **優勢**：整個結構形成閉合對稱雙向環，**不存在任何 NULL 指標**，消除了所有插入首尾邊界條件的特殊分支判斷。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q30"></a>

### Q30. [Ch2] 有序串列搜尋 (Ordered List Search) 的失敗提前終止機制與比對次數？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 20~22 (PDF p.10~11) [Variations on Sequential Searches: Ordered list search / Algorithm 2-4]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **機制**：由於資料已由小到大排序，循序走訪時一旦遇到當前元素數值**已大於目標值 (list[i] > target)**，即可斷定目標絕不可能出現在後續陣列中，立即終止搜尋並宣告失敗。
- **效益**：搜尋失敗時不必巡訪完全程 n 個元素，平均比對次數縮短為約 **n / 2 次**。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q31"></a>

### Q31. [Ch1] 虛擬碼參數傳遞模式：Pass by Value (val) vs. Pass by Reference (ref) 差異？

> 📍 **講義出處**：DS_Ch1.pdf 投影片 Slide 8 (PDF p.4) [Header in Pseudocode: pass by value (val) & pass by reference (ref)]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- `val` (Pass by Value)：函式接收到的是引數的**數值複本**。函式內部的修改只影響區域變數，呼叫端的外部變數不會受影響。
- `ref` (Pass by Reference)：函式接收到的是外部變數的**記憶體位址/別名**。函式內部的修改會直接改變外部變數的值，常用於回傳多個運算結果（Output Parameters）。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q32"></a>

### Q32. [Ch3] 單向鏈結串列走訪 (Traversal) 的標準虛擬碼寫法與終止條件？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 60~64 (PDF p.30~32) [Traverse List / Algorithm 3-8]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

```cpp
Node* pWalk = head;
while (pWalk != NULL) {
    // 執行處理操作 (如印出資料)
    cout << pWalk->data << endl;

    // 指標前移至下一個節點
    pWalk = pWalk->next;
}
```

**終止條件**：`pWalk == NULL`（代表已走訪過尾節點並抵達鏈結末端）。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

## 第三優先：其他核心列舉題、公式與特性對比

> 講義中可能出現「Please list N...」的地方與關鍵觀念分析

<a id="q33"></a>

### Q33. [Ch1] 良好變數命名 (Intelligent Data Names) 的三大禁忌與原則？

> 📍 **講義出處**：DS_Ch1.pdf 投影片 Slide 11~12 (PDF p.6) [1-1 Pseudocode: Intelligent data names principles]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【三大禁忌】**

- **禁止單字母變數**（除慣用的迴圈計數器 `i, j, k` 外，禁止 `a, b, x`）。
- **禁止空洞通用名稱**（Generic names，如 `count, sum, total, row, file`）。
- **禁止易引發混淆的簡陋縮寫**（如 `noStu` 易被誤認為「沒有學生」，應寫 `numOfStu`）。

**【原則】**：具備具體語意、採用駝峰式命名、陣列預設自索引 0 開始。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q34"></a>

### Q34. [Ch1] 程式設計典範的三大階段演進歷史與特點？

> 📍 **講義出處**：DS_Ch1.pdf 投影片 Slide 17~18 (PDF p.9) [1-2 The Abstract Data Type: Spaghetti code, Structured programming, ADT]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **Spaghetti Code（義大利麵條式程式碼）**：早期組合語言/Basic，大量依賴 `GOTO` 跳躍，流程凌亂難除錯。
- **Modular Programming（模組化程式設計，1970s）**：依功能拆解為獨立函式，由上而下結構化分解。
- **Object-Oriented Programming（物件導向程式設計，OOP）**：以物件為核心，將資料與方法封裝，強調重用性、多型與繼承。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q35"></a>

### Q35. [Ch1] n × n 矩陣相加 vs. 矩陣相乘的時間複雜度比較與推導？

> 📍 **講義出處**：DS_Ch1.pdf 投影片 Slide 45~50 (PDF p.23~25) [Algorithm Efficiency: Add matrices O(n^2) & Multiply matrices O(n^3)]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **矩陣相加 (Matrix Addition)**：

  雙重巢狀迴圈逐一走訪每個元素做相加：`n × n` 次，複雜度為 **O(n²)**。
- **矩陣相乘 (Matrix Multiplication)**：

  三重巢狀迴圈（外兩層定位 `C[i][j]`，內層計算列與行之內積）：`n × n × n` 次，複雜度為 **O(n³)**。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q36"></a>

### Q36. [Ch1] 為什麼漸進分析 (Big-O) 要捨棄常數係數與低階次要項？

> 📍 **講義出處**：DS_Ch1.pdf 投影片 Slide 40 (PDF p.20) [Big-O Notation: Derivation steps from f(n)]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- 漸進分析關注的是問題規模 `n → ∞` 趨近於無窮大時，演算法運行時間成長的**主導項 (Dominant Term)**。
- 例如 `3n² + 5n + 100` 中，當 `n` 極大時，`n²` 的增長速度徹底主宰全域，`5n` 與 `100` 的佔比微乎其微。
- 常數係數 3 受到硬體執行速度等因素影響，在跨演算法階層對比時不具決定性意義。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q37"></a>

### Q37. [Ch1] ADT 中的泛型實作：C++ Template 的語法及 TYPE 與 KTYPE 涵義？

> 📍 **講義出處**：DS_Ch1.pdf 投影片 Slide 31~32 (PDF p.16) [ADT Class Templates: template <class TYPE, class KTYPE>]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【語法宣告】**

`template <class TYPE, class KTYPE>`

**【代表涵義】**

- `TYPE`：代表節點所儲存的資料型別（Data / Payload）。
- `KTYPE`：代表用於比對與搜尋的鍵值型別（Key Type）。

允許資料結構與具體資料型態解耦，達成代碼高度重用。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q38"></a>

### Q38. [Ch2] 評估優良雜湊函式 (Hash Function) 的三大黃金指標？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 50 (PDF p.25) [Hashing Method: Three basic requirements for hash function]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **計算極速 (Easy and Fast to Compute)**：轉換過程必須是低開銷的 O(1) 常數時間運算。
- **分佈均勻 (Uniform Distribution)**：將鍵值均勻散佈於所有槽位，避免特定區域群聚。
- **最小化碰撞 (Minimize Collisions)**：盡可能減少同義詞的產生。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q39"></a>

### Q39. [Ch2] 講義所介紹的 8 種雜湊函式方法 (Hashing Methods) 名稱列舉？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 50 (PDF p.25) [Hashing Method: Eight hashing methods list]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **Direct Method**（直接對應法）
- **Subtraction Method**（減法對應法）
- **Modulo-Division Method**（取模除法）
- **Digit-Extraction Method**（數位擷取法）
- **Midsquare Method**（平方取中法）
- **Folding Method**（折疊法：平移與邊界）
- **Rotation Method**（旋轉法）
- **Pseudorandom Method**（偽亂數法）

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q40"></a>

### Q40. [Ch2] 二次探測 (Quadratic Probing) 的探測公式與兩大缺點限制？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 85~86 (PDF p.43) [Open Addressing: Quadratic Probe / Table 2-2 limitations]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【探測公式】**

`h_i(k) = (h(k) ± i²) mod m`

**【兩大缺點限制】**

- **Secondary Clustering（二次聚集）**：相同主位址的同義詞依然具有完全相同的探測路徑。
- **無法探測所有槽位**：若表長 `m` 未精心設計為 `4k+3` 型態的質數，二次探測將只能覆蓋部分槽位（例如 m=100 時僅能探測 59 個位址），其餘空槽永遠利用不到。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q41"></a>

### Q41. [Ch2] 桶子雜湊法 (Bucket Hashing) 的運作機制與主要缺點？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 95~96 (PDF p.48) [Bucket Hashing / Figure 2-17]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **運作機制**：每個雜湊位址（Bucket）分配多個槽位（Slots），可存放多筆資料，只有當桶子內部槽位全滿時才會發生溢位。
- **主要缺點**：若大部分桶子只存放少數資料，會產生嚴重的**內部空間浪費 (Internal Fragmentation)**。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q42"></a>

### Q42. [Ch2] 循序搜尋在最佳、最差與平均情況下的比對次數公式手算？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 34~36 (PDF p.17~18) [Analyzing Search Algorithms: Sequential search successful & unsuccessful]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

假設陣列長度為 n，各元素被搜尋機率均等（1/n）：

- **Best Case（最佳情況）**：第 1 筆即命中，比對 **1 次**，O(1)。
- **Worst Case（最差情況）**：最後一筆才命中，比對 **n 次**，O(n)。
- **Average Case（平均情況）**：

  `(1 + 2 + ... + n) / n = [n(n+1)/2] / n = (n+1) / 2 次`，O(n)。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q43"></a>

### Q43. [Ch2] 旋轉法 (Rotation Method) 解決連續流水號群聚的實務操作？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 65~66 (PDF p.33) [Rotation Method / Figure 2-12 Rotation hashing]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **適用場合**：鍵值為連續流水號，前段號碼均相同、僅末尾 1~2 碼相異（如 `980001, 980002, 980003`）。
- **操作方法**：將最後一位數字循環移至最前端，變為 `198000, 298000, 398000`，徹底破壞高位連續性，再搭配取模或折疊法均勻散佈。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q44"></a>

### Q44. [Ch2] 數位擷取法 (Digit-Extraction Method) 的位數選取原則？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 59 (PDF p.30) [Digit-Extraction Method: Selected digits extracted from key]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- 適用於鍵值結構固定但長度冗長（如身分證字號、學號）。
- **選取原則**：預先統計分析各個位數的分佈，**剔除分佈集中或固定的位數**（如入學年碼、性別代碼），僅保留分佈最為均勻發散的位數組成位址。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q45"></a>

### Q45. [Ch2] 雜湊取模除法若預期容納 70 筆資料且負載因子 α = 0.7，除數 m 應選多少？為什麼？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 56 (PDF p.28) [Modulo-Division (Prime)] & Slide 78 (PDF p.39) [Load factor α]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【計算】**

表長需求 `n = k / α = 70 / 0.7 = 100`。

**【選取原則】**

除數 `m` 應選取**大於等於 100 且最接近的質數**，即 **101**（或 103）。

⚠️ 絕對不能選 100（非質數且為偶數），否則與 2 或 5 有公因數的鍵值序列將引發嚴重聚集。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q46"></a>

### Q46. [Ch3] 陣列實作串列 vs. 鏈結串列實作串列的 6 大維度全方位對比？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 4~15 (PDF p.2~8) [Linear List Concepts] & Slide 17~22 (PDF p.9~11) [Linked List Concepts]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **記憶體配置**：陣列為連續記憶體；串列為動態分散配置 (Heap)。
- **容量彈性**：陣列固定大小易溢位；串列動態增刪無容量上限。
- **額外開銷**：陣列零指標開銷；串列每節點需 4~8 bytes 指標空間。
- **隨機存取**：陣列支援 O(1)；串列需 O(n) 循序走訪。
- **插入刪除**：陣列需搬移元素 O(n)；串列僅改指標 O(1)。
- **Cache 局部性**：陣列空間局部性極佳；串列指標分散易 Cache Miss。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q47"></a>

### Q47. [Ch3] 鏈結串列刪除首節點的三部曲與常見致命錯誤 (Use-After-Free)？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 39~40 (PDF p.20) [Delete Node: Delete First Node / Figure 3-12]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【正確三部曲】**

```cpp
Node* pTemp = head;  // 1. 先用暫存指標抓住首節點
head = head->next;   // 2. 表頭指標後移指向第二個節點
delete pTemp;        // 3. 安全釋放原首節點記憶體
```

⚠️ **致命錯誤**：先寫 `delete head;` 再寫 `head = head->next;`！此時記憶體已釋放，讀取其 `next` 是嚴重的 **Undefined Behavior (Use-After-Free)**！

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q48"></a>

### Q48. [Ch3] 串列附加 (Append Lists) 的步驟與有無尾指標的時間複雜度差異？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 84~88 (PDF p.42~44) [Append Lists / Algorithm 3-10]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

將串列 L2 附加至 L1 尾端：

- **無尾指標**：必須走訪 L1 全程找到尾節點，耗時 **O(len(L1))**。
- **維護有尾指標 rear**：直接執行 `L1->rear->next = L2->head; L1->rear = L2->rear;`，耗時僅需 **O(1)**！

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q49"></a>

### Q49. [Ch3] 串列陣列 (Array of Lists) 的定義與兩大應用實例？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 90~93 (PDF p.45~47) [Array of Lists / Figure 3-27 & Figure 3-28]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **定義**：元素型態為「串列表頭指標」的一維陣列（`Node* listArray[MAX];`）。
- **實例 1**：**雜湊表鏈結法 (Separate Chaining)**，陣列每格為一個桶子，指向同義詞鏈結串列。
- **實例 2**：**學校班級學生名冊**，陣列索引代表班級編號，每個槽位指向該班學生資料串列。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q50"></a>

### Q50. [Ch3] 串列銷毀 (Destroy List) 為何不能只寫 head = NULL？正確做法？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 65~66 (PDF p.33) [Destroy List / Algorithm 3-9]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **危害**：若只寫 `head = NULL`，只是斷開表頭指標，已配置在 Heap 上的所有節點實體依然佔用記憶體且永遠無法釋放，造成嚴重的 **Memory Leak**！
- **正確做法**：使用 `while` 迴圈搭配暫存指標逐一走訪並 `delete` 每個節點，最後再將 `head = NULL`。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q51"></a>

### Q51. [Ch3] 雙向鏈結串列相較於單向鏈結串列的兩大優點與兩大缺點？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 96~98 (PDF p.48~49) [Doubly Linked Lists: Advantages & Disadvantages]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **兩大優點**：

  - 支援**雙向走訪**（向前與向後均為 O(1) 前移）。
  - 給定節點指標 `pCur` 時，可在 **O(1)** 內直接取得前驅 `pCur->prev` 完成刪除，無需重頭搜尋前驅。
- **兩大缺點**：

  - 每個節點多耗費一個指標空間（多 4~8 bytes）。
  - 插入刪除需維護 4 個指標，程式邏輯較繁複且容易出錯。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q52"></a>

### Q52. [Ch3] 單向鏈結串列插入中間節點時，為何必須維護前驅指標 pPre？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 26 (PDF p.13) [Insert Node] & Slide 32 (PDF p.16) [Add Node in Middle]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

因為單向鏈結串列的指標只有單向向前（`next`），**無法反向獲取前一個節點**。

在指定節點前插入新節點時，必須修改前驅節點的 `next` 指向新節點，因此走訪時必須同時保留前驅指標 `pPre`。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q53"></a>

### Q53. [Ch2] 傳統循序搜尋在每次迴圈迭代時，內部進行的兩項條件檢查為何？

> 📍 **講義出處**：DS_Ch2.pdf 投影片 Slide 8~10 (PDF p.4~5) [Sequential Search Algorithm / Algorithm 2-1] (原標籤誤植為 Ch1，已修正為 Ch2)

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **邊界條件檢查 (Boundary Check)**：檢查是否已抵達陣列結尾（`index < size`）。
- **目標比對檢查 (Target Equality Check)**：檢查當前元素是否等於目標值（`list[index] == target`）。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---

<a id="q54"></a>

### Q54. [Ch3] 雙端操作在單向串列 vs. 維護 rear 的單向環狀串列效能差別？

> 📍 **講義出處**：DS_Ch3.pdf 投影片 Slide 94~95 (PDF p.47~48) [Circularly Linked Lists: Operations with Rear Pointer]

<details>
<summary>👉 點擊展開答案與詳細解析</summary>

- **一般單向串列**：若無尾指標，尾端操作需 O(n)；即便有尾指標，尾端刪除仍需 O(n) 搜尋倒數第二個節點。
- **維護 rear 的單向環狀串列**：尾端與首端均可在 **O(1)** 進行插入與讀取，極度適合作為 FIFO 佇列 (Queue) 的高效率實作結構。

</details>

[🔝 回到目錄](#📑-目錄導覽-table-of-contents)

---
