# 計算機概論 錯題與觀念復盤 (Computer Science Review)

此檔案用於紀錄每次模擬考的錯題復盤與核心觀念釐清，以便考前快速複習。

---

## 📝 Mock Exam 7 復盤 (2026-06-20)

### 📌 Dijkstra 演算法的資料結構搭配與時間複雜度 (對應 Q6)

Dijkstra 演算法的時間複雜度取決於「圖 (Graph)」與「優先權佇列 (Priority Queue)」的實作資料結構。核心動作分為：

1. **Extract-Min**：從尚未處理的節點中找出距離最小的點。
2. **Decrease-Key (Relaxation)**：更新該點的鄰居距離。

| 圖的表示法                            | Priority Queue 實作方式             | Extract-Min 成本 | Decrease-Key 成本 | 總時間複雜度                  | 適用場景                                                     |
| :------------------------------------ | :---------------------------------- | :--------------- | :---------------- | :---------------------------- | :----------------------------------------------------------- |
| **Adjacency Matrix** (相鄰矩陣) | **Array** (一維陣列線性搜尋)  | $O(V)$         | $O(1)$          | **$O(V^2)$**          | **稠密圖** (Dense Graph)，邊數 $E$ 接近 $V^2$ 時。 |
| **Adjacency List** (相鄰串列)   | **Binary Heap** (二元堆積)    | $O(\log V)$    | $O(\log V)$     | **$O((V+E)\log V)$**  | **稀疏圖** (Sparse Graph)，多數情況下的標準實作。      |
| **Adjacency List** (相鄰串列)   | **Fibonacci Heap** (費氏堆積) | $O(\log V)$    | $O(1)$ (均攤)   | **$O(V \log V + E)$** | 理論上最快，但實作極度複雜，常出現在考題中。                 |

*推導提示：圖中有 $V$ 個點，取出最小值 $V$ 次；圖中有 $E$ 條邊，最多更新 $E$ 次。總和即為最終複雜度。*

---

### 📌 Cache Mapping Techniques 快取映射機制 (對應 Q8)

負責決定主記憶體 (Main Memory) 的 Block 搬到 Cache 時，應該放在哪個位置。

1. **Direct Mapping (直接映射)**：
   - **規則**：某個 Block 只能放在 Cache 裡**唯一固定**的位置 (`Block_Address % Cache_Lines`)。
   - **優缺點**：硬體簡單、找資料快；但極易發生 **Conflict Miss (衝突失誤)**。
2. **Fully Associative Mapping (全關聯映射)**：
   - **規則**：Block 可以放在 Cache 中的**任何空位**。
   - **優缺點**：沒有 Conflict Miss；但尋找時需平行掃描全區，硬體極貴且耗電。
3. **Set Associative Mapping (集合關聯映射)**：
   - **規則**：將 Cache 分為多個 Set。Block 只能去特定的 Set，但進入 Set 後裡面的位置可隨便挑 (例如 4-way 代表一個 Set 內有 4 個位置)。折衷前兩者的優缺點。

---

### 📌 C/C++ 陣列傳遞與 `sizeof` 陷阱 (對應 Q13)

- **`\0` 的迷思**：只有「字元陣列 (字串)」如 `char str[] = "hello"` 會有 `\0` 結尾 (`sizeof` 為 6)。一般的整數陣列如 `int arr[]` **沒有** `\0`。
- **陣列退化 (Array Decay)**：當陣列作為函數參數傳遞時（如 `void func(int arr[])`），會自動退化成指標 `int *arr`，失去原有的長度資訊。
- **陷阱**：在函數內對該參數使用 `sizeof(arr)`，測量到的會是**指標變數本身的大小**（64-bit 系統為 8 Bytes，32-bit 為 4 Bytes），而不是陣列的總位元組數。

---

### 📌 System Call 系統呼叫 (對應 Q11)

System Call 是作業系統提供給應用程式的「API」，用於請求高權限的服務（如讀寫檔案、網路連線）。

- **運作機制 (Software Interrupt / Trap)**：
  1. **觸發**：使用者程式呼叫 Library，發出一個**軟體中斷 (Software Interrupt) 或稱 Trap**。
  2. **切換**：CPU 暫停目前工作，將權限從 **User Mode (使用者模式)** 切換到 **Kernel Mode (核心模式)**。
  3. **執行**：OS 接管控制權，根據 System call number 執行對應的服務。
  4. **返回**：服務完成後，OS 將結果回傳，並把權限降回 User Mode，程式繼續執行。

---

## 📝 Mock Exam 8 復盤 (2026-06-20)

### 📌 經典圖論演算法比較：MST vs Shortest Path (對應 Q16)

圖論演算法主要解決兩大類問題：「最小生成樹 (MST)」與「最短路徑 (Shortest Path)」。

| 演算法名稱                         | 解決的問題            | 核心精神 (設計典範) | 運作機制與特點                                                                                                                            |
| :--------------------------------- | :-------------------- | :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **Kruskal's Algorithm**      | 最小生成樹 (MST)      | Greedy (貪婪法)     | 將**所有邊**依權重排序，從小到大挑選。若加入該邊會形成 Cycle 則捨棄 (通常用 Disjoint Set / Union-Find 檢查)。適合**稀疏圖**。 |
| **Prim's Algorithm**         | 最小生成樹 (MST)      | Greedy (貪婪法)     | 從單一**節點**出發，每次挑選與目前 MST 相連且權重最小的邊加入。類似 Dijkstra。適合**稠密圖**。                                |
| **Dijkstra's Algorithm**     | 單點源最短路徑 (SSSP) | Greedy (貪婪法)     | 從起點出發，每次挑選距離最近的點向外擴展 (Relaxation)。**缺點：不能處理負權重邊 (Negative edges)**。                                |
| **Bellman-Ford Algorithm**   | 單點源最短路徑 (SSSP) | Dynamic Programming | 對所有邊進行$V-1$ 次 Relaxation。**優點：可處理負權重邊，並偵測負權重迴圈 (Negative weight cycle)**。時間複雜度較高 $O(VE)$。   |
| **Floyd-Warshall Algorithm** | 全點對最短路徑 (APSP) | Dynamic Programming | 找出圖中所有點到所有點的最短路徑。透過三層迴圈列舉所有可能的中繼點。時間複雜度$O(V^3)$。                                                |

---

### 📌 TCP 三方交握 (3-way Handshake) 與 Flags (對應 Q19)

TCP 是可靠的連線導向協定，在傳輸資料前必須先建立連線。過程稱為 Three-way Handshake：

1. **第一次交握 (Client -> Server)**：
   - 傳送 Flag：`SYN` (Synchronize)
   - 意義：Client 告訴 Server「我想建立連線，我的初始序號是 X」。
2. **第二次交握 (Server -> Client)**：
   - 傳送 Flag：**`SYN` + `ACK`** (Acknowledge)
   - 意義：Server 回覆 `ACK` 說「我收到你的請求了」，同時也傳送 `SYN` 說「我也想跟你建立連線，我的初始序號是 Y」。
3. **第三次交握 (Client -> Server)**：
   - 傳送 Flag：`ACK`
   - 意義：Client 回覆 `ACK` 說「我收到你的請求了，連線建立完成」。

*記憶口訣：C 說 Hi (SYN) -> S 說收到你的 Hi，我也 Hi (ACK + SYN) -> C 說收到你的 Hi (ACK)。*

---

### 📌 動態規劃與 LCS (Longest Common Subsequence) (對應 Q20)

最長共同子序列 (LCS) 是經典的**動態規劃 (Dynamic Programming, DP)** 問題。雖然台聯大較少考複雜的 DP 計算，但常考其「觀念分類」。

- **DP 的兩大核心條件**：
  1. **Optimal Substructure (最佳子結構)**：大問題的最佳解可以由小問題的最佳解組合而成。
  2. **Overlapping Subproblems (重疊子問題)**：在遞迴過程中，相同的小問題會被重複計算。
- **DP 的解決方案**：
  使用記憶體將計算過的小問題答案存起來 (Memoization / Tabulation)，避免重複計算。常見於 LCS、背包問題 (Knapsack)、最短路徑 (Bellman-Ford, Floyd-Warshall)。

---

### 📌 Pipeline Hazards (管線化危險) 總整理

在 CPU 的管線化 (Pipelining) 設計中，多個指令重疊執行可能會發生資源或資料衝突，導致管線必須暫停 (Stall)。這種衝突稱為 Hazard，主要分為三大類：

#### 1. Structural Hazard (結構危險)

- **原因**：硬體資源不足。例如兩個指令在同一個 Clock Cycle 要求使用同一個硬體元件（如：只有單一記憶體，導致 Instruction Fetch 與 Memory Access 互搶）。
- **解決方案**：
  - **硬體資源加倍**：例如採用哈佛架構 (Harvard Architecture)，將記憶體拆分為獨立的 Instruction Memory 與 Data Memory。
  - **Stall (暫停)**：讓後續指令等待，產生氣泡 (Bubble)。

#### 2. Data Hazard (資料危險)

- **原因**：指令間存在資料依賴性 (Data Dependency)。後續指令需要用到前面指令尚未寫回 (Write-Back) 的暫存器結果。最常見的為 RAW (Read After Write)。
- **解決方案**：
  - **Data Forwarding / Bypassing (資料前推)**：不等待寫回階段，直接把 ALU 算出的熱騰騰結果拉線 (Bypass) 給下一個指令的 ALU 使用。
  - **Stall + Forwarding**：遇到特例 `Load-Use Hazard` (前面是 Load 指令從記憶體讀資料，下一個指令馬上要用)，即便有 Forwarding 也必須強行 Stall 一個 Cycle 等資料讀出來。
  - **Compiler Scheduling (編譯器排程)**：編譯器在不影響結果的前提下，調換指令順序，將無關指令安插在依賴的指令之間。

#### 3. Control Hazard (控制危險 / Branch Hazard)

- **原因**：遇到分支指令 (Branch/Jump)。因為管線化是不斷預先抓取指令，當執行到 Branch 確定要跳轉時，後面已經被抓進管線的指令就全成了廢指令。
- **解決方案**：
  - **Branch Prediction (分支預測)**：大膽猜測會不會跳轉（Static 猜測或 Dynamic 硬體紀錄）。若猜錯了，就把誤抓進入管線的指令清空 (Flush)。
  - **Delayed Branch (延遲分支)**：定義分支指令後方有一個 Delay Slot，編譯器刻意找一個「一定會執行」的指令塞進去，避免浪費管線空間。

---

### 📌 網路模型比較：OSI 7 層與 TCP/IP 5 層模型

根據手寫筆記彙整，此部分為網路概論的核心基礎。常考題型包含：各層的功能對應、PDU 名稱、相關設備運作在哪一層，以及常見協定的 Port 號。

| OSI 7層                             | TCP/IP (5層模型)                                                          | 核心功能與特色                                                                                                                    | 傳輸對象                                                                   | PDU (協定資料單位)                                                  | 常見協定與設備                                                                                                                 |
| :---------------------------------- | :------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- | :------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------- |
| **7. 應用層 (Application)**   | **5. 應用層 (Application)**`<br>`*(TCP/IP 將 OSI 5, 6, 7 合併)* | **提供服務**：提供使用者或應用程式網路服務介面。                                                                            | -                                                                          | **Data** (資料)                                               | **Protocol (Port):**`<br>`FTP (21), Telnet (23), SMTP (25), DNS (53), DHCP (67/68), HTTP (80), POP3 (110), HTTPS (443) |
| **6. 表示層 (Presentation)**  | 同上                                                                      | 1.**內碼轉換** (如 ASCII, UTF-8, Big5)`<br>`2. **資料加解密** `<br>`3. **資料壓縮/解壓縮** (De/compression) | -                                                                          | **Data** (資料)                                               | **Format/Protocol:**`<br>`ASCII, UTF-8, JPEG, TLS, SSL                                                                 |
| **5. 交談層 (Session)**       | 同上                                                                      | **建立會議/連線**：負責連線通道的建立、維護與終止。                                                                         | -                                                                          | **Data** (資料)                                               | **Protocol:**`<br>`RPC, NetBIOS                                                                                        |
| **4. 傳輸層 (Transport)**     | **4. 傳輸層 (Transport)**                                           | 1.**流量控制** (Flow Control)`<br>`2. **錯誤偵測/處理** (Error Control)                                             | **End-to-End** (端對端)`<br>`**Process-to-Process** (行程間) | **Segment** (TCP 區段)`<br>`**Datagram** (UDP 資料重) | **Protocol:** TCP, UDP                                                                                                   |
| **3. 網路層 (Network)**       | **3. 網路層 (Network)**                                             | 1.**邏輯定址 (Addressing)**：IP 計算 `<br>`2. **路由選擇 (Routing)**：決定封包傳遞路徑                              | **Host-to-Host** (主機對主機)                                        | **Packet** (封包)                                             | **Device:** Router (路由器), L3 Switch `<br>`**Protocol:** IP, ARP, RARP, ICMP                                   |
| **2. 資料鏈結層 (Data Link)** | **2. 資料鏈結層 (Data Link)**                                       | 1.**收送同步化與錯誤控制** `<br>`2. **MAC / LLC**：媒體存取控制 (如 CSMA/CD, CSMA/CA)                               | **Node-to-Node** (相鄰節點對相鄰節點)                                | **Frame** (訊框)                                              | **Device:** L2 Switch (交換器), Bridge (橋接器), NIC (網卡)`<br>`**Protocol:** MAC, LLC, IEEE 802 系列           |
| **1. 實體層 (Physical)**      | **1. 實體層 (Physical)**                                            | 1.**實體線材與介質規格** `<br>`2. **電子訊號傳送** (0與1的電氣訊號)                                                 | **Point-to-Point** (點對點)                                          | **Bit** (位元)                                                | **Device:** Hub (集線器), Repeater (中繼器), Cable, RJ-45, RS-232                                                        |

#### 💡 補充優化與進階考點：

1. **資料鏈結層的子層 (LLC & MAC)**：
   - **LLC (Logical Link Control，邏輯鏈結控制)**：負責與上層 (網路層) 溝通，進行錯誤控制與流量控制 (IEEE 802.2)。
   - **MAC (Media Access Control，媒體存取控制)**：負責與下層 (實體層) 溝通，處理硬體位址 (MAC Address) 以及碰撞偵測/避免 (如有線網路的 CSMA/CD，無線網路的 CSMA/CA)。
2. **ARP 與 RARP 的階層歸屬**：
   - ARP (IP 轉 MAC) 和 RARP (MAC 轉 IP) 在考題中常被歸類在**網路層 (Layer 3)**，但它們的功用是協助網路層與資料鏈結層之間的轉換，有時也被視為跨 Layer 2 與 Layer 3 的協定。
3. **TCP/IP 的版本差異**：
   - 表格中的「TCP/IP 5 層模型」是為了教學方便，將 OSI 下兩層拆開的版本。傳統標準的 **TCP/IP DoD 模型其實只有 4 層**：應用層、傳輸層、網際網路層 (Internet Layer)、網路存取層 (Network Access Layer，包含 OSI 的 L1+L2)。
4. **傳輸方式 (通訊範圍) 區分**：
   - **End-to-End (端對端)**：傳輸層專屬，確保兩個行程 (Process) 間的可靠通訊。
   - **Host-to-Host (主機對主機)**：網路層專屬，負責兩台設備 (Host) 之間的跨網段路由。
   - **Node-to-Node (節點對節點)**：資料鏈結層專屬，負責同網段內相鄰設備間的資料框傳遞。
5. **OSI 記憶口訣 (由下到上 1~7)**：
   - "**P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way"
   - (Physical, Data Link, Network, Transport, Session, Presentation, Application)
6. **碰撞偵測/避免**：
   - ***CSMA/CD (Carrier Sense Multiple Access with Collision Detection) 碰撞偵測:***
     主要應用於有線網路（如傳統 Ethernet 乙太網路，IEEE 802.3 標準）。
     核心精神是「邊傳邊聽，撞了就停」。
     運作方式：
     - 監聽：傳送資料前，先聆聽通道是否空閒。
     - 傳送與監測：若空閒則開始傳送，並在傳輸的同時持續監控通道電壓變化。
     - 碰撞處理：若偵測到電壓異常（發生碰撞），立即停止傳送，並廣播 Jam Signal（干擾訊號），確保網路上所有節點都知道發生了碰撞。
     - 隨機退避：發生碰撞的節點會暫停傳送，並進入等待。
   - ***CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance)碰撞避免:***
     主要應用於無線網路（如 Wi-Fi，IEEE 802.11 標準）。
     核心精神是「傳前預約，避免相撞」（因為無線電波衰減嚴重，發送端的訊號會蓋過接收端，導致硬體上無法做到邊傳邊聽）。
     運作方式：
     - 監聽：傳送前聆聽通道。若通道忙碌，節點會主動退避一段隨機時間；若空閒，還需等待一段特定的 IFS (Inter-Frame Space, 訊框間隔) 時間後才準備動作。
     - 確認 / 預約：為了解決無線網路特有的 Hidden Terminal Problem（隱藏節點問題），傳送端在發送大筆資料前，會先廣播 RTS (Request To Send, 請求發送)。接收端若同意，則回傳 CTS (Clear To Send, 允許發送)，藉此警告周圍其他節點暫時不要發送訊號。
     - 避讓：因為 CA 無法像 CD 那樣偵測碰撞，所以資料傳送完畢後，必須依賴接收端回傳 ACK (Acknowledgment, 確認回條)。若發送端在超時前沒收到 ACK，就會視為發生碰撞並重新傳送。





---

### 📌 IEEE 754 浮點數表示法與特殊值 (Special Values)

在計算機組織與 C/C++ 考題中，**單精度 (Single Precision, 32-bit)** 與 **雙精度 (Double Precision, 64-bit)** 浮點數的極端情況非常愛考。以下以最常考的單精度 (1-bit Sign, 8-bit Exponent, 23-bit Fraction) 為例，整理其特殊值的判斷條件：

| 數值類型 (Value Type)                           | Exponent (指數)               | Fraction (小數/尾數) | 意義與說明                                                                         |
| :---------------------------------------------- | :---------------------------- | :------------------- | :--------------------------------------------------------------------------------- |
| **Zero (零)**                             | **全為 0**              | **全為 0**     | 分為$+0$ (Sign=0) 與 $-0$ (Sign=1)。                                           |
| **Subnormal / Denormalized (非正規化數)** | **全為 0**              | **不為 0**     | 用於表示極接近 0 的超小數值，此時隱藏位元為 0 (而不是標準的 1)。                   |
| **Normalized (正規化數)**                 | $1 \sim 254$                | 任意值               | 一般正常的浮點數。隱藏位元固定為 1。                                               |
| **Infinity (無限大 $\pm\infty$)**       | **全為 1** (255 / 0xFF) | **全為 0**     | 分為$+\infty$ (Sign=0) 與 $-\infty$ (Sign=1)。常發生於除以零，如 $x / 0.0$。 |
| **NaN (Not a Number)**                    | **全為 1** (255 / 0xFF) | **不為 0**     | 表示無效運算結果，例如：$0.0 / 0.0$、$\infty - \infty$ 或 $\sqrt{-1}$。      |

#### 💡 考試防呆重點與陷阱：

- **解題 S.O.P**：只要看到 **Exponent 全為 1**，立刻聯想「不是無限大，就是 NaN」。接著看 Fraction：乾乾淨淨全為 0 就是 $\infty$；有雜質（不為0）就是 NaN。
- **NaN 程式陷阱**：在 C/C++ 中，`NaN == NaN` 的比對結果是 `false`！這是選擇題極常出現的語法陷阱。

---

## 📝 台聯大 114 學年度計算機概論 復盤

### 📌 Cache Miss 與陣列存取方向 (Row-major vs Column-major) (對應 114年 Q18)

**題目回顧：**
> A processor has a 32 KB L1 cache with 64-byte lines. A program accesses a 2D array of 1024×1024 integers (4 bytes each) in column-major order. Assuming the cache is initially empty, approximately how many cache misses occur in the first complete column access?
> (A) 1024 (B) 4096 (C) 16384 (D) 65536 (E) 1048576

**解題 SOP 與觀念釐清：**

1. **判斷快取行 (Cache Line) 容量**：
   - Cache Line 大小：`64 Bytes`。
   - 陣列元素：`4 Bytes` (整數)。
   - 每個 Cache Line 可以容納：$64 \div 4 = 16$ 個整數。
2. **釐清陣列記憶體配置 (Memory Layout) 與存取模式 (Access Pattern)**：
   - 題目中的 2D 陣列大小為 $1024 \times 1024$。在預設情況下（如 C/C++），二維陣列在記憶體中為 **Row-major (以列為主)**，亦即同一 Row 的元素 (例如 `A[0][0]` 到 `A[0][1023]`) 是連續存放在記憶體中的。
   - 然而，程式採用 **Column-major order (以行為主)** 的方式進行存取。意思是存取順序為 `A[0][0], A[1][0], A[2][0] ... A[1023][0]`。
3. **計算第一行 (First Complete Column) 的 Miss 數量**：
   - 當讀取 `A[0][0]` 時，發生 **Compulsory Miss (強制性失誤)**，系統會將 `A[0][0] ~ A[0][15]` 一併載入同一個 64-byte 的 Cache Line。
   - 接著讀取 `A[1][0]`。因為 `A[1][0]` 與 `A[0][0]` 在記憶體中相隔了一整個 Row 的距離 ($1024 \times 4 = 4096$ Bytes)，它絕對不會落在剛才載入的 Cache Line 內，因此**必定再次發生 Miss**。
   - 依此類推，由於同一 Column 中的任何兩個相鄰元素都相隔 4096 Bytes (遠大於 64 Bytes 的 Cache Line)，每一次存取都會落在不同的 Cache Line 上。
   - 結論：存取第一行的 1024 個元素時，**每次都會 Miss**，總共產生 **1024 次 Cache Miss**。(答案選 A)

> [!WARNING]
> **延伸思考：Thrashing 與 Capacity Miss 陷阱**
> 如果題目問的是「存取整個陣列 (1024x1024)」的 Cache Miss 次數呢？
> 存取第一行時，總共載入了 1024 個 Cache Line，佔用 $1024 \times 64 = 64 \text{ KB}$ 的快取空間。
> 但是，L1 Cache 的總容量只有 **32 KB**！這意味著在第一行還沒讀完時，快取就已經滿了，最舊的資料（如 `A[0][0]` 所在的 Block）早就被替換 (Evicted) 出去。
> 因此，當程式開始讀取第二行 `A[0][1]` 時，**又會全部 Miss**。最終整個陣列的存取會產生 $1024 \times 1024 = 1048576$ 次 Miss。

---

### 📌 Cache 記憶體位址切割與 Tag 計算 (對應 114年 Q10)

**題目回顧：**
> A 64-MiB main memory is byte-addressable. A 4-way set-associative cache of 32 KiB uses 64-byte lines. Number of tag bits in a 32-bit address is:
> (A) 19 (B) 16 (C) 13 (D) 20 (E) 21

**解題 SOP 與觀念釐清：**

Cache 位址通常被切割為三個部分：`[ Tag | Index | Offset ]`。

1. **計算 Offset (區塊內偏移量)**：
   - 題目給定 Cache Line (Block) 大小為 `64 Bytes`。
   - 因為記憶體是 byte-addressable，所以 Offset 需要 $\log_2(64) = 6$ bits。
2. **計算 Index (Set 索引)**：
   - 先求出 Cache 內總共有幾個 Block：$32 \text{ KiB} \div 64 \text{ Bytes} = 2^{15} \div 2^6 = 2^9 = 512$ 個 Blocks。
   - 題目給定為 **4-way set-associative** (每個 Set 裝 4 個 Block)。
   - 因此總共有 $512 \div 4 = 128$ 個 Sets。
   - Index 需要 $\log_2(128) = 7$ bits。
3. **計算 Tag (標籤)**：
   - **(陷阱警告) 題目的「32-bit address」 vs 「64-MiB main memory」**：
     雖然 64-MiB 的主記憶體只需 26 bits ($\log_2(2^{26})$) 來定址，但題目特別指定要求的是**「在一個 32-bit 的位址中」** (in a 32-bit address)。這代表 CPU 發出的位址匯流排寬度就是 32 bits，未對應到實體記憶體的高位元依然是 Tag 的一部分。
   - 根據 32-bit 總長度計算：`Tag = Total - Index - Offset`
   - $Tag = 32 - 7 - 6 = 19$ bits。(答案選 A)

> [!CAUTION]
> **考試防呆重點 (Distractor 辨識)**
> 本題的「64-MiB main memory」是個標準的**干擾資訊 (Distractor)**。如果誤用 26 bits 來算，就會算出 $26 - 7 - 6 = 13$ bits 而掉入選項 (C) 的陷阱。
> **判斷原則**：在計算 Cache Tag 時，**優先以題目明確指示的 Address Length (如本題的 32-bit address) 為總長度**。只有當題目完全沒提 Address Length 時，才用 Main Memory Size 來推算總位元數。
