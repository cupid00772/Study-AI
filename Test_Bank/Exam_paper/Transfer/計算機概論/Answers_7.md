# 模擬考解答與詳解 (Answers & Explanations) - Mock Exam 7

## 📊 考點分佈總表與預期能力分析

本份考卷為 **弱點打擊驗收卷**。特別針對你在上一份考卷 (Mock Exam 6) 中暴露的盲點（包含：P vs NP、Subnetting 運算、IEEE 754 特殊值、C++ 解構子與 virtual 特性、Dijkstra 時間複雜度）進行「換句話說」的再測試。若你能順利答對這些題目，就代表你已經完全掌握了這些概念！

| 題號 | 測驗科目 / 章節 | 檢驗核心知識點 (🔴 為前次弱點驗收) | 難度 |
| :--- | :--- | :--- | :---: |
| Q1 | 程式設計 | 🔴 C++ 解構子 (Virtual Destructor) 與記憶體洩漏 | [Medium] |
| Q2 | 程式設計 | 🔴 C++ OOP 多型與 `virtual` 關鍵字 | [Medium] |
| Q3 | 演算法 | 🔴 P ≠ NP 條件下的 NP-complete 問題性質 | [Medium] |
| Q4 | 網路原理 | 🔴 IPv4 Subnetting 與 Network ID 的 AND 運算 | [Medium] |
| Q5 | 計算機組織 | 🔴 IEEE 754 浮點數特殊值 (Infinity 定義) | [Easy] |
| Q6 | 演算法 | 🔴 Dijkstra 搭配 Min-Heap 的時間複雜度 | [Hard] |
| Q7 | 程式設計 | 🔴 C++ 程式碼追蹤 (動態綁定 Dynamic Binding) | [Medium] |
| Q8 | 計算機組織 | Cache 映射機制 (Direct Mapping 特性) | [Easy] |
| Q9 | 作業系統 | CPU 排班演算法與 Starvation (飢餓) 現象 | [Easy] |
| Q10 | 資料結構 | 平衡二元搜尋樹 (AVL Tree) 的插入時間複雜度 | [Easy] |
| Q11 | 作業系統 | System Call 的觸發機制 (Software Interrupt/Trap) | [Medium] |
| Q12 | 網路原理 | TCP 協定的三大特性 (可靠、連線導向、流量/壅塞控制) | [Easy] |
| Q13 | C/C++ 語言 | `sizeof` 陣列傳遞退化為指標的經典陷阱 | [Medium] |
| Q14 | 邏輯設計 | 基本邏輯閘運算 (NAND + NOT = AND) | [Easy] |
| Q15 | 資料結構 | Stack (LIFO) 與 Queue (FIFO) 的差異 | [Easy] |
| Q16 | 演算法 | QuickSort 的平均時間複雜度 | [Easy] |
| Q17 | 作業系統 | 同一個 Process 下 Threads 共用與獨立的資源 | [Medium] |
| Q18 | 資料結構 | 樹的走訪推演 (Pre-order + In-order 推導 Post-order) | [Hard] |
| Q19 | C/C++ 語言 | `static` 關鍵字在區域變數中的作用 (生命週期延長) | [Easy] |
| Q20 | 網路原理 | OSI 模型中 Network Layer (網路層) 的路由功能 | [Easy] |

---

## 📝 詳解與解題步驟 (Step-by-step Explanations)

### 1. (B)
**解題步驟 (弱點驗收)：**
- 當使用「父類別指標」刪除物件時，若父類別的解構子沒有標示為 `virtual`，C++ 編譯器會採用「靜態綁定 (Static Binding)」。
- 也就是說，它只看指標的型態 (Base*)，直接呼叫 `~Base()`，而完全不會呼叫子類別的解構子。
- 這樣會導致子類別中自己申請的記憶體或資源無法釋放，造成 Memory Leak。

### 2. (C)
**解題步驟 (弱點驗收)：**
- C++ 實現「執行期多型 (Run-time Polymorphism)」或「動態綁定 (Dynamic Binding)」的核心就是 `virtual` 關鍵字。
- 只有加上 `virtual`，程式在執行時才會透過虛擬函式表 (V-Table) 找出物件真實的型態，並呼叫對應的 overridden 函式。

### 3. (B)
**解題步驟 (弱點驗收)：**
- P = 可以在多項式時間內解出的問題。
- 如果 P ≠ NP，表示 NP 中最難的問題（也就是 NP-complete）是**無法**在多項式時間內被任何已知演算法解決的。
- 若任何一個 NP-complete 能在多項式時間內解決，那 P 就會等於 NP 了。既然 P ≠ NP，答案就是 (B)。

### 4. (B)
**解題步驟 (弱點驗收)：**
- **公式**：`IP Address` AND `Subnet Mask` = `Network ID`
- 只需計算最後一個 Byte：`45` AND `240`
- `45` 轉二進位 = `0010 1101`
- `240` 轉二進位 = `1111 0000`
- 進行 AND 運算：`0010 0000`，轉回十進位就是 `32`。
- 因此 Network ID 為 `172.16.50.32`。

### 5. (D)
**解題步驟 (弱點驗收)：**
- IEEE 754 規定：
  - 當 Exponent 全部為 1，且 Fraction (Mantissa) **全部為 0** 時，代表 **Infinity (無限大)**。
  - 當 Exponent 全部為 1，且 Fraction **不為 0** 時，代表 **NaN (Not a Number)**。
- 題目明確說明 Fraction 都是 0，故為 Infinity。

### 6. (C)
**解題步驟 (弱點驗收)：**
- 使用 Adjacency List + Min-Heap 實作 Dijkstra：
  - 每個 Vertex 抽離 Heap (Extract-Min)：$V \times O(\log V)$
  - 每條 Edge 進行鬆弛操作 (Decrease-Key)：$E \times O(\log V)$
  - 兩者相加提出公因式即為 **$O((V + E) \log V)$**。

### 7. (B)
**解題步驟 (弱點驗收)：**
- 延續前面考過的 `virtual` 概念。
- 父類別的 `speak()` 函式宣告為 `virtual`，因此開啟了動態綁定。
- 雖然指標型態是 `Animal*`，但它實際指向的實體是 `Dog`。
- 執行時會呼叫 `Dog` 覆寫後的 `speak()`，輸出 `Dog `。

### 8. (B)
**解題步驟：**
- Direct Mapping (直接映射)：每個記憶體區塊只能放在 Cache 中**唯一固定**的某個位置 (利用 mod 運算)。
- Fully Associative：可以放在 Cache 的任何位置。
- Set Associative：可以放在特定 Set 裡面的任何一個位置。

### 9. (C)
**解題步驟：**
- Starvation (飢餓) 是指 Process 因為優先權較低或某種原因，永遠等不到 CPU。
- SJF (Shortest Job First)：如果系統中一直有源源不絕的「短工作」加入，那原本的「長工作」就會永遠排不到 CPU，導致飢餓。
- Round Robin 與 FCFS 都有保證每個排隊的 Process 最終一定能分配到 CPU，不會有飢餓現象。

### 10. (B)
**解題步驟：**
- 在平衡的二元搜尋樹（如 AVL Tree 或 Red-Black Tree）中，樹的高度保證在 $O(\log n)$。
- 插入新節點的搜尋與重新平衡成本都正比於樹高，因此最壞情況為 $O(\log n)$。

### 11. (C)
**解題步驟：**
- 作業系統基於安全考量，將 CPU 權限分為 User Mode (使用者模式) 與 Kernel Mode (核心模式)。
- User program 不能直接呼叫 Kernel 的函數，必須透過觸發「軟體中斷 (Software Interrupt)」或稱「Trap」，讓 CPU 切換到 Kernel Mode 後，由作業系統代為執行。

### 12. (C)
**解題步驟：**
- UDP 是非連線導向、不可靠的。
- IP 負責網路層定址與路由，不保證可靠。
- **TCP** 提供連線導向 (3-way handshake)、可靠傳輸、流量控制與壅塞控制。

### 13. (C)
**解題步驟：**
- 在 C/C++ 中，當陣列作為參數傳遞給函式時，它會「退化 (Decay)」成一個指標，指向陣列的第一個元素。
- `sizeof(arr)` 此時取得的並非整個陣列的大小，而是「指標變數的大小」（在 64-bit 系統中通常是 8 bytes）。

### 14. (A)
**解題步驟：**
- NAND 等於 NOT(A AND B)。
- 後面再接一個 NOT：NOT(NOT(A AND B))。
- 負負得正，結果還原為 **AND**。

### 15. (B)
**解題步驟：**
- Stack (堆疊) 是後進先出 (LIFO, Last-In-First-Out)。
- Queue (佇列) 是先進先出 (FIFO, First-In-First-Out)。

### 16. (B)
**解題步驟：**
- QuickSort 的最佳與平均時間複雜度為 $O(n \log n)$。
- 其最壞時間複雜度 (例如當陣列已排序好，且 Pivot 選擇極端) 則會退化成 $O(n^2)$。

### 17. (C)
**解題步驟：**
- 同一個 Process 內的 Threads：
  - **共享**：Address Space (Text, Data, Heap)、Global variables、Open files。
  - **獨立**：Program Counter (PC)、Registers、Stack。

### 18. (A)
**解題步驟：**
- Pre-order (前序): `[A] B D E C F G` ➔ 第一個是 Root `A`。
- In-order (中序): `[D B E] A [F C G]` ➔ `A` 的左子樹是 `{D, B, E}`，右子樹是 `{F, C, G}`。
- 左子樹 `{D, B, E}`：前序為 `[B] D E` (Root 是 B)，中序為 `D [B] E` ➔ 左小孩是 D，右小孩是 E。左子樹後序為 `D E B`。
- 右子樹 `{F, C, G}`：前序為 `[C] F G` (Root 是 C)，中序為 `F [C] G` ➔ 左小孩是 F，右小孩是 G。右子樹後序為 `F G C`。
- 總後序 (Post-order) = 左子樹後序 + 右子樹後序 + Root ➔ `D E B` + `F G C` + `A` = **D E B F G C A**。

### 19. (B)
**解題步驟：**
- 區域變數 (Local variable) 若加上 `static`，它的記憶體會被配置在 Data segment 而非 Stack。
- 其生命週期會延長至整個程式結束，因此在多次函式呼叫之間，它能夠**保留上一次的值**。

### 20. (C)
**解題步驟：**
- 網路層 (Network Layer) 負責 Logical Addressing (如 IP) 以及封包的 Routing (路由選擇)，決定封包從來源到目的地的最佳路徑。

---

## 🎯 評分標準與檢討

- **每題 5 分，共 100 分。**
- 請為自己計分，這份考卷的前 7 題 (Q1~Q7) 就是你上一份考卷的致命弱點！
- 如果你前 7 題全對，代表我們剛剛的觀念釐清大成功 🎉
- 如果有任何題目還是錯了，或者在推導過程中感到猶豫，請回覆我：「**我錯了第 X 題，還是不太懂為什麼...**」，我們繼續突破它！
