# 國立臺灣聯合大學系統 114學年度 計算機概論 弱點加強試題 (Targeted Exam 2)

**測驗說明區**
- **測驗範圍：** 計算機概論（針對弱點：Pipeline Hazards, CPU Scheduling, Deadlock, BST Complexity, Memory Hierarchy, Flip-Flops, Multilevel Page Table）
- **難易度：** 弱點打擊模式 (Targeted)
- **出題策略：** 針對前次測驗易混淆觀念進行深度檢測，確保觀念釐清。
- **配分建議：** 單選題，共 7 題，每題 10 分，滿分 70 分。作答完畢請參考 `Targeted_Answers_2.md` 核對答案。

---

## 一、單選題

1. What will be the output of the following C code snippet regarding the size of the string?
```c
#include <stdio.h>
#include <string.h>
int main() {
    char str[] = "Taiwan";
    printf("%lu %lu", sizeof(str), strlen(str));
    return 0;
}
```
(A) 6 6
(B) 7 6
(C) 6 7
(D) 7 7
(E) 8 6

2. Which of the following CPU scheduling algorithms is guaranteed to be completely free from "Starvation" regardless of the job lengths?
(A) Shortest Job First (SJF)
(B) Priority Scheduling (without aging)
(C) Round Robin (RR)
(D) Shortest Remaining Time First (SRTF)
(E) None of the above

3. In a system, there are 4 identical instances of a resource type and 3 processes competing for them. If each process needs a maximum of $M$ instances to complete its task, what is the maximum value of $M$ that guarantees the system will NEVER enter a deadlock state?
(A) 1
(B) 2
(C) 3
(D) 4
(E) 5

4. In a standard 5-stage pipelined processor, an instruction like `add r1, r2, r3` is immediately followed by a conditional branch instruction `beq r1, r0, target`. What type of pipeline hazard(s) are primarily involved here?
(A) Structural hazard only
(B) Data hazard only
(C) Control hazard only
(D) Both Data hazard and Control hazard
(E) Exception hazard

5. What is the worst-case time complexity to search for a specific element in an ordinary (unbalanced) Binary Search Tree containing $n$ nodes, and in an AVL tree containing $n$ nodes, respectively?
(A) $O(\log n)$ and $O(\log n)$
(B) $O(n)$ and $O(n)$
(C) $O(n \log n)$ and $O(\log n)$
(D) $O(n)$ and $O(\log n)$
(E) $O(1)$ and $O(\log n)$

6. In digital logic design, if you want a Flip-Flop to maintain its previous output state (No change) under certain conditions, and toggle its state under other conditions, which Flip-Flop is best suited for this when its inputs are tied together?
(A) D Flip-Flop
(B) SR Flip-Flop
(C) JK Flip-Flop
(D) Latch
(E) None of the above

7. Which of the following statements best describes the primary purpose of using a Multilevel Page Table in an Operating System?
(A) It reduces the time required to translate a virtual address to a physical address.
(B) It prevents Thrashing by keeping more pages in main memory.
(C) It reduces the continuous physical memory space required to store the page table itself.
(D) It acts as a fast cache for recently translated addresses, replacing the TLB.
(E) It increases the speed of disk I/O operations during page faults.
