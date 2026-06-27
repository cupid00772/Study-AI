# 台灣聯合大學系統 模擬轉學考 計算機概論 解答卷 (Answers 8)

## 🎯 考點分佈總表 (Topic Distribution)

| 領域 | 題號 | 測驗重點 (Knowledge Point) | 難度 |
| :--- | :--- | :--- | :--- |
| **程式設計 (C++)** | 1, 2, 12, 18 | 建構/解構順序、虛擬解構子、純虛擬函式、volatile 關鍵字 | [Medium] |
| **網路原理** | 4, 13, 19 | Subnetting (Network ID)、ARP、TCP 3-way Handshake | [Medium] |
| **演算法** | 3, 6, 14, 16, 20 | P vs NP、Dijkstra 複雜度、穩定排序、Kruskal、Dynamic Programming | [Hard] |
| **計算機組織** | 5, 9, 17 | IEEE 754 特殊值、Cache 寫入策略、2的補數 | [Medium] |
| **作業系統** | 7, 10, 15 | 死結條件、Thrashing、System Call (Trap) | [Easy] |
| **資料結構** | 8, 11 | Hash Table 碰撞、二元樹走訪推導 | [Medium] |

---

## 二、詳解與觀念剖析 (Detailed Explanations)

**1. [C] Vehicle Constructor -> Car Constructor -> Car Destructor -> Vehicle Destructor**
- **難度**: [Easy]
- **核心觀念**: 建構與解構順序。
- **解題步驟**:
  1. 建立衍生類別物件時，會先呼叫**父類別 (Base) 的建構子**，再呼叫**子類別 (Derived) 的建構子** (由上而下建立)。
  2. 銷毀物件時順序剛好相反，先呼叫**子類別的解構子**，再呼叫**父類別的解構子** (由下而上拆解)。
- **常見錯誤陷阱**: 記反建構與解構的方向。

**2. [B] To ensure that the derived class's destructor is called when an object is deleted through a base class pointer.**
- **難度**: [Medium]
- **核心觀念**: 虛擬解構子 (Virtual Destructor)。
- **解題步驟**:
  若透過父類別指標刪除子類別物件（如 `Base* ptr = new Derived(); delete ptr;`），若父類別的解構子沒有標示為 `virtual`，編譯器只會採用靜態綁定，導致只有父類別的解構子被執行，子類別配置的資源（如 Heap 記憶體）將無法釋放，造成 Memory Leak。
- **常見錯誤陷阱**: 忽略多型 (Polymorphism) 操作下解構子的動態綁定需求。

**3. [B] No NP-complete problem can be solved in polynomial time.**
- **難度**: [Hard]
- **核心觀念**: P 與 NP 類別。
- **解題步驟**:
  1. P = 可以在多項式時間內「解決」的問題。
  2. NP = 可以在多項式時間內「驗證」解的問題。
  3. NP-complete 是 NP 中最難的問題。
  4. 若 P ≠ NP，代表 P (好解) 與 NP (難解) 不相等，推論出 NP-complete 絕對不可能在多項式時間內被解決，否則 P 就會等於 NP。

**4. [B] 192.168.1.128**
- **難度**: [Medium]
- **核心觀念**: Subnetting 與 Network ID 計算。
- **解題步驟**:
  1. 將 IP 的最後一個 Byte 展開: `135` = `128 + 0 + 32 + 0 + 0 + 4 + 2 + 1` = `10000111` (二進位)。
  2. 將 Subnet Mask 的最後一個 Byte 展開: `224` = `128 + 64 + 32` = `11100000` (二進位)。
  3. 執行 AND 運算:
     `10000111`
     `11100000`
     ---------
     `10000000` = `128` (十進位)。
  4. 故 Network ID 為 `192.168.1.128`。

**5. [D] NaN (Not a Number)**
- **難度**: [Medium]
- **核心觀念**: IEEE 754 浮點數標準。
- **解題步驟**:
  - Exponent = 全 0, Fraction = 0: 零 (Zero)
  - Exponent = 全 0, Fraction ≠ 0: 非正規劃數 (Denormalized)
  - Exponent = 全 1, Fraction = 0: 無限大 (Infinity)
  - Exponent = 全 1, Fraction ≠ 0: **NaN (Not a Number)**，表示無效的運算結果，例如 0/0 或負數開根號。

**6. [C] O((V + E) log V)**
- **難度**: [Hard]
- **核心觀念**: Dijkstra 時間複雜度。
- **解題步驟**:
  使用 Adjacency List 時，共有 V 個節點與 E 條邊。
  1. 每個節點最多被 Extract-Min 一次：`V * O(log V)`。
  2. 每條邊最多會觸發一次 Decrease-Key：`E * O(log V)`。
  總和為 `O(V log V + E log V) = O((V+E)logV)`。
- **常見錯誤陷阱**: 若使用 Adjacency Matrix，複雜度為 O(V²)。必須看清楚題目給的資料結構。

**7. [C] Preemption**
- **難度**: [Easy]
- **核心觀念**: 死結 (Deadlock) 四大必要條件。
- **解題步驟**:
  四個條件分別是：
  1. Mutual Exclusion (互斥)
  2. Hold and Wait (持有並等待)
  3. **No Preemption (不可被搶奪)**：資源不能被強行收回。題目選項為 Preemption，因此是錯的。
  4. Circular Wait (循環等待)

**8. [A] Linear Probing**
- **難度**: [Medium]
- **核心觀念**: Hash Collision Resolution。
- **解題步驟**:
  Linear Probing (線性探測) 當發生碰撞時，會依序往下一個格子尋找空位。這容易導致連續的佔用區塊越來越大，新元素碰撞機率隨之增加，這種現象稱為 Primary Clustering (主群聚)。Quadratic Probing 會產生 Secondary Clustering。

**9. [C] It reduces the number of write operations to main memory, thereby saving memory bandwidth.**
- **難度**: [Medium]
- **核心觀念**: Cache Write Policies。
- **解題步驟**:
  - **Write-Through**: 每次寫入 Cache 時，也同步寫入 Main Memory。優點是資料一致，缺點是頻寬消耗大。
  - **Write-Back**: 只寫入 Cache，並標記 Dirty bit。直到該 Block 被替換 (Evicted) 時才寫回 Main Memory。優點是大幅減少對 Memory 的寫入次數，節省頻寬。

**10. [B] High paging activity where the system spends more time swapping pages than executing processes.**
- **難度**: [Easy]
- **核心觀念**: 虛擬記憶體與 Thrashing (震盪)。
- **解題步驟**:
  當系統中載入過多 Process，導致分配給每個 Process 的實體記憶體過少，就會頻繁發生 Page Fault。系統將大部分 CPU 時間耗費在 I/O 的 Page-in / Page-out 上，導致 CPU 實際利用率極低，這就是 Thrashing。

**11. [B] G**
- **難度**: [Hard]
- **核心觀念**: 二元樹走訪推導。
- **解題步驟**:
  1. Pre-order: **F** B A D C E G I H (第一個為 Root) -> Root 是 F。
  2. In-order: A B C D E **F** G H I -> F 的左子樹為 {A, B, C, D, E}，右子樹為 {G, H, I}。
  3. 取右子樹元素 {G, H, I}，回到 Pre-order 看順序：**G** I H -> 該子樹的第一個節點為 G。
  4. 故 F 的右子樹的 Root 是 G。

**12. [A] A class containing at least one pure virtual function cannot be instantiated (it becomes an abstract class).**
- **難度**: [Medium]
- **核心觀念**: C++ 抽象類別 (Abstract Class)。
- **解題步驟**:
  純虛擬函式的宣告語法為 `virtual void func() = 0;`。一旦類別包含了純虛擬函式，該類別就成為「抽象類別」，無法建立實體物件 (Instantiated)，必須由衍生類別實作 (Override) 該函式後才能產生物件。

**13. [D] ARP**
- **難度**: [Easy]
- **核心觀念**: 網路通訊協定。
- **解題步驟**:
  - ARP (Address Resolution Protocol): 將已知的 IP 地址轉換為對應的 MAC 地址。
  - RARP 則是反過來，MAC 轉 IP。
  - DNS 是 Domain Name 轉 IP。

**14. [A] Quick Sort**
- **難度**: [Medium]
- **核心觀念**: Stable Sort (穩定排序)。
- **解題步驟**:
  Stable Sort 指的是「數值相同的元素，在排序後仍保持原本的相對順序」。
  - Stable: Bubble Sort, Insertion Sort, Merge Sort。
  - Unstable: Quick Sort, Heap Sort, Selection Sort。

**15. [C] Software Interrupt (Trap)**
- **難度**: [Easy]
- **核心觀念**: System Call。
- **解題步驟**:
  User Program 無法直接呼叫作業系統核心的函式。必須透過觸發一個 Software Interrupt (又稱為 Trap)，讓 CPU 將控制權轉交給 OS，並將特權模式從 User Mode 切換到 Kernel Mode，再由 OS 執行對應的服務。

**16. [B] Kruskal's Algorithm**
- **難度**: [Easy]
- **核心觀念**: Minimum Spanning Tree (MST)。
- **解題步驟**:
  - Kruskal's Algorithm: 針對「邊」進行排序，由小到大挑選，並利用 Disjoint Set (Union-Find) 檢查是否形成迴圈。
  - Prim's Algorithm: 從單一節點出發，每次挑選與當前 MST 相連的權重最小的邊加入。

**17. [A] 11110011**
- **難度**: [Medium]
- **核心觀念**: 2的補數 (2's Complement)。
- **解題步驟**:
  1. 將 13 轉為 8-bit 二進位: `00001101`
  2. 取 1 的補數 (0/1 反轉): `11110010`
  3. 取 2 的補數 (加 1): `11110010 + 1 = 11110011`

**18. [B] It tells the compiler that the variable's value may change at any time without any action being taken by the code, preventing certain optimizations.**
- **難度**: [Medium]
- **核心觀念**: `volatile` 關鍵字。
- **解題步驟**:
  在撰寫嵌入式系統或多執行緒時，某些變數可能會被硬體中斷或另一個執行緒改變。`volatile` 告知編譯器每次存取該變數時，必須強制去記憶體讀取最新值，不可以使用 Cache 或暫存器裡的舊值（禁止編譯器對其進行存取最佳化）。

**19. [C] SYN and ACK**
- **難度**: [Medium]
- **核心觀念**: TCP 三方交握。
- **解題步驟**:
  1. Client -> Server: 傳送 `SYN` (請求建立連線)。
  2. Server -> Client: 傳送 `SYN + ACK` (確認收到 Client 的請求，並同時提出建立連線的請求)。
  3. Client -> Server: 傳送 `ACK` (確認收到 Server 的請求)。

**20. [D] Dynamic Programming**
- **難度**: [Easy]
- **核心觀念**: 演算法設計典範。
- **解題步驟**:
  LCS (Longest Common Subsequence) 具有「最佳子結構 (Optimal Substructure)」與「重疊子問題 (Overlapping Subproblems)」的特性，因此非常適合使用 Dynamic Programming 建立表格 (Tabulation) 或是 Memoization 來解，時間複雜度通常為 O(m*n)。

---

## 三、配分建議與評分標準 (Marking Scheme)
- **滿分**: 100 分
- **配分**: 共 20 題，每題 5 分。答錯不倒扣。
- **實力落點評估**:
  - **85 - 100 分**: 頂標 (對核心觀念非常清晰，台聯大考試大機率能取得高分)
  - **70 - 80 分**: 前標 (具備基礎實力，請針對本次做錯的 [Medium] 或 [Hard] 題型仔細檢討)
  - **50 - 65 分**: 均標 (仍有觀念漏洞，尤其是 P vs NP 或指標/多型相關部分需重新複習)
  - **50 分以下**: 基礎尚需加強 (請再次詳讀解答，並搭配課本或參考資料釐清基礎)
