# 國立臺灣聯合大學系統 114學年度 計算機概論 模擬試題 (Mock Exam 2 - 弱點打擊)

**測驗說明區**
- **測驗範圍：** 計算機概論（針對前次測驗弱點：快取記憶體、Heap演算法、行程狀態、虛擬記憶體、P vs NP、殭屍行程）
- **測驗難易度：** 擬真 (Medium)
- **出題策略：** 弱點打擊 (Weakness Targeted) - 專攻你容易混淆的觀念。
- **配分建議：** 單選題，共 6 題，每題 10 分，滿分 60 分。作答完畢請參考 `Answers_2.md`。

---

## 一、選擇題

1. Regarding cache memory design, which of the following mechanisms ensures that whenever a processor writes to the cache, the corresponding block in main memory is also updated at the same time?
(A) Write-back
(B) Write-through
(C) Cache locality
(D) Translation Lookaside Buffer (TLB)
(E) LRU Replacement

2. In an operating system, if a process moves from the "Waiting" (or Blocked) state to the "Ready" state, what is the most likely reason?
(A) The process's time slice (quantum) has expired.
(B) The process requested a new I/O operation.
(C) The process was just created.
(D) The I/O operation that the process was waiting for has completed.
(E) The process has finished its execution.

3. Which of the following statements accurately describes the condition for a "Page Fault" to occur?
(A) The physical RAM is 100% full and a page must be written to disk.
(B) A process tries to execute a privileged instruction in user mode.
(C) The CPU attempts to access a virtual memory page that has not been loaded into the physical RAM yet.
(D) A division by zero error happens during execution.
(E) The Translation Lookaside Buffer (TLB) is full.

4. How can a parent process in a Unix/Linux system prevent its terminated child processes from remaining as "Zombie processes"?
(A) By sending a SIGKILL signal to the child process.
(B) By increasing the priority of the child process.
(C) By calling the `wait()` or `waitpid()` system call to read the child's exit status.
(D) By restarting the CPU scheduler.
(E) A zombie process will automatically disappear after a few seconds without any action.

5. What is the worst-case time complexity of extracting the maximum element (`extract-max`) from a Max-Heap containing $n$ elements?
(A) $O(1)$
(B) $O(\log n)$
(C) $O(n)$
(D) $O(n \log n)$
(E) $O(n^2)$

6. In the theory of computation, which of the following defines the class of "NP" problems?
(A) Problems that can be solved in non-polynomial time only.
(B) Problems whose solutions cannot be verified quickly.
(C) Problems for which a proposed solution can be verified for correctness in polynomial time.
(D) The hardest problems in computer science that have no solution.
(E) Problems that can be solved deterministically in polynomial time.
