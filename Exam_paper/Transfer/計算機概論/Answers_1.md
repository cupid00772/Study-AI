# 國立臺灣聯合大學系統 114學年度 計算機概論 模擬試題 解答卷 (Answers 1)

**難易度分佈：** 包含 [Easy], [Medium], [Hard] 標籤。

---

### 單選題，共 25 題，每題 4 分 (答錯不倒扣)

**1. Answer: `(B)`**
- **難度：** [Medium]
- **核心概念：** C 語言指標操作、後置遞增運算子 (Postfix Increment)。
- **解題步驟：**
  1. `p` 指向陣列的第一個元素（數值為 10）。
  2. `*(p++)` 會先取用 `p` 目前所指的值（印出 10），然後 `p` 的記憶體位址加 1，移向陣列的下一個元素（指向 20）。
  3. 接著執行 `*p`，此時 `p` 已經指向第二個元素，因此印出 20。
- **常見錯誤陷阱：** 誤以為 `*(p++)` 會先將指標加 1 再取值（那是 `*(++p)` 的行為）。

**2. Answer: `(B)`**
- **難度：** [Medium]
- **核心概念：** 記憶體階層 (Memory Hierarchy)、快取與虛擬記憶體原理。
- **解題步驟：**
  - (A) 錯誤：L1 cache 比 L2 cache 更小且更快。
  - (B) 正確：空間局部性 (Spatial locality) 意指程式碼存取某個記憶體位址後，附近相鄰的位址也有很高機率被存取。
  - (C) 錯誤：這是寫回 (Write-back) 的定義。寫入穿透 (Write-through) 會立刻同時更新快取與主記憶體。
  - (D) 錯誤：虛擬記憶體通常利用硬碟 (Disk) 實作，而非 SRAM。
  - (E) 錯誤：TLB (Translation Lookaside Buffer) 是用來快取分頁表 (Page Table) 紀錄的，並非快取 CPU 執行的指令。

**3. Answer: `(A)`**
- **難度：** [Easy]
- **核心概念：** 二補數 (2's Complement) 表示法。
- **解題步驟：**
  1. `0xFFFFFFF0` 最高位元（MSB）為 1，表示這是一個負數。
  2. 求二補數對應的數值：先減 1（或先取反碼再加 1）。
  3. `0xFFFFFFF0` 取反為 `0x0000000F` (也就是 15)。
  4. 加 1 變成 16，套上負號即為 -16。

**4. Answer: `(C)`**
- **難度：** [Easy]
- **核心概念：** 二元搜尋樹 (Binary Search Tree) 與走訪 (Traversal)。
- **解題步驟：**
  - 二元搜尋樹的特性是：左子節點 < 根節點 < 右子節點。
  - 使用中序走訪 (In-order traversal, Left-Root-Right) 剛好會依序讀出由小到大排序的值。

**5. Answer: `(E)`**
- **難度：** [Easy]
- **核心概念：** 作業系統死結 (Deadlock) 的四個必要條件。
- **解題步驟：**
  - 死結的四個必要條件為：互斥 (Mutual Exclusion)、占用並等待 (Hold and Wait)、不可剝奪 (No Preemption)、循環等待 (Circular Wait)。
  - 飢餓 (Starvation) 是一個資源分配不均的問題，但並非死結的必要條件。

**6. Answer: `(C)`**
- **難度：** [Hard]
- **核心概念：** Heap 資料結構、建構 Max-Heap 的時間複雜度。
- **解題步驟：**
  - 如果從空堆積開始「逐一插入 (insert)」元素，最差時間複雜度為 $O(n \log n)$。
  - 但如果是給定一個長度為 $n$ 的未排序陣列，使用由下而上 (Bottom-up) 的 `heapify` 演算法，數學上已證明可以達成 $O(n)$ 的時間複雜度。

**7. Answer: `(B)`**
- **難度：** [Medium]
- **核心概念：** 子網域遮罩 (Subnet Mask)、IP 位址分配。
- **解題步驟：**
  1. 子網域遮罩 `255.255.255.224` 的最後一個位元組為 `224`。
  2. 224 的二進位為 `11100000`。
  3. 屬於主機 (Host) 的位元數有 5 個（即 `0` 的數量）。
  4. 每個子網域可以容納 $2^5 = 32$ 個 IP。
  5. 扣除 1 個 Network IP (全 0) 和 1 個 Broadcast IP (全 1)，可用的主機 IP 為 $32 - 2 = 30$ 個。

**8. Answer: `(D)`**
- **難度：** [Easy]
- **核心概念：** TCP/IP 模型、傳輸層 (Transport Layer)。
- **解題步驟：**
  - 傳輸層 (Transport Layer) 中的 TCP 協定負責建立連線、確保資料可靠傳輸與錯誤還原。

**9. Answer: `(A)`**
- **難度：** [Easy]
- **核心概念：** 堆疊 (Stack) 資料結構。
- **解題步驟：**
  1. `push(1)` $\rightarrow$ Stack: [1]
  2. `push(2)` $\rightarrow$ Stack: [1, 2]
  3. `pop()` $\rightarrow$ 移除 2，Stack: [1]
  4. `push(3)` $\rightarrow$ Stack: [1, 3]
  5. `push(4)` $\rightarrow$ Stack: [1, 3, 4]
  6. `pop()` $\rightarrow$ 移除 4，Stack: [1, 3]
  7. `pop()` $\rightarrow$ 移除 3，Stack: [1]
  - 最後頂端 (Top) 元素為 1。

**10. Answer: `(D)`**
- **難度：** [Medium]
- **核心概念：** 排序演算法的時間複雜度。
- **解題步驟：**
  - (A) Bubble Sort：最差 $O(n^2)$
  - (B) Insertion Sort：最差 $O(n^2)$
  - (C) Quick Sort：最差 $O(n^2)$ (當資料已排序且未優化 Pivot 時)
  - (D) Merge Sort：最差保證為 $O(n \log n)$
  - (E) Selection Sort：最差 $O(n^2)$

**11. Answer: `(D)`**
- **難度：** [Medium]
- **核心概念：** RISC vs CISC 計算機架構。
- **解題步驟：**
  - RISC 的設計哲學是依賴大量通用的暫存器來減少記憶體存取。因此 RISC 通常比 CISC 擁有「更多」的通用暫存器 (General-purpose registers)。選項 (D) 敘述相反，為錯誤。

**12. Answer: `(C)`**
- **難度：** [Medium]
- **核心概念：** 作業系統行程狀態 (Process States)。
- **解題步驟：**
  - 當行程從 Running 退回 Ready，代表它被作業系統剝奪了 CPU 的使用權，最常見的原因是時間切片用盡 (Time slice expired)，也就是 Timer interrupt。
  - (A) 會從 Running 進入 Waiting/Blocked。
  - (B) 會進入 Terminated 狀態。
  - (D) 會從 Waiting 進入 Ready。

**13. Answer: `(C)`**
- **難度：** [Medium]
- **核心概念：** 遞迴 (Recursion)。
- **解題步驟：**
  - `func(5) = 5 * func(3)`
  - `func(3) = 3 * func(1)`
  - `func(1) = 1` (觸發終止條件)
  - 帶回計算：`3 * 1 = 3`，然後 `5 * 3 = 15`。

**14. Answer: `(D)`**
- **難度：** [Easy]
- **核心概念：** 數位邏輯、通用邏輯閘 (Universal Gates)。
- **解題步驟：**
  - NAND 與 NOR 皆為通用邏輯閘，能用來組合出 AND、OR、NOT 等任何布林函數。

**15. Answer: `(D)`**
- **難度：** [Easy]
- **核心概念：** 非對稱加密 (Asymmetric Cryptography)、公開金鑰。
- **解題步驟：**
  - 若要確保訊息的機密性 (Confidentiality) 且只有接收者能解讀，傳送者 (Alice) 必須使用接收者 (Bob) 的「公鑰 (Public Key)」進行加密。Bob 收到後再用自己的私鑰解密。

**16. Answer: `(C)`**
- **難度：** [Easy]
- **核心概念：** 網路通訊協定、ARP。
- **解題步驟：**
  - ARP (Address Resolution Protocol) 負責將邏輯的 IP 位址解析為實體的 MAC 位址。

**17. Answer: `(B)`**
- **難度：** [Medium]
- **核心概念：** 虛擬記憶體、分頁錯誤 (Page Fault)。
- **解題步驟：**
  - 當 CPU 請求的虛擬記憶體頁面存在於分頁表，但此時並未載入於實體記憶體 (Physical RAM) 中時，就會產生 Page Fault，作業系統需從磁碟中將該頁面載入。

**18. Answer: `(B)`**
- **難度：** [Medium]
- **核心概念：** 後序運算式 (Postfix Expression)、堆疊求值。
- **解題步驟：**
  1. 依序推入數字堆疊：[8, 4, 2]
  2. 遇到 `/`：取出 4 與 2，執行 $4 / 2 = 2$。推回堆疊：[8, 2]
  3. 遇到 `3`：推入堆疊：[8, 2, 3]
  4. 遇到 `*`：取出 2 與 3，執行 $2 * 3 = 6$。推回堆疊：[8, 6]
  5. 遇到 `+`：取出 8 與 6，執行 $8 + 6 = 14$。推回堆疊：[14]
  - 結果為 14。

**19. Answer: `(C)`**
- **難度：** [Hard]
- **核心概念：** 演算法 P 與 NP 類別問題。
- **解題步驟：**
  - 如果 $P \neq NP$，這意味著 NP-complete 問題絕對不存在多項式時間 (Polynomial-time) 的解法。
  - (B) 是錯的，NP 不等於 NP-complete。
  - (D) NP-hard 包含但不限於 NP，且比 P 更難。

**20. Answer: `(A)`**
- **難度：** [Hard]
- **核心概念：** 二元樹走訪還原。
- **解題步驟：**
  1. Pre-order 第一個節點 `A` 為根節點。
  2. 根據 In-order：`[D B E]` 是左子樹，`[F C G]` 是右子樹。
  3. 分析左子樹 `[D B E]`，對應的 Pre-order 是 `[B D E]`，故 `B` 是子根，In-order 顯示 `D` 在 `B` 左側，`E` 在右側。
  4. 分析右子樹 `[F C G]`，對應的 Pre-order 是 `[C F G]`，故 `C` 是子根，In-order 顯示 `F` 在 `C` 左側，`G` 在右側。
  5. 寫出 Post-order (Left-Right-Root)：
     左子樹 Post-order = `D E B`
     右子樹 Post-order = `F G C`
     整棵樹 = `D E B F G C A`。

**21. Answer: `(C)`**
- **難度：** [Medium]
- **核心概念：** 軟體工程、設計模式 (Design Patterns)。
- **解題步驟：**
  - Singleton (單例模式) 確保類別只有一個實例，並提供全域存取點。

**22. Answer: `(C)`**
- **難度：** [Medium]
- **核心概念：** 作業系統、行程管理 (Zombie Process)。
- **解題步驟：**
  - 當子行程結束執行 (Terminated)，但父行程尚未呼叫 `wait()` 或 `waitpid()` 讀取其結束狀態 (Exit status) 時，該子行程的 PCB 仍會殘留在系統表中，被稱為殭屍行程 (Zombie process)。

**23. Answer: `(B)`**
- **難度：** [Easy]
- **核心概念：** 圖論、廣度優先搜尋 (BFS)。
- **解題步驟：**
  - BFS 通常配合 Queue 來實作，以達成層次走訪 (Level-order) 的特性；而 DFS 則是配合 Stack 或遞迴實作。

**24. Answer: `(E)`**
- **難度：** [Medium]
- **核心概念：** 運算理論、圖靈機 (Turing Machine)。
- **解題步驟：**
  - 圖靈機的模型包含：無限長的紙帶 (Infinite tape)、讀寫頭 (Read/write head)、狀態暫存器 (State register)、轉移函數 (Transition function)。並不包含現代計算機的 RAM 隨機存取記憶體。

**25. Answer: `(C)`**
- **難度：** [Medium]
- **核心概念：** 浮點數表示法 (IEEE 754)。
- **解題步驟：**
  - 單精度 (Single-precision, 32-bit) 的格式分配為：
    - 符號位元 (Sign bit)：1 bit
    - 指數部分 (Exponent)：8 bits
    - 小數部分 (Mantissa/Fraction)：23 bits

---
> 💡 **考後檢討互動：**
> 如果你寫完了這份考卷並核對完解答，請告訴我：「你錯了哪幾題？具體遇到了什麼問題或卡在哪個觀念？」我會幫你釐清弱點，作為下次出題的參考！
