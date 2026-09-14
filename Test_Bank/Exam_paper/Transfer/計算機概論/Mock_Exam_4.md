# 國立臺灣聯合大學系統 114學年度 計算機概論 模擬測驗 (Mock Exam 4)

**測驗說明區**
- **測驗時間：** 80 分鐘
- **滿分：** 100 分
- **測驗範圍：** 計算機概論全範圍 (涵蓋計算機組織、作業系統、資料結構與演算法、程式設計、網路與資料庫)
- **難易度：** 困難 (Hard) - 強調格式擬真與難度提升，並納入先前學習狀態之易錯盲點。
- **出題策略：** 擬真考古題 (Simulated Past Paper) + 弱點打擊 (Targeted Weaknesses)

---

## 單選題 (Single Choice, 每題 5 分，共 20 題，答錯不倒扣)

1. **Which of the following statements regarding memory hierarchy and caches is FALSE?**
(A) The TLB (Translation Lookaside Buffer) is used to cache virtual-to-physical address translations, not the actual page data.
(B) L1 cache is typically smaller but faster than L2 cache, and both are usually implemented using SRAM.
(C) In a Write-through cache, data is written to both the cache and the main memory simultaneously, ensuring strong consistency.
(D) In a Write-back cache, a "dirty bit" is required to keep track of whether the cache block has been modified.
(E) A larger cache block size always reduces the miss rate because it maximizes spatial locality without any negative impact.

2. **Consider a multiprogramming operating system. Which of the following state transitions of a process is generally triggered by a hardware timer interrupt?**
(A) New $\rightarrow$ Ready
(B) Running $\rightarrow$ Waiting (Blocked)
(C) Running $\rightarrow$ Ready
(D) Waiting $\rightarrow$ Ready
(E) Ready $\rightarrow$ Running

3. **What is the primary cause of a "Zombie Process" in a UNIX-like operating system?**
(A) A process is stuck in an infinite loop and cannot be terminated by the OS.
(B) A parent process is terminated before its child process finishes executing.
(C) A child process finishes execution, but its parent process has not yet called `wait()` to read its exit status.
(D) A process requests a resource that is currently held by another process, resulting in a circular wait.
(E) A process is swapped out to the disk and the OS loses its page table entry.

4. **A "Page Fault" occurs in an operating system when:**
(A) The physical memory is completely full and cannot hold any more data.
(B) A process attempts to access a memory page that is currently not loaded into the physical main memory.
(C) A program tries to access a protected area of memory that belongs to the OS kernel.
(D) The Translation Lookaside Buffer (TLB) becomes full and needs to evict an entry.
(E) Two processes try to write to the same shared memory page simultaneously.

5. **What is the optimal worst-case time complexity to build a Max-Heap from an unsorted array of $n$ elements?**
(A) $O(1)$
(B) $O(\log n)$
(C) $O(n)$
(D) $O(n \log n)$
(E) $O(n^2)$

6. **Assuming $P \neq NP$, which of the following statements is TRUE?**
(A) All problems in NP can be solved in polynomial time.
(B) NP-complete problems can be solved in polynomial time.
(C) The intersection of P and NP-complete is empty ($P \cap \text{NP-complete} = \emptyset$).
(D) Problems in P are strictly harder than problems in NP.
(E) NP means "Not Polynomial".

7. **What will be the output of the following C code?**
```c
#include <stdio.h>
int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int *p = arr;
    int val1 = *(p++);
    int val2 = *(++p);
    printf("%d %d", val1, val2);
    return 0;
}
```
(A) 10 20
(B) 20 30
(C) 10 30
(D) 20 20
(E) 30 40

8. **What will be the output of the following C program?**
```c
#include <stdio.h>
int magic(int n) {
    if (n == 0) return 0;
    return (n & 1) + magic(n >> 1);
}
int main() {
    printf("%d", magic(43));
    return 0;
}
```
(A) 3
(B) 4
(C) 5
(D) 6
(E) 43

9. **A binary tree has the following traversals:**
- Inorder: D, B, E, A, F, C, G
- Preorder: A, B, D, E, C, F, G
**What is the Postorder traversal of this tree?**
(A) D, E, B, F, G, C, A
(B) D, E, B, G, F, C, A
(C) E, D, B, G, F, C, A
(D) D, B, E, F, G, C, A
(E) None of the above

10. **In a 5-stage pipeline processor (IF, ID, EX, MEM, WB), a data hazard occurs due to a true data dependency (RAW) between two consecutive instructions. If data forwarding (bypassing) is NOT implemented, how many stall cycles (bubbles) must be inserted to resolve the hazard? (Assume register read happens in the second half of ID cycle and write happens in the first half of WB cycle)**
(A) 0
(B) 1
(C) 2
(D) 3
(E) 4

11. **Consider a system with 5 processes. Each process needs a maximum of 3 resource instances to complete its execution. What is the MINIMUM total number of resource instances required in the system to guarantee that deadlock will NEVER occur?**
(A) 10
(B) 11
(C) 12
(D) 15
(E) 5

12. **Given an IP address `192.168.10.75` with a subnet mask of `255.255.255.192`. Which of the following IP addresses belongs to the SAME subnet?**
(A) 192.168.10.10
(B) 192.168.10.60
(C) 192.168.10.100
(D) 192.168.10.130
(E) 192.168.10.200

13. **What is the minimum number of bits required to represent the decimal number -128 in two's complement notation?**
(A) 6
(B) 7
(C) 8
(D) 9
(E) 10

14. **When dealing with Hash Tables, which of the following statements about "Separate Chaining" and "Open Addressing" is TRUE?**
(A) Separate chaining suffers from primary clustering, while open addressing does not.
(B) In separate chaining, the load factor ($\alpha$) can be strictly greater than 1.
(C) Linear probing is a form of separate chaining.
(D) Open addressing requires dynamic memory allocation for linked lists at each table slot.
(E) Double hashing completely eliminates secondary clustering but guarantees more cache misses than separate chaining.

15. **What is the time complexity of the following pseudo-code?**
```text
for i = 1 to n:
    j = i
    while j < n:
        j = j * 2
```
(A) $O(\log n)$
(B) $O(n)$
(C) $O(n \log n)$
(D) $O(n^2)$
(E) $O(n^2 \log n)$

16. **Which of the following database ACID properties ensures that a transaction is either fully completed or completely rolled back, leaving the database in a consistent state without partial updates?**
(A) Atomicity
(B) Consistency
(C) Isolation
(D) Durability
(E) Normalization

17. **In C++, what does the `virtual` keyword on a class destructor guarantee?**
(A) It prevents the destructor from being overridden by derived classes.
(B) It ensures that the derived class's destructor is called when deleting an object through a base class pointer.
(C) It allocates the object on the heap rather than the stack.
(D) It makes the class an abstract base class that cannot be instantiated.
(E) It avoids memory leaks by automatically calling `free()` on all member pointers.

18. **In IEEE 754 single-precision floating-point format (32 bits), what does an exponent field consisting of all 1s (11111111) and a non-zero fraction (mantissa) field represent?**
(A) Positive Zero
(B) Negative Zero
(C) Infinity
(D) NaN (Not a Number)
(E) Denormalized Number

19. **Which page replacement algorithm suffers from Belady's Anomaly (where increasing the number of page frames can unexpectedly increase the number of page faults)?**
(A) LRU (Least Recently Used)
(B) OPT (Optimal)
(C) FIFO (First-In-First-Out)
(D) LFU (Least Frequently Used)
(E) Clock Algorithm

20. **Which of the following is an asymmetric encryption algorithm (Public-Key Cryptography)?**
(A) AES (Advanced Encryption Standard)
(B) DES (Data Encryption Standard)
(C) RSA (Rivest–Shamir–Adleman)
(D) MD5
(E) SHA-256
