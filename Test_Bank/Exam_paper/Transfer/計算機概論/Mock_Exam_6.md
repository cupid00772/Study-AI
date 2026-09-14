# 台灣聯合大學系統 模擬轉學考 計算機概論 (Mock Exam 6)

## 測驗說明 (Exam Instructions)

- **測驗時間**：80 分鐘
- **總分**：100 分
- **出題範圍**：計算機組織、作業系統、資料結構與演算法、網路原理、C/C++ 程式設計
- **難度預估**：中偏難 (比照台聯大歷屆試題難度，並特別加強歷次常錯與不熟觀念)
- **題型**：單選題，共 20 題，每題 5 分 (答錯不倒扣)

---

## 一、單選題 (Multiple Choice Questions)

**1. Which of the following descriptions regarding "Memory-Mapped I/O" is TRUE?**
(A) It requires special, dedicated I/O instructions like `IN` and `OUT` to access devices.
(B) I/O devices and main memory share the same address space.
(C) It is typically faster than DMA (Direct Memory Access) for transferring large blocks of data.
(D) It provides a completely separate physical bus for I/O operations.

**2. What is the optimal worst-case time complexity to construct a Max-Heap from an unsorted array of `n` elements using the standard `buildHeap` algorithm?**
(A) O(n)
(B) O(n log n)
(C) O(log n)
(D) O(n²)

**3. In an operating system with virtual memory, a page fault occurs when:**
(A) The physical memory is completely full and no free frames are available.
(B) A process attempts to access a page that is valid in its logical address space but is not currently loaded into physical memory.
(C) A process attempts to access an invalid memory address outside its allocated space.
(D) The secondary storage (disk) becomes full during a swap operation.

**4. Which of the following page replacement algorithms suffers from Belady's Anomaly (i.e., increasing the number of page frames may increase the number of page faults)?**
(A) LRU (Least Recently Used)
(B) Optimal Page Replacement
(C) FIFO (First-In-First-Out)
(D) LFU (Least Frequently Used)

**5. Assuming P ≠ NP, which of the following statements concerning computational complexity classes is TRUE?**
(A) P = NP-complete
(B) The intersection of NP-complete and P is not empty.
(C) All problems in NP can be solved in polynomial time.
(D) No NP-complete problem can be solved in polynomial time.

**6. An IPv4 host is assigned the IP address `192.168.1.130` with a subnet mask of `255.255.255.192`. What is the Network ID for this subnet?**
(A) 192.168.1.0
(B) 192.168.1.64
(C) 192.168.1.128
(D) 192.168.1.192

**7. In the IEEE 754 single-precision floating-point standard, what does a value with all 1s in the exponent field and a non-zero fraction (mantissa) field represent?**
(A) Positive or Negative Infinity
(B) NaN (Not a Number)
(C) A denormalized (subnormal) number
(D) Zero

**8. In a typical process state transition diagram, which of the following events directly causes a process to transition from the "Running" state to the "Ready" state?**
(A) The process requests an I/O operation.
(B) An I/O operation the process was waiting for completes.
(C) A timer interrupt occurs because the process's time quantum has expired.
(D) The process executes the `exit()` system call.

**9. What is the output of the following C++ code?**

```cpp
#include <iostream>
using namespace std;

int main() {
    int arr[] = {10, 20, 30, 40};
    int *p = arr;
    cout << *p++ << " ";
    cout << *p << endl;
    return 0;
}
```

(A) 10 10
(B) 11 11
(C) 10 20
(D) 11 20

**10. What is the output of the following C++ code?**

```cpp
#include <iostream>
using namespace std;

class Base {
public:
    Base() { cout << "B "; }
    ~Base() { cout << "~B "; }
};

class Derived : public Base {
public:
    Derived() { cout << "D "; }
    ~Derived() { cout << "~D "; }
};

int main() {
    Base* obj = new Derived();
    delete obj;
    return 0;
}
```

(A) B D ~D ~B
(B) D B ~D ~B
(C) B D ~B
(D) B D ~D

**11. Which of the following statements about cache and the memory hierarchy is FALSE?**
(A) L1 cache is typically faster but smaller than L2 cache.
(B) A Translation Lookaside Buffer (TLB) is a specialized cache used to store recent translations of virtual memory to physical memory addresses.
(C) In a write-through cache, data is written to both the cache and the underlying main memory simultaneously.
(D) In a write-back cache, main memory is updated every time the processor executes a write instruction that hits in the cache.

**12. What is a "Zombie Process" in a UNIX-like operating system?**
(A) A process that has been executing for an excessively long time and is consuming too much CPU.
(B) A process that is waiting indefinitely for a synchronization lock that will never be released.
(C) A child process that has completed execution, but its parent has not yet read its exit status via the `wait()` system call.
(D) A parent process that has terminated while its child processes are still running in the background.

**13. Which protocol is responsible for resolving an IPv4 address to its corresponding physical MAC address on a local area network?**
(A) DHCP
(B) DNS
(C) ARP
(D) ICMP

**14. What is the worst-case time complexity of the following recursive function?**

```c
int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}
```

(A) O(n)
(B) O(n log n)
(C) O(n²)
(D) O(2^n)

**15. Which digital logic gate produces an output of `1` if and only if its two inputs are different?**
(A) AND
(B) OR
(C) XOR
(D) NAND

**16. Which of the following tree traversals, when applied to a valid Binary Search Tree (BST), will visit and output the nodes in strictly ascending order?**
(A) Pre-order traversal
(B) In-order traversal
(C) Post-order traversal
(D) Level-order traversal

**17. A pipeline processor is designed with 4 stages. If the clock cycle time of the processor is 2 nanoseconds (ns), what is the ideal instruction throughput of this processor?**
(A) 0.25 billion instructions per second (BIPS)
(B) 0.5 billion instructions per second (BIPS)
(C) 1.0 billion instructions per second (BIPS)
(D) 2.0 billion instructions per second (BIPS)

**18. Which of the following statements is TRUE regarding the `virtual` keyword in C++?**
(A) It is used to allocate objects dynamically in a virtual memory space.
(B) It prevents a class from being inherited by any other class.
(C) It enables run-time polymorphism (dynamic binding) for member functions.
(D) It makes a member variable accessible to all derived classes without consuming additional memory.

**19. Which of the following is NOT one of the four Coffman necessary conditions for a deadlock to occur in a system?**
(A) Mutual Exclusion
(B) Hold and Wait
(C) Preemption
(D) Circular Wait

**20. Given a connected weighted graph with `V` vertices and `E` edges, what is the time complexity of Dijkstra's shortest path algorithm if it is implemented using an adjacency list and a Min-Priority Queue (Binary Heap)?**
(A) O(V²)
(B) O(E + V log V)
(C) O((V + E) log V)
(D) O(V + E)
