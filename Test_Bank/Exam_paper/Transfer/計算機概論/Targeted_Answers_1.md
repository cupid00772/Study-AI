# 國立臺灣聯合大學系統 114學年度 計算機概論 模擬試題 解答卷 (Answers 2 - 弱點打擊)

**考點分佈總表**
此份考卷專門針對 `Learning_Status.md` 中的紅燈 🔴 弱點進行複習：
- 記憶體階層 (Write-through vs Write-back)
- 行程狀態 (Waiting to Ready)
- 虛擬記憶體 (Page Fault 定義)
- 殭屍行程 (Zombie Process 的處理)
- 資料結構 (Heap 的操作複雜度)
- 演算法 (NP 的定義)

---

### 單選題，共 6 題，每題 10 分

**1. Answer: `(B)`**
- **難度：** [Easy]
- **核心概念：** 快取寫入策略 (Cache Write Policies)。
- **解題步驟：**
  - 當 CPU 寫入快取時，若同時也將資料寫入主記憶體 (Main Memory)，這被稱為 Write-through (寫入穿透)。
  - 若只有更新快取，直到該快取區塊被替換出時才寫回主記憶體，稱為 Write-back (寫回)。
- **常見錯誤陷阱：** 上次測驗你可能混淆了這兩個名詞。記住 "through" 就像是一路穿透寫回底層記憶體。

**2. Answer: `(D)`**
- **難度：** [Medium]
- **核心概念：** 行程狀態轉換 (Process State Transitions)。
- **解題步驟：**
  - "Waiting" (或 Blocked) 狀態代表行程正在等待某個事件發生（通常是 I/O 完成或等待 Lock）。
  - 當該事件完成時（例如 I/O 設備傳回資料），行程就會解除阻塞，進入 "Ready" 狀態，重新排隊等待 CPU。
  - (A) Time slice expired 會導致 Running -> Ready（這正是你上次錯的觀念！）。
  - (B) Requesting I/O 會導致 Running -> Waiting。

**3. Answer: `(C)`**
- **難度：** [Easy]
- **核心概念：** 分頁錯誤 (Page Fault)。
- **解題步驟：**
  - Page Fault 的精確定義是：CPU 透過分頁表 (Page Table) 尋找某個虛擬記憶體位址，卻發現該頁面的 Valid bit 為 0（代表該頁面不在實體記憶體 Physical RAM 中，可能還在硬碟裡）。
  - 此時硬體會觸發一個中斷 (Trap) 給 OS，OS 負責把該頁面從磁碟載入 RAM。
- **常見錯誤陷阱：** 千萬別把 Page Fault 和「記憶體滿了 (Out of Memory)」畫上等號。記憶體很空也可能發生 Page Fault，只要你要找的資料還沒被載入 RAM 就會發生。

**4. Answer: `(C)`**
- **難度：** [Medium]
- **核心概念：** 殭屍行程 (Zombie Process) 的預防與清理。
- **解題步驟：**
  - Zombie process 是一個「已經死掉（結束執行），但屍體（結束狀態碼）還沒被收走」的行程。
  - 父行程有責任呼叫 `wait()` 或 `waitpid()` 來讀取這個結束狀態。一旦讀取完畢，作業系統就會將這個殭屍行程的 PCB 從系統中完全刪除。

**5. Answer: `(B)`**
- **難度：** [Medium]
- **核心概念：** Max-Heap 的操作時間複雜度。
- **解題步驟：**
  - 上一張考卷考的是「建構 (Build) 整棵 Heap」的時間複雜度，如果是從已知陣列建構，最佳解是 $O(n)$。
  - 這題考的是「取出最大值 (extract-max)」。在 Max-Heap 中，最大值永遠在根節點。取出根節點後，我們通常把最後一個節點移到根節點，然後執行往下篩 (sift-down / heapify) 來維持 Heap 性質。
  - 這個往下走訪的路徑長度最多等於樹的高度，因此時間複雜度為 $O(\log n)$。

**6. Answer: `(C)`**
- **難度：** [Medium]
- **核心概念：** NP 問題的定義。
- **解題步驟：**
  - P 問題：可以在多項式時間內被「解決」。
  - NP 問題：Nondeterministic Polynomial time，指的是一個問題的解如果被給出來，可以在多項式時間內被「驗證 (Verified)」是否正確。
  - (A) 是錯誤的，NP 問題並不代表「只能」在非多項式時間解決（因為 P 也是 NP 的一部分）。

---
> 💡 **考後檢討互動：**
> 這是為你特製的弱點打擊測驗！請試著作答 `Mock_Exam_2.md`，寫完後再回來對照解答。如果你對這些解釋還有任何疑問，我們隨時可以再深入討論喔！
