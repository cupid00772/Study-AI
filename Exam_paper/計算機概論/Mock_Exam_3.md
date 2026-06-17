# 國立臺灣聯合大學系統 114學年度 計算機概論 模擬試題 (Mock Exam 3)

**測驗說明區**
- **測驗範圍：** 計算機概論全（含程式設計、資料結構、演算法、作業系統、計算機組織、網路、數位邏輯與資安）
- **測驗難易度：** 擬真 (Medium)
- **出題策略：** 策略 A - 擬真考古題 (Simulated Past Paper) - 綜合各章節，模擬實際台聯大考試出題比例。
- **配分建議：** 單選題，共 25 題，每題 4 分（答錯不倒扣），滿分 100 分。作答完畢請參考 `Answers_3.md` 核對答案。

---

## 一、選擇題

1. What will be the output of the following C code snippet?
```c
#include <stdio.h>
int main() {
    char str[] = "Hello";
    printf("%lu", sizeof(str));
    return 0;
}
```
(A) 4
(B) 5
(C) 6
(D) 8
(E) Compiler Error

2. In the IEEE 754 single-precision (32-bit) floating-point format, what is the value of the exponent bias?
(A) 0
(B) 127
(C) 128
(D) 255
(E) 1023

3. Which of the following hazard types in a pipelined processor occurs when an instruction depends on the result of a previous instruction that has not yet completed?
(A) Structural hazard
(B) Control hazard
(C) Data hazard
(D) Branch hazard
(E) Exception hazard

4. Which of the following CPU scheduling algorithms is most likely to cause "Starvation" for some processes?
(A) Round Robin (RR)
(B) Shortest Job First (SJF)
(C) First-Come, First-Served (FCFS)
(D) Multilevel Feedback Queue with aging
(E) Completely Fair Scheduler (CFS)

5. In a perfectly balanced Binary Search Tree (such as an AVL tree) containing $n$ nodes, what is the worst-case time complexity to find the maximum element?
(A) $O(1)$
(B) $O(\log n)$
(C) $O(n)$
(D) $O(n \log n)$
(E) $O(n^2)$

6. Which protocol in the TCP/IP suite is primarily used to translate human-readable domain names (like `www.google.com`) into IP addresses?
(A) DHCP
(B) FTP
(C) HTTP
(D) DNS
(E) ARP

7. In modern operating systems, the phenomenon known as "Thrashing" is most closely associated with:
(A) A process consuming 100% of the CPU.
(B) A deadlock situation involving multiple resources.
(C) The system spending more time servicing page faults than executing processes.
(D) A network interface card dropping packets due to a full buffer.
(E) The cache memory being flushed repeatedly.

8. What is the 2's complement of the 8-bit binary number `11010110`?
(A) 00101001
(B) 00101010
(C) 11010111
(D) 00101011
(E) 10101010

9. What is the average-case time complexity of the QuickSort algorithm?
(A) $O(1)$
(B) $O(\log n)$
(C) $O(n)$
(D) $O(n \log n)$
(E) $O(n^2)$

10. Which algorithm is widely used to find the shortest path from a single source vertex to all other vertices in a weighted graph with non-negative edge weights?
(A) Prim's Algorithm
(B) Kruskal's Algorithm
(C) Dijkstra's Algorithm
(D) Floyd-Warshall Algorithm
(E) Depth-First Search (DFS)

11. Consider a system with 3 processes. They share 4 identical instances of a resource type. Each process requires a maximum of 2 instances to complete its execution. Which of the following statements is TRUE regarding this system?
(A) The system will definitely enter a deadlock.
(B) The system can never enter a deadlock.
(C) Deadlock is possible if all 3 processes request 1 resource simultaneously.
(D) The system requires at least 6 resources to guarantee deadlock freedom.
(E) Starvation will occur for at least one process.

12. What will be the output of the following C code snippet?
```c
#include <stdio.h>
int main() {
    int a = 1;
    printf("%d", a << 3);
    return 0;
}
```
(A) 3
(B) 4
(C) 8
(D) 10
(E) 13

13. Which of the following storage components provides the fastest data access speed for the CPU?
(A) L1 Cache
(B) L2 Cache
(C) Main Memory (RAM)
(D) Registers
(E) Solid State Drive (SSD)

14. How does a Hash Table implemented with "Separate Chaining" resolve hash collisions?
(A) By finding the next available empty slot in the array using linear probing.
(B) By using a secondary hash function to calculate a new index.
(C) By replacing the old element with the newly inserted element.
(D) By maintaining a linked list of elements at each bucket index.
(E) By automatically doubling the size of the hash table.

15. In the OSI 7-layer model, which layer is responsible for logical addressing and routing packets across multiple different networks?
(A) Physical Layer
(B) Data Link Layer
(C) Network Layer
(D) Transport Layer
(E) Application Layer

16. Which of the following is a widely used Symmetric-key encryption algorithm?
(A) RSA
(B) ECC (Elliptic Curve Cryptography)
(C) Diffie-Hellman
(D) AES (Advanced Encryption Standard)
(E) SHA-256

17. Which of the following is NOT a typical state for a process or thread in an operating system?
(A) Ready
(B) Running
(C) Waiting (Blocked)
(D) Terminated
(E) Compiling

18. In digital logic design, which type of Flip-Flop is known to toggle (invert) its output state whenever both of its inputs are set to logic '1'?
(A) D Flip-Flop
(B) T Flip-Flop
(C) SR Flip-Flop
(D) JK Flip-Flop
(E) Latch

19. Given the prefix expression `* + 2 3 4`, what is its evaluated result?
(A) 9
(B) 14
(C) 20
(D) 24
(E) Invalid expression

20. Which Abstract Data Type (ADT) follows the LIFO (Last In, First Out) principle?
(A) Queue
(B) Stack
(C) Priority Queue
(D) Tree
(E) Graph

21. In a pipelined CPU architecture, a "Branch Penalty" is primarily caused by which of the following?
(A) Data hazards
(B) Control hazards (Branch instructions)
(C) Structural hazards
(D) Cache misses
(E) Page faults

22. What is the primary advantage of using a Multilevel Page Table in virtual memory management?
(A) It reduces the time required for address translation.
(B) It eliminates the need for a Translation Lookaside Buffer (TLB).
(C) It reduces the amount of physical memory needed to store the page tables themselves.
(D) It prevents page faults from occurring.
(E) It increases the size of the virtual address space.

23. What will be the output of the following C code snippet?
```c
#include <stdio.h>
int main() {
    int a = 10;
    int *p = &a;
    int **q = &p;
    printf("%d", **q);
    return 0;
}
```
(A) The memory address of `a`
(B) The memory address of `p`
(C) 10
(D) 0
(E) Segmentation fault

24. What is the maximum number of nodes in a binary tree of height $h$ (assuming a tree with a single root node has a height of 1)?
(A) $2^h$
(B) $2^{h-1}$
(C) $2^h - 1$
(D) $2^{h+1} - 1$
(E) $h^2$

25. Which tree traversal method, when applied to a Binary Search Tree (BST), will visit the nodes in descending (largest to smallest) order?
(A) Pre-order traversal
(B) In-order traversal
(C) Reverse In-order traversal (Right-Root-Left)
(D) Post-order traversal
(E) Level-order traversal
