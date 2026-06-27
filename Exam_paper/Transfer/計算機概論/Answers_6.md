# 模擬考解答與詳解 (Answers & Explanations) - Mock Exam 6

## 📊 考點分佈總表與預期能力分析

本份考卷特別針對你先前在 `Learning_Status.md` 中紀錄的「🔴 弱點」與「🟡 尚可」進行打擊與驗收。藉由擬真台聯大歷屆試題的風格，幫助你釐清並鞏固關鍵概念。

| 題號 | 測驗科目 / 章節 | 檢驗核心知識點 (特別標註弱點) | 難度 |
| :--- | :--- | :--- | :---: |
| Q1 | 計算機組織 | 記憶體對映 I/O (Memory-Mapped I/O) 的基本觀念 | [Easy] |
| Q2 | 資料結構與演算法 | 🟡 Heap 建構的時間複雜度 (O(n) vs O(n log n)) | [Easy] |
| Q3 | 作業系統 | 🟡 Virtual Memory 與 Page Fault 的成因定義 | [Easy] |
| Q4 | 作業系統 | 🔴 Page Replacement 中的 Belady's Anomaly (FIFO) | [Easy] |
| Q5 | 演算法 | 🟡 P vs NP vs NP-complete 的理論基礎與關係 | [Medium] |
| Q6 | 網路原理 | 🔴 IPv4 Subnetting 與 Network ID 計算 (AND 運算) | [Medium] |
| Q7 | 計算機組織 | 🔴 IEEE 754 浮點數特殊值 (Infinity vs NaN) | [Medium] |
| Q8 | 作業系統 | 🟡 Process States (Running -> Ready 的 Interrupt) | [Easy] |
| Q9 | C/C++ 程式設計 | 指標運算 (`*p++`) 的優先序與傳值陷阱 | [Medium] |
| Q10 | C/C++ 程式設計 | 類別繼承與解構子 (Virtual Destructor 陷阱) | [Hard] |
| Q11 | 計算機組織 | 🟡 Cache 寫入策略 (Write-through/back) 與 TLB | [Medium] |
| Q12 | 作業系統 | 🟡 Process Management 中 Zombie Process 的定義 | [Easy] |
| Q13 | 網路原理 | ARP 協定在 Logical 與 Physical Address 間的轉換 | [Easy] |
| Q14 | 演算法 | 遞迴演算法的時間複雜度分析 (Fibonacci) | [Medium] |
| Q15 | 計算機組織 / 邏輯設計 | 基本邏輯閘 XOR 運算定義 | [Easy] |
| Q16 | 資料結構 | Binary Search Tree (BST) 的 In-order traversal 特性 | [Easy] |
| Q17 | 計算機組織 | Pipeline throughput 計算 (Clock rate 的倒數應用) | [Medium] |
| Q18 | C/C++ 程式設計 | OOP 多型與 `virtual` 關鍵字的用途 (Dynamic Binding) | [Medium] |
| Q19 | 作業系統 | Deadlock 的四大必要條件 (No Preemption) | [Easy] |
| Q20 | 演算法 | Dijkstra's Algorithm 搭配 Min-Heap 的時間複雜度 | [Hard] |

---

## 📝 詳解與解題步驟 (Step-by-step Explanations)

### 1. (B)
**解題步驟：**
- Memory-Mapped I/O (記憶體對映 I/O) 是一種將 I/O 設備的暫存器與記憶體位址對應到「同一個位址空間」的技術。
- CPU 使用一般的記憶體存取指令 (如 `Load` / `Store`) 即可存取 I/O 設備，不需要像 Isolated I/O 那樣使用專門的指令 (如 `IN` / `OUT`)。
**常見錯誤陷阱：** 誤選 (A)，那是 Isolated I/O 的特徵。誤選 (C)，DMA 才是專門用來高速傳輸大量資料的技術，Memory-mapped I/O 仍需 CPU 介入。

### 2. (A)
**解題步驟：**
- 從無序陣列建構 Max-Heap 時，若從下到上 (Bottom-up) 使用 `heapify` (或 `sift-down`)，位在底層的節點數量多，但 sift-down 的深度淺；頂層節點數量少，但深度深。
- 經過數學推導 (Sum of `h * 2^(H-h)`），其精確的時間複雜度收斂於 **O(n)**。
**常見錯誤陷阱：** 誤以為是每個元素執行插入 `O(log n)` 共 n 個元素，所以是 `O(n log n)`。注意：`buildHeap` 演算法是 O(n)。

### 3. (B)
**解題步驟：**
- Page Fault 的精確定義是：程式存取了其 Logical Address Space 中合法的一頁，但該頁目前並未存在於 Physical Memory (實體記憶體) 中（可能在硬碟的 Swap space 裡）。
- OS 會觸發中斷，將該頁從硬碟載入記憶體。
**常見錯誤陷阱：** 將 Page Fault 與記憶體不足 (OOM) 混淆。記憶體不足是無法配置，Page Fault 只是資料暫時不在 RAM 裡。

### 4. (C)
**解題步驟：**
- Belady's Anomaly (貝拉迪異常) 是指「當分配給 Process 的 Page Frames 數量增加時，Page Fault 的次數反而上升」的反常現象。
- 只有 **FIFO (First-In-First-Out)** 演算法會發生此現象。LRU, Optimal 屬於 Stack Algorithms，保證不會發生 Belady's Anomaly。

### 5. (D)
**解題步驟：**
- 假設 P ≠ NP，這代表 P (多項式時間可解) 與 NP-complete (NP 中最難的問題) 沒有交集。
- 只要有**任何一個** NP-complete 問題能在多項式時間內被解決，則 P = NP。既然前提是 P ≠ NP，那就表示「**沒有任何一個** NP-complete 問題能在多項式時間內被解決」。
**常見錯誤陷阱：** 混淆 NP 與 NP-complete。NP 包含了 P，所以 NP 裡面的部分問題 (屬於 P 的部分) 是可以在多項式時間內解決的。

### 6. (C)
**解題步驟：**
- Network ID 的計算方法：將 IP Address 與 Subnet Mask 進行二進位的 **AND 運算**。
- `192.168.1.130` = `11000000.10101000.00000001.10000010`
- `255.255.255.192` = `11111111.11111111.11111111.11000000`
- 最後一個 byte 做 AND：`130 (10000010)` AND `192 (11000000)` = `128 (10000000)`
- 所以 Network ID 為 `192.168.1.128`。

### 7. (B)
**解題步驟：**
- 根據 IEEE 754 規範：
  - Exponent 全 1，Fraction 全 0：表示 **Infinity** (正負取決於 Sign bit)。
  - Exponent 全 1，Fraction 不為 0：表示 **NaN (Not a Number)**。
**常見錯誤陷阱：** 忘記區分 Fraction 是否為 0，將 NaN 誤認為 Infinity。

### 8. (C)
**解題步驟：**
- Running -> Waiting (Blocked)：等待 I/O 或資源。
- Waiting -> Ready：I/O 完成。
- Running -> Ready：**Timer interrupt** (時間片段 Time Quantum 用完)，作業系統強制剝奪 CPU 使用權，讓 Process 回到 Ready queue 排隊。

### 9. (C)
**解題步驟：**
- `*p++` 是一個常見的指標陷阱。後置遞增 `++` 的優先權高於解取值 `*`。
- 運算順序是：先回傳 `p` 原始位址供 `*` 解取值印出 (`10`)，然後 `p` 的位址才遞增指向陣列的下一個元素 (`20`)。
- 所以第二行 `cout << *p` 時，`p` 已經指向 `20`。輸出為 `10 20`。

### 10. (C)
**解題步驟：**
- 在此程式碼中，`Base` 類別的解構子 **沒有被宣告為 virtual**。
- 當我們使用 Base 型態的指標 (`Base* obj`) 去 `delete` 一個 Derived 的物件時，C++ 編譯器只會根據指標型態去呼叫對應的解構子。
- 因此，只會呼叫 `~Base()`，而 **不會** 呼叫 `~Derived()`，這將導致 Memory Leak。
- 順序：建構時先呼叫 Base 再呼叫 Derived (`B D `) -> 解構時因為無 virtual，只呼叫 Base (`~B `)。
**常見錯誤陷阱：** 誤選 (A)，忽略了父類別必須宣告 `virtual ~Base()` 才能正確觸發子類別的解構子。

### 11. (D)
**解題步驟：**
- Write-through：寫入 Cache 的同時也立刻寫入 Main Memory。
- Write-back：寫入 Cache 時「**不會**」立刻寫入 Main Memory，而是將該 Cache block 標示為 Dirty。只有當這個 block 被替換(Evicted)出 Cache 時，才會一併更新到 Main Memory。
- 選項 (D) 描述的是 Write-through 的行為，因此 (D) 是錯誤的敘述。

### 12. (C)
**解題步驟：**
- Zombie Process (殭屍行程) 是指：子行程已經結束執行並釋放了大部分資源，但其 Exit Status 還留在系統的 Process Table 中，等待父行程呼叫 `wait()` 來回收。
- 如果父行程遲遲不呼叫 `wait()`，子行程就會一直處於 Zombie 狀態。

### 13. (C)
**解題步驟：**
- ARP (Address Resolution Protocol) 用於在區域網路上，透過已知的 IP 位址查詢對應設備的 MAC 位址。
- DHCP 是用來分配 IP；DNS 用來將 Domain Name 轉為 IP。

### 14. (D)
**解題步驟：**
- 這是一個未經優化 (無 Memoization) 的費氏數列遞迴演算法。
- 每呼叫一次 `fib(n)` 就會展開成 `fib(n-1)` 與 `fib(n-2)` 兩個分支，形成高度為 n 的遞迴二元樹。
- 節點總數接近 2^n，因此時間複雜度為指數等級 **O(2^n)**。

### 15. (C)
**解題步驟：**
- XOR (Exclusive OR) 互斥或閘的真值表：
  - `0 XOR 0 = 0`
  - `1 XOR 1 = 0`
  - `1 XOR 0 = 1`
  - `0 XOR 1 = 1`
- 只有當兩個輸入「不同」時，輸出才為 1。

### 16. (B)
**解題步驟：**
- 在二元搜尋樹 (BST) 中，左子樹所有節點 < 根節點 < 右子樹所有節點。
- In-order traversal (中序走訪) 的順序是：走訪左子樹 -> 訪問當前節點 -> 走訪右子樹。
- 這完美對應了從小到大的順序 (Ascending order)。

### 17. (B)
**解題步驟：**
- 在理想狀態 (無 Hazards, 無 Stalls) 下，Pipeline 每個 Clock Cycle 都能完成一個指令 (CPI = 1)。
- Throughput = 1 / Cycle Time = 1 / 2ns = 0.5 * 10^9 指令/秒。
- 也就是 **0.5 BIPS**。

### 18. (C)
**解題步驟：**
- C++ 中的 `virtual` 關鍵字主要用於宣告虛擬函式。
- 透過 Base class 指標呼叫該函式時，程式會在「執行時期 (Run-time)」動態決定 (Dynamic Binding) 要呼叫哪一個 Derived class 的實作，這正是物件導向中的**多型 (Polymorphism)**。

### 19. (C)
**解題步驟：**
- 死結的四大必要條件 (Coffman conditions)：
  1. Mutual Exclusion (互斥)
  2. Hold and Wait (持有並等待)
  3. **No Preemption (不可剝奪)**：不能中途搶奪資源。
  4. Circular Wait (循環等待)
- 選項 (C) 是 Preemption (可剝奪)，不是條件。條件應為 **No** Preemption。

### 20. (C)
**解題步驟：**
- Dijkstra 演算法如果使用 Adjacency List (相鄰串列) 搭配 Min-Priority Queue (Binary Heap)：
  - 每個 Vertex 會被 extract-min 一次：O(V log V)
  - 每個 Edge 會觸發一次 decrease-key 操作：O(E log V)
  - 總時間複雜度為 **O((V + E) log V)** 或簡寫為 O(E log V) 若為連通圖。

---

## 🎯 評分標準與後續行動 (Rubrics & Next Steps)

- **每題 5 分，共 100 分。**
- **85 - 100 分**：基礎非常穩固，請繼續維持並練習進階計算題。
- **60 - 80 分**：某些特定章節（如 Pipeline、C++ 指標、Virtual Memory）仍有盲點，請針對錯題回頭複習課本或講義對應章節。
- **60 分以下**：許多觀念存在明顯漏洞，建議放慢腳步，重新釐清 `Learning_Status.md` 中標記為🔴弱點的核心名詞定義。

> **💡 考後互動檢討**
> 請在批改完自己的考卷後，告訴我：**「你錯了哪幾題？具體遇到了什麼問題或卡在哪個觀念？」**
> 我會協助你釐清盲點，並自動為你更新你的 `Learning_Status.md` 狀態表！
