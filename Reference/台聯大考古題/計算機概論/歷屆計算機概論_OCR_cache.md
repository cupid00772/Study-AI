# 國立台灣聯合大學系統 歷屆計算機概論 考古題 OCR 辨識結果

> **說明**：本檔案由 GOT-OCR-2.0 模型自動提取原始 PDF 考卷內容。

## 【114計算機概論.pdf】

```text
單選題, 共 25 題, 每題 4 分（答錯不倒扣）
1. Which of the following is true for binary search algorithm?
(A) Can be used on unsorted data
(B) Time complexity is \(O(n)\)
(C) Data must be sorted
(D) Always returns the first occurrence
(E) Requires linear time
2. Which logic gate has the following truth table: output is 1 only if inputs are different?
(A) AND
(B) OR
(C) NAND
(D) XOR
(E) XNOR
3. In an operating-system context, the banker's algorithm is used to:
(A) Detect deadlock
(B) Prevent starvation
(C) Avoid deadlock by resource allocation
(D) Select victim pages for replacement
(E) Schedule disk I/O requests
4. The IP, TCP, and UDP headers all carry a 16-bit field named "checksum." Which ISO/OSI layer primarily uses that field?
(A) Transport
(B) Data-link
(C) Network
(D) Physical
(E) None of the above
5. In IPv4, a /26 CIDR network supports how many usable host addresses?
(A) 30
(B) 62
(C) 64
(D) 32
(E) 26
6. IPv6 eliminates the need for which IPv4 feature?
(A) DHCP
(B) ARP
(C) DNS
(D) ICMP
(E) NAT
7. Message Authentication Codes (MACs) provide:
(A) Integrity and authenticity
(B) Non-repudiation and confidentiality
(C) Confidentiality only
(D) Key exchange
(E) Forward secrecy
8. A max-heap stored in an array of length \(n\) guarantees that the parent of the node at index \(i\) is at:
(A) floor \((i / 2)\)
(B) floor \((i-1) / 2)\)
(C) ceil \((i / 2)\)
(D) \(\mathrm{i}-1\)
(E) floor \((i / 3)\)
9. In 8-bit two's-complement arithmetic, adding \(0 \times 73+0 \times 94\) raises the overflow flag because:
(A) Signs differ but result is negative
(B) Both operands are positive but result is negative
(C) Carry-in to MSB = carry-out from MSB
(D) Parity bit \(=0\)
(E) Half-carry occurred
10. A 64-MiB main memory is byte-addressable. A 4-way set-associative cache of 32
KiB uses 64-byte lines. Number of tag bits in a 32-bit address is:
(A) 19
(B) 16
(C) 13
(D) 20
(E) 21
11. In standard C, whether char is signed or unsigned by default is:
(A) Always signed
(B) Always unsigned
(C) Controlled by pragma
(D) Undefined behaviour
(E) Implementation-defined
12. You are designing an ALU that must support the rotate-through-carry left (RCL) operation on 32-bit registers. If the current \(\mathrm{CF}=1\) and the operand is \(0 \times 800000000\), what are the new value of the register and the new carry flag?
(A) \(0 \times 00000000, \mathrm{CF}=0\)
(B) \(0 \times 000000000, \mathrm{CF}=1\)
(C) \(0 \times 000000001, \mathrm{CF}=0\)
(D) \(0 \times 00000001, \mathrm{CF}=1\)
(E) \(0 \times 000000003, \mathrm{CF}=1\)
13. You benchmark QuickSort and Measure that its running time on random permutations doubles when \(n\) grows from \(2 \mathrm{M}\) to \(4 \mathrm{M}\). Which average-case complexity class is most consistent with this observation?
(A) \(\mathrm{O}(\mathrm{n})\)
(B) \(\mathrm{O}(\mathrm{n} \log \log \mathrm{n})\)
(C) \(\mathrm{O}(\mathrm{n} \log \mathrm{n})\)
(D) \(\mathrm{O}(\sqrt{ } \mathrm{n})\)
(E) \(\mathrm{O}\left(\mathrm{n}^{2}\right)\)
\title{
台灣聯合大學系統 114 學年度學士班轉學生考試試題
}
\section*{科目 計算機概論 颊組別 A4 共(1)頁 第 4頁}
14. A university has the prefix 2001:0db8:acad::/48 and wants 400 subnets. What is the smallest subnet mask that meets the need and keeps addresses aligned on nibble boundaries?
(A) \(/ 52\)
(B) \(/ 56\)
(C) \(/ 48\)
(D) \(/ 60\)
(E) \(/ 64\)
15. A \(900 \mathrm{MHz}\) microcontroller must process each PWM cycle in \(\leq 90\) instruction cycles.
An ISR currently compiles to 112 cycles. Which optimisation meets timing with least code change?
A) Unroll loops
B) Inline all function calls
C) Move ISR to lower priority
D) Switch to Thumb-2
E) None of the above
16. A function returns std: : vector<T> foo ( ) ;. At call-site you write:
\[
\begin{array}{l}
\text { std: :vector<T> } v \text {; } \\
v=\text { std: :move }(\mathrm{foo}()) \text {; }
\end{array}
\]
Why might the extra std: :move ( ) be worse than writing \(v=\) foo ( ) ;?
A) Disables copy elision
B) Prevents RVO
C) Converts to lvalue reference
D) Increases alignment padding
E) None of the above
17. A company's e-commerce database has a "products" table with 10 million rows. A query "SELECT * FROM products WHERE price BETWEEN 100 AND 200" takes 45 seconds. What optimization would provide the most significant performance improvement?
(A) Add more RAM to the database server
(B) Increase the number of CPU cores
(C) Partition the table by product category
(D) Use a faster SSD storage
(E) Create an index on the price column
18. A processor has a \(32 \mathrm{~KB}\) L1 cache with 64-byte lines. A program accesses a 2D array of 1024×1024 integers (4 bytes each) in column-major order. Assuming the cache is initially empty, approximately how many cache misses occur in the first complete column access?
(A) 1024
(B) 4096
(C) 16384
(D) 65536
(E) 1048576
19. A company implements AES-256 encryption for sensitive data. Each encryption operation takes \(0.1 \mathrm{~ms}\). If they need to encrypt \(100 \mathrm{~GB}\) of data in 1-hour batches, what is the minimum number of encryption threads needed to meet the deadline?
(A) 100
(B) 200
(C) 400
(D) 1000
(E) 2778
20. A real-time system has 3 periodic tasks: T1 (period \(=50 \mathrm{~ms}\), execution \(=10 \mathrm{~ms}\) ), T2 (period \(=100 \mathrm{~ms}\), execution \(=20 \mathrm{~ms}\) ), T3 (period \(=200 \mathrm{~ms}\), execution \(=40 \mathrm{~ms}\) ). Using Rate Monotonic Scheduling, what is the CPU utilization?
(A) \(60 \%\)
(B) \(70 \%\)
(C) \(80 \%\)
(D) \(90 \%\)
(E) \(100 \%\)
21. What is the output of the following \(\mathrm{C}++\) code?
\begin{tabular}{|l|}
\hline \#include <iostream> \\
using namespace std; \\
\hline class Test \{ \\
public: \\
Test() \{ cout << "Constructor "; \} \\
\(\quad\)\begin{tabular}{l}
\(\quad\) "Test() \{ cout << "Destructor " ; \} \\
Test (const Test\& t) \(\{\) cout << "Copy " ; \} \\
\} ; \\
int main() \{\) \\
Test \(\mathrm{t} 1 ;\) \\
Test \(\mathrm{t} 2=\mathrm{t} 1 ;\) \\
Test \(\mathrm{t} 3(\mathrm{t} 1) ;\) \\
return 0 ;
\end{tabular} \\
\} \\
\hline
\end{tabular}
(A) Constructor Copy Constructor Destructor Destructor Destructor
(B) Constructor Constructor Copy Destructor Destructor Destructor
(C) Constructor Copy Copy Destructor Destructor
(D) Constructor Copy Copy Destructor Destructor Destructor
(E) Constructor Constructor Constructor Destructor Destructor Destructor
22. What is the output of the following code?

\title{
台淲聯合大學系統 114 學年度學士班轉學生考試試題
}

24. What is the output of the following code?

25. What is the output of the following code?
```

---

## 【113計算機概論.pdf】

```text
\begin{tabular}{|c|c|c|c|c|c|c|c|c|}
\hline 科目 & 计算機 & & 颠组别 & & A4 & & 共_8 & 第 1 真 \\
\hline \multicolumn{2}{|c|}{ 罩選題, 共 25 題, 每題 4 分(答错不倒扣) } & \multicolumn{7}{|c|}{1. Which phase is not involved in the functioning of an interpreter? } \\
\hline \multicolumn{9}{|c|}{ (A) Parsing } \\
\hline \multicolumn{9}{|c|}{ (B) Lexical analysis } \\
\hline \multicolumn{9}{|c|}{ (C) Syntax analysis } \\
\hline \multicolumn{9}{|c|}{ (D) Preprocessing } \\
\hline \multicolumn{9}{|c|}{ (E) Execution } \\
\hline \multicolumn{9}{|c|}{ 2. Which of the following statements is true about the 'volatile' keyword in C? } \\
\hline \multicolumn{9}{|c|}{ (A) It is the same as the const keyword. } \\
\hline \multicolumn{9}{|c|}{ (B) It guarantees atomicity of variable access. } \\
\hline \multicolumn{9}{|c|}{ (C) It is used to optimize variable access. } \\
\hline \multicolumn{9}{|c|}{ (D) It prevents the compiler from optimizing the variable. } \\
\hline \multicolumn{9}{|c|}{ (E) It ensures the variable is thread-safe. } \\
\hline \multicolumn{9}{|c|}{ 3. Which of the following descriptions about C language is TRUE? } \\
\hline \multicolumn{9}{|c|}{ (A) When reading EOF, sca & 1f and get & 1r returns NULL, while gets and f & ets and f & \\
\hline \multicolumn{9}{|c|}{ return EOF. } \\
\hline \multicolumn{9}{|c|}{ (B) int \(\mathrm{n}\) have different memory size on different machine, and so does int *pn. } \\
\hline \multicolumn{9}{|c|}{ (C) A loop for( \(\mathrm{r} ;\) ); is dangerous and will make the program crash within a few } \\
\hline \multicolumn{9}{|c|}{ minutes. } \\
\hline \multicolumn{9}{|c|}{ (D) sizeof(int*) and sizeof(float****) have the different size. } \\
\hline \multicolumn{9}{|c|}{ (E) while(T--) \{\ldots\} can be used to repeat a piece of code for exactly T-1 times. } \\
\hline \multicolumn{9}{|c|}{ 4. What will be the result of the following C code? } \\
\hline \multicolumn{9}{|c|}{\#include <stdio.h> } \\
\hline \multicolumn{9}{|c|}{ void func() \{ } \\
\hline \multicolumn{9}{|c|}{ static int \(\mathrm{x}=0\); } \\
\hline \multicolumn{9}{|c|}{\(\mathrm{x}++;\)} \\
\hline \multicolumn{9}{|c|}{ printf("\%d ", x); } \\
\hline \multicolumn{9}{|c|}{ int main() \{ } \\
\hline \multicolumn{9}{|c|}{ for (int \(\mathrm{i}=0 ; \mathrm{i}<3 ; \mathrm{i}++)\{\)} \\
\hline \multicolumn{9}{|c|}{ func(); } \\
\hline \multicolumn{9}{|c|}{\} } \\
\hline \multicolumn{9}{|c|}{ return 0; } \\
\hline \multicolumn{9}{|c|}{\} } \\
\hline \multicolumn{9}{|c|}{ (A) 000} \\
\hline \multicolumn{9}{|c|}{ (B) 111} \\
\hline \multicolumn{9}{|c|}{ (C) 012} \\
\hline \multicolumn{9}{|c|}{ (D) 123} \\
\hline \multicolumn{9}{|c|}{ (E) 222} \\
\hline
\end{tabular}
科目 計算機概論
類組別
A4
共 8 真 第 2 真
5. Which type of data structure is a ternary heap?
(A) Array
(B) Hash
(C) Priority Stack
(D) Priority Queue
(E) None of the above
6. Which design pattern defines an interface for creating an object but lets subclasses alter the type of objects that will be created?
(A) Factory Method
(B) Abstract Factory
(C) Builder
(D) Prototype
(E) Adapter
7. What is not the necessary condition for deadlock?
(A) Resource holding
(B) Mutual exclusion
(C) Circular waiting
(D) No preemption
(E) Starvation
8. Which search method takes less memory?
(A) Depth-First search
(B) Breadth-First search
(C) Linear search
(D) Optimal search
(E) Random search
9. Which of the following best describes a DDoS attack?
(A) An attack that involves redirecting traffic to a malicious website.
(B) An attack that uses multiple compromised systems to flood the bandwidth or resources.
(C) An attack that intercepts and alters communications between two parties.
(D) An attack that exploits a specific software vulnerability.
(E) An attack that installs malware on a single user's computer.
科目 計算機概論 類組別 A4 共 8 貢 第 3 貢
10. Which of the following is a challenge commonly associated with implementing meta-reasoning systems in AI?
(A) Difficulty in defining accurate meta-level objectives.
(B) Lack of sufficient training data.
(C) Inability to process unstructured data.
(D) Poor integration with machine learning models.
(E) Slow processing speeds in general.
11. What is the time complexity of the following recursive function?
void funec(int \(\mathrm{n}\) ) \{
if \((\mathrm{n}<=1)\) return;
func \((\mathrm{n}-1)\);
func(n-1);
\}
(A) \(\mathrm{O}(\mathrm{n})\)
(B) \(\mathrm{O}\left(\mathrm{n}^{2}\right)\)
(C) \(\mathrm{O}\left(2^{\mathrm{n}}\right)\)
(D) \(\mathrm{O}(\mathrm{n} \log \mathrm{n})\)
(E) \(\mathrm{O}(\log \mathrm{n})\)
12. Which shading technique computes the color at each vertex and interpolates the color across the surface of the polygon?
(A) Ray Tracing
(B) Flat Shading
(C) Gouraud Shading
(D) Phong Shading
(E) None of the above
13. Assuming \(\mathrm{P}!=\mathrm{NP}\), which of the following is TRUE?
(A) NP-complete \(=\mathrm{NP}\).
(B) NP-complete \(\cap \mathrm{P}=\emptyset\).
(C) NP-hard \(=\mathrm{NP}\).
(D) \(\mathrm{P}=\mathrm{NP}\)-complete.
(E) NP-complete \(\cap \mathrm{NP}=\emptyset\).
14. Let \(\mathrm{W}(\mathrm{n})\) and \(\mathrm{A}(\mathrm{n})\) denote the worst- and average-case running time of an algorithm executed on an input of size \(n\), respectively. Which of the following is TRUE?
(A) \(\mathrm{W}(\mathrm{n})=\mathrm{O}(\mathrm{A}(\mathrm{n}))\).
(B) \(\mathrm{A}(\mathrm{n})=\mathrm{O}(\mathrm{W}(\mathrm{n}))\).
(C) \(\mathrm{A}(\mathrm{n})=\Theta(\mathrm{W}(\mathrm{n}))\).
(D) \(\mathrm{A}(\mathrm{n})=\Omega(\mathrm{W}(\mathrm{n}))\).
(E) \(\mathrm{W}(\mathrm{n})=\Theta(\mathrm{A}(\mathrm{n}))\).
15. Which of the following statements about signed and unsigned numbers is TRUE?
(A) Even though they have the same width, the two types can represent different ranges of values.
(B) When designing a subtraction function in hardware, it is always necessary to create a separate module instead of using the addition module.
(C) Accesses to signed numbers are slower than accesses to unsigned numbers.
(D) When turning a 2's-complement signed number with a certain number of bits into one with more bits, a sign-extension operation is performed on that number's least significant bit (LSB).
(E) Only C language has unsigned numbers.
16. After executing the following code, which variable is equal to 0?
unsigned int \(a=0 \times f f f f f f f\);
unsigned int \(b=1\);
unsigned int \(\mathrm{c}=\mathrm{a}+\mathrm{b}\);
unsigned long \(d=(\) unsigned long \() a+b\);
(Assume its are 32 bits wide and longs are 64 bits wide.)
(A) a
(B) \(\mathrm{b}\)
(C) \(\mathrm{c}\)
(D) \(\mathrm{d}\)
(E) None of the above
17. Memory systems have many bottlenecks. To overcome the bottlenecks of memory systems, i.e., the transmission speed and bandwidth, which of the following techniques cannot be used by a system architect?
(A) Out-of-order execution.
(B) Pre-fetching.
(C) Pipelining.
(D) Caching
(E) Improving data locality.
18. What is the output of the following program?
int fun(int i) \{
if \((\mathrm{i}==0)\{\)
return 0 ;
\}
\}
\}
return 1 ;
\}
return fun(i-1) + fun(i-2);
\}
台灣聯合大學系統 113 學年度學士班轉學生考試試題


19. What is the output of the following program?


20. What is the output of the following program?


\section*{注意:背面有試題}
\title{
int main() \\ printf("\%d", fun(11)); return 0 ;
}
\section*{(A) 4}
(B) 5
(C) 6
(D) 7
(E) 8
21. What is the possible number of comparisons required to find a value in a list of 20 items using a binary search?
(A) 5
(B) 6
(C) 7
(D) 8
(E) 9
22. Which of the following statements about data structure is TRUE?
(A) A stack is a list in which the entries are removed only at the tail and new entries are inserted only at the head, whereas a queue is a list in which entries are inserted and removed only at the head.
(B) Static structures are easier to manage than dynamic ones.
(C) Standard Template Library (STL) is found in the Java programming environment, and it contains a collection of predefined classes that describe popular data structures.
(D) In binary tree storage techniques, each entry (or node) of the binary tree contains four components: (1) the data, (2) a pointer to the node's first child, (3) a pointer to the node's second child, and (4) a pointer to the node's parent.
(E) In a max heap, for any given node \(\mathrm{C}\), if \(\mathrm{P}\) is a parent node of \(\mathrm{C}\), then the key (the value) of \(\mathrm{P}\) is smaller than or equal to the key of \(\mathrm{C}\).
23. Given the following program, which of the following statements is TRUE?
int \(\mathrm{a}=0\);
for (int \(\mathrm{i}=0 ; \mathrm{i}<\mathrm{n} ;++\mathrm{i})\{\)
for (int \(\mathrm{j}=\mathrm{n} ; \mathrm{j}>\mathrm{i} ;--\mathrm{j})\{\)
\(\quad a=a+i+j ;\)
\}
\}
(A) Time Complexity: O(nlogn).
(B) Time Complexity: O(2n).
(C) Time Complexity: O(n).
(D) Space Complexity: O(1).
(E) Space Complexity: O(n).
24. Which is the pre-order traversal sequence of the following binary tree.

(A) 39410285617
(B) 75102961843
(C) 10759234681
(D) 39105724861
(E) 12345678910
25. What is the output of this program?
\#include <bits/stdc++.h>
using namespace std;
class base \{
public:
void print1() \{
\(\operatorname{cout}<<\) "base1 \(\backslash n\) " \(;\)
\}
\begin{tabular}{|c|c|c|c|c|}
\hline 科目 & 計算洅概論 & 颠組別 & A4 & 共_8 質 第_8 貢 \\
\hline \multicolumn{5}{|c|}{ class deri1 : public base \{ } \\
\hline \multicolumn{5}{|c|}{ public: } \\
\hline \multicolumn{5}{|c|}{ void print1() \{ } \\
\hline & \multicolumn{4}{|c|}{ cout \(<<\) "deri1 \(\backslash n "\) "; } \\
\hline \multicolumn{5}{|l|}{\} } \\
\hline \multicolumn{5}{|c|}{ class deri2 : public deri1 \{ } \\
\hline \multicolumn{5}{|c|}{ public: } \\
\hline \multicolumn{5}{|c|}{ void print1() \{ } \\
\hline & \multicolumn{4}{|c|}{ cout \(<<\) "deri2 \(\backslash n "\) "; } \\
\hline & \multicolumn{4}{|l|}{\} } \\
\hline & \multicolumn{4}{|c|}{ signed main() \{ } \\
\hline & \multicolumn{4}{|c|}{ base *a = new deri2(); } \\
\hline & \multicolumn{4}{|c|}{ a -> print1(); } \\
\hline & \multicolumn{4}{|l|}{ return 0; } \\
\hline & \multicolumn{4}{|l|}{\} } \\
\hline & \multicolumn{4}{|c|}{ (A) base 1} \\
\hline & \multicolumn{4}{|l|}{ (B) deri 1} \\
\hline & \multicolumn{4}{|l|}{ (C) deri2 } \\
\hline & \multicolumn{4}{|l|}{ (D) base 1} \\
\hline & \multicolumn{4}{|l|}{\(\frac{\text { deri } 1}{\text { (E) base1 }}\)} \\
\hline & \multicolumn{4}{|l|}{\(\frac{\text { deri } 1}{\text { deri2 }}\)} \\
\hline
\end{tabular}
```

---

## 【112計算機概論.pdf】

```text
單選題，共20題，每題5分
1. 假設我們用8-bit來儲存一個整數, 並以二補數格式儲存負整數, 下列哪個式子計算結果是整數溢位(overflow)?
(A) \(11000010+00111111\)
(B) \(00000010+00111111\)
(C) \(11000010+1111111\)
(D) \(10000010+10000000\)
(E) \(00000010-11111111\)
2. 假設電腦的硬體設計使用記憶體對映輸人輸出來定址(memory-mapped I/O addressing), 且它的記憶體位址使用 10 個 bits。如果實體記憶體空間至多能使用 1000 個字(words), 剩下的空間給 \(I / O\) 控制器(controllerr)使用, 那麼假設每個控制器有 2 個暫存器(register), 則此電腦總共可以存取幾個控制器?
(A) 2
(B) 8
(C) 10
(D) 12
(E) 24
3. 電腦的作業系統使用虛擬記憶體來管理記憶體, 假設每個分頁(page)大小為 \(4 \mathrm{~KB}\), 總共有邏輯位址(logical address)空間共256分頁, 而此電腦的實體記憶體總共只有64框(frame)。那麼此電腦的邏輯位址、實體位址(physical address)分別應是多少台式?
(A) 選輯位址為 20 bits, 實體位址為 18 bits
(B) 選輯位址為 10 bits, 實體位址為 8 bits
(C) 選輯位址為 18 bits, 實體位址為 16 bits
(D) 選輯位址為 8 bits, 實體位址為 6 bits
(E) 選輯位址為 16 bits, 實體位址為 18 bits
4. Scheme 是一種函式程式語言(functional programming language), 其中定義了一個函式如下：
( define (mystery input-list)
(cond ((null? input-list) 0)
(e1se (+ 1 (mystery (cdr input-list)))))
請間執行下列函式的呼叫，結果為何？
(mystery (list 4 5 6))
(A) 15
(B) \((5 \quad 6 \quad 7)\)
(C) 7
(D) \((7 \quad 6 \quad 5)\)
(E) 3
5. 電腦裡的程序 (process)有三種狀態 (state): 準備中 (ready)、執行中(running)、等待中(waiting)。下列哪一個程序狀態的變化是不會發生的?
(A) 從執行中變到準備中
(B) 從等待中變到執行中
(C) 從等待中變到準備中
(D) 從執行中變到等待中
(E) 從準備中變到執行中
6. 下列有關TCP/IP的協定的敘述有誤？
(A) TCP與UDP都是傳輸層(transport-layer)協定
(B) 網路層(network layer)的封包遞送服務並不保證是可靠的(reliable)
(C) 在資料鏈結層(data link layer)的通訊是相鄰的節點之間(node-to-node)
(D) 實體層提供的是程序對程序(process-to-process)之間的通訊
(E) TCP是連結導向(connection-oriented)的協定，UDP則是非連結導向 (connectionless)協定
7. 一個無階級(classless)IP位址為157.177.187.135/30, 那麼下列哪一個IP位址跟它是在同一個子網域(subnet)
(A) 157.177.187.128
(B) 157.177.187.132
(C) 157.177.187.165
(D) 157.177.188.135
(E) 157.177.188.130
8. 下列哪一個，不是作業系統主要執行的任務？
(A) 使用者介面
(B) 有效的資源配置
(C) 程式的排程
(D) 電子郵件
(E) 記憶體管理
9. 下面這個邏輯線路圈，有兩個1-bit的輸人a及b，產生1-bit的輸出。請問這個邏輯線路圖可能的運算功能為何?

(A) 1-bit的大於比較器, 即如果 \(a>b\) 則輸出 1, 反之輸出 0
(B) 1-bit的相同比較器, 即如果 \(a\) 等於 \(b\), 則輸出 1, 反之輸出 0
(C) 1-bit的互斥或(XOR)運算, 即如果 \(a\) 等於 \(b\), 則輸出 0, 反之輸出 1
(D) 1-bit的乘法器, 也就是輸出為 \(a\) 與 \(b\) 的乘積
(E) 1-bit的大於等於比較器, 即如果 \(a>=b\) 則輸出 1, 反之輸出 0
10. 下列依據由左至右順序來建構二元搜尋樹(binary search tree), 哪一個建構的樹有最大的深度 (depth)?
(A) \(25,7,31,41\)
(B) \(25,31,7,41\)
(C) \(41,7,31,25\)
(D) \(41,25,7,31\)
(E) \(25,41,7,31\)
11. 有關資料的排序，下列的敘述，何者錯誤？
(A) 選擇排序法(Selection Sort)，是將資料分成已排序、未排序兩部份，依序由未排序中找最小值(or 最大值)，加人到已排序部份的末端
(B) 合併排序法(Merge Sort) : 是直接將任意2個陣列的資料作合併來達成排序目的
(C) 氣泡排序法(Bubble Sort)，是利用兩兩比對，若大小順序不對的話就進行交換位置，這樣的概念來達成排序目的
(D) 插人排序法(Insertion Sort)，是將資料分成已排序、未排序兩部份，依序由未排序中的第一筆(正處理的值)，插人到已排序中的適當位置
(E) 快速排序法(Quick Sort)探用分割與征服(Divide and Conquer)策略,將問題分解成較小的子問題，用相同的解決程序一一解決後，再將子問題的結果整合成原問題的答案
12. 下列哪一個機制，並不在IEEE 802.11的CA(Collision Avoidance)的協定設計?
(A) 不同時問題長度的IFS (Inter-frame Space)
(B) 随機backoff(後退)錯開機制
(C) RTS/CTS的協定
(D) CD(Collision Detection)的機制
(E) NAV(Network Allocation Vector)的機制
13. 對一(個二元樹的走訪(binary tree traversal), 以後序走訪(postorder traversal)的結果是
FECHGDBA，但若以中序走訪(incorder traversal)的結果是 FECABHDG，那麼這個二元樹若以前序走訪(preorder traversal)的結果會是 :
(A) ACEFBDHG
(B) AFECBHDG
(C) ACFEBHDG
(D) ABDGHCEF
(E) AEFCHBDG
14. 下面的運算式是以後序法(postfix)表示： 593 + * 2 +, 其運算結果跟下列哪一個的運算結果一樣?
(A) 前序法(prefix)表示式： + 2 * + 395
(B) 中序法(infix)表示式： \(5 * 9+3+2\)
(C) 中序法(infix)表示式： \(5+2 * 3+9\)
(D) 中序法(infix)表示式： \(5+2 *(3+9)\)
(E) 前序法(prefix)表示式： + 2 * \(3+95\)
15. 數位燼章(Digital Signature)，並沒辦法直接提供下列哪一個服務？
(A) 身份的驗證(authentication)
(B) 訊息的驗證
(C) 訊息的完整性(integrity)
(D) 訊息的機密性(confidentiality)
(E) 訊息傳送的不可否認性
(non-repudiation)
注意:背面有試題
16. 某種替換式加密(substitution cipher)方法如下, 將26個英文字母的A加密替換成C, B加密替換成 \(D\), 以此類推, X替換成 \(Z\), Y替換成 \(A, Z\) 替換成 \(B\) 。那麼如果密文是EJCVIRV, 解密回來的明文是甚麼?
(A) GLEXKTX
(C) COMPILE
(E) CHATGPT
(B) CHAPGPT
(D) CHAPTER
17. 一個圖蓋機(Turing machine)的指令，(i, j, k, s, d)代表：如果目前在狀態i且讀到符號(symbol) \(j\) ，則寫符號k到紙帶(tape)上，改變狀態為 \(s\) ，往 \(\mathrm{d}\) 的方向移動讀寫頭。狀態1是一開始的初始狀態。
下列是此圖靈機的指令：
\((1,1,1,2\), 左 \()\)
\((2, b, 0,3\), 左 \()\)
\((3, b, 1,4\), 右 \()\)
\((4,0,1,4\), 右 \()\)
如果資料紙帶上的資料是如下： (b代表空白資料, 紙帶的兩端是空白的)... b1b...
讀寫頭一開始是在紙帶上資料 1 的位置, 則執行完的結果, 紙帶上的資料會變成下面哪一個?
(A)...b1b...
(C)...b111b...
(E)...b010b...
(B)...b101b...
(D)...b11b...
18. 一般來說, 下列哪一種技術, 並無法解決機構內IP不夠用的問題?
(A) VPN
(B) NAT
(C) DHCP
(D) IPv6
(E) IP分享器
19. 下列哪一個並不是作業系統裡程序 (process)之間造成死結(deadlock)的必要條件之一?
(A) Mutual exclusion：一個資源一次只能被一個process所使用
(B) Hold and Wait： process取得一個資源之後並等待其他的資源
(C) Many resource restrictions：程序必須擁有所有需要的資源，才允許它被執行
(D) No preemption：資源只能由process自己釋放，不能由其他方式釋放
(E) Circular wait：在系統中存在一組Process，且每個之間都處於前一個 process 在等待下一個 process的資源的狀態，第一個等待第二個，最後一個又再等待第一個的資源，如此一來形成一個cycle，也就成了circular wait的情形
20. 假設整數A與B，都是以符號與值(sign-and-magnitude) 8個台式的格式來儲存。
\(\mathrm{A}=(00010001)_{2}\)
B \(=(10010110)_{2}\)
那麼 \(A-B\) 的計算結果也是以符號與值格式來表示，會是下面哪一個?
(A) 00100111
(B) 01111011
(C) 01111111
(D) 10000101
(E) Overflow 溢位
```

---

## 【111計算機概論.pdf】

```text
注意：考試開始鈴響前，不可以翻閱試題
台灣聯合大學系統 111 學年度學士班轉學考試題
\title{
考試科目：計算機概論
}
\author{
組別：A4
}
\section*{参考 \\ 用
}
1. 作答中如發現試題印刷不清, 得舉手請監試人員處理, 但不得要求解釋題意。
2. 請核對答案卷 (卡) 上之准考證號、考試科目是否正確。
3. 本考科禁止使用計算器。
4. 選擇題請在答案卡上作答。
5. 考生限在作答區內作答, 不可書寫姓名、准考證號或與作答無關之其他文字或符號。
6. 答案卷用盡不得要求增加。
7. 答案卷限用藍筆或黑色鋼筆、原子筆或鉛筆書寫; 答案卡限用 \(2 \mathrm{~B}\)軟心鉛筆畫記, 如畫記不清 (含未依範例畫記) 致光學閱讀機無法辨識答案者, 其後果考生自行負責。
8. 因字跡潦草或作答未標明題號等情事, 致評閲人員無法辨識答案者, 該部分不予計分。
科目計算機概論 類組別 A4 共 9 頁 第 \(\angle\) 頁
單選題, 共 25 題, 每題 4 分(答錯不倒扣)
1. Which operation is functionally complete in Boolean logic?
(A) OR
(B) NOR
(C) NOT
(D) AND
(E) None of the above
2. Which algorithm or representation is typically used for circuit construction?
(A) Logic Optimizer
(B) Branch-and-Bound
(C) Multiply-Accumulate
(D) Sum-of-Products
(E) Dynamic Programing
3. Which of the machines is designed to directly provide a wide range of powerful features in such a way that the end result is a smaller program?
(A) MISC
(B) CISC
(C) SISC
(D) SICC
(E) RISC
4. How many bits are required for each address field in a machine language instruction on a computer with a maximum of \(2^{N}\) memory cells?
(A) \(\mathrm{N}-1\)
(B) \(\mathrm{N}+1\)
(C) \(2 \mathrm{~N}\)
(D) \(2^{N}\)
(E) \(\mathrm{N}\)
5. Typically, what do we refer to a program written in assembly language as?
(A) Data Program
(B) Object Program
(C) Control Program
(D) Stored Program
(E) Source Program
科目 计算機概論 類組別 A4 共 9 真 第乙頁
6. What should be transmitted to the processor to alert the computer that an input/output operation has been completed?
(A) Condition Code
(B) Execution Instruction
(C) Operand Address
(D) Interrupt Signal
(E) Switch Context
7. Which machine is able to provide the set of services and resources created by the system software and made available by the users?
(A) Harvard
(B) Multi-Tasking
(C) Virtual
(D) Von Neumann
(E) Super-computing
8. Which type of computer network allows third parties (such as vendors or customers) to access restricted information?
(A) Intranet
(B) Middleton
(C) Lannet
(D) Internet
(E) Extranet
9. What is the device that connects internetworks and provides routing between different wide area networks?
(A) Gateway
(B) Switch
(C) Bridge
(D) Repeater
(E) Hub
10. Which following representation of numeric data has two forms of zero?
(A) Fixed-sized Numbers
(B) Floating Point
(C) Signed-magnitude
(D) Ten's Complement
(E) Scientific Notation
科目 計算機概論 類組別 A4 共 9 頁 第 2 页
11. What type of computer application is designed to facilitate the exchange of messages and files on a network?
(A) Chat Room
(B) Social Network
(C) Bulletin Board System
(D) World Wide Web
(E) Internet of Things
12. What is the common term used to describe John Von Neumann's radically different computer concept based on a model conceived in 1946?
(A) External Program
(B) Stored Program
(C) Programmable Function
(D) Memory Unit
(E) Firmware
13. What is the process involved in finding errors that are uncovered by repeated use with varying input values?
(A) Resource Recycling
(B) Program Maintenance
(C) Data Warehousing
(D) Garbage Collection
(E) Buffer Management
14. Which gate produces the carry portion of two binary digits in a half adder?
(A) AND
(B) NAND
(C) XOR
(D) OR
(E) NOR
15. Which process is used to verify who is granted access to one computer, whether it is a local computer or a Web server?
(A) Authorization
(B) Encryption
(C) Certification
(D) Authentication
(E) Accounting
科目計算機概論 類組別 A4 共 9 頁 第 1 页
16. Which unit of binary storage has a size that is processor-dependent?
(A) Byte
(B) Nibble
(C) Bit
(D) Word
(E) Block
17. Which are useful for measuring the performance of one machine against another, and evaluating the sensitivity of an algorithm to variations in input on a particular machine?
(A) Time Trials
(B) Multivariate Analysis
(C) Comparison Times
(D) Turing Tests
(E) Benchmarks
18. What is the common practice of sending fraudulent messages to trick recipients into releasing sensitive information or installing malicious software on their system?
(A) Fishing
(B) Pharming
(C) Blasting
(D) Phishing
(E) Hijacking
19. How does a numeric overflow occur?
(A) Using fixed-sized numbers in a floating-point calculation
(B) A calculation producing an invalid result
(C) A calculation producing a value that won't fit into the allotted space
(D) Using a radix point instead of a decimal point
(E) Using a radix point in a fixed-sized number calculation
20. Which of the following is the best description of a register?
(A) A memory location which stores a sum
(B) A device that contains the arithmetic/logic unit
(C) A device that contains the control unit
(D) A large memory location in auxiliary storage
(E) A small memory location in the central processing unit
科目 計算機概論 類組別 A4 共 9 貢 第 5 頁
21. Which of the following is stored in the instruction register?
(A) The memory location of an instruction
(B) An instruction
(C) The number of program instructions executed
(D) The number of programs executed
(E) The data used by an instruction
科目計算機概論 類組別 A4 共 页 第 6 页
22. Given the following C code,
\#include <stdio.h>
void add(unsigned a) \(\{++a ;\}\)
void sub(unsigned *a) \(\{--(*) a\} ;\}\)
unsigned \(a=0 ;\)
int main() \{
if \((a=3)\{\)
for (int \(i=0 ; i<2 ; i++)\)
add (a);
for (int \(i=0 ; i<2 ; i++)\)
sub( \(\& a) ;\)
printf("\%u", a);
return 0 ;
\}
what is the output displayed on the screen?
(A) 0
(B) 1
(C) 3
(D) 5
(E) None of the above
科目计算榄概論 類組別 A4 共 9 貢 第 2 页
23. Given the following C code,
\#include <stdio.h>
int \(A(\) int \(m\), int \(n)\{\)
if \((m==0)\)
return \(n+1\);
else if \((n==0)\)
return \(A(m-1,1)\);
else
return \(A(m-1, A(m, n-1))\);
\}
int main() \{
printf("\%d", A(2, 2));
return 0 ;
\}
what is the output of the following code?
(A) 4
(B) 5
(C) 6
(D) 7
(E) 8
科目 計算機概論 類組別 A4 共 9 貢 第 8 貢
24. Given the following C code,
\#include <stdio.h>
\#include <unistd.h>
int main() \{
for (int \(i=1 ; i<5 ; i++)\{\)
if \(((\) fork ()\()==0)\)
fork \((\) );
else \{
fork \((\) );
fork \((\) );
\}
return 0 ;
\}
how many processes are created (including the main process)?
(A) 256
(B) 625
(C) 3125
(D) 1296
(E) 7776
科目 計算機概論 頗组别 A4 共 9 頁 第 9 頁
25. Given the following C code,
\#include <stdio.h>
void \(f(\) char \(* \operatorname{in})\{\)
(*in--)++;
void \(\left({ }^{*} p\right)(\) char \({ }^{*}\) ) \(=\mathrm{f} ;\)
int main() \{
char \(\mathrm{c}=48\);
\(p(\& c)\);
\(p(\& c)\);
printf("\%d", c);
return 0 ;
\}
what is the output of the following code?
(A) 49
(B) 50
(C) 51
(D) 52
(E) None of the above
```

---

## 【109計算機概論.pdf】

```text
單選題, 每題四分, 共 25 題 答錯不倒扣
1. In Von Neumann model, it does not include:
(A) Memory
(B) Heat Dissipation
(C) Control Unit
(D) Input/Output
(E) Logic Unit
2. Which award is considered as the Nobel Prize in computer science?
(A) Computer Pioneer Award
(B) Eckert-Mauchly Award
(C) Turing Award
(D) Computer Entrepreneur Award
(E) Golden Bell Prize
3. Which of the following is not true in memory management?
(A) Demand segmentation uses swapping.
(B) In monoprogramming, most of the memory capacity is dedicated to a single program.
(C) The paging approach uses the technique of virtual memory.
(D) In demand paging, a program is divided into equally sized pages.
(E) Partitioning is a multiprogramming approach.
4. Which of the following representations is incorrect?
(A) \(22 \mathrm{~A}\)
(B) \((110)_{2}\)
(C) \((\mathrm{EF})_{16}\)
(D) \((141)_{8}\)
(E) 145
5. The number 188.875 in decimal is equal to number in octal.
(A) 273.7
(B) 274.7
(C) 258.5
(D) 278.6
(E) 268.6
6. To convert a "Source Program" into an "Object Program", which step is NOT included?
(A)Preprocessor
(B) Lexical analyzer
(C)Syntax analyzer
(D)Semantic analyzer
(E) all of the above
7. Covert data type (i) to data type (ii), which one may cause data loss?
(A) (i) bool (ii) char
(B) (i) float (ii) double
(C) (i) int (ii) char
(D) (i) short (ii) long
(E) (i) int (ii) float
8. Which of the following statement is False?
(A) An array is a random-access structure.
(B) A sequential list is a random-access structure.
(C) A linked list is a random-access structure.
(D) A stack is not a random-access structure.
(E) None of the above
9. Recursion is memory-intensive because:
(A) Recursive functions tend to declare many local variables.
(B) Previous function calls are still open when the function calls itself and the activation records of these previous calls still occupy space on the call stack.
(C) Many copies of the function code are created.
(D) It requires large data values.
(E) Too many lines of code exist.
10. Assuming the following pseudocode for the Fibonacci series, what is the value of the \(5^{\text {th }}\) Fibonacci number (fibonacci ( 5 ) )?
fibonacci( 0 ) \(=0\)
fibonacci( 1 ) \(=1\)
fibonacci( \(n\) ) = fibonacci( \(n-1\) ) + fibonacci( \(n-2\) )
(A) 1.
(B) 3.
(C) 5.
(D) 7.
(E) 9.
11. Consider the \(\mathrm{C}\) program on the right side. What will be printed on the screen after the program finishes execution?
(A) -1
(B) 2
(C) 0
(D) 1
(E) None of the above
struct point \(\{\) int \(\mathrm{x}\}\);
int main() \{
struct point *p;
struct point \(\mathrm{q}\);
(\({ }^{*}(\& \mathrm{q})). \mathrm{x}=2\);
\(\mathrm{p}=\& \mathrm{q}\);
q.x \(=(\& q) \rightarrow x-1\);
printf("\%d" \(\mathrm{p}->\mathrm{x})\);
return 0 ;
12. Given that \(\mathrm{k}\) is an integer array starting at location \(2000, \mathrm{kPtr}\) is a pointer to \(\mathrm{k}\) and each integer is stored in 4 bytes of memory, what location does \(\mathrm{kPtr}+3\) point to?
(A) 2003.
(B) 2006.
(C) 2012.
(D) 2016.
(E) 2024.
13. Every object of the same class:
(A) Gets a copy of every member function and member variable.
(B) Gets a copy of every member variable.
(C) Gets a copy of every member function.
(D) Shares pointers to all member variables and member functions.
(E) Has the same address.
14. Which of the following is not a dynamic data structure?
(A) Linked list.
(B) Stack.
(C) Array.
(D) Binary tree.
(E) Queue
15. A stack is initially empty, then the following commands are performed:
push 5
push 7
pop
push 10
push 5
pop
Which of the following is the correct stack after those commands (assume the top of the stack is on the left)?
(A) 51075.
(B) 510.
(C) 75.
(D) 105.
(E) 5105.
16. A queue performs the following commands (in pseudo-code):
enqueue 4, 6, 8, 3, 1
dequeue three elements
enqueue 3, 1, 5, 6
dequeue two elements
What number is now at the front of the queue?
(A) 3.
(B) 4.
(C) 5.
(D) 6.
(E) 8
17.

What will be the value of the following expression:
listData \(->\) next \(->\) next \(->\) info
(A) 25
(B) 30
(C) 45
(D) 60
(E) None of the above
18. Which of the formulas gives the maximum number of nodes in the \(N\)th level of a binary tree?
(A) \(\mathrm{N}^{2}-1\)
(B) \(2^{N}\)
(C) \(2^{N+1}-1\)
(D) \(2^{N+1}\)
(E) None of the above
19. Given the array
\begin{tabular}{|c|c|c|c|c|c|c|c|c|c|}
\hline 26 & 24 & 3 & 17 & 25 & 24 & 13 & 60 & 47 & 1 \\
\hline
\end{tabular}
Which sorting algorithm would produce the following results after four iterations :
\begin{tabular}{|c|c|c|c|c|c|c|c|c|c|}
\hline 1 & 3 & 13 & 17 & 26 & 24 & 24 & 25 & 47 & 60 \\
\hline
\end{tabular}
(A) Bubble sort
(B) Selection sort
(C) Insertion sort
(D) Quick sort
(E) None of the above
20. Which of the following choices represents a correct in-order traversal for the binary tree on the right side?

(A) 5320897461
(B) 5321087964
(C) 4697081253
(D) 3521807964
(E) None of the above
21. In a data compression method, the received data need not be an exact copy of the original message.
(A) MP3
(B) JPEG
(C) MPEG
(D) GIFT
(E) all of the above
22. Which protocol is designed for file transfer?
(A) FTP
(B) SMTP
(C) TELNET
(D) HTTP
(E) POP
23. Which of the following is a white box (glass box) testing in software engineering?
(A) Random testing
(B) Boundary-value testing
(C) Basis path testing
(D) Exhaustive testing
(E) All of the above
24. Which of the following is true regarding the TCP/IP protocol suite?
(A) The application layer is responsible for providing services to the users.
(B) The transport layer is responsible for the logical delivery of a message between client and server processes.
(C) The network layer is responsible for the delivery of individual packets from the source host to the destination host.
(D) The data link layer is responsible for node-to-node- delivery of frames.
(E) All of the above
25. Which of the following is true regarding computer security?
(A) Authentication keeps information secret from unauthorized access.
(B) Steganography conceals the secret message by covering it with something else, such as an image file and a video file.
(C) In public-key cryptography, two parties communicate each other by using a shared key to encrypt and decrypt their secret messages
(D) Denial-of-service (DoS) attacks confidentiality of the secret communication channel between two parties.
(E) All of the above
```

---

## 【108計算機概論.pdf】

```text
\title{
單選題 (每題三分, 答錯不倒扣)
}
1. Which of the following items of information would not be contained in an operating system's process table?
(A) The location of the memory area assigned to the process
(B) The priority of each process
(C) Whether the process is ready or waiting
(D) The machine language instructions being executed by the process
(E) None of the above
2. Which of the following is not a means of performing multiple activities at the same time?
(A) Pipelining
(B) Multiprogramming
(C) Virtual memory
(D) Multiple processors
(E) None of the above
3. Which of the following is a protocol for controlling the right to transmit a message in a network?
(A) UDP
(B) TCP
(C) FTP
(D) CSMA/CD
(E) None of the above
4. Which layer of the TCP/IP hierarchy chops messages into units whose size is compatible with the Internet?
(A) Application
(B) Transport
(C) Network
(D) Link
(E) None of the above
5. Which of the following software engineering methodologies is the most rigid?
科目 計算機概論 頗組別 A4 804 共 9 真 第 2 真
(A) Waterfall model
(B) Incremental model
(C) Evolutionary prototyping
(D) Extreme programming
(E) None of the above
6. Which of the following is a notational system for representing object-oriented designs?
(A) Structure charts
(B) Dataflow diagrams
(C) UML
(D) Modular designs
(E) None of the above
7. Given the two relations \(\mathrm{X}\) and \(\mathrm{Y}\) below
\begin{tabular}{|c|c|c|c|c|}
\hline \(\mathrm{X}: \quad \Delta \quad \mathrm{B}\) & \(\mathrm{Y}: \quad \mathrm{C} \quad \mathrm{D}\) \\
7 & \(\mathrm{~s}\) & \(\mathrm{t}\) & 3 \\
2 & \(\mathrm{z}\) & \(\mathrm{r}\) & 2 \\
\hline
\end{tabular}
what value would be retrieved by executing the following SQL statement?
\begin{tabular}{l} 
select Y.C \\
from \(X, Y\) \\
where \(X. A<Y. D\)
\end{tabular}
(A) \(s\)
(B) \(\mathrm{z}\)
(C) \(\mathrm{t}\)
(D) \(\mathrm{r}\)
(E) None of the above
8. Which of the following features within a DBMS is not provided to maintain database integrity?
(A) Concurrent transaction processing
(B) \(\log\)
(C) Locking protocol
(D) Commit points
(E) None of the above
9. What action is performed by the Turing machine described below?
\begin{tabular}{|c|c|c|c|c|}
\hline \begin{tabular}{c} 
Current \\
state \\
START \\
X \\
X \\
Y \\
Y
\end{tabular} & \begin{tabular}{c} 
Current \\
cell content \\
\(*\) \\
1 \\
0 \\
0 \\
0 \\
\(*\)
\end{tabular} & \begin{tabular}{c} 
Value \\
to write \\
\(*\) \\
0 \\
0 \\
0 \\
\(*\)
\end{tabular} & \begin{tabular}{c} 
Direction \\
to move \\
left \\
left \\
right \\
right \\
no move
\end{tabular} & \begin{tabular}{c} 
New \\
state \\
X \\
X \\
Y \\
Y \\
HALT
\end{tabular} \\
\hline
\end{tabular}
(A) It replaces any string of consecutive 1s to the left of an * with Os.
(B) It leaves the tape unchanged.
(C) It places an * at the left end of any string of consecutive 1s appearing to the left of an
(D) It complements the string of 0 s and 1 s appearing to the left of an \(*\).
(E) None of the above
10. Which of the following is the most precise classification of a problem X?
(A) \(\mathrm{X}\) is in \(O\left(n^{2}\right)\).
(B) \(\mathrm{X}\) is in \(\Theta\left(n^{2}\right)\).
(C) \(\mathrm{X}\) is in NP.
(D) \(\mathrm{X}\) is in \(\mathrm{P}\).
(E) None of the above
11. The following numbers are in the 8 bit 2's complement format. Which number is the largest?
(A) 10010011
(B) 01101001
(C) 11110000
(D) 01010101
(E) 00110110
12. What is the number in base-10 representation for the hexadecimal number A6F?
(A) 2651
(B) 2415
(C) 2715
(D) 2671
(E) 2561
13. Given \(x=143\) and \(x\) XOR \(y=63\). What is \(y\)?
(A) 56
(B) 80
(C) 102
(D) 176
(E) 227
14. What is the first 5 bits of the mantissa part of 3.125 in the IEEE-754 single precision floating point presentation?
(A) 10010
(B) 11001
(C) 00010
(D) 01100
(E) 01010
15. Estimate about how long it would take to transfer a 400-page novel encoded in Unicode at a transfer rate of 10 Mbps. Suppose each page contains 300 Chinese characters in average.
(A) 0.1 second
(B) 0.2 second
(C) 0.5 second
(D) 1 second
(E) 2 seconds
16. Before A, B, C, and D ran a race they made the following predictions:
- A predicted that B would win.
- B predicted that \(\mathrm{D}\) would be last.
- C predicted that A would be third.
- D predicted that A's prediction would be correct.
Only one of these predictions was true, and this was the prediction made by the winner. In what order did A, B, C, and D finish the race?
(A) \(\mathrm{ABCD}\)
(B) \(\mathrm{BADC}\)
(C) \(\mathrm{DCBA}\)
(D) \(\mathrm{CBAD}\)
(E) \(\mathrm{CDAB}\)
17. If a program has time complexity \(T(n)=T(n / 2)+\Theta\left(n^{2}\right)\). What is the solution of \(T(n)\)?
(A) \(\Theta\left(n^{2}\right)\)
(B) \(\Theta\left(n^{2} \log n\right)\)
(C) \(\Theta\left(n^{2} \sqrt{n}\right)\)
(D) \(\Theta\left(n^{3}\right)\)
(E) \(\Theta\left(n^{3} \log n\right)\)
18. In a recursive function call, which data structure is used to track the calling sequence?
(A) Linked list
(B) Queue
(C) Stack
(D) Binary Tree
(E) Hash table
19. Which task is NOT part of the rendering process?
(A) Clipping
(B) Scan Conversion
(C) Hidden-Surface Removal
(D) Shading
(E) Triangulation
20. Deep learning belongs to which category of AI methods?
(A) Statistical learning
(B) Logic reasoning
(C) Artificial neural network
(D) Bayesian network
(E) Genetic algorithms
多選題（每題四分，答錯每個選項倒扣 0.8 分） 倒扣到該大題 0 分為止
21. Which of the following statements are/is correct in Computer Networks?
(A) Bridge connects existing networks to form an internet.
(B) Peer-to-peer is a means of performing interprocess communication over a network.
(C) Tier-2 ISPs are assigned the task of providing individual users access to the Internet.
(D) Port number identifies the application to which a message arriving from the Internet should be given.
(E) Ethernet is a means of implementing the Star network topology.
22. Which of the following statements are/is correct in Programming Languages?
(A) Most machine languages are based on the Imperative paradigm.
(B) In the process of translating a program, executing the program is one of the key steps.
(C) Polymorphism is the provision of a single interface to entities of different types.
(D) The scope of a variable is the portion of the program in which the variable can be accessed.
(E) Parse tree is not constructed by a typical compiler.
23. Given the following C-language declarations:
\begin{tabular}{|ll|}
\hline int \(* \mathrm{pt} ;\) & \\
int (*pa) & {\(\)}; \\
int ar1  & {\(\)}; \\
int ar2  & {\(\)}; \\
int \(* * \mathrm{p} 2 ;\) & \\
\hline
\end{tabular}
which of the following assignment statements are/is valid?
(A) pt \(=\) ar \(1 ;\)
(B) pa \(=\) ar \(2 ;\)
(C) p2 \(=\delta\) pt; \(/ /\) where \(\delta\) is the address-of operator
(D) p2 \(=\) ar \(2 ;\)
(E) \({ }^{*} \mathrm{p} 2=\mathrm{ar} 2 ; / /\) where \({ }^{*}\) is the indirection operator
24. Suppose you have this C-language function definition:
\begin{tabular}{|c|c|}
\hline \multicolumn{2}{|c|}{\begin{tabular}{l} 
\#include <stdio.h> \\
char *pr (char *str) \\
\{ \\
char *pc; \\
pc = str; \\
while (*pc) \\
putchar (*pc++) ; \\
do \{ \\
putchar (*--pc); \\
\} while (pc - str); \\
return (pc); \\
\}
\end{tabular}} \\
\hline
\end{tabular}
Consider the following function call:
\[
x=\operatorname{pr}(" \text { Ho Ho Ho!" }) ;
\]
which of the following statements are/is correct about this code segment?
(A) "Ho Ho Ho!oHo Ho o" is printed.
(B) *--pc means to take the value pointed to by pc and decrement that value by 1.
(C) --*pc means to decrement the pointer by 1 and use the value found there.
(D) while (pc - str) checks to see that pc does not point to the same location that str does (the beginning of the string).
(E) If *--pc were replaced with *pc--, "Ho Ho ho!oHo oH oH" is printed.
25. Which of the following questions have/has been answered by researchers?
(A) What is the time complexity of the problem of sorting a list?
(B) Is NP contained in P?
(C) Is P contained in NP?
(D) Are all the problems in NP solvable?
(E) Are all the problems in P solvable?
26. An 8 bit datum appends 1 bit odd parity checking bit for error detection. Which of the following data must have at least one bit error?
(A) 100100110
(B) 011010011
(C) 111100001
(D) 010101010
(E) 001100101
27. Which of the following data structures are/is usually used to implement a queue?
(A) Array
(B) Tree
(C) Circular list
(D) Graph
(E) Linked list
28. Which of the following sorting algorithms have/has worst case time complexity \(O(n \log n)\)?
(A) Quick sort
(B) Merge sort
(C) Bubble sort
(D) Heap sort
(E) Insertion sort
29. Which of the following algorithms are/is used for global lighting in computer graphics?
(A) Specular light reflection
(B) Phong shading
(C) Ray tracing
(D) Gouraud shading
(E) Radiosity
30. Which of the following components are/is in the production system for AI reasoning?
科目计算機概論
(А) А control system
(B) A collection of states
(C) An inference engine
(D) A collection of productions
(E) A search tree
```

---

## 【107計算機概論(A4,804).pdf】

```text
注意：考試開始鈴響前, 不可以翻閱試題
台灣聯合大學系統 107 學年度學士班轉學考試題
\title{
考試科目：計算機概論
}
\section*{組別：A4、803}
\section*{一作答注意事項一}
1. 作答中如發現試題印刷不清, 得舉手請監試人員處理, 但不得要求解釋題意。
2. 請核對答案卷 (卡) 上之准考證號、考試科目是否正確。
3. 本考科禁止使用計算器。
4. 選擇題請在答案卡上作答。
5. 考生限在作答區內作答, 不可書寫姓名、准考證號或與作答無關之其他文字或符號。
6. 答案卷用盡不得要求增加。
7. 答案卷限用藍筆或黑色鋼筆、原子筆或鉛筆書寫; 答案卡限用 \(2 \mathrm{~B}\)軟心鉛筆畫記, 如畫記不清 (含未依範例畫記) 致光學閱讀機無法辨識答案者, 其後果考生自行負責。
8. 因字跡潦草或作答未標明題號等情事, 致評閱人員無法辨識答案者,該部分不予計分。
單選題（每題三分，答錯不倒扣）
1. Which of the following is the binary representation of the decimal number
(78.5625)?
(A) 1001110.1001
(B) 1001110.11
(C) 1001100.1001
(D) 1001110.101
(E) None of the above.
2. Each of decimal value \(X=170\) and \(Y=80\) are stored in 8 bit allocation. The result of operation \(X \oplus Y\) should be?
(A) 00001010
(B) 11110000
(C) 10100000
(D) 00001111
(E) None of the above.
3. Which of the following is the number representation of IEEE-754 singleprecision floating-point format (C189000016)
(A) \((-117.5)\)
(B) \((-117.125)\)
(C) \((117.125)\)
(D) \((-17.125)\)
(E) None of the above.
4. Which of following is incorrect of the vector graphic method image?
(A) The type of image that can be easily rescaled
(B) The type of image that's file size smaller than bitmap image.
(C) The type of image that can represent the details in a photo.
(D) The type of image that consists of geometric shapes.
(E) None of the above.
5. We use \(8 \mathrm{~K}\) times per second sampling audio signal. 128 different levels present each sample. How many bytes are needed to store 2 minutes audio voice.
(A) \(240 \mathrm{~KB}\)
(B) \(60 \mathrm{~KB}\)
(C) \(120 \mathrm{~KB}\)
(D) \(300 \mathrm{~KB}\)
(E) None of the above.
6. Which of the following creates an overflow if both of the numbers and the result are in 8-bit two's complement representation?
(A) (-37) - 99
(B) \(37+99\)
(C) \(37-99\)
(D) \((-37)+99\)
(E) None of the above.
7. If the computer has 32 data registers ( \(\mathrm{R} 0\) to \(\mathrm{R} 31\) ), 2000 words in memory, and 16 different instructions. What is the minimum size of an add instruction in bits if a typical instruction use the following format: add R0 R2
(A) 14
(B) 13
(C) 28
(D) 29
(E) None of the above.
8. Which of the following is the first stage of the modern operation system be loaded into the memory and run it?
(A) Bootstrap program in ROM.
(B) Bootstrap program in H.D.
(C) Boot manager in H.D.
(D) Boot manager in floppy disk.
(E) None of the above.
9. Which of the following condition is not correct regarding deadlock or necessary conditions for deadlock?
(A) Mutual exclusion.
(B) A process may hold allocated resources even though it cannot use it until other resources are available.
(C) No resource can be forcibly removed from a process holding it by operation system.
(D) Operation must abort all deadlocked processes to avoid deadlock.
(E) None of the above.
10. Which of the following is correct if the memory allocated to a process is a little larger than the process?
(A) Internal fragmentation occurs
(B) External fragmentation occurs
(C) Both internal and external fragmentation occur
(D) Neither internal nor external fragmentation occurs
(E) None of the above.
11. Which of the following is true of memory-mapped \(1 / 0\)?
(A) The devices have a separate address space with memory.
(B) The advantage is the devices have to deal with larger address lines
(C) The device has to repeatedly check the status flags
(D) The devices and the memory using the same address space.
(E) None of the above.
12. Which of the following compression algorithm, when the symbols occurring more frequently assign shorter codes and those that occurring less frequently assign longer codes?
(A) Run-length coding
(B) Dictionary coding
(C) Arithmetic coding
(D) Huffman coding
(E) Predictive coding
13. A binary tree has eight nodes. The postorder traversal is FECHGDBA and inorder is EFCABHDG. Which of following is the preorder of the tree?
(A) BHDGAEFC
(B) BHDGAFEC
(C) AEFBCDGH
(D) EFCADHGB
(E) ACEFBDHG
14. Which of the following is incorrect of software testing phase?
(A) The black-box testing depends only on the external system interface to confirm its correctness.
(B) The basis path testing is glass-box testing.
(C) The control structure testing is glass-box testing.
(D) Boundary-value testing is glass-box testing.
(E) None of the above.
15. Which of the following is the ciphertext of \(p=11\) and \(q=5\) and choose \(e=7\).
Apply RSA algorithm where plaintext message \(=12\)?
(A) 23
(B) 12
(C) 64
(D) 11
(E) None of the above.
16. Which of the following is result of running the \(C\) programing language below?
\(\#\) define \(M 1(a, b) a *\) (*b)
\#define M2(a,b) (a) \(+b\)
\#include <stdio.h>
void main(void)
\(\ulcorner\{\)
int \(n 1, n 2\);
n1 \(=2\);
n2 \(=3\);
n1 \(=M 1(n 1-n 2, n 2-n 1) * M 2(n 1+n 2,2 * n 2)\);
printf("\%d \(\backslash n ", n 1)\);
\}
(A) (-11)
(B) (-7)
(C) (-2)
(D) 2
(E) None of the above.
17. Which of the following is result of running the \(C\) programing language below?
\begin{tabular}{|c|c|c|c|c|c|c|c|c|}
\hline 科目 & 计算機 & & 频组别 & \(\mathrm{A} 4\) & 803 & & 共 & 第 5 & 言 \\
\hline & \multicolumn{8}{|c|}{ void fun1(char *a) \{ } \\
\hline & \multicolumn{8}{|c|}{ int \(\mathrm{i}, \mathrm{j}\); } \\
\hline & \multicolumn{8}{|c|}{ char c; } \\
\hline & \multicolumn{8}{|c|}{ for \((\mathrm{i}=1, \mathrm{j}=\) strlen(a) - 1; \(\mathrm{i}<\mathrm{j} ; \mathrm{i}=\mathrm{i}+1, \mathrm{j}=\mathrm{j}-1)\{\)} \\
\hline & \multicolumn{8}{|c|}{\(c=a[i] ;\)} \\
\hline & \multicolumn{8}{|c|}{\(a[i]=a[j] ;\)} \\
\hline & \multicolumn{8}{|c|}{\(a[i]=c ;\)} \\
\hline & \multicolumn{8}{|c|}{\}} \\
\hline & \multicolumn{8}{|c|}{ int main(void) \{ } \\
\hline & \multicolumn{8}{|c|}{ char s1 \(\square=\) "ABCDE"; } \\
\hline & \multicolumn{8}{|c|}{ fun1(s1); } \\
\hline & \multicolumn{8}{|c|}{ printf(\%"s", s1); } \\
\hline & \multicolumn{8}{|c|}{ return 0; } \\
\hline & \multicolumn{8}{|c|}{\} } \\
\hline & \multicolumn{8}{|c|}{ (A) \(\quad\) ABCDE } \\
\hline & \multicolumn{8}{|c|}{ (B) \(\quad\) EDCBA } \\
\hline & \multicolumn{8}{|c|}{ (C) AEDCB } \\
\hline & \multicolumn{8}{|c|}{ (D) \(\quad\) DECBA } \\
\hline & \multicolumn{8}{|c|}{ (E) None of the above. } \\
\hline & \multicolumn{8}{|c|}{ 18. Consider the following C programing language? } \\
\hline & \multicolumn{8}{|c|}{ int Func (int \(\mathrm{n}\) ) } \\
\hline & \multicolumn{8}{|c|}{ if \(\langle\mathrm{n}==2\rangle\) return 1; } \\
\hline & \multicolumn{8}{|c|}{ else return \(\mathrm{n}+\) Func \((\mathrm{n}-2) ;\)} \\
\hline & \multicolumn{8}{|l|}{\}} \\
\hline & \multicolumn{8}{|c|}{ What is the result after call Func(10) } \\
\hline & \multicolumn{8}{|l|}{ (A) 16} \\
\hline & \multicolumn{8}{|l|}{ (B) 19} \\
\hline & \multicolumn{8}{|l|}{ (C) 29} \\
\hline & \multicolumn{8}{|l|}{ (D) 39} \\
\hline & \multicolumn{8}{|l|}{ (E) None of the above. } \\
\hline & \multicolumn{8}{|c|}{\begin{tabular}{l} 
19. Which is the concept using by virtual memory when a process is copied into \\
main memory from the secondary memory according to the requirement.? \\
(A) Demand paging \\
(B) Scheduling \\
(C) Segmentation
\end{tabular}} \\
\hline & \multicolumn{8}{|c|}{ 注意:背面有試題 } \\
\hline
\end{tabular}
(D) Virtualization
(E) None of the above.
20. In computer system hardware, which of following item is the fastest and most expensive form of storage and comparatively small?
(A) Tape Storage
(B) Cache
(C) Optical Storage
(D) Flash memory
(E) None of the above.
多選題（每題四分，答錯每個選項倒扣 0.8 分）
21. Which of the statement(s) are correct in TCP protocol?
(A)TCP is Connection-oriented
(B)TCP is process-to-process
(C)In TCP, sending and receiving data is done as sequence of characters
(D)TCP is network layer protocol
(E)TCP groups a number of bytes together into a packet called segment
22. Which of the statement(s) are correct in RISC architecture?
(A) The advance is power efficient than CISC.
(B) The Personal Computer is designed following this architecture.
(C) The architecture is aimed at increasing the time of execution of instructions.
(D) The processor has a more complicated design than CISC
(E) The architecture was the first to implement pipe-lining.
23. Which of the statement(s) are correct in Computer Networks?
(A) The length of an IPv6 address is 128 bits.
(B) IPv6 does not use Broadcast type of address
(C) Telnet can be used for file transfer, too.
(D) Two colons (:): are used to denote continuous hexadecimal fields of zeros.
(E) Transferring a file by FTP uses UCP connections.
24. Which of the statement(s) are correct in complexity of algorithm \(\mathrm{O}\left(\mathrm{n}^{2}\right)\)?
(A) merge sort
(B) linear search
(C) binary search
(D) bubble sort
\section*{注意:背面有試題}
( \(E\) ) selection sort
25. Which of the following a Turing machine consists of?
(A) Keyboard
(B) Head (read/write)
(C) Controller
(D) Calculator
(E) Tape
26. What is the length of the character after encoding by Huffman coding with the given frequencies?
\(\mathrm{A}(20), \mathrm{B}(8), \mathrm{C}(9), \mathrm{D}(2), \mathrm{E}(14)\)
(A) A: 1 bits
(B) B: 3 bits
(C) C: 2 bits
(D) D: 4 bits
(E) E: 2 bit
27. Choose the following items that are correct regarding ADT (Abstract Data Type)?
(A) Array contains elements of different type.
(B) Binary search cannot be implemented using linked lists.
(C) Stack underflow is removing items from an empty stack.
(D) The suitable structure for Breadth-First Traversal on a graph is the tree.
(E) A queue is a FIFO (First In First Out) list.
28. Consider the following C programing language?
int \(a, b ;\)
int \(* x, * y ;\)
\(a=1 ;\)
\(b=2 ;\)
\(x=\& a ;\)
\(y=\& b ;\)
\(x=y ;\)
\(* \mathrm{x}=3 ;\)
\(* y=4 ;\)
printf \((" \% d \% d \% d ", a, b, " x, * y) ;\)
What is the value after running?
(A) \(a=1\)
(B) \(b=4\)
(C) \(\mathrm{x}=3\)
(1) \(y=3\)
(2) \(y=4\)
29. Which of following item(s) is correct about Computer Networks?
(A) SMTP uses the TCP port 25.
(B) An email client has to know the MAC address of its initial SMTP server.
(C) SMTP defines message encryption.
(D) SMTPS is based on the SMTP connections secured by SSL.
(E) Simple mail transfer protocol (SMTP) uses TCP as the transport layer protocol for electronic mail transfer.
30. Which of following item(s) is incorrect about CPU Processing?
(A) The processes that are stored in main memory and are ready and waiting to execute will be keep on a list called ready queue.
(B) In priority scheduling algorithm the process with highest priority allocate CPU.
(C) A process can move to a different classified ready queue in multilevel feedback scheduling algorithm.
(D) User level thread can be scheduled by the kernel.
(E) The interval time from a process submit and complete time is called turnaround time.
```

---

## 【106計算機概論(A4,803).pdf】

```text
*請在答案卡內作答
單選題 (1 15), 每題 3 分, 不倒扣
1. Which of the following cannot decide unique binary tree?
(A) inorder and preorder (B) postorder and preorder (C) postorder and inorder
2. A so-called algorithm is to make a big problem, which breaks into many small problems; if these small problems are resolved, then the original big problem will be solved.
(A) Binary Search (B) Merge Sort (C) Quick Sort (D) All of the above
3.
\begin{tabular}{|c|c|c|c|c|}
\hline \(9,7,15,8,11,13,12,22,30,10\) & & & & \\
\hline 7,9 & 8,15 & 11,13 & 12,22 & 10,30 \\
\hline \(7,8,9,15\) & & \(11,12,13,22\) & & 10,30 \\
\hline \(7,8,9,11,12,13,15,22\) & & & & 10,30 \\
\hline \(7,8,9,10,11,12,13,15,22,30\) & & & & \\
\hline
\end{tabular}
What sorting method was used in above example?
(A) Binary Search (B) Merge Sort (C) Quick Sort (D) Insertion Sort (E) All of the above
4. Three traversals have been defined in binary search tree (BST): preorder, inorder, and postorder. Given the following binary search tree:

Which one is correct?
(A) Postorder traversal: \(1,2,7,5,12,24,22,25,21\)
(B) Preorder traversal: \(21,12,5,2,1,7,25,22,24\)
(C) Inorder traversal: \(1,2,5,7,12,21,22,24,25\)
(D) All of the above.
5. What is the reason for building a Distributed System?
a.Resource sharing
b. Speed up
c.Communication
(A) ab (B) ac (C) bc (D) abc
6. ebay.com is a well-known auction site. What type of e-commerce model is it?
(A) B2C (B) C2C (C) B2B (D) O2O (E) None of the above
*請在答案卡內作答
7. When you buy mobile phones on ASUS website (store.asus.com), what kind of e-commerce model is it used?
(A) B2C (B) C2C (C) B2B (D) O2O (E) None of the above
8. On P2P communication technology, which of the following is not correct?
(A) eMule is a software that uses P2P (B) KKBOX is a software that uses P2P (C) The clients can send data directly to each other (D) It is a client/server network (E) None of the above
9. What kind of communication protocol is used in Web-Based Mail?
(A) SMTP and POP (B) Telnet (C) HTTP (D) FTP (E) None of the above
10. In Streaming Media, which of the following is not correct?
(A) Wait for the file to be downloaded before it is played (B) Users can watch audio and video data instantly (C) Send audio and video data to a single point or multi-point: broadcast, unicast, multicast (D) None of the above
11. Convert the following IP address to decimal result:
00100110011000011000011000001000
(A) 166.97.67.1 (B) 38.97.67.8 (C) 38.97.67.1 (D) 38.97.134.8 (E) None of the above
12. In TCP/IP (Transmission Control Protocol/Internet Protocol), which of the following communication protocols is not belongs to the application layer?
(A) SMTP (B) FTP (C) DNS (D) TCP (E) None of the above
13. Consider the following declarations and initializations of a \(\mathbf{C}\) program:
int \(\mathrm{i}=10, \mathrm{j}=6, * \mathrm{~s}=\& \mathrm{i}, * \mathrm{t}=\& \mathrm{j}\);
What is the value of \(10 *\left(* \mathrm{~s} / * \mathrm{t}\right)+7\)
(A) 13 (B) 7 (C) 17 (D) 607 (E) None of the above
14. What is the time complexity (Big-O) in following program segment?
\(\mathrm{r}=0\);
for \((\mathrm{i}=1 ; \mathrm{i}<\mathrm{M} ; \mathrm{i}++)\)
for \((\mathrm{j}=1 ; \mathrm{j}<\mathrm{t} * \mathrm{i} ; \mathrm{j}++)\)
if \((j \% \mathrm{i}==0)\)
for \((\mathrm{k}=0 ; \mathrm{k}<\mathrm{j} ; \mathrm{k}++)\)
\(\mathrm{r}^{+}+\)
(A) \(\mathrm{O}\left(\mathrm{N}^{5}\right)(\mathrm{B}) \mathrm{O}\left(\mathrm{N}^{4}\right)(\mathrm{C}) \mathrm{O}\left(\mathrm{N}^{2}\right)(\mathrm{D}) \mathrm{O}(\mathrm{N})\) (E) None of the above
15. What is the result in following program segment?
int \(x\);
int *p, *q;
p \(=x+1\);
\(q=x+5\);
*(p+1) \(=10\);
printf("q+p is \(\% \mathrm{~d} "\), q-p);
(A) \(q+p\) is \(0(B) q+p\) is \(4(C) q+p\) is \(16(D) q+p\) is \(15(E)\) None of the above
*請在答案卡內作答
多選題 (16 26), 一題 5 分, 每一選項單獨計分, 答錯倒扣
16. \(n\)-tree (each node has at most \(n\) children) with \(h\) height \((n=3 ; h=6)\). Which of the following are correct?
(A) Maximum number of nodes: 364 (B) Minimum number of nodes: 63 (C)
Maximum number of nodes: \(\left[\begin{array}{c}n^{h} \\ n-1\end{array}\right]\) (D) \(\left[\begin{array}{c}2 \frac{n}{2}\right|_{2} ^{h-1}-1\right.\) \(+1(\mathrm{E})\) The perfect \(N\)-tree (full and complete) with \(\left[\begin{array}{c}n^{h} \\ n-1\end{array}\right]\) nodes.
17. Consider the following expressions \((2+3) *(5-2)\), which of the following are correct?
(A) Prefix forms: \(*+23-52\) (B) Postfix forms: \(23+52-*(\mathrm{C})\) Inorder form \(2+3 * 5-2\) (D)
The tree is:
\section*{(E) It is a complete binary tree}
18. Choose the correct answers from following items regarding Asymmetric Encryption.
(A) Both the sender and the receiver have a pair of public and private keys
(B) If the data has been encryption by private key, we must use the corresponding public key to decrypt.
(C) If the data has been encryption by public key, we must use the corresponding private key to decrypt.
(D) Both private key and public key can be made public.
(E) Asymmetric encryption is also called as Secret Key.
19. In internet, which of the following are not correct.
(A) In IPv4, each address has 32 bits.
(B) In IPv6, each address has 64 bits.
(C) DNS is used to address Hyperlink, DNS is the address of various resources on the webs.
(D) Some well-known communications protocols FTP-DNS-SMTP-Tlenet-HTTP are belong to the Network Layer.
(E) Some well-known communications protocols TCP (Transmission Control Protocol) and UDP (User Datagram Protocol) are belong to the Transport Layer.
20. Choose the following items that are correct regarding Programming Language?
(A) C++, Java, C\#, and Python are Object-Oriented Paradigm.
(B) The functional paradigm is also called a procedural paradigm, some typical programming languages are FORTRAN, BASIC and COBOL.
(C) Windows is designed by Object-Oriented Programming, the main features is that each object cannot be reused.
(D) LISP is a functional paradigm, program is treated as a combination of several basic functions.
(E) PRPLOG (PR0gramming LOGic) is belong to functional paradigm, is developed by
科目 計算機概論
*請在答案卡內作答
\title{
A4 803
}
共 5 页 第千頁
Alain Colmerauer and Philippe Roussel to deal with the natural language.
21. Choose the following items that are correct regarding ADT (Abstract Data Types)?
(A) A stack is a linear list in which data can only be inserted at one end, called the rear.
(B) A queue is a restricted linear list in which all additions and deletions are made at one end, the top.
(C) A graph is an ADT made of a set of nodes, called vertices, and set of lines connecting the vertices, called edges or arcs.
(D) In a directed graph, or digraph, each edge, which connects two vertices, has a direction from one vertex to the other.
(E) In breadth-first traversal of a binary tree we process all the children of a node before proceeding with the next generation.
22. Choose the following items that are correct regarding Data Structure?
(A) In two-dimensional arrays, the data is organized linearly in one direction.
(B) A record is a collection of data in which each element contains the location of the next element.
(C) In linked list, the last element contains a null pointer, indicating the end of the list.
(D) There are two pointers pre (for previous) and cur (current) in linked list. At the beginning of the search, both the pre pointer and the cur pointer point to the first node.
(E) Before deleting a node in a linked list, we apply the search algorithm. Deletion is simpler than insertion: only two cases, deleting the first node and deleting any other node.
23. Choose the following items that are correct regarding CPU scheduling?
(A) In a time sharing system, the most suitable criterion for CPU scheduling is to maximize the CPU utilization.
(B) A round robin scheduling algorithm should be preemptive
(C) If a process is terminated with some exit value in the UNIX operating system, the system call wait() in the parent process can be used to obtain the value.
(D) The shortest-job-first algorithm can be implemented for the short-term CPU scheduling.
(E) Processes in the waiting status will wait for the CPU resources
24. Choose the following items that are not correct regarding deadlock.
(A) In case that there exists a cycle in resource-allocation graph, it will always in deadlock (B) A process.
(B) A computer has 9 tapes drives, with \(n\) process competing for them. Each process may need at most 3 drives at the same time. 3 is the maximum value of \(n\) that keeps the system deadlock free.
(C) If there is a cycle of resource allocation graph for a system with single instance resource, it will be in a deadlock state.
(D) If a system is not in the safe state, it will be in a deadlock state.
(E) There are 4 necessary conditions for a deadlock: Mutual Exclusion, Hold \& Wait, No Preemption, and Circular Waiting. It will be deadlock free if one of the above necessary conditions is not established.
25. Which of the following statements are correct regarding Memory management
(A) The purpose of timing sharing is to increase user responsiveness
(B) Paging avoids the problem of external fragmentation of memory in a multi-programming environment.
(C) Compaction could be used to solve problems caused by internal fragmentation.
(D) The physical memory implements the translation of a program's address space to physical addresses.
(E) When TLB (Translation Lookaside Buffer) cannot find the information the CPU is looking for, the OS will be awaken to load the correct TLB in the disc.
*請在答案卡內作答
26. Which of the following statements are correct regarding Template.
(A) Initially, the concept of templates was not included in some languages, such as Java.
(B) Templates allows functions and classes to operate with generic types.
(C) Templates does not allows a function or class to work on many different data types without being rewritten for each one.
(D) The C++ Standard Library provides many useful functions within a framework of connected templates
(E) Function templates, class templates, and variable template are three types of templates.
```

---

## 【105計算機概論(A4,804).pdf】

```text
*請在答案卡內作答
單選題 (1 20), 每題 3 分, 不倒扣
1. Given a decimal number (19.375) 10, please calculate its corresponding binary value.
(A) 10001.101 (B) 10011.011 (C) 1.011 (D) 1110.0101 (E) None of the above.
2. Let \(X\) and \(Y\) be two 8-bit signed integers, where \(X=01100001, Y=00001111\)
The result of \(X+Y\) should be
(A) 11110000 (B) 00110000 (C) 01110000 (D) 10110000 (E) None of the above
3. Which one of the following circuits is NOT equivalent to a 2-input XNOR (exclusive NOR)

(B)

(D)

4. \(X\) and \(Y\) are two real numbers in IEEE single-precision floating-point format:
\[
\begin{array}{l}
X=0100000010111000000000000000000, \\
Y=010000110010000111100000000000000
\end{array}
\]
Calculate and show the result of \(X+Y\).
(A) 0100001100100111101000000000000000
(B) 01000000101000011110000000000000000
(C) 0100001100100001111000000000000000
(D) 0000000000100111101000000000000000
(E) None of the above
5. An operating system can put resource restrictions on processes to prevent
(A) starvation (B) synchronization (C) paging (D) deadlock
6. Which of the following is true regarding ADT (Abstract Data Types)?
(A) Computer languages do not provide ADT packages. To use an ADT, it is first implanted and kept in a library.
(B) A stack is a linear list in which data can only be inserted at one end, call the rear, and deleted from the other end, call the front.
(C) Stacks are familiar from everyday life. A line of people waiting for the bus at bus station is a queue.
(D) Queues are knowns as last in, first out (LIFO) data structure.
(E) None of the above
7. Which of the following is true regarding File structures?
(A) Compared to sequential, indexed and hashed file, only an sequential file can be accessed randomly.
(B) If we need to access a file, one record after another, from beginning to end, we will use a random access file structure.
(C) A indexed file uses a mathematical function to map the key to the address.
(D) none of the above

科目 計算機概論 類組別 A4 804 共 7 真 第 2 真
*請在答案卡內作答
8. Which of the following is not correct regarding Computer Networks?
(A) File Transfer Protocol (FTP) is the standard application program used for file transfer.
(B) The layers in TCP/IP protocol suite are application (layer 5), network (layer 4), transport (layer 3), data link (layer 2), and physical (layer 1).
(C) The transport layer is responsible for process-to-process delivery of the entire message. The transport layer address is the process identification, called a port number
(D) TELNET is used to establish a login session on a remote machine. After establishing a session, we can also use TELNET commands to copy files.
9. The layer of the TCP/IP protocol suite transmits a bit stream over a physical medium.
(A) data-link (B) physical (C) network (D) transport
10. The simplified SOP (Sum Of Product) form of the boolean expression.
\(\left(\mathrm{P}+\mathrm{Q}^{\prime}+\mathrm{R}^{\prime}\right).\left(\mathrm{P}+\mathrm{Q}^{\prime}+\mathrm{R}\right).\left(\mathrm{P}+\mathrm{Q}+\mathrm{R}^{\prime}\right)\) is?
(A) \(\left(\mathrm{P}^{\prime} \cdot \mathrm{Q}+\mathrm{R}^{\prime}\right)\)
(B) \(\left(\mathrm{P}+\mathrm{Q}^{\prime} \cdot \mathrm{R}^{\prime}\right)\)
(C) \(\left(\mathrm{P}^{\prime} \cdot \mathrm{Q}+\mathrm{R}\right)\)
(D) \((\mathrm{P} \cdot \mathrm{Q}+\mathrm{R})\)
11. Which netmask setting should been apply when you want to separate a class C network?
(A) \(255.255.0.0 \quad\) (B) \(2.255.255.255.0 \quad\) (C) \(255.255.255.64 \quad\) (D) \(4.255.255.255.192\)
12. What will the following program output?

(A) \(121215(\mathrm{~B}) 0015(\mathrm{C}) 121415\) (D) \(12123\)
13. What will the following program output?

*請在答案卡內作答
\[
\begin{array}{l}
\text { int } * c=\& a ; \\
* c= * c+3 ; \\
a=a+5 ; \\
\text { printf( "a="d ",a): }
\end{array}
\]
(A) 17 (B) 3 (C) 5 (D) 20 (E) 25
14. What will the following program output in C language?
\#include <stdio.h>
int main(void)
\{
int \(a=10\);
float \(\mathrm{b}=4.2\);
printf("\%d ", (int) (a/ b));
printf("\% \(\backslash\) u", a / b);
return 0 ;
\section*{(A) 2.380953 2.380953 (B) 2 2 (C) 2 2.380953 (D) 22.4}
15. Consider the C code piece on the right side. Which of the following is correct regarding the computing result?
(A) \(a=21\) and \(\& a=21\)
(B) \(a=21\) and \(* a \operatorname{Pr}=\mathbf{2 1}\)
(C) \(\mathrm{aPtr}=21\) and \(* \mathrm{aPtr}=21\)
(D) \(\& \mathrm{a}=21\) and \(\mathrm{aPtr}=21\)
(E) None of the above
16. What will the following program output in \(\mathrm{C}++\) language? \(\mathrm{D}\)

*請在答案卡內作答
\begin{tabular}{|c|c|c|c|c|c|c|c|c|}
\hline \multicolumn{9}{|c|}{\begin{tabular}{l} 
(E) \\
1
\end{tabular}} \\
\hline 2 & 2 & 3 & & & & & & \\
\hline 3 & 6 & 9 & & & & & & \\
\hline
\end{tabular}
17. What kinds of sorting algorithm is implemented in following program?

*請在答案卡內作答

*請在答案卡內作答
(1) When a hashing algorithm produces an address for an insertion key and that address is already occupied, it is called a synonym.
(2) In the modulo division hashing method, there are no synonyms or collisions.
(3) In the division remainder hashing method, there are no synonyms or collisions.
(4) In the modulo division hashing method, selected digits are extracted from the key and used as the address.
(5) The prime area is the file area that contains all the home addresses.
25. Which of the following items are correct in \(\mathrm{C}++\) and Java
(A) A reference is an alias for another variable in \(\mathrm{C}++\),
(B) \(\mathrm{C}++\) supports both pointers and references, while Java only supports references
(C) References can be null in \(\mathrm{C}++\)
(D) Inherited private members are not accessible to the derived class functions in \(\mathrm{C}++\)
(E) \(\mathrm{C}++\) only supports single inheritance
26. Which of the following items are correct in \(\mathrm{C}++\) and Java
(A) \(\mathrm{C}++\) provides capabilities for object-oriented programming.
(B) \(\mathrm{C}++\), an extension of \(\mathrm{C}\), was developed by Bjarne Stroustrup in the early 1980s at Bell Laboratories.
(C) C++ programs consist of pieces called classes and functions.
(D) Java is now used to develop large-scale enterprise applications, to enhance the functionality of web servers, to provide applications for consumer devices and for many other purposes.
(E) JAVA source code filenames often end with the.cpp,.cxx,.cc or.C
27. Which of the following items are correct in \(\mathrm{C}++\).
(A) Sometimes functions are not members of a class. Such functions are called global functions.
(B) Functions in the <match> header file are global functions
(C) Function arguments may not be constants, variables or more complex expressions.
(D) The return-value-type void indicates that a function will return a value
(E) None of the above
28. Which of the following items are correct in pointer in \(\mathrm{C}++\).
(A) Pointers cannot pass-by-reference and cannot used to create and manipulate dynamic data structures
(B) A pointer with the value 1 or NULL points to nothing and is known as a null pointer.
(C) The address operator \(\left({ }^{*}\right)\) is a unary operator that obtains the memory address of its operand.
(D) The \(\left(^{*}\right)\) operator, commonly referred to as the indirection operator or dereferencing operator, returns a synonym for the object to which its pointer operand points.
(E) None of the above
29. Which of the following items are correct in Data Structure.
(A) An Array is a collection of data in which each element contains the location of the next element
(B) A Linked list is a collection of related elements, possibly of different types, having a single name. Each element in a linked list is called a field.
(C) If we have a list in which a lot of insertions and deletions are expected after the original list has been created, we will use an array.
(D) A Record is a collection of data in which each element contains the location of the next element-that is, each element contains two parts: data and link.
*請在答案卡內作答
(E) None of the above
30. Which of the following items are correct in ADTs (Abstract Data Type)
(A) An abstract data type is a data type packaged with the operations that are meaningful for the data type
(B) A Computer languages do not provide ADT packages. To use an ADT, it is first implemented and kept in a library.
(C) A stack is a restricted linear list in which all additions and deletions are made at first in, first out. (FIFO)
(D) A queue is a last in, first out (LIFO) structure.
(E) None of the above
```

---
