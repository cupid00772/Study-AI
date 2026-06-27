# 台灣聯合大學系統 模擬轉學考 計算機概論 (Mock Exam 8)

## 測驗說明 (Exam Instructions)
- **測驗時間**：80 分鐘
- **總分**：100 分
- **出題範圍**：計算機組織、作業系統、資料結構與演算法、網路原理、C/C++ 程式設計
- **難度預估**：中等至中偏難 (綜合測驗，包含前次測驗之弱點觀念加強)
- **題型**：單選題，共 20 題，每題 5 分 (答錯不倒扣)

---

## 一、單選題 (Multiple Choice Questions)

**1. Consider a derived class `Car` that inherits from a base class `Vehicle`. When an object of `Car` is instantiated and later destroyed, what is the correct order of execution for the constructors and destructors?**
(A) Vehicle Constructor -> Car Constructor -> Vehicle Destructor -> Car Destructor
(B) Car Constructor -> Vehicle Constructor -> Car Destructor -> Vehicle Destructor
(C) Vehicle Constructor -> Car Constructor -> Car Destructor -> Vehicle Destructor
(D) Car Constructor -> Vehicle Constructor -> Vehicle Destructor -> Car Destructor

**2. Why is it important to declare a base class destructor as `virtual` in C++ when using inheritance and polymorphism?**
(A) To prevent the base class from being instantiated directly.
(B) To ensure that the derived class's destructor is called when an object is deleted through a base class pointer.
(C) To allow the destructor to take arguments.
(D) To make the destructor execute faster by resolving it at compile time.

**3. If it is proven that P ≠ NP, which of the following statements must be TRUE regarding NP-complete problems?**
(A) All NP-complete problems can be solved in polynomial time.
(B) No NP-complete problem can be solved in polynomial time.
(C) Some NP-complete problems can be solved in polynomial time, but not all.
(D) NP-complete problems can only be solved by non-deterministic Turing machines, not deterministic ones.

**4. A host has an IP address of `192.168.1.135` and a subnet mask of `255.255.255.224`. What is the Network ID of the subnet this host belongs to?**
(A) 192.168.1.0
(B) 192.168.1.128
(C) 192.168.1.135
(D) 192.168.1.224

**5. In the IEEE 754 single-precision floating-point standard, what value is represented if the 8-bit Exponent field consists of all 1s (i.e., 255) and the 23-bit Fraction (Mantissa) field is non-zero?**
(A) Positive or Negative Infinity
(B) A Denormalized Number
(C) Zero
(D) NaN (Not a Number)

**6. What is the time complexity of Dijkstra's algorithm when implemented using an Adjacency List and a Min-Heap priority queue, where V is the number of vertices and E is the number of edges?**
(A) O(V²)
(B) O(E + V)
(C) O((V + E) log V)
(D) O(V log E)

**7. Which of the following is NOT one of the four necessary conditions for a deadlock to occur in an operating system?**
(A) Mutual Exclusion
(B) Hold and Wait
(C) Preemption
(D) Circular Wait

**8. Which collision resolution technique in hash tables is most likely to suffer from the problem of "primary clustering"?**
(A) Linear Probing
(B) Quadratic Probing
(C) Double Hashing
(D) Separate Chaining

**9. What is the primary advantage of a Write-Back cache policy compared to a Write-Through cache policy?**
(A) It ensures that main memory is always perfectly synchronized with the cache.
(B) It is simpler to implement in hardware.
(C) It reduces the number of write operations to main memory, thereby saving memory bandwidth.
(D) It eliminates the need for a cache completely.

**10. In the context of virtual memory, what does the term "Thrashing" refer to?**
(A) A situation where the CPU is excessively busy executing system calls.
(B) High paging activity where the system spends more time swapping pages than executing processes.
(C) A security attack that rapidly exhausts the system's memory.
(D) The process of defragmenting the physical memory.

**11. If the Pre-order traversal of a binary tree is `F B A D C E G I H` and its In-order traversal is `A B C D E F G H I`, what is the root node of the right subtree of the node `F`?**
(A) B
(B) G
(C) I
(D) H

**12. Which of the following statements about pure virtual functions in C++ is TRUE?**
(A) A class containing at least one pure virtual function cannot be instantiated (it becomes an abstract class).
(B) A pure virtual function must have a body (implementation) defined in the base class.
(C) A pure virtual function is declared using the `= 1;` syntax.
(D) Derived classes are not required to override pure virtual functions.

**13. Which protocol is responsible for resolving a known IP address to an unknown MAC address?**
(A) DNS
(B) DHCP
(C) RARP
(D) ARP

**14. Which of the following sorting algorithms is NOT considered a "stable" sort by default?**
(A) Quick Sort
(B) Merge Sort
(C) Insertion Sort
(D) Bubble Sort

**15. When a process executes a system call, it typically transitions from User Mode to Kernel Mode. What mechanism is typically used to achieve this safe transition?**
(A) Direct Memory Access (DMA)
(B) Hardware Interrupt from a peripheral device
(C) Software Interrupt (Trap)
(D) Polling

**16. Which algorithm is used to find the Minimum Spanning Tree (MST) of a connected, undirected graph by sorting all edges by weight and adding them one by one, ensuring no cycles are formed?**
(A) Prim's Algorithm
(B) Kruskal's Algorithm
(C) Bellman-Ford Algorithm
(D) Floyd-Warshall Algorithm

**17. What is the 8-bit Two's Complement representation of the decimal number -13?**
(A) 11110011
(B) 10001101
(C) 11110010
(D) 11110100

**18. In C/C++, what is the purpose of the `volatile` keyword?**
(A) It makes a variable thread-safe.
(B) It tells the compiler that the variable's value may change at any time without any action being taken by the code, preventing certain optimizations.
(C) It allocates the variable dynamically on the heap.
(D) It indicates that the variable can only be modified by a constant expression.

**19. In the TCP 3-way handshake used to establish a connection, which flags are set in the second segment sent from the server back to the client?**
(A) SYN only
(B) ACK only
(C) SYN and ACK
(D) FIN and ACK

**20. The Longest Common Subsequence (LCS) problem is typically solved efficiently using which algorithmic paradigm?**
(A) Divide and Conquer
(B) Greedy Algorithm
(C) Backtracking
(D) Dynamic Programming
