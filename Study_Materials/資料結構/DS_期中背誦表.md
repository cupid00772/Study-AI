# DS 期中背誦表 (Data Structures Active Recall Sheet)

> 📚 **課程名稱**：資料結構 (Data Structures)  
> 🎯 **考試範圍**：Chapter 1 ~ Chapter 3 全覆蓋 (54 核心考點)  
> 💡 **互動模式**：亦可直接於瀏覽器開啟互動網頁版本：[DS_期中背誦表.html](./DS_期中背誦表.html)  

---

## 📌 使用方法

1. 只放「**要背下來**」的東西：列舉題、考卷上要寫的英文句子、公式、解題步驟和指標圖解。
2. 由上到下依優先順序排，第一區沒背熟之前不要往下。
3. 先遮住答案（點擊 `<details>` 摺疊），心中自己默背作答，再展開對照。

---

## 第一優先：高頻考點、核心演算與必考圖解
> 配分最高、歷屆必考大題、關鍵演算法步驟與指標順序

### Q1. [Ch3] 單向鏈結串列插入新節點的「先連後斷」順序為何？若順序顛倒會造成什麼致命問題？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【先連後斷黃金法則】**

給定前驅指標 `pPre` 與待插入新節點 `pNew`：

```cpp
`// 1. 先連：新節點先指向後續節點
pNew->next = pPre->next;

// 2. 後斷：前驅節點改指向新節點
pPre->next = pNew;`
```

⚠️ **顛倒後果（致命錯誤）**：

若先執行 `pPre->next = pNew`，原本指向後續節點的指標直接被覆蓋，後續整條鏈結串列將永遠與前面脫鉤，造成 **Memory Leak（記憶體洩漏）** 且資料永久遺失！

</details>

### Q2. [Ch3] 雙向鏈結串列在前驅 pPre 與後繼 pSucc 間插入新節點 pNew 的 4 步指標賦值順序？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【雙向鏈結串列插入四部曲】**

```cpp
`// 步驟 1: 新節點向右連後繼
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
    list->rear = pNew; // 插入尾端`
```


</details>

### Q3. [Ch3] 雙向鏈結串列刪除節點 pCur 的指標重接步驟與記憶體釋放？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【雙向鏈結串列刪除步驟】**

```cpp
`// 步驟 1: 前驅節點跨過 pCur 向右指
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
delete pCur;`
```


</details>

### Q4. [Ch2] 雜湊取模除法 h(k) = k mod m 為什麼除數 m 必須選質數 (Prime Number)？選偶數或 2^p 會如何？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**選質數的原因**：質數能打破鍵值數列與表長的公因數週期性，使餘數在 `0 ~ m-1` 之間呈現最均勻的分佈，極小化碰撞。</li>
<li>**若選偶數**：偶數鍵值必映射至偶數位址，奇數鍵值必映射至奇數位址。若輸入資料偏向某類，將導致一半槽位閒置、另一半槽位嚴重碰撞！</li>
<li>**若選 2^p**：`k mod 2^p` 在二進位計算中等同於「直接截取鍵值的最低 p 個 bits」，高位元資訊完全未參與運算，大幅增加碰撞機率！</li>
</ul>

</details>

### Q5. [Ch2] 一次聚集 (Primary Clustering) vs. 二次聚集 (Secondary Clustering) 定義與成因差異？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**一次聚集 (Primary Clustering)**：
  <ul>
    <li>**成因**：由**線性探測 (Linear Probing)** 引發。</li>
    <li>**現象**：不同主位址的碰撞元素連續佔據相鄰槽位，形成連續大區塊；區塊越大，後續鍵值掉入該區塊的機率越高，造成探測步數雪崩式暴增。</li>
  </ul>
</li>
<li>**二次聚集 (Secondary Clustering)**：
  <ul>
    <li>**成因**：由**二次探測 (Quadratic Probing)** 或偽亂數探測引發。</li>
    <li>**現象**：擁有**相同主位址**的同義詞（Synonyms），其後續探測序列完全相同，沿著同一條路徑競爭。</li>
  </ul>
</li>
</ul>

</details>

### Q6. [Ch2] 鍵值位移 (Key Offset / Double Hashing) 為何能同時解決一次與二次聚集？公式為何？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【公式】**

`h_i(k) = (h(k) + i × step(k)) mod m`


**【原理與解決機制】**
<ul>
<li>**步長相依於鍵值**：`step(k)` 不再是常數，而是根據鍵值本身計算出的步長（例如 `step = 1 + (k mod (m-1))` 或 `floor(k/m)`）。</li>
<li>**消除 Primary Clustering**：步長不是固定的 1，碰撞時以動態跨度跳躍，絕不會在相鄰槽位堆疊成區塊。</li>
<li>**消除 Secondary Clustering**：即使兩個鍵值不幸擁有相同主位址 `h(k_1) = h(k_2)`，但因鍵值不同，算出的步長 `step(k_1) ≠ step(k_2)`，探測路徑徹底分流！</li>
</ul>

</details>

### Q7. [Ch2] 開放定址法刪除節點時為什麼絕對不能直接清成 NULL？什麼是 Tombstone？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**原因**：開放定址法的搜尋演算法在遇到空槽位 (NULL) 時會判定「搜尋失敗並終止」。若將刪除槽位直接設為 NULL，會切斷探測路徑，導致後續曾因碰撞而探測到更後方槽位的同義詞永遠無法被找到！</li>
<li>**解決方案（Tombstone / 墓碑值）**：刪除時改為標記為特殊狀態「墓碑 (Deleted)」。
  <ul>
    <li>**搜尋時**：視為「已佔用」，演算法繼續往後探測。</li>
    <li>**插入時**：視為「可用空槽」，允許覆寫新資料。</li>
  </ul>
</li>
</ul>

</details>

### Q8. [Ch1] Big-O 的嚴格數學定義 (Formal Definition) 與圖形條件？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【嚴格數學定義 (必背英文句子)】**

`f(n) = O(g(n))` if and only if there exist positive constants `c` and `n_0` such that:

<div style="text-align:center;margin:8px 0;font-weight:bold;font-size:1.1em;color:#2563eb;">
f(n) ≤ c · g(n), &nbsp; ∀ n ≥ n_0
</div>
**【意義】**

當問題規模 `n` 充分大（大於門檻值 `n_0`）時，`c · g(n)` 構成 `f(n)` 的漸進上界（Asymptotic Upper Bound）。

</details>

### Q9. [Ch1] 常見演算法複雜度 Big-O 階層由小到大（由快到慢）的排序？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<div style="font-size:1.15em;font-weight:bold;margin-bottom:8px;color:#059669;">
O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(n³) &lt; O(2ⁿ) &lt; O(n!)
</div>
<ul>
<li>**常數時間**：O(1)</li>
<li>**對數時間**：O(log n)</li>
<li>**線性時間**：O(n)</li>
<li>**線性對數**：O(n log n)</li>
<li>**多項式時間**：O(n²), O(n³)</li>
<li>**指數時間**：O(2ⁿ)</li>
<li>**階乘時間**：O(n!)</li>
</ul>

</details>

### Q10. [Ch1] 迴圈分析陷阱：相依二次迴圈 vs. 幾何收斂迴圈的複雜度差異？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**相依二次迴圈 (Dependent Loop)**：

  外層 `i` 從 1 走到 n，內層 `j` 從 1 走到 `i`：

  總執行次數 = `1 + 2 + ... + n = n(n+1)/2 = O(n²)`。
</li>


<li>**幾何等比收斂迴圈 (Geometric Loop - 經典大考陷阱！)**：

  外層 `i` 從 n 開始每次除以 2（`i = n; i > 0; i /= 2`），內層 `j` 從 1 走到 `i`：

  總次數 = `n + n/2 + n/4 + ... ≤ 2n = O(n)`！

  ⚠️ **注意**：絕非 O(n log n)！因為內層總和為等比級數收斂至 2n。
</li>
</ul>

</details>

### Q11. [Ch2] 二分搜尋法 (Binary Search) 的兩大嚴格前提條件？鏈結串列為何無法做二分搜尋？複雜度？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**兩大嚴格前提條件**：
  <ol>
    <li>串列資料必須**已經排序 (Sorted)**。</li>
    <li>資料結構必須支援**常數時間隨機存取 (Random Access: O(1))**，即**陣列 (Array)**。</li>
  </ol>
</li>
<li>**鏈結串列為何無法做二分搜尋**：鏈結串列不具隨機存取能力，計算出中點 `mid = (low + high)/2` 後，必須從頭走訪 O(n) 才能抵達該節點，直接破壞了二分搜尋減半的效益！</li>
<li>**時間複雜度**：`O(log₂ n)`。</li>
</ul>

</details>

### Q12. [Ch3] 單向環狀串列 (Circular List) 只保留尾指標 rear 的設計優勢與操作？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【核心優勢】**

透過單一尾指標 `rear`，即可在 **O(1) 常數時間** 同時存取串列首端與尾端：
<ul>
<li>**存取尾節點**：`rear`（O(1)）</li>
<li>**存取首節點**：`rear->next`（O(1)）</li>
<li>**首端插入**：新節點連向 `rear->next`，再令 `rear->next = new_node`（O(1)）</li>
<li>**尾端插入**：同首端插入後，多一行 `rear = new_node`（O(1)）</li>
</ul>
大幅節省表頭結構維護兩個指標（head, tail）的開銷，非常適合作為 Queue 的底層結構。

</details>

### Q13. [Ch3] 單向鏈結串列原地反轉 (Reverse Linked List) 演算法三指標寫法？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【原地反轉（In-place Reverse，空間複雜度 O(1)）】**

```cpp
`Node* reverseList(Node* head) {
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
}`
```


</details>

### Q14. [Ch3] 多重鏈結串列 (Multilinked Lists) 的設計哲學與兩大核心優勢？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**設計哲學**：**單一資料實體僅存一份，節點內包含多組獨立的指標欄位**（如 `nextByID`, `nextByGPA`）。</li>
<li>**兩大核心優勢**：
  <ol>
    <li>**巨幅節省記憶體**：無需為了支援多種排序方式而複製多份龐大記錄。</li>
    <li>**確保資料一致性 (Data Consistency)**：更新某一筆記錄的資料內容時，所有走訪鏈結自動同步更新，絕不會產生多份複本資料不一致的異常。</li>
  </ol>
</li>
</ul>

</details>

### Q15. [Ch2] 鏈結串列法 (Separate Chaining) 的負載因子 α 限制與三大優點？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**負載因子限制**：**α 可以大於 1！**（不受限於表長，例如 10 個槽位可容納 100 筆資料，α = 10）。</li>
<li>**三大核心優點**：
  <ol>
    <li>**徹底杜絕聚集**：不會發生 Primary Clustering 與 Secondary Clustering。</li>
    <li>**記憶體動態彈性**：節點動態配置於 Heap，容量無限擴充。</li>
    <li>**刪除操作單純**：直接釋放節點記憶體，完全無需維護墓碑 (Tombstone)。</li>
  </ol>
</li>
<li>**主要缺點**：每個節點多耗費指標空間；快取局部性較差。</li>
</ul>

</details>

## 第二優先：簡答出過的定義題與專有名詞
> 必背英文原句、名詞解釋、單行定義題

### Q1. [Ch1] ADT (Abstract Data Type) 的標準英文定義與兩大要素？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【標準英文定義】**

<em>An Abstract Data Type is a data declaration packaged together with all meaningful operations that can be performed on the data.</em>


**【兩大核心要素】**
<ol>
<li>**資料宣告 (Data Declaration)**：內部封裝的資料集合。</li>
<li>**操作方法 (Operations)**：作用於該資料上的一組公開介面操作。</li>
</ol>
重點在於 **What it does**（外部使用者關心），而非 **How it is done**（內部實作細節）。

</details>

### Q2. [Ch1] 資訊隱藏 (Information Hiding) 與封裝 (Encapsulation) 的本質差異？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**封裝 (Encapsulation)**：將資料屬性與對應的操作函式**捆綁打包**成單一模組單元（如 Class 或 ADT）。</li>
<li>**資訊隱藏 (Information Hiding)**：將內部資料結構與演算法細節設為私有（Private），對外界隔離隱藏，調用端只能透過公開介面進行操作，無法直接窺探或竄改內部結構。</li>
</ul>

</details>

### Q3. [Ch1] 結構化程式設計的三大基本控制結構 (Control Constructs)？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

根據 **Böhm-Jacopini 定理**，任何可計算之演算法皆僅需以下三種結構：
<ol>
<li>**循序結構 (Sequence)**：由上而下無分支執行的敘述。</li>
<li>**選擇結構 (Selection)**：依條件決定執行分支（如 `if-else`, `switch`）。</li>
<li>**重複結構 (Iteration / Loop)**：依終止條件反覆執行區塊（如 `while`, `for`）。</li>
</ol>

</details>

### Q4. [Ch1] 何謂原子資料 (Atomic Data) 與複合資料 (Composite Data)？各舉一例。
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**原子資料 (Atomic Data)**：被視為單一且不可再分割的實體。

  <em>範例</em>：整數 `int`、浮點數 `float`、單一字元 `char`。
</li>
<li>**複合資料 (Composite Data)**：由多個原子資料或其他複合資料組合而成。

  <em>範例</em>：電話號碼（國碼 + 區碼 + 本碼）、學生結構體（學號 + 姓名 + 成績列表）。
</li>
</ul>

</details>

### Q5. [Ch1] 合格虛擬碼演算法標頭 (Algorithm Header) 的 5 大必備元素？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ol>
<li>**Algorithm Name & Parameter List**（註明 `val` 傳值或 `ref` 傳參考）</li>
<li>**Purpose**（簡述演算法的核心功能與任務）</li>
<li>**Precondition**（執行前必須滿足的前提條件；若無寫 None）</li>
<li>**Postcondition**（執行完畢後的副作用與外部狀態變更）</li>
<li>**Return Condition**（回傳值的型態與代表意義）</li>
</ol>

</details>

### Q6. [Ch2] 哨兵搜尋法 (Sentinel Search) 的原理與優點 (Knuth 單一條件法則)？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**原理**：在陣列長度尾端額外開闢一格（`A[n]`），放入目標值作為「哨兵」。</li>
<li>**優點**：將迴圈每輪的**雙重條件檢查**（邊界 `i &lt; n` 且 `A[i] != target`）縮減為**單一條件檢查**（`A[i] != target`），免除每次迭代的邊界檢查，大幅降低 CPU 分支預測開銷與指令數。</li>
<li>**判定**：迴圈結束後僅需檢查 `if (i &lt; n)` 即知是否在真實資料中找到。</li>
</ul>

</details>

### Q7. [Ch2] 機率搜尋法 (Probability Search / 80-20 Rule) 的啟發式對調機制？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**背景**：現實世界資料存取強烈遵循 **80/20 法則**（20% 的熱門資料佔據 80% 的查詢量）。</li>
<li>**啟發式對調機制**：每次成功搜尋到目標時，**將該元素與其前一個元素交換位置 (Swap with predecessor)**。</li>
<li>**效果**：高頻被查的熱門元素會逐漸動態遷移至串列最前端，使後續搜尋平均時間顯著趨近於 `O(1)`。</li>
</ul>

</details>

### Q8. [Ch2] 名詞解釋：Home Address、Collision、Synonym。
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**主位址 (Home Address)**：鍵值經由雜湊函式 `h(k)` 初次計算映射產生的陣列槽位索引。</li>
<li>**碰撞 (Collision)**：兩個相異鍵值經雜湊後產生相同的主位址（`k₁ ≠ k₂` 但 `h(k₁) = h(k₂)`）。</li>
<li>**同義詞 (Synonyms)**：映射至同一個主位址的鍵值集合（例如 `k₁` 與 `k₂` 互為同義詞）。</li>
</ul>

</details>

### Q9. [Ch2] 負載因子 (Load Factor, α) 的公式、意義與建議範圍？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【公式】**

`α = k / n = 已存入資料筆數 / 雜湊表總槽位數`


**【意義】**

衡量雜湊表的擁擠程度。α 越大，碰撞機率越高。

**【建議範圍】**

開放定址法通常將 α 壓制在 **0.5 ~ 0.7** 之間；若超過 0.75 通常需執行 Rehash 擴容。

</details>

### Q10. [Ch2] 折疊法 (Folding Method)：Fold Shift vs. Fold Boundary 的操作差異？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

將鍵值切割為固定長度的小段後相加：
<ul>
<li>**平移折疊 (Fold Shift)**：直接將各小段由左至右對齊相加。</li>
<li>**邊界折疊 (Fold Boundary)**：如手風琴折紙，將**最左段與最右段進行左右鏡像反轉 (Reverse)** 後，再與中間段對齊相加。</li>
</ul>
<em>範例</em>：123456789 切成 123, 456, 789

Shift: `123 + 456 + 789`

Boundary: `321(反轉) + 456 + 987(反轉)`

</details>

### Q11. [Ch2] 為什麼平方取中法 (Midsquare Method) 能讓雜湊位址分佈非常均勻？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【核心數學原理】**

因為在進行乘法（平方 `k²`）的直式計算過程中，**鍵值的每一個位數 (Every digit) 都會與其他位數交叉相乘，並全面影響到乘積中間幾個數位的數值**。

因此擷取中間數位能代表整個鍵值的綜合分佈特性，有效打散原鍵值的規律性。

</details>

### Q12. [Ch3] 陣列 vs. 鏈結串列在隨機存取與已知位置插入刪除的複雜度比較？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**隨機存取指定索引 (Random Access)**：
  <ul>
    <li>陣列 (Array)：`O(1)`（記憶體位址連續，`Base + i * size` 直接計算）</li>
    <li>鏈結串列 (Linked List)：`O(n)`（必須從頭沿指標逐一走訪）</li>
  </ul>
</li>
<li>**已知位置插入/刪除 (Insert/Delete at known location)**：
  <ul>
    <li>陣列 (Array)：`O(n)`（需搬移後續所有元素）</li>
    <li>鏈結串列 (Linked List)：`O(1)`（只需修改相鄰指標賦值，無需搬移任何資料）</li>
  </ul>
</li>
</ul>

</details>

### Q13. [Ch3] 鏈結串列表頭結構 (Head Structure) 的三大元數據 (Metadata) 欄位？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ol>
<li>`count`：記錄串列中的節點總數量（使求串列長度由 `O(n)` 降為 `O(1)`）。</li>
<li>`head`：指向串列第一個資料節點的指標。</li>
<li>`rear`（可選）：指向串列最後一個資料節點的指標（使尾端插入由 `O(n)` 降為 `O(1)`）。</li>
</ol>

</details>

### Q14. [Ch3] 雙向環狀鏈結串列 (Doubly Circular List) 的指標對稱性與優勢？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**首尾指標指向**：
  <ul>
    <li>首節點的 `prev` 指向**尾節點 (rear)**。</li>
    <li>尾節點的 `next` 指向**首節點 (head)**。</li>
  </ul>
</li>
<li>**優勢**：整個結構形成閉合對稱雙向環，**不存在任何 NULL 指標**，消除了所有插入首尾邊界條件的特殊分支判斷。</li>
</ul>

</details>

### Q15. [Ch2] 有序串列搜尋 (Ordered List Search) 的失敗提前終止機制與比對次數？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**機制**：由於資料已由小到大排序，循序走訪時一旦遇到當前元素數值**已大於目標值 (list[i] &gt; target)**，即可斷定目標絕不可能出現在後續陣列中，立即終止搜尋並宣告失敗。</li>
<li>**效益**：搜尋失敗時不必巡訪完全程 n 個元素，平均比對次數縮短為約 **n / 2 次**。</li>
</ul>

</details>

### Q16. [Ch1] 虛擬碼參數傳遞模式：Pass by Value (val) vs. Pass by Reference (ref) 差異？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>`val` (Pass by Value)：函式接收到的是引數的**數值複本**。函式內部的修改只影響區域變數，呼叫端的外部變數不會受影響。</li>
<li>`ref` (Pass by Reference)：函式接收到的是外部變數的**記憶體位址/別名**。函式內部的修改會直接改變外部變數的值，常用於回傳多個運算結果（Output Parameters）。</li>
</ul>

</details>

### Q17. [Ch3] 單向鏈結串列走訪 (Traversal) 的標準虛擬碼寫法與終止條件？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>


```cpp
`Node* pWalk = head;
while (pWalk != NULL) {
    // 執行處理操作 (如印出資料)
    cout << pWalk->data << endl;
    
    // 指標前移至下一個節點
    pWalk = pWalk->next;
}`
```

**終止條件**：`pWalk == NULL`（代表已走訪過尾節點並抵達鏈結末端）。

</details>

## 第三優先：其他核心列舉題、公式與特性對比
> 講義中可能出現「Please list N...」的地方與關鍵觀念分析

### Q1. [Ch1] 良好變數命名 (Intelligent Data Names) 的三大禁忌與原則？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【三大禁忌】**
<ol>
<li>**禁止單字母變數**（除慣用的迴圈計數器 `i, j, k` 外，禁止 `a, b, x`）。</li>
<li>**禁止空洞通用名稱**（Generic names，如 `count, sum, total, row, file`）。</li>
<li>**禁止易引發混淆的簡陋縮寫**（如 `noStu` 易被誤認為「沒有學生」，應寫 `numOfStu`）。</li>
</ol>
**【原則】**：具備具體語意、採用駝峰式命名、陣列預設自索引 0 開始。

</details>

### Q2. [Ch1] 程式設計典範的三大階段演進歷史與特點？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ol>
<li>**Spaghetti Code（義大利麵條式程式碼）**：早期組合語言/Basic，大量依賴 `GOTO` 跳躍，流程凌亂難除錯。</li>
<li>**Modular Programming（模組化程式設計，1970s）**：依功能拆解為獨立函式，由上而下結構化分解。</li>
<li>**Object-Oriented Programming（物件導向程式設計，OOP）**：以物件為核心，將資料與方法封裝，強調重用性、多型與繼承。</li>
</ol>

</details>

### Q3. [Ch1] n × n 矩陣相加 vs. 矩陣相乘的時間複雜度比較與推導？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**矩陣相加 (Matrix Addition)**：

  雙重巢狀迴圈逐一走訪每個元素做相加：`n × n` 次，複雜度為 **O(n²)**。
</li>
<li>**矩陣相乘 (Matrix Multiplication)**：

  三重巢狀迴圈（外兩層定位 `C[i][j]`，內層計算列與行之內積）：`n × n × n` 次，複雜度為 **O(n³)**。
</li>
</ul>

</details>

### Q4. [Ch1] 為什麼漸進分析 (Big-O) 要捨棄常數係數與低階次要項？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>漸進分析關注的是問題規模 `n → ∞` 趨近於無窮大時，演算法運行時間成長的**主導項 (Dominant Term)**。</li>
<li>例如 `3n² + 5n + 100` 中，當 `n` 極大時，`n²` 的增長速度徹底主宰全域，`5n` 與 `100` 的佔比微乎其微。</li>
<li>常數係數 3 受到硬體執行速度等因素影響，在跨演算法階層對比時不具決定性意義。</li>
</ul>

</details>

### Q5. [Ch1] ADT 中的泛型實作：C++ Template 的語法及 TYPE 與 KTYPE 涵義？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【語法宣告】**

`template &lt;class TYPE, class KTYPE&gt;`


**【代表涵義】**
<ul>
<li>`TYPE`：代表節點所儲存的資料型別（Data / Payload）。</li>
<li>`KTYPE`：代表用於比對與搜尋的鍵值型別（Key Type）。</li>
</ul>
允許資料結構與具體資料型態解耦，達成代碼高度重用。

</details>

### Q6. [Ch2] 評估優良雜湊函式 (Hash Function) 的三大黃金指標？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ol>
<li>**計算極速 (Easy and Fast to Compute)**：轉換過程必須是低開銷的 O(1) 常數時間運算。</li>
<li>**分佈均勻 (Uniform Distribution)**：將鍵值均勻散佈於所有槽位，避免特定區域群聚。</li>
<li>**最小化碰撞 (Minimize Collisions)**：盡可能減少同義詞的產生。</li>
</ol>

</details>

### Q7. [Ch2] 講義所介紹的 8 種雜湊函式方法 (Hashing Methods) 名稱列舉？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ol>
<li>**Direct Method**（直接對應法）</li>
<li>**Subtraction Method**（減法對應法）</li>
<li>**Modulo-Division Method**（取模除法）</li>
<li>**Digit-Extraction Method**（數位擷取法）</li>
<li>**Midsquare Method**（平方取中法）</li>
<li>**Folding Method**（折疊法：平移與邊界）</li>
<li>**Rotation Method**（旋轉法）</li>
<li>**Pseudorandom Method**（偽亂數法）</li>
</ol>

</details>

### Q8. [Ch2] 二次探測 (Quadratic Probing) 的探測公式與兩大缺點限制？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【探測公式】**

`h_i(k) = (h(k) ± i²) mod m`


**【兩大缺點限制】**
<ol>
<li>**Secondary Clustering（二次聚集）**：相同主位址的同義詞依然具有完全相同的探測路徑。</li>
<li>**無法探測所有槽位**：若表長 `m` 未精心設計為 `4k+3` 型態的質數，二次探測將只能覆蓋部分槽位（例如 m=100 時僅能探測 59 個位址），其餘空槽永遠利用不到。</li>
</ol>

</details>

### Q9. [Ch2] 桶子雜湊法 (Bucket Hashing) 的運作機制與主要缺點？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**運作機制**：每個雜湊位址（Bucket）分配多個槽位（Slots），可存放多筆資料，只有當桶子內部槽位全滿時才會發生溢位。</li>
<li>**主要缺點**：若大部分桶子只存放少數資料，會產生嚴重的**內部空間浪費 (Internal Fragmentation)**。</li>
</ul>

</details>

### Q10. [Ch2] 循序搜尋在最佳、最差與平均情況下的比對次數公式手算？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

假設陣列長度為 n，各元素被搜尋機率均等（1/n）：
<ul>
<li>**Best Case（最佳情況）**：第 1 筆即命中，比對 **1 次**，O(1)。</li>
<li>**Worst Case（最差情況）**：最後一筆才命中，比對 **n 次**，O(n)。</li>
<li>**Average Case（平均情況）**：

  `(1 + 2 + ... + n) / n = [n(n+1)/2] / n = (n+1) / 2 次`，O(n)。
</li>
</ul>

</details>

### Q11. [Ch2] 旋轉法 (Rotation Method) 解決連續流水號群聚的實務操作？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**適用場合**：鍵值為連續流水號，前段號碼均相同、僅末尾 1~2 碼相異（如 `980001, 980002, 980003`）。</li>
<li>**操作方法**：將最後一位數字循環移至最前端，變為 `198000, 298000, 398000`，徹底破壞高位連續性，再搭配取模或折疊法均勻散佈。</li>
</ul>

</details>

### Q12. [Ch2] 數位擷取法 (Digit-Extraction Method) 的位數選取原則？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>適用於鍵值結構固定但長度冗長（如身分證字號、學號）。</li>
<li>**選取原則**：預先統計分析各個位數的分佈，**剔除分佈集中或固定的位數**（如入學年碼、性別代碼），僅保留分佈最為均勻發散的位數組成位址。</li>
</ul>

</details>

### Q13. [Ch2] 雜湊取模除法若預期容納 70 筆資料且負載因子 α = 0.7，除數 m 應選多少？為什麼？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【計算】**

表長需求 `n = k / α = 70 / 0.7 = 100`。


**【選取原則】**

除數 `m` 應選取**大於等於 100 且最接近的質數**，即 **101**（或 103）。

⚠️ 絕對不能選 100（非質數且為偶數），否則與 2 或 5 有公因數的鍵值序列將引發嚴重聚集。

</details>

### Q14. [Ch3] 陣列實作串列 vs. 鏈結串列實作串列的 6 大維度全方位對比？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ol>
<li>**記憶體配置**：陣列為連續記憶體；串列為動態分散配置 (Heap)。</li>
<li>**容量彈性**：陣列固定大小易溢位；串列動態增刪無容量上限。</li>
<li>**額外開銷**：陣列零指標開銷；串列每節點需 4~8 bytes 指標空間。</li>
<li>**隨機存取**：陣列支援 O(1)；串列需 O(n) 循序走訪。</li>
<li>**插入刪除**：陣列需搬移元素 O(n)；串列僅改指標 O(1)。</li>
<li>**Cache 局部性**：陣列空間局部性極佳；串列指標分散易 Cache Miss。</li>
</ol>

</details>

### Q15. [Ch3] 鏈結串列刪除首節點的三部曲與常見致命錯誤 (Use-After-Free)？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

**【正確三部曲】**

```cpp
`Node* pTemp = head;  // 1. 先用暫存指標抓住首節點
head = head->next;   // 2. 表頭指標後移指向第二個節點
delete pTemp;        // 3. 安全釋放原首節點記憶體`
```

⚠️ **致命錯誤**：先寫 `delete head;` 再寫 `head = head->next;`！此時記憶體已釋放，讀取其 `next` 是嚴重的 **Undefined Behavior (Use-After-Free)**！

</details>

### Q16. [Ch3] 串列附加 (Append Lists) 的步驟與有無尾指標的時間複雜度差異？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

將串列 L2 附加至 L1 尾端：
<ul>
<li>**無尾指標**：必須走訪 L1 全程找到尾節點，耗時 **O(len(L1))**。</li>
<li>**維護有尾指標 rear**：直接執行 `L1->rear->next = L2->head; L1->rear = L2->rear;`，耗時僅需 **O(1)**！</li>
</ul>

</details>

### Q17. [Ch3] 串列陣列 (Array of Lists) 的定義與兩大應用實例？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**定義**：元素型態為「串列表頭指標」的一維陣列（`Node* listArray[MAX];`）。</li>
<li>**實例 1**：**雜湊表鏈結法 (Separate Chaining)**，陣列每格為一個桶子，指向同義詞鏈結串列。</li>
<li>**實例 2**：**學校班級學生名冊**，陣列索引代表班級編號，每個槽位指向該班學生資料串列。</li>
</ul>

</details>

### Q18. [Ch3] 串列銷毀 (Destroy List) 為何不能只寫 head = NULL？正確做法？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**危害**：若只寫 `head = NULL`，只是斷開表頭指標，已配置在 Heap 上的所有節點實體依然佔用記憶體且永遠無法釋放，造成嚴重的 **Memory Leak**！</li>
<li>**正確做法**：使用 `while` 迴圈搭配暫存指標逐一走訪並 `delete` 每個節點，最後再將 `head = NULL`。</li>
</ul>

</details>

### Q19. [Ch3] 雙向鏈結串列相較於單向鏈結串列的兩大優點與兩大缺點？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**兩大優點**：
  <ol>
    <li>支援**雙向走訪**（向前與向後均為 O(1) 前移）。</li>
    <li>給定節點指標 `pCur` 時，可在 **O(1)** 內直接取得前驅 `pCur->prev` 完成刪除，無需重頭搜尋前驅。</li>
  </ol>
</li>
<li>**兩大缺點**：
  <ol>
    <li>每個節點多耗費一個指標空間（多 4~8 bytes）。</li>
    <li>插入刪除需維護 4 個指標，程式邏輯較繁複且容易出錯。</li>
  </ol>
</li>
</ul>

</details>

### Q20. [Ch3] 單向鏈結串列插入中間節點時，為何必須維護前驅指標 pPre？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

因為單向鏈結串列的指標只有單向向前（`next`），**無法反向獲取前一個節點**。

在指定節點前插入新節點時，必須修改前驅節點的 `next` 指向新節點，因此走訪時必須同時保留前驅指標 `pPre`。

</details>

### Q21. [Ch1] 傳統循序搜尋在每次迴圈迭代時，內部進行的兩項條件檢查為何？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ol>
<li>**邊界條件檢查 (Boundary Check)**：檢查是否已抵達陣列結尾（`index < size`）。</li>
<li>**目標比對檢查 (Target Equality Check)**：檢查當前元素是否等於目標值（`list[index] == target`）。</li>
</ol>

</details>

### Q22. [Ch3] 雙端操作在單向串列 vs. 維護 rear 的單向環狀串列效能差別？
<details>
<summary>👉 點擊展開答案與詳細解析</summary>

<ul>
<li>**一般單向串列**：若無尾指標，尾端操作需 O(n)；即便有尾指標，尾端刪除仍需 O(n) 搜尋倒數第二個節點。</li>
<li>**維護 rear 的單向環狀串列**：尾端與首端均可在 **O(1)** 進行插入與讀取，極度適合作為 FIFO 佇列 (Queue) 的高效率實作結構。</li>
</ul>

</details>
