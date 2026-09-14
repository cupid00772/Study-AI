# 台灣聯合大學系統 模擬轉學考 計算機概論 (Mock Exam 7)

## 測驗說明 (Exam Instructions)
- **測驗時間**：80 分鐘
- **總分**：100 分
- **出題範圍**：計算機組織、作業系統、資料結構與演算法、網路原理、C/C++ 程式設計
- **難度預估**：中偏難 (比照台聯大歷屆試題難度，並針對你目前的「學習盲點」進行密集驗收)
- **題型**：單選題，共 20 題，每題 5 分 (答錯不倒扣)

---

## 一、單選題 (Multiple Choice Questions)

**1. In C++, what happens if a base class destructor is NOT declared as `virtual` and a derived class object is deleted through a base class pointer?**
(A) The compiler generates a syntax error and refuses to compile.
(B) Only the base class destructor is called, leading to a potential memory leak for derived class resources.
(C) Only the derived class destructor is called.
(D) Both the base and derived destructors are called in the correct order automatically.

**2. Which of the following keywords in C++ is essential for enabling run-time polymorphism (dynamic binding) when using base class pointers or references to call overridden methods in derived classes?**
(A) `static`
(B) `inline`
(C) `virtual`
(D) `abstract`

**3. Assuming P ≠ NP, which of the following statements about NP-complete problems is TRUE?**
(A) They can be solved in polynomial time by a deterministic Turing machine.
(B) They cannot be solved in polynomial time by any known algorithm.
(C) They are problems that can only be verified in exponential time.
(D) They belong to the class P but not NP.

**4. Given an IP address of `172.16.50.45` and a subnet mask of `255.255.255.240`, what is the Network ID for this host?**
(A) 172.16.50.0
(B) 172.16.50.32
(C) 172.16.50.40
(D) 172.16.50.48

**5. In the IEEE 754 single-precision floating-point format, what does the bit pattern represent if the exponent bits are all 1s and the fraction (mantissa) bits are all 0s?**
(A) NaN (Not a Number)
(B) A denormalized number
(C) Zero
(D) Infinity (Positive or Negative)

**6. What is the worst-case time complexity of Dijkstra's shortest path algorithm when implemented with an Adjacency List and a Min-Priority Queue (Binary Heap) for a graph with V vertices and E edges?**
(A) O(V²)
(B) O(E + V)
(C) O((V + E) log V)
(D) O(V³)

**7. What is the output of the following C++ code?**
```cpp
#include <iostream>
using namespace std;

class Animal {
public:
    virtual void speak() { cout << "Animal "; }
};

class Dog : public Animal {
public:
    void speak() override { cout << "Dog "; }
};

int main() {
    Animal* a = new Dog();
    a->speak();
    delete a;
    return 0;
}
```
(A) Animal
(B) Dog
(C) Animal Dog
(D) Compilation Error

**8. Which of the following cache mapping techniques allows a main memory block to be placed in exactly one specific cache line?**
(A) Fully Associative Mapping
(B) Direct Mapping
(C) 4-way Set Associative Mapping
(D) Victim Cache Mapping

**9. Which of the following CPU scheduling algorithms can potentially lead to "Starvation" (a situation where a low-priority process never gets the CPU)?**
(A) Round Robin (RR)
(B) First-Come, First-Served (FCFS)
(C) Shortest Job First (SJF)
(D) None of the above

**10. In a balanced Binary Search Tree (such as an AVL tree) containing `n` elements, what is the worst-case time complexity for inserting a new element?**
(A) O(1)
(B) O(log n)
(C) O(n)
(D) O(n log n)

**11. A system call is typically triggered by a user program to request a service from the operating system kernel. How is a system call usually implemented?**
(A) By directly calling a function located in the kernel memory space.
(B) By writing a specific value to a designated hard drive sector.
(C) By generating a software interrupt (or trap) to transition from user mode to kernel mode.
(D) By sending a message over the network to the localhost loopback address.

**12. Which Transport Layer protocol in the TCP/IP model provides reliable, connection-oriented data delivery with built-in congestion control and flow control?**
(A) UDP
(B) IP
(C) TCP
(D) ICMP

**13. In C/C++, what is the result of using the `sizeof` operator on an array passed as a parameter to a function? For example:**
```c
void printSize(int arr[]) {
    printf("%lu", sizeof(arr));
}
```
(A) The total number of bytes occupied by all elements in the array.
(B) The number of elements in the array.
(C) The size of a pointer to an integer.
(D) A syntax error occurs during compilation.

**14. Which Boolean logic operation is logically equivalent to a NAND gate followed immediately by a NOT gate?**
(A) AND
(B) OR
(C) XOR
(D) NOR

**15. Which fundamental data structure strictly enforces LIFO (Last-In-First-Out) ordering for its elements?**
(A) Queue
(B) Stack
(C) Priority Queue
(D) Linked List

**16. What is the average-case time complexity of the standard QuickSort algorithm?**
(A) O(n)
(B) O(n log n)
(C) O(n²)
(D) O(log n)

**17. Which of the following is TRUE regarding "Threads" belonging to the same "Process"?**
(A) They have completely separate memory address spaces.
(B) They share the same Program Counter (PC).
(C) They share the same global variables and open file descriptors.
(D) They share the same execution stack.

**18. If the Pre-order traversal of a binary tree is `A B D E C F G` and the In-order traversal is `D B E A F C G`, what is its Post-order traversal?**
(A) D E B F G C A
(B) D E B G F C A
(C) E D B F G C A
(D) A B C D E F G

**19. What does the `static` keyword mean when applied to a local variable inside a C/C++ function?**
(A) It prevents the variable from being modified (makes it read-only).
(B) It causes the variable to retain its value between multiple function calls.
(C) It allocates the variable dynamically on the heap.
(D) It restricts the scope of the variable to the entire file rather than just the function.

**20. Which layer of the OSI model is directly responsible for routing packets from a source to a destination across multiple interconnected networks?**
(A) Transport Layer
(B) Data Link Layer
(C) Network Layer
(D) Physical Layer
