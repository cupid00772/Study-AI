# 國立臺灣聯合大學系統 114學年度 計算機概論 模擬測驗 (Mock Exam 5)

**測驗說明區**
- **測驗時間：** 100 分鐘
- **滿分：** 100 分
- **測驗範圍：** 計算機概論全範圍 (涵蓋計算機組織、作業系統、資料結構與演算法、程式設計、網路與資料庫)
- **難易度：** 困難 (Hard) - 延續台聯大難度，並精準針對第 4 回測驗之弱點進行「弱點打擊」。
- **出題策略：** 弱點打擊 (Targeted Weaknesses) + 擬真考古題 (Simulated Past Paper)

---

## 單選題 (Single Choice, 每題 4 分，共 25 題，答錯不倒扣)

1. **In a multiprogramming operating system, a process is currently in the "Waiting" (or Blocked) state. Which of the following events will most likely transition the process into the "Ready" state?**
(A) The CPU scheduler selects the process for execution.
(B) A hardware timer interrupt occurs due to time quantum expiration.
(C) An I/O device completes the operation that the process was waiting for.
(D) The process executes the `exit()` system call.
(E) The process invokes a system call to read data from the hard disk.

2. **Regarding the Time Complexity of Heap operations, which of the following statements is FALSE?**
(A) Inserting a single element into an existing Max-Heap of size $n$ takes $O(\log n)$ time.
(B) Building a Max-Heap from an unsorted array of size $n$ using the bottom-up `heapify` method takes $O(n \log n)$ time.
(C) Extracting the maximum element from a Max-Heap of size $n$ and restoring the heap property takes $O(\log n)$ time.
(D) Finding the maximum element in a Max-Heap takes $O(1)$ time.
(E) Heap Sort algorithm has a worst-case time complexity of $O(n \log n)$.

3. **In the context of Computational Complexity Theory (assuming $P \neq NP$), which of the following statements about NP-Hard and NP-Complete is TRUE?**
(A) All NP-Hard problems belong to the NP class.
(B) An NP-Complete problem is defined as a problem that is both in NP and is NP-Hard.
(C) If a problem is in P, it cannot be reduced to an NP-Complete problem in polynomial time.
(D) NP-Complete problems can be solved deterministically in polynomial time.
(E) NP stands for "Not Polynomial", implying these problems are strictly exponential.

4. **Consider a 5-stage instruction pipeline (IF, ID, EX, MEM, WB). Assume that Data Forwarding (Bypassing) is IMPLEMENTED from EX/MEM and MEM/WB registers to the ALU input. How many stall cycles are required to resolve a RAW (Read After Write) data hazard between an ALU instruction (like ADD) and an immediately following ALU instruction that depends on its result?**
(A) 0
(B) 1
(C) 2
(D) 3
(E) 4

5. **Given an IP address `172.16.45.14` with a subnet mask of `255.255.240.0`. What is the Broadcast Address for this subnet?**
(A) 172.16.45.255
(B) 172.16.47.255
(C) 172.16.48.255
(D) 172.16.63.255
(E) 172.16.255.255

6. **In the IEEE 754 Single-Precision Floating-Point standard (32 bits), how is the value "Negative Infinity" ($-\infty$) represented?**
(A) Sign bit = 1, Exponent = All 0s, Mantissa = All 0s
(B) Sign bit = 1, Exponent = All 1s, Mantissa = All 0s
(C) Sign bit = 1, Exponent = All 1s, Mantissa = Non-zero
(D) Sign bit = 1, Exponent = All 0s, Mantissa = Non-zero
(E) Sign bit = 0, Exponent = All 1s, Mantissa = All 0s

7. **Which of the following Page Replacement algorithms may suffer from Belady's Anomaly, and what is Belady's Anomaly?**
(A) LRU; the anomaly where a recently used page is evicted prematurely.
(B) OPT; the anomaly where the optimal choice cannot be determined because the future is unknown.
(C) FIFO; the anomaly where increasing the number of physical page frames can increase the number of page faults.
(D) LFU; the anomaly where a heavily used page is evicted if it is not used in the last time quantum.
(E) FIFO; the anomaly where all page frames are filled with identical data blocks.

8. **Assume a system uses paging with a Translation Lookaside Buffer (TLB). The TLB hit ratio is 80%. A TLB search takes 20 ns, and a main memory access takes 100 ns. What is the Effective Memory Access Time (EMAT)?**
(A) 100 ns
(B) 120 ns
(C) 140 ns
(D) 180 ns
(E) 220 ns

9. **Which of the following sorting algorithms is NOT stable?**
(A) Insertion Sort
(B) Bubble Sort
(C) Merge Sort
(D) Quick Sort
(E) Counting Sort

10. **What will be the output of the following C program?**
```c
#include <stdio.h>
int main() {
    int a = 10, b = 20, c = 30;
    int *arr[] = {&a, &b, &c};
    int **ptr = arr;
    ptr++;
    printf("%d ", **ptr);
    (*ptr)++;
    printf("%d", **ptr);
    return 0;
}
```
(A) 20 21
(B) 20 20
(C) 20 30
(D) 10 20
(E) Compile Error

11. **Using the Master Theorem, what is the asymptotic time complexity of the recurrence relation $T(n) = 3T(n/2) + O(n)$?**
(A) $O(n \log n)$
(B) $O(n^{\log_2 3})$
(C) $O(n^2)$
(D) $O(n^{\log_3 2})$
(E) $O(n^3)$

12. **Consider a computer system with a 32-bit physical address space, an 8 KB Direct-Mapped Cache, and a block size of 64 bytes. How many bits are used for the Tag, Index, and Block Offset fields respectively?**
(A) Tag = 19, Index = 7, Offset = 6
(B) Tag = 18, Index = 8, Offset = 6
(C) Tag = 19, Index = 8, Offset = 5
(D) Tag = 17, Index = 9, Offset = 6
(E) Tag = 18, Index = 7, Offset = 7

13. **In the context of the Banker's Algorithm for deadlock avoidance, a system is in a "Safe State" if:**
(A) There is at least one sequence of all processes such that each process can complete its execution with currently available resources and resources released by previously executed processes in the sequence.
(B) No processes are currently in the waiting state.
(C) The total number of available resources strictly exceeds the total maximum demand of all processes.
(D) A cycle does not exist in the Resource Allocation Graph.
(E) All processes have executed the `wait()` system call successfully.

14. **Which of the following features is a primary advantage of User-Level Threads (ULT) over Kernel-Level Threads (KLT)?**
(A) If one ULT blocks on an I/O operation, other ULTs within the same process can continue executing.
(B) The Operating System can schedule multiple ULTs from the same process onto multiple CPU cores simultaneously.
(C) Thread switching in ULT does not require a context switch into kernel mode, making it much faster.
(D) ULTs are directly managed and optimized by the hardware scheduler.
(E) ULTs are immune to race conditions and do not require synchronization mechanisms like mutexes.

15. **In an entity-relationship (ER) model and Relational Databases, what is the defining condition for a table to be in the Second Normal Form (2NF)?**
(A) It must be in 1NF and contain no transitive dependencies.
(B) It must be in 1NF and all non-key attributes must be fully functionally dependent on the primary key.
(C) Every determinant must be a candidate key.
(D) It must contain only atomic (indivisible) values.
(E) It must contain no multi-valued dependencies.

16. **What is the output of the following recursive C function when `foo(5)` is called?**
```c
#include <stdio.h>
void foo(int n) {
    if (n > 0) {
        foo(n - 1);
        printf("%d ", n);
        foo(n - 2);
    }
}
```
(A) 5 4 3 2 1
(B) 1 2 3 4 5
(C) 1 2 1 3 1 2 4 1 2 1 3 5 1 2 1 3 1 2
(D) 1 2 1 3 1 4 1 2 1 5 1 2 1 3 1
(E) 5 3 1 2 1 4 2 1 3 1

17. **During the TCP 3-Way Handshake to establish a connection, what is the correct sequence of packets exchanged between the Client and the Server?**
(A) SYN $\rightarrow$ ACK $\rightarrow$ SYN-ACK
(B) SYN $\rightarrow$ SYN-ACK $\rightarrow$ ACK
(C) ACK $\rightarrow$ SYN $\rightarrow$ SYN-ACK
(D) SYN-ACK $\rightarrow$ SYN $\rightarrow$ ACK
(E) SYN $\rightarrow$ SYN $\rightarrow$ ACK

18. **In Graph Algorithms, which of the following statements about Dijkstra's Shortest Path Algorithm is TRUE?**
(A) It can correctly find the shortest path in a graph containing negative edge weights, provided there are no negative weight cycles.
(B) It can be implemented to run in $O(V \log V + E)$ time using a Fibonacci Heap.
(C) It uses a Divide and Conquer approach.
(D) It finds the Minimum Spanning Tree (MST) of a graph.
(E) It requires the graph to be a Directed Acyclic Graph (DAG).

19. **According to Amdahl's Law, if 80% of a program can be perfectly parallelized, what is the maximum theoretical speedup that can be achieved if the program is run on a system with an infinite number of processors?**
(A) 4x
(B) 5x
(C) 8x
(D) 10x
(E) Infinite

20. **When using Asymmetric Cryptography (Public-Key Cryptography) for Digital Signatures to ensure non-repudiation and authentication, how does the sender (Alice) sign a document sent to the receiver (Bob)?**
(A) Alice encrypts the document hash with Alice's Public Key.
(B) Alice encrypts the document hash with Bob's Public Key.
(C) Alice encrypts the document hash with Alice's Private Key.
(D) Alice encrypts the document hash with Bob's Private Key.
(E) Alice encrypts the document hash with a shared Symmetric Key.

21. **In Boolean Algebra, which of the following represents De Morgan's Law?**
(A) $A + (B \cdot C) = (A + B) \cdot (A + C)$
(B) $A \cdot (A + B) = A$
(C) $\overline{A \cdot B} = \overline{A} + \overline{B}$
(D) $A + \overline{A}B = A + B$
(E) $A \cdot \overline{A} = 0$

22. **In a UNIX-like file system using i-nodes, if an i-node contains 12 direct block pointers, 1 single indirect pointer, 1 double indirect pointer, and 1 triple indirect pointer. Assuming each disk block is 4KB and a pointer requires 4 Bytes, what is the maximum file size that can be supported by the single indirect pointer alone?**
(A) 48 KB
(B) 4 MB
(C) 4 GB
(D) 1024 KB
(E) 4096 KB

23. **Consider a Hash Table utilizing Double Hashing for collision resolution. The primary hash function is $h_1(k)$ and the secondary hash function is $h_2(k)$. Which of the following is a critical requirement for $h_2(k)$?**
(A) $h_2(k)$ must evaluate to 0 for at least one key.
(B) $h_2(k)$ must never evaluate to 0.
(C) $h_2(k)$ must always return an odd number.
(D) $h_2(k)$ must be identical to $h_1(k)$ to ensure symmetry.
(E) $h_2(k)$ must return a value greater than the table size.

24. **Which of the following data structures is most suitable for implementing a Breadth-First Search (BFS) algorithm on a graph?**
(A) Stack
(B) Priority Queue
(C) Queue
(D) Hash Table
(E) Max-Heap

25. **If a complete binary tree has $N$ nodes, what is the maximum number of leaves it can have?**
(A) $\lfloor N / 2 \rfloor$
(B) $\lceil N / 2 \rceil$
(C) $2^{\lfloor \log_2 N \rfloor}$
(D) $N - 1$
(E) $N / 2 - 1$

---
*End of Exam*
