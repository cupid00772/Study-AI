# 國立臺灣聯合大學系統 114學年度 計算機概論 模擬試題 (Mock Exam 1)

**測驗範圍：** 計算機概論全（含程式設計、資料結構、演算法、作業系統、計算機組織、網路、資安與數位邏輯）
**難易度：** 擬真（Medium）
**配分建議與評分標準：** 單選題，共 25 題，每題 4 分（答錯不倒扣），滿分 100 分。請參考解答卷 `Answers_1.md` 核對答案。

---

**單選題，共 25 題，每題 4 分 (答錯不倒扣)**

1. What will be the output of the following C code snippet?
```c
#include <stdio.h>
int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int *p = arr;
    printf("%d ", *(p++));
    printf("%d", *p);
    return 0;
}
```
(A) 10 10
(B) 10 20
(C) 20 20
(D) 20 30
(E) Compiler Error

2. Which of the following statements regarding the memory hierarchy and caching is TRUE?
(A) L1 cache is typically larger and slower than L2 cache.
(B) Spatial locality refers to the tendency of execution to involve a number of memory locations that are clustered.
(C) Write-through cache updates the main memory only when a modified block is replaced.
(D) Virtual memory is generally implemented using SRAM.
(E) A TLB (Translation Lookaside Buffer) is used to cache instructions from the CPU.

3. In a 32-bit system, integers are represented in 2's complement. If an integer variable `x` has the hexadecimal value `0xFFFFFFF0`, what is its decimal value?
(A) -16
(B) -15
(C) -1
(D) 16
(E) 240

4. Which of the following traversal methods applied to a Binary Search Tree (BST) will output the nodes in sorted (ascending) order?
(A) Pre-order traversal
(B) Post-order traversal
(C) In-order traversal
(D) Level-order traversal
(E) Depth-first search (DFS)

5. Consider a system with 3 processes (P1, P2, P3) and 3 resource types (R1, R2, R3). Which of the following is NOT a necessary condition for a deadlock to occur?
(A) Mutual Exclusion
(B) Hold and Wait
(C) No Preemption
(D) Circular Wait
(E) Starvation

6. What is the time complexity of building a Max-Heap from an unsorted array of $n$ elements using the optimal algorithm?
(A) $O(1)$
(B) $O(\log n)$
(C) $O(n)$
(D) $O(n \log n)$
(E) $O(n^2)$

7. A network uses a subnet mask of `255.255.255.224`. How many usable host IP addresses are available in each subnet?
(A) 14
(B) 30
(C) 32
(D) 62
(E) 64

8. Which of the following layers in the TCP/IP model is responsible for reliable, connection-oriented data delivery and error recovery?
(A) Physical Layer
(B) Data Link Layer
(C) Network Layer
(D) Transport Layer
(E) Application Layer

9. If a stack is initially empty and the following operations are performed: `push(1), push(2), pop(), push(3), push(4), pop(), pop()`, what is the element at the top of the stack now?
(A) 1
(B) 2
(C) 3
(D) 4
(E) The stack is empty.

10. Which of the following sorting algorithms has a worst-case time complexity of $O(n \log n)$?
(A) Bubble Sort
(B) Insertion Sort
(C) Quick Sort
(D) Merge Sort
(E) Selection Sort

11. Which of the following statements about RISC (Reduced Instruction Set Computer) architecture is FALSE?
(A) It relies heavily on compiler optimization.
(B) Instructions usually have a fixed length.
(C) Memory access is mostly limited to specific load and store instructions.
(D) It typically contains fewer general-purpose registers than CISC.
(E) Most of its instructions can be executed in a single clock cycle.

12. In an operating system, when a process moves from the "Running" state to the "Ready" state, what is the most likely cause?
(A) The process requested an I/O operation.
(B) The process completed its execution.
(C) A timer interrupt occurred (time slice expired).
(D) The I/O operation requested by the process is completed.
(E) The process is waiting for a semaphore.

13. What is the output of the following recursive function if `func(5)` is called?
```c
int func(int n) {
    if (n <= 1) return 1;
    return n * func(n - 2);
}
```
(A) 5
(B) 10
(C) 15
(D) 20
(E) 120

14. Which digital logic gate acts as a universal gate, meaning any Boolean function can be implemented using only this type of gate?
(A) AND gate
(B) OR gate
(C) XOR gate
(D) NAND gate
(E) NOT gate

15. In public-key (asymmetric) cryptography, if Alice wants to send a confidential message to Bob, which key should Alice use to encrypt the message?
(A) Alice's private key
(B) Alice's public key
(C) Bob's private key
(D) Bob's public key
(E) A shared secret session key

16. Which of the following protocols is used to map an IP address to a MAC address?
(A) DNS
(B) DHCP
(C) ARP
(D) ICMP
(E) SMTP

17. In the context of virtual memory, a "Page Fault" occurs when:
(A) A process attempts to divide an integer by zero.
(B) The CPU tries to access a memory page that is currently not in the physical RAM.
(C) A process tries to access memory outside its allocated address space.
(D) The cache memory is completely full and a block must be evicted.
(E) Two processes attempt to write to the same memory location simultaneously.

18. Given the postfix expression `8 4 2 / 3 * +`, what is the result of its evaluation?
(A) 9
(B) 14
(C) 18
(D) 24
(E) 32

19. Assuming $P \neq NP$, which of the following statements is TRUE?
(A) The Boolean Satisfiability Problem (SAT) can be solved in polynomial time.
(B) Every NP problem is also an NP-complete problem.
(C) There exists no polynomial-time algorithm for any NP-complete problem.
(D) NP-hard problems are always a subset of P.
(E) All algorithms with $O(2^n)$ complexity belong to class P.

20. A binary tree has a pre-order traversal sequence of `A B D E C F G` and an in-order traversal sequence of `D B E A F C G`. What is the post-order traversal sequence of this tree?
(A) D E B F G C A
(B) E D B G F C A
(C) D E B G F C A
(D) A C G F B E D
(E) D B E F G C A

21. Which design pattern guarantees that a class only has one instance and provides a global point of access to it?
(A) Factory Method
(B) Observer
(C) Singleton
(D) Decorator
(E) Adapter

22. What happens when a "Zombie process" is created in a UNIX/Linux system?
(A) A process is running but unresponsive.
(B) A process continues to execute after its parent has been terminated.
(C) A process has terminated, but its exit status has not yet been read by its parent.
(D) A process consumes all available CPU resources.
(E) A malicious program takes control of a background service.

23. Which of the following graph traversal algorithms is typically implemented using a Queue data structure?
(A) Depth-First Search (DFS)
(B) Breadth-First Search (BFS)
(C) Dijkstra's Shortest Path
(D) Prim's Minimum Spanning Tree
(E) Kruskal's Algorithm

24. A Turing Machine is a mathematical model of computation. Which of the following components is NOT part of a standard Turing Machine?
(A) An infinite tape
(B) A read/write head
(C) A state register
(D) A finite set of instructions (transition function)
(E) A fixed-size RAM (Random Access Memory)

25. IEEE 754 is a standard for floating-point arithmetic. In a single-precision (32-bit) IEEE 754 floating-point number, how many bits are allocated for the exponent?
(A) 1 bit
(B) 7 bits
(C) 8 bits
(D) 11 bits
(E) 23 bits
