# 國立臺灣聯合大學系統 114學年度 計算機概論 模擬測驗 解答卷 (Answers 4)

## 考點分佈總表

| 題號 | 測驗考點 / 知識領域 | 難度標籤 | 弱點針對 (Targeted) |
| :--- | :--- | :---: | :---: |
| 1 | 計算機組織 - Memory Hierarchy & Cache | [Hard] | ✅ Cache 觀念釐清 |
| 2 | 作業系統 - Process State Transitions | [Medium] | ✅ Timer interrupt 觸發 |
| 3 | 作業系統 - Process Management | [Medium] | ✅ Zombie Process 觀念 |
| 4 | 作業系統 - Virtual Memory & Page Fault | [Easy] | ✅ Page Fault 真正成因 |
| 5 | 演算法 - Heap Construction | [Medium] | ✅ Max-Heap 建構複雜度 |
| 6 | 演算法 - Complexity Classes (P vs NP) | [Hard] | ✅ P/NP/NP-complete 關係 |
| 7 | 程式設計 - C Language Pointers | [Hard] | |
| 8 | 程式設計 - Recursion & Bitwise Operations | [Medium] | |
| 9 | 資料結構 - Binary Tree Traversals | [Medium] | |
| 10 | 計算機組織 - Pipeline Hazards & Stalls | [Hard] | |
| 11 | 作業系統 - Deadlock Prevention Formula | [Hard] | |
| 12 | 網路原理 - IP Subnetting | [Medium] | |
| 13 | 數位邏輯 - Two's Complement Range | [Easy] | |
| 14 | 資料結構 - Hash Table Collision Handling | [Hard] | |
| 15 | 演算法 - Time Complexity Analysis | [Hard] | |
| 16 | 資料庫 - ACID Properties | [Easy] | |
| 17 | 程式設計 - C++ Virtual Destructor | [Medium] | |
| 18 | 計算機組織 - IEEE 754 Floating Point | [Medium] | |
| 19 | 作業系統 - Page Replacement Algorithms | [Medium] | |
| 20 | 資訊安全 - Cryptography | [Easy] | |

---

## 評分標準與建議 (Marking Scheme)
- **總分：** 100 分
- **配分：** 共 20 題，每題 5 分，答錯不倒扣。
- **實力評估：**
  - **85分以上：** 觀念非常扎實，具備頂尖錄取水準。
  - **70 - 80分：** 基本功良好，但需針對少數 Hard 題目加強細節。
  - **50 - 65分：** 尚可，請特別檢討標記為 ✅ 的弱點針對題型，這些是前次測驗的盲點。
  - **50分以下：** 基礎知識有待補強，建議重新溫習課本核心觀念。

---

## 詳細解說 (Detailed Solutions)

### 單選題 (每題 5 分)

**1. Answer: `(E)`**
- **考點：** Cache 的區塊大小 (Block Size) 影響。
- **解析：** 雖然較大的 Block Size 確實能提升空間局部性 (Spatial Locality)，但若 Cache 總容量固定，Block Size 變大會導致 Cache 內能容納的 Block 總數減少。這將增加 Conflict Misses 與 Capacity Misses，因此一味增加 Block Size 並不能「永遠降低」Miss rate，Miss rate 最終會呈現 U 型曲線。這是常見的陷阱題。

**2. Answer: `(C)`**
- **考點：** Process States。
- **解析：** 在多元程式 (Multiprogramming/Time-sharing) 環境中，當一個行程的 CPU 時間片 (Time Quantum) 耗盡時，作業系統的硬體計時器 (Timer) 會發出 Interrupt。此時作業系統會將該行程的狀態從執行中 (Running) 強制切換回就緒狀態 (Ready)，這稱為 Preemption。

**3. Answer: `(C)`**
- **考點：** Zombie Process 的成因。
- **解析：** 當一個子行程 (Child Process) 結束執行，作業系統會釋放其大部分資源，但仍會在 Process Table 中保留其 Exit status 等資訊。如果此時父行程 (Parent Process) 還沒有呼叫 `wait()` 或 `waitpid()` 來讀取這些狀態資訊，該子行程就會處於僵屍狀態 (Zombie Process)。選項 B 描述的是孤兒行程 (Orphan Process)。

**4. Answer: `(B)`**
- **考點：** Page Fault 定義。
- **解析：** Page Fault（分頁錯誤）發生的唯一原因是：CPU 試圖存取的虛擬記憶體頁面 (Page)，目前不在實體的 Main Memory 中 (通常還在磁碟上)，因此觸發 Interrupt 請求 OS 將其載入。並不是因為實體記憶體空間滿了。

**5. Answer: `(C)`**
- **考點：** Max-Heap 建構。
- **解析：** 若使用 Bottom-up (由下而上) 的 `heapify` 演算法從無序陣列建構 Max-Heap，其數學級數證明時間複雜度為嚴格的 $O(n)$。若是逐一 Insert，最差才是 $O(n \log n)$，但這不是「最佳」方法。

**6. Answer: `(C)`**
- **考點：** P 與 NP 理論。
- **解析：** $P$ 代表可以在多項式時間內「解決」的問題集合；$NP$ 代表可以在多項式時間內「驗證」解的問題集合。若假設 $P \neq NP$，則那些最難的 NP 問題 (即 NP-complete) 絕對不可能在多項式時間內被解決，因此 P 與 NP-complete 的交集為空集合。

**7. Answer: `(C)`**
- **考點：** C 語言指標運算與後置/前置遞增。
- **解析：**
  - 最初 `p` 指向 `arr[0]` (值為 10)。
  - `val1 = *(p++);` 是後置遞增，先取 `p` 的值 (10) 賦給 `val1`，然後 `p` 往前移一格指向 `arr[1]`。
  - `val2 = *(++p);` 是前置遞增，`p` 先往前移一格指向 `arr[2]` (值為 30)，然後取值賦給 `val2`。
  - 因此輸出為 `10 30`。

**8. Answer: `(B)`**
- **考點：** 遞迴與位元運算。
- **解析：** 此遞迴函式的功能是計算整數二進位表示法中 `1` 的數量。
  - `n & 1` 會取得最右邊的 bit (是否為奇數)。
  - `n >> 1` 是將數值除以 2 (右移一位)。
  - 十進位的 43 轉為二進位是 `101011`，裡面有 4 個 `1`，所以輸出為 4。

**9. Answer: `(A)`**
- **考點：** Binary Tree Traversals 樹的走訪。
- **解析：**
  - 由 Preorder (前序) `A, B, D, E, C, F, G` 可知，Root 是 `A`。
  - 在 Inorder (中序) `D, B, E, A, F, C, G` 中，`A` 的左邊 `D, B, E` 是左子樹，右邊 `F, C, G` 是右子樹。
  - 分析左子樹 `{D, B, E}`：Preorder 順序為 `B, D, E`，所以 `B` 是根；Inorder 為 `D, B, E`，推知 `D` 是 `B` 的左子，`E` 是右子。
  - 分析右子樹 `{F, C, G}`：Preorder 為 `C, F, G`，所以 `C` 是根；Inorder 為 `F, C, G`，推知 `F` 是 `C` 的左子，`G` 是右子。
  - Postorder (後序) 順序為「左、右、中」，左子樹後序：`D, E, B`；右子樹後序：`F, G, C`；加上總根 `A`。結果為：`D, E, B, F, G, C, A`。

**10. Answer: `(C)`**
- **考點：** Pipeline Hazards 管線化危險。
- **解析：**
  - Instruction 1 在 `WB` 階段的「前半週期」寫入暫存器。
  - Instruction 2 需要在 `ID` 階段的「後半週期」讀出資料。
  - 因為沒有 Forwarding，I2 必須等到 I1 的 `WB` 階段到達時才能順利讀取。
  - I1 的管線：`IF  ID  EX  MEM  WB` (第 5 週期寫回)
  - I2 的管線：`    IF  ID (stall) (stall) ID` (必須在第 5 週期才能讀)
  - 因此需要插入 2 個 stall cycles。

**11. Answer: `(B)`**
- **考點：** Deadlock Prevention (死結免除)。
- **解析：** 為了保證絕對不發生死結，資源總數 $R$ 必須滿足：$R > \sum (\text{Max}_{i} - 1)$。
  - 有 5 個行程，每個最大需求為 3。
  - $R > 5 \times (3 - 1) = 10$。
  - 因此 $R$ 至少需要為 11，才能保證即便所有行程都拿到了 2 個資源，系統中還有 1 個剩餘資源可以打破循環等待。

**12. Answer: `(C)`**
- **考點：** Subnetting 子網路切割。
- **解析：**
  - Subnet Mask `255.255.255.192` 的最後一個 byte `192` 二進位為 `11000000`。
  - 借了 2 個 host bits 當作 network bits，每個子網的 Block Size 是 $256 - 192 = 64$。
  - 子網的區間為：`0-63`、`64-127`、`128-191`、`192-255`。
  - 目標 IP `.75` 落在 `64-127` 這個區段。選項中只有 `100` 也落在同一個區段。

**13. Answer: `(C)`**
- **考點：** Two's Complement 範圍。
- **解析：** $n$ 個 bit 的 2's complement 可以表示的範圍是 $-2^{n-1} \sim 2^{n-1}-1$。
  - 當 $n=8$ 時，範圍是 $-128 \sim 127$。因此最少需要 8 個 bits 才能表示 -128。

**14. Answer: `(B)`**
- **考點：** Hash Tables。
- **解析：**
  - Load factor ($\alpha$) 定義為 (元素總數 / 表格大小)。在 Separate Chaining (串列處理法) 中，因為同一個 slot 可以無限接 Linked List，所以 $\alpha$ 絕對可以大於 1。
  - Open Addressing (如線性探測) 則限制 $\alpha \le 1$。
  - Primary clustering 發生在 Open Addressing 的線性探測，而不在 Separate Chaining。

**15. Answer: `(B)`**
- **考點：** Time Complexity 時間複雜度分析。
- **解析：**
  - 外層迴圈執行 $n$ 次。
  - 內層迴圈對於給定的 $i$，`j` 每次乘以 2，執行次數約為 $\log_2(n/i)$。
  - 總執行次數為 $\sum_{i=1}^n \log_2(n/i) = \log_2(n^n / n!) \approx \log_2(e^n) = n \log_2 e = O(n)$。
  - 這個演算法看似巢狀迴圈且有 log，但總複雜度可以嚴格證明為 $O(n)$。

**16. Answer: `(A)`**
- **考點：** Database ACID Properties。
- **解析：** Atomicity (不可分割性/原子性) 保證交易(Transaction)中的所有操作要麼全部成功，要麼全部失敗並還原 (Rollback)，不會有做一半的情況。

**17. Answer: `(B)`**
- **考點：** C++ Virtual Destructor。
- **解析：** 當使用基底類別 (Base Class) 的指標指向衍生類別 (Derived Class) 的物件時，如果基底類別的解構式不是 `virtual`，在使用 `delete` 釋放該指標時，只會呼叫基底類別的解構式，造成衍生類別專屬的資源發生 Memory Leak。加上 `virtual` 可以確保呼叫到正確的衍生類別解構式。

**18. Answer: `(D)`**
- **考點：** IEEE 754 Floating Point 標準。
- **解析：** 在 IEEE 754 標準中，如果 Exponent 全部為 1 (即 255)，且 Mantissa (小數部分) 不等於 0，這代表 NaN (Not a Number)，用來表示無效或未定義的運算結果 (例如 0/0)。如果 Mantissa 等於 0，則是 Infinity。

**19. Answer: `(C)`**
- **考點：** Page Replacement Algorithms。
- **解析：** Belady's Anomaly (布雷迪異常) 是指派給行程更多的 Page Frames，反而導致 Page Faults 增加的不正常現象。這只會發生在 FIFO (First-In-First-Out) 演算法中，因為 FIFO 不符合堆疊演算法 (Stack Algorithm) 的特性。LRU 與 OPT 則保證不會發生。

**20. Answer: `(C)`**
- **考點：** Cryptography (密碼學)。
- **解析：**
  - RSA 是最著名的非對稱加密演算法 (Asymmetric encryption / Public-Key Cryptography)。
  - AES 與 DES 是對稱加密演算法。
  - MD5 與 SHA-256 是雜湊演算法 (Hash functions)，不是用來加密還原資料的。
