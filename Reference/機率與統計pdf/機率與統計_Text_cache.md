## 【Prob_Stat_04-Probability(I).pdf】

Probability – I
Yi-Fen Liu
Department of IECS, FCU
References:
- Dimitri P. Bertsekas and John N. Tsitsiklis, Introduction to Probability, Chapter 2
- Walpole R. E., Myers R. H., Myers S. L. and Ye K., Probability & Statistics for Engineers & Scientists, Ch. 3
- William Navidi, Statistics for Engineers and Scientists, Ch. 2.4
- Slides are credited from Prof. Berlin Chen, NTNU. 
RANDOM VARIABLES:
DISCRETE & CONTINUOUS
Random Variables
• Given an experiment and the corresponding set of 
possible outcomes (the sample space), a random variable 
associates a particular number with each outcome
– This number is referred to as the (numerical) value of the random 
variable
– We can say a random variable is a real-valued function of the 
experimental outcome
Probability & Statistics - 3
w
Random Variables: Example 
Probability & Statistics - 4
• An experiment consists of two rolls of a 4-sided die, and the 
random variable is the maximum of the two rolls
– If the outcome of the experiment is (4, 2), the value of this random 
variable is 4
– If the outcome of the experiment is (3, 3), the value of this random 
variable is 3
– Can be one-to-one or many-to-one mapping
Main Concepts Related to Random Variables 
Probability & Statistics - 5
• For a probabilistic model of an experiment
– A random variable is a real-valued function of the outcome of the 
experiment
– A function of a random variable defines another random variable
– We can associate with each random variable certain “averages” of 
interest such the mean and the variance
– A random variable can be conditioned on an event or on another 
random variable
– There is a notion of independence of a random variable from an 
event or from another random variable X : w  x Y  gx
Discrete/Continuous Random Variables 
Probability & Statistics - 6
• A random variable is called discrete if its range (the set of 
values that it can take) is finite or at most countably infinite
• A random variable is called continuous (not discrete) if its 
range (the set of values that it can take) is uncountably
infinite
– E.g., the experiment of choosing a point a from the interval [−1, 1]
• A random variable that associates the numerical value a
2
to the 
outcome a is not discrete
finite :1,2,3,4, countably infinite :1,2,

Concepts Related to Discrete Random Variables 
Probability & Statistics - 7
• For a probabilistic model of an experiment
– A discrete random variable is a real-valued function of the outcome 
of the experiment that can take a finite or countably infinite number 
of values
– A (discrete) random variable has an associated probability mass 
function (PMF), which gives the probability of each numerical value 
that the random variable can take
– A function of a random variable defines another random variable, 
whose PMF can be obtained from the PMF of the original random 
variable
Probability Mass Functions
Probability & Statistics - 8
• A (discrete) random variable X is characterized through the 
probabilities of the values that it can take, which is captured 
by the probability mass function (PMF) of X , denoted
– The sum of probabilities of all outcomes that give rise to a value of 
X equal to x
– Upper case characters (e.g., X ) denote random variables, while 
lower case ones (e.g., x ) denote the numerical values of a random 
variable
– The probability mass function is sometimes called probability 
distribution
p x X p x X x p x X x X
 P  or X
 P 
Cumulative Distribution Function
Probability & Statistics - 9
• The probability mass function specifies the probability that 
a random variable is equal to a given value 
• A function called the cumulative distribution function (CDF) 
specifies the probability that a random variable is less than 
or equal to a given value
• The cumulative distribution function of the random variable 
X is the function F(x) = P(X ≤ x)
Calculation of the PMF
Probability & Statistics - 10
• For each possible value x of a random variable X :
1. Collect all the possible outcomes that give rise to the event
2. Add their probabilities to obtain
• An example: the PMF of the random variable X = 
maximum roll in two independent rolls of a fair 4-sided die
p x X X  x
p x X
More on Discrete Random Variables
Probability & Statistics - 11
• Let X be a discrete random variable. Then
– The probability mass function (PMF) of X is the function 
pX
(x) = P(X = x)
– The cumulative distribution function (CDF) of X is the function
– , where the sum is over all the possible 
values of X
   
       
 
  
 
t x t x
X F x p t X t
F x X x
P
P         1
x x
X p x P X x X  x's
are disjoint and form a partition of the sample space
Motivation for Expected Value (1/2)
• An Illustrative Example: Suppose that you spin the wheel 
k times, and that ki
is the number of times that the 
outcome (money) is mi
(there are n distinct outcomes, 
m1
,m2
,...,mn
)
• What is the amount of money that you “expect” to get 
“per spin”?
– The total amount received is
– The amount received per spin is
Probability & Statistics - 12 n n m k  m k  m k 1 1 2 2
k
m k m k m k M
   n n 
1 1 2 2 
Motivation for Expected Value (2/2)
– If the number of spins k is very large, and if we are willing to 
interpret probabilities as relative frequencies, it is reasonable to 
anticipate that mi
comes up a fraction of times that is roughly 
equal to pi
– Therefore, the amount received per spin can be also represented 
as
Probability & Statistics - 13 k
k
p
i
i 
Expectation
• The expected value (also called the expectation or the 
mean) of a random variable X , with PMF , is defined 
by
– Can be interpreted as the center of gravity of the PMF (Or a 
weighted average, in proportion to probabilities, of the possible 
values of X )
• The expectation is well-defined if
– That is, converges to a finite value
Probability & Statistics - 14
X  xp x X
x
E  
pX
    
x
X x p x   
x
X xp x
   
  

 
 
x X
x X
c xp x
x c p x 0
Example
• Example 2.2: Consider two independent coin tosses, each 
with a 3/4 probability of a head, and let X be the number 
of head obtained. This is a binomial random variable with 
parameters n = 2 and p = 3/4. Its PMF is
Probability & Statistics - 15
  



 
  


(3/ 4) , if 2, 2 (1/ 4) (3/ 4), if 1, (1/ 4) , if 0, 2
2
x
x
x
p x X
    2
3
16
24
4
3
2
4
3
4
1
1 2
4
1
0
2 2
  





   




     



 X  xp x   X
x
E
Moments
• The n-th moment of a random variable X is the expected 
value of a random variable Xn
(or the random variable 
Y , )
– The 1st moment of a random variable X is just its mean (or 
expectation)
Probability & Statistics - 16
E X
n
é
ë
ù
û
= x
n
x
å pX
(
x)
Y = g(X) = X
n
Xn
is termed as X raised to the power of n (or the nth power) 
or the nth power of X
Variance
• The variance of a random variable X is the expected 
value of a random variable 
– The variance is always nonnegative (why?)
– The variance provides a measure of dispersion of X around its 
mean
– The standard derivation is another measure of dispersion, which is 
defined as (a square root of variance)
• Easier to interpret, because it has the same units as X
Probability & Statistics - 17   
2 X E X
X   X
 var      
x X  p x
X X X
X
x   
 
2
2
var
E
E E
Variance in Terms of Moments Expression
• We can also express variance of a random variable X as
Probability & Statistics - 18       
2 2
var X  E X  E X
      
        
          
       
    
2 2
2 2 2
2 2
2 2
2
2
2
2
var
X X
X X X
x p x X xp x X p x
x x X X p x X x X p x
x X
x X
x X
X
x
X
x
E E
E E E
E E
E E
E
 
  





 




 




 
  
    


Mean and Variance for Discrete Random Variables
• The mean (or expected value) of X is given by
where the sum is over all possible values of X
• The variance of X is given by
• The standard deviation is the square root of the variance
Probability & Statistics - 19
      
      
2 2 2 2
2
2 2
 ,also denoted as
 , also denoted as
x p x X X
x p x X
X X
x
X X
x X X
E E
E
  
   


  
xp x X  X
x
 X
  , also denoted as E
The Probability Histogram
• When the possible values of a discrete random 
variable are evenly spaced, the probability mass 
function can be represented by a histogram, with 
rectangles centered at the possible values of the 
random variable
• The area of the rectangle centered at a value x is 
equal to P(X = x)
• Such a histogram is called a probability histogram, 
because the areas represent probabilities
Probability & Statistics - 20
Example
• The following is a probability histogram for the example 
with number of flaws in a randomly chosen piece of wire
– P(X = 0) = 0.48, P(X = 1) = 0.39, P(X = 2) = 0.12, P(X = 3) = 
0.01
• Figure 2.10
Probability - 21
Continuous Random Variables (1/2)
• Random variables with a continuous range of possible 
values are quite common
– The velocity of a vehicle
– The temperature of a day
– The blood pressure of a person
– etc.
Probability & Statistics - 22

Event {e  outcomes  f}
Sample Space
a’ b’ c’ d’ e’ f’ x
Event {c  outcomes  d}
Event {a  outcomes  b}
Continuous Random Variables (2/2)
• A random variable is continuous if its probabilities are 
given by areas under a curve
• The curve is called a probability density function (PDF) for 
the random variable. Sometimes the PDF is called the 
probability distribution
• Let X be a continuous random variable with probability 
density function f(x). Then
  1 

f x dx X
Probability & Statistics - 23
Computing Probabilities
• Let X be a continuous random variable with probability 
density function f(x). Let a and b be any two numbers, 
with a < b. Then
• In addition,
Probability & Statistics - 24
       
f xdx
a X b a X b a X b a X b
b a

P    P    P    P  
     
X a X a f xdx
X a X a f x dx
a
a 

    
    P P
P P
Cumulative Distribution Functions
Probability & Statistics - 25
• The cumulative distribution function (CDF) of a random 
variable X is denoted by and provides the 
probability 
– The CDF accumulates probability up to x
– The CDF provides a unified way to describe all kinds of 
random variables mathematically
   
 
   


   




, if is continuous
, if is discrete f t dt X
p k X
F x X x x X
k x X
X P
F x X PX  x
F x X F x X
Properties of a CDF (1/3)
Probability & Statistics - 26
• The CDF is monotonically non-decreasing
• The CDF tends to 0 as x  – , and to 1 as x  
• If X is discrete, then is a piecewise constant 
function of x
F x X     i j X i X j if x  x , then F x  F x F x X F x X
Properties of a CDF (2/3)
Probability & Statistics - 27
• If X is continuous, then is a continuous function of 
x
F x X
  for a x b
b a
f x X  


, 1    
b a
x a
dt
b a
F X x f t dt
xa
xa X X 



     1
   
 
 
 
 
2
2
2
2
b a
x a
dt
b a
t a F X x f t dt
xa
xa X X 




      
   
 
 
 
b a b a
b a
f b
b a
c
x a
c
c x a dx
f x c x a for a x b
X
b
a
b
a X 


  
       
   

2 2
2
1
2
( ), 
2
2
2
Properties of a CDF (3/3)
Probability & Statistics - 28
• If X is discrete and takes integer values, the PMF and the CDF 
can be obtained from each other by summing or differencing 
• If X is continuous, the PDF and the CDF can be obtained from 
each other by integration or differentiation
– The second equality is valid for those x for which the CDF has a 
derivative (or at which PDF is continuous)      
     1    1
,        
    p k X k X k F k F k
F k X k p i
X X X
k
i
X X
P P
P
     
 
 
dx
dF x
f x
F x X x f t dt
X
X
x X X 
    P , a X b f xdx
b
a
P     X F b F a 
X  X
is equivalent to ?
Example
Probability & Statistics - 29
• Example 2.41: A hole is drilled in a sheet-metal component, and 
then a shaft is inserted through the hole. The shaft clearance is 
equal to the difference between the radius of the hole and the 
radius of the shaft. Let the random variable X denote the 
clearance, in millimeters. The probability density function of X is 
1. Components with clearances larger than 0.8 mm must be scraped. 
What proportion of components are scrapped?
2. Find the cumulative distribution function F(x).
   


   

0 otherwise
1.25 1 0 1 4
x x
f x
Answer
Probability & Statistics - 30
1. Figure 2.13: Graph of the PDF of X
   
 
0.0819
5
1.25
1.25 1
0.8
1
0.8
5
0.8
4
0.8






  
 
 



x
x
x dx
X f x dx P X
Probability & Statistics - 31
2. 
   
0
0 





 dt
F x f t dt
x
x
Figure: Plot of F(x)
If x  0
If 0 < x < 1
   
   
 





  





   
  
 

 
 




5
1.25
5
0 1.25
0 1.25 1
5
0
5
0
4
0
0
0
x
x
t
t dt t dt
f t dt f t dt F x f t dt
x
x
x
x
If x  1
   
     
 
1
0 1 0
0
5
0 1.25
0 1.25 1 0
1
0
5
1
1
0
4
0
1
1
0
0

  
 




   
   
  

  
  




t
t dt t dt dt
f t dt f t dt f t dt F x f t dt
x
x
x
 





  




 


 1, 1 
, 0 1 5
1.25
 0, 0 5
x
x
x
x
x
F x
Another Example on Continuous RV
Probability & Statistics - 32
• Suppose that the error in the reaction temperature, in C (實驗反應溫度), 
for a controlled laboratory experiment is a continuous random variable X 
having the probability density function
• Problems: 
– a. Find .
– b. Find the F(x), and use it to evaluate 
– Solution:
• a. 
• b.
P0  X 1 P0  X 1
  


   

0, otherwise, 
, if 1 2, 3
2
x
x
f x X
 
       
1
0
1
0
2 3
1
0 9
1
3 9
(0 1) x dx x
x f x dx P X       9
1
9
3
1
3 
    
 
t x F x X x f t dt
x
x
X P X 9
1
9
1
9
2 P(0  x 1)  F(1)  F(0)   
 





  

 

1, 2. 
, 1 2, 9
1
0, 1 3
x
x
x
x
F x X
Exercise #13
Probability & Statistics - 33
• Exercise #13: Resistor(電阻器) labeled 100  have true 
resistances that are between 80  and 120 . Let X be the mass 
of a randomly chosen resistor. The probability density function of 
X is given by
1. What proportion of resistors have resistances less than 90 ?
Ans: 1/16
2. Find the cumulative distribution function F(x) of the resistances.
Ans:
  


  


0 otherwise
 80 120 800
80
x
x
f x
 





   


 1, 120
4, 80 120 1600 10
 0, 80 2
x
x
x x
x
F x
Exercise #18
Probability & Statistics - 36
• Exercise #18: The lifetime, in years, of a certain type of pump is a 
random variable with probability density function
1. What is the probability that a pump lasts more than two years?
Ans: 1/16
2. Find the cumulative distribution function F(x) of the lifetime.
Ans: 
    






 
0 0
 0 2
64
5
x
x
f x x
    









 0, 0
, 0
2
16 1 4
x
x F x x
More on Continuous Random Variables
• Let X be a continuous random variable with probability 
density function f(x). The cumulative distribution function
(CDF) of X is the function
• The mean (or expected value) of X is given by
• The variance of X is given by
Probability & Statistics - 39
      
      
2 2 2 2
2 2 2
x ,also denoted as
x , also denoted as
x f x d X X
x f x d X
X
X X X
E E
E
  
  




 
  
xf xdx X 
- X
 , also denoted as E 

 
Fx X x f tdt,
x 
 P  
Example
Probability & Statistics - 40
• Example 2.44: Refer to Example 2.41. Find the mean clearance 
and the variance of the clearance.
1. The mean is given by
2. Having computed X= 0.4167, we can now compute by using 
the equation: 
   


   

0 otherwise
1.25 1 0 1 4
x x
f x
2  X   x
2 2 2
X d X   x f x   

 
    
 
0.0645
0.4167
3 7
1.25
1.25 1 0.4167
x
2
1
0
3 7
1
0
2 4 2
2 2 2

 




  
  
 


 x x
x x dx  X x f x d  X
 
  
0.4167
2 6
1.25
1.25 1
x
1
0
2 6
1
0
4 





  
 



 x x
x x dx
 X xf x d
Exercise #13
Probability & Statistics - 41
• Exercise #13: Find the mean resistance and the standard 
deviation of the resistances.
1. The mean is given by
2. Having computed X= 106.67, we can now compute : 
2  X
  X
 
9
800
3
320
800 10 3200 30
3
320
800
80
x
2
120
80
4 3
120
80
3 2
120
80
2
2
2 2 2
 




  




   




  






 




 

 



 x x dx x x dx x
x  X x f x d  X
 
106.67
3
320
2400
120
800
80
x
120
80
3 2
120
80   




 






 




x x dx x
x  X xf x d
  


  


0 otherwise
 80 120 800
80
x
x
f x
9.428
9
2 800
 X
  X
 
Median and Percentiles
Probability & Statistics - 42
• Let X be a continuous random variable with probability mass 
function f(x) and cumulative distribution function F(x)
– The median of X is the point xm that solves the equation
– If p is any number between 0 and 100, the pth percentile is the 
point xp
that solves the equation
– The median is the 50th percentile
          0.5 
F x X x f x dx
xm
m P m Fx  X x  f xdx p /100 p x
p
  p
  
P
Exercise #18
Probability & Statistics - 43
• Exercise #18: 
1. What is the probability that a pump last between two and four 
years?
2. Find the mean lifetime.
3. Find the variance of the lifetimes.
    






 
0 0
 0 2
64
5
x
x
f x x
 
   
2 / 3
2
1
3
1
64
64 2
64 2
2
64
2
3 4
2
4 5
2
5 0
5
 




   
   



      
  
u u
du u u du
u
dx u
x
x  X
 
   
 
9
8
4 / 9
3
4
2
1
64
64 4 4 4 / 9
2 / 3
64 2
x
2
64
2
2 3 4
2
3 4 5
2
2
5
2
2
0
5
2 2
  




    
   
  




       




u u u
u u u du
du
u
u
d
x
x  X  X
Exercise #18
Probability & Statistics - 44
• Exercise #18: 
1. What is the probability that a pump last between two and four 
years?
2. Find the mean lifetime. (next)
3. Find the variance of the lifetimes. (next)
4. Find the median lifetime. The median xm sloves F(xm) = 0.5. 
Therefore , so xm = 0.3784
5. Find the 60th percentile of the lifetimes. The 60th percentile x60
sloves F(x60) = 0.6. Therefore , so x60 = 0.5149
    






 
0 0
 0 2
64
5
x
x
f x x
 
    1296
65
2
16
2
64 2 4
4
2
4
4
2
5


 

    x x
P X
  0.5
2
16 1 4



mx
  0.6
2
16 1 4
60



x
    









 0, 0
, 0
2
16 1 4
x
x F x x


## 【Prob_Stat_05-Probability(II).pdf】

Probability – II
Yi-Fen Liu
Department of IECS, FCU
References:
- Dimitri P. Bertsekas and John N. Tsitsiklis, Introduction to Probability, Chapter 2
- Walpole R. E., Myers R. H., Myers S. L. and Ye K., Probability & Statistics for Engineers & Scientists, Ch. 3
- William Navidi, Statistics for Engineers and Scientists, Ch. 2.4
- Slides are credited from Prof. Berlin Chen, NTNU. 
LINEAR FUNCTIONS OF RANDOM 
VARIABLES
Functions of Random Variables (1/2)
Probability & Statistics - 3
• Given a random variable X , other random variables can be 
generated by applying various transformations on X 
– Linear
– Nonlinear
Y = g(
x) = aX +b
Daily temperature
in degree Fahrenheit
Daily temperature
in degree Celsius
Y = g(
x) = logX
Sample Space
Ω x
pX
(x) pY
(y)
y
one-to-one
or many to one
one-to-one
or many to one
Functions of Random Variables (2/2)
Probability & Statistics - 4
• That is, if Y is an function of X , then Y is also a 
random variable
– If X is discrete with PMF , then Y is also discrete and its 
PMF can be calculated using 
   
     
x g x y
Y X p y p x
(Y = g(X))
pX
(x)
Functions of Random Variables: An Example
Probability & Statistics - 5
Expectations for Functions of Random Variables
• Let X be a random variable with PMF , and let 
be a function of X . Then, the expected value of the 
random variable is given by
• To verify the above rule
– Let , and therefore 
Probability & Statistics - 6
E g(X)
é
ë
ù
û
= E[Y ] = y
y
å pY
(
y)
= y
y
å pX
( x) =
{x g(x)=y}
å g( x) pX
( x)
{x g(x)=y}
å
y
å
= g(x)
x
å pX
(x)
g(X)
g(X)
Y = g(X)    
     
x g x y
Y X p y p x
y1
x1
x2
x3
x4
x5
x6
x7
y2
y3
y4
E g(X)
é
ë
ù
û
= g(
x) pX
(
x)
x
å
?
pX
Example
• Example 2.3: For the a random variable X with PMF 
Probability & Statistics - 7
           9
60
9
1
var
4
4
2 2 2
       
x X
x
X E X E X x E X p x x
pX
(x) =
1/ 9, if x is an integer in the range [-4, 4],
0, otherwise
ì
í
ï
îï     0
9
1
4
4
    
x X
x
E X xp x x
  



 
  
0, otherwise 1/ 9, if 0 2 / 9, if 1,4,9,16
Z z
z
p z
  
2 2 Or, let Z  X E X  X
      9
60
var X  Z  zpZ z 
z
E
Discrete Uniform Random Variable
Mean and Variance of Linear Functions of 
Random Variables (1/2)
• Let X be a random variable and let 
where a and b are given scalars
Then, 
• If is a linear function of X , then
Probability & Statistics - 8
Y = aX +b
E[Y ] = aE[X] + b
var(Y ) = a
2
var(X)
E g(X)
é
ë
ù
û
= g(E[X])
a linear function of X
g(X)
How to verify it ?
Mean and Variance of Linear Functions of 
Random Variables (2/2)
Probability & Statistics - 9
E[Y ] = (ax + b) pX
(
x)
x
å = a xpX
(
x)
x
å
é
ë
ê
ù
û
ú+ b pX
(
x)
x
å
é
ë
ê
ù
û
ú= aE[X] + b
1
      
     
     a X  a x X p x ax b a X b p x Y ax b aX b p x
X
x
x X
x X
var
var
2
2 2
2
2

 
   
    


E
E
E
var(X)
Linear Functions of Random Variables
• If X is a random variable, and a and b are constants, 
then 
Probability & Statistics - 10
aX b X
aX b X
aX b X
a
a
a b
 
 
 


 



2 2 2
More Linear Functions
• If X and Y are random variables, and a and b are 
constants, then
• More generally, if X1
, …, Xn
are random variables and c1
, …, 
cn
are constants, then the mean of the linear combination 
c1 X1
, …, cn Xn
is given by
Probability & Statistics - 12 aX bY  aX  bY  a X  bY
nXn X X n Xn c X c X c   
 c   c   c  1 1 2 2 1 1 2 2
Variance Properties
• If X and Y are independent random variables with 
variances , then the variance of the sum X + Y is
• The variance of the difference X – Y is
Probability & Statistics - 13
2 2 2  X Y
 X  Y
2 2 2  X Y
 X  Y
More Variance Properties
• If X1
, …, Xn
are independent random variables, then the 
variance of the sum X1+ …+ Xn
is given by
• If X1, …, Xn are independent random variables and c1
, …, cn
are constants, then the variance of the linear combination 
c1 X1+ …+ cn Xn
is given by
Probability & Statistics - 14
2 2 2 2
X1 X2 Xn X1 X2 Xn
  
  
2 2 2 2
2
2 2
1
2
1 1 2 2 nXn X1 X2 n Xn c X c X c   
 c   c   c 
Independence and Simple Random Samples
• Definition: If is a simple random sample, then 
may be treated as independent random 
variables, all from the same population
– Phrased another way, are independent, and 
identically distributed (i.i.d.)
– Sample Mean:
– Sample Variance:
Probability & Statistics - 15 X X Xn
, , , 1 2 
X X Xn
, , , 1 2 
X X Xn
, , , 1 2   
 


n
i
Xi X
n
s
1
2 2
1
1  
n
i
Xi
n
X
1
1  
  
n
i
Xi X
n
s
1
2 2 1
Properties of (1/4)
• If is a simple random sample from a 
population with mean μ and variance σ
2
, then the sample 
mean is a random variable with
The standard deviation of is
Probability & Statistics - 16    X
X X Xn
, , , 1 2 
X
X
X
n
X
2
2 
 
mean of sample mean
variance of sample mean
n
X

 
Properties of (2/4)
Probability & Statistics - 17   X X Xn
n
X  1  2 
1
X
( 37.8) X  x1 
parameters (, 2
) 
Population X
37 40 35 … 39
X1 X2 X3 Xn
sample mean
simple random sample mean of size n
41 38 42 … 38.5 sample mean
( 40.2)
simple random sample mean of size n
X  x2 
37.5 38 42 … 40.2 sample mean
( 38.6)
simple random sample mean of size n
X  x3 
sample mean can be viewed 
as a random variable
with values
X can be represented as X
x1
, x2
,, xk
,
X1
, X2
,…, Xn are i.i.d. 
and follow the same distribution X
 
n
n n n
n n n
n
n X X X
X X X
n X
2
2
2
2
2
2
2
2
2
2
2
2
2
2
1
2
1 1 1
1 1 1
1 2
1 2

  
  
 

   
   

   


Properties of (3/4)
Probability & Statistics - 18 X
 

  
  
 

   
   

  
n n n
n n n
n
n X X X
X X X
n X1 1 1
1 1 1
1 2
1 2 1 


X1
, X2
,..., Xn are i.i.d.
and follow the same distribution X with mean 
X1
, X2
,..., Xn are independent
X1
, X2
,..., Xn are identically distributed
(follow the same distribution X with variance
2
)
Properties of (4/4)
Probability & Statistics - 19 X
mean of sample mean (equal to population mean )
sample mean 
The spread of sample mean is determined by the variance of sample 
mean (equal to where is the population variance)

i X  x
sample mean 
j X  x
X 
2  X n
2  2 
INDEPENDENCE – BASICS
Independence of a Random Variable from an Event
• A random variable X is independent of an event A if 
– Require two events and A be independent for all x
• If a random variable X is independent of an event A 
and
Probability & Statistics - 21 P(A) > 0
{X = x}
P(X = x and A) = P(X = x)P(A), for all x
pX|A
( x) =
P(X = x and A)
P(A)
=
P(X = x)P(A)
P(A)
= P(X = x)
= pX
(x), for all x
Example
• Example 2.19. Consider two independent tosses of a fair coin.
– Let random variable X be the number of heads
– Let random variable Y be 0 if the first toss is head, and 1 if the first 
toss is tail
– Let A be the event that the number of head is even
• Possible outcomes (T,T), (T,H), (H,T), (H,H)
Probability & Statistics - 22
  



 



1/ 4, if 2
1/ 2, if 1
1/ 4, if 0
x
x
x
p x X   





1/ 2, if y 1
1/ 2, if y 0
p y Y PA 1/ 2
pY A
(y) =
P(Y = y and A)
P(A)
=
1/ 2, if y = 0
1/ 2, if y =1
ì
í
ï
îï
pX A
(x) =
1/ 2, if x = 0
0, if x =1
1/ 2, if x = 2
ì
í
ï
î
ï p x p x X and Aare not independent! X A  X 
p y p y Y and Aare independent! Y A

Y 
The Prove on Variance Properties
• If X and Y are independent random variables, then
– As shown by the following calculation
Probability & Statistics - 23 var[X +Y] = var[X] +var[Y]
      
             
                 
         
     
         
 X   X    Y   Y   X  Y  X Y X Y
x p x y y p x y xyp x y X X Y Y
x y p x y X Y X X Y Y X Y X Y X Y X Y X Y X Y X Y
x y X Y
x y X Y
x y X Y
x y X Y
var var
 2
, , 2 ,
 2
, 2 2
2
var
2 2 2 2
2 2
,
,
,
, 2
,
, 2
2 2
,
, 2
2 2
2
     
  






 





 




 
   
    




  
      
       

E E E E
E E E E
E E E E
E E E E E E
E E E E E
E E
?
2  X Y

2 2 2  X Y
 X  Y
is equal to


## 【Prob_Stat_06-Probability(III).pdf】

Probability – III
Yi-Fen Liu
Department of IECS, FCU
References:
- Dimitri P. Bertsekas and John N. Tsitsiklis, Introduction to Probability, Chapter 2
- Walpole R. E., Myers R. H., Myers S. L. and Ye K., Probability & Statistics for Engineers & Scientists, Ch. 4
- William Navidi, Statistics for Engineers and Scientists, Ch. 2.6
- Slides are credited from Prof. Berlin Chen, NTNU. 
JOINT DISTRIBUTED RANDOM 
VARIABLES
Motivation
• Given an experiment, e.g., a medical diagnosis
– The results of blood test is modeled as numerical values of a 
random variable X
– The results of magnetic resonance imaging (MRI, 核磁共振攝影) 
is also modeled as numerical values of a random variable Y
We would like to consider probabilities of events involving 
simultaneously the numerical values of these two variables and to 
investigate their mutual couplings
Probability & Statistics - 3
PX  xY  y?
Joint Discrete Random Variables
• If X and Y are jointly discrete random variables:
– The joint probability mass function of X and Y is the function
– The marginal probability mass functions of X and Y can be 
obtained from the joint probability mass function as follows:
where the sums are taken over all the possible values of Y and of 
X, respectively
– The joint probability mass function has the property that 
where the sum is taken over all the possible values of X and Y
Probability & Statistics - 4
p x y X x Y y X ,Y
,
 P 
,

   
x y
X Y p ,
x, y 1
                   
y x
X X Y Y X Y p x X x p x, y , p y Y y p x, y P
,
P
,
Tabular Method
• Tabular Method: Given the joint PMF of random variables X
and Y is specified in a two-dimensional table, the marginal 
PMF of X and Y at a given value is obtained by adding the 
table entries along a corresponding column or row, respectively
Probability & Statistics - 5
Example
Probability & Statistics - 6
• Example 2.52 , 2.53:
1. Find the probability that a CD cover has a length of 129 mm.
2. Find the probability that a CD cover has a width of 16 mm.
     
0.12 0.08 0.20
129 129, 15 129, 16
  
P X   P X  Y   P X  Y 
     
 
0.08 0.28 0.04 0.40
131, 16
16 129, 16 130, 16    
  
       X Y
Y X Y X Y
P
P P P
Example (1/2)
Probability & Statistics - 7
• Two ballpoint are selected at random from a box that contain 3 blue pens, 
2 red pens, and 3 green pens. If X is the number of blue pens selected and 
Y is the number of red pens selected, find (a) the joint probability mass 
function (b) , where A is the region {(x,y) | x 
+ y  1}
– Solution:
(a)
(b)
   
     
14
9
28
9
14
3
28
3
0,0 0,1 1,0
, 1
, , ,
,    
  
  
X Y X Y X Y
X Y
p p p
p x y P X Y
  , for 0,1,2; 0,1,2; and 0 2
2
8
2
3 2 3
,
,     











  











  x y x y
x y x y
p x y X Y
p x y X Y
,
,  x y A PX ,Y { , }
Example (2/2)
Probability & Statistics - 8
• Show that the column and row totals of Table give the marginal 
distribution of X alone and of Y alone.
– Solution:
       
       
        28
3
0 0
28
3
2 2,0 2,1 2,2
28
15 0
14
3
28
9
1 1,0 1,1 1,2
14
5
28
1
14
3
28
3
0 0,0 0,1 0,2
, , ,
, , ,
, , ,
   
   
   
   
   
   
X Y X Y X Y
X Y X Y X Y
X Y X Y X Y X p p p X p p p X p p p P
P
P
   
  


  
 
y X Y
y X p x y
X x Y y
p x X x
, ( , )
, P
P
       
       
        28
1
0 0
28
1
2 0,2 1,2 2,2
14
6
0
14
3
14
3
1 0,1 1,1 2,1
28
15
28
3
28
9
28
3
0 0,0 1,0 2,0
, , ,
, , ,
, , ,
   
   
   
   
   
   
X Y X Y X Y
X Y X Y X Y
X Y X Y X Y Y p p p Y p p p Y p p p P
P
P
Joint Continuous Random Variables
• If X and Y are jointly continuous random variables, with 
joint probability density function fX,Y(x,y), and a < b, c < d, 
then
• The joint probability density function has the property 
that
Probability & Statistics - 9
 
  



f X ,Y x, y dydx 1
   
      
b
a
d
c
a X b,c Y d f X Y x, y dydx P
,
Marginals of X and Y
• If X and Y are jointly continuous with joint probability 
density function fX,Y(x,y), then the marginal probability 
density functions of X and Y are given, respectively, by
– Such a process is called “marginalization”
Probability & Statistics - 10
   
   




 

f y f x y dx
f x f x y dy
Y X Y
X X Y
,
,
,
,
Example
Probability & Statistics - 11
• Example 2.54: Assume that for a certain type of washer, both the 
thickness and the hole diameter vary from item to item. Let X 
denote the thickness in millimeters and let Y denote the hole 
diameter in millimeters, for a randomly chosen washer. Assume 
the joint PDF of X and Y is given by
Find the probability that a randomly chosen washer has a thickness 
between 1.0 and 1.5 mm, and a hole diameter between 4.5 and 5 mm.
 
 



     

0 otherwise 
 if 1 2 and 4 5 6
1
,
, x y x y
f x y X Y
Answer
Probability & Statistics - 12
• Example 2.54:
We integrate the joint probability density 
function over the indicated region:
   
4
1
48
19
12
6 12
6
1
1 1.5, 4.5 5
1.5
1
1.5
1
5
4.5
2
1.5
1
5
4.5






  





  
     


 
dx x dx xy y P X Y x y dydx
What are the marginal PDFs of X and Y ?
Probability & Statistics - 13
• Example 2.54:
   
 
 for 1 2
2
9
6
1
6
1
, 5
4   




  
 



 x x
x y dy
f x f x y dy X    
 
 for 4 5
2
3
6
1
6
1
, 2
1   




  
 



 y y
x y dx
f y f x y dx Y
 
 



     

0 otherwise 
 if 1 2 and 4 5 6
1
,
, x y x y
f x y X Y
More than Two Random Variables
• If the random variables X1
, …, Xn
are jointly discrete, the 
joint probability mass function is
• If the random variables X1
, …, Xn
are jointly continuous, 
they have a joint probability density function f(x1
, x2
,…, xn
), 
where 
for any constants a1 ≤ b1
, …, an ≤ bn
Probability & Statistics - 14
   
      
n
n
b
a
b
a
n n n n dx dxn a X b a X b f x x
1
1
1 1 1 1 1 P ,,  ,, 
    n n n p x , , x  X  x , , X  x 1  P 1 1 
Means of Functions of Random Variables
• Let X be a random variable, and let h(X) be a function of X. 
Then:
– If X is a discrete with probability mass function p(x), then mean of 
h(X) is given by
where the sum is taken over all the possible values of X
– If X is continuous with probability density function f(x), the mean 
of h(x) is given by
Probability & Statistics - 15
  hxpx hX 
x
h X
  ,also denoted as E
  hxf xdx hX  h X
 ,also denoted as E 

 
Functions of Joint Random Variables
• If X and Y are jointly distributed random variables, and 
h(X,Y) is a function of X and Y, then
– If X and Y are jointly discrete with joint probability mass function 
p(x,y), 
where the sum is taken over all possible values of X and Y
– If X and Y are jointly continuous with joint probability density 
function f(x,y),
Probability & Statistics - 16
       
x y
h X Y h x, y p x, y  ,
     
  



 h x y f x y dxdy h X Y
, ,  ,
Example
• Given the random variables X and Y whose joint is given in 
the following figure, and a new random variable Z is defined 
by Z = X + 2Y, calculated
– Method 1: (using linearity)
– Method 2:
Probability & Statistics - 17   20
51
20
3
4
20
8
3
20
6
2
20
3 E X 1       
E[Z]
 
7.55
20
1
12
20
1
 11
20
2
10
20
3
9
20
3
8
20
4
 7
20
2
6
20
2
5
20
1
4
20
1
3
    
        E Z            
   
  
x y x y z
Z X Y p z p x y
, 2
,
,
  20
50
20
3
4
20
7
3
20
7
2
20
3 E Y 1       
      7.55
20
151
20
50 2
20
51 E Z  E X  2E Y    
pZ (3) =
1
20
, pZ (4) =
1
20
, pZ (5) =
2
20
, pZ (6) =
2
20
pZ (7) =
4
20
, pZ (8) =
3
20
, pZ (9) =
3
20
, pZ (10) =
2
20
pZ (11) =
1
20
, pZ (12) =
1
20
Example
Probability & Statistics - 18
• Example 2.56: The article “Performance Comparison of Two Location 
Based Routing Protocols for Ad Hoc Networks” (T. Camp, J. Boleng, et al., 
Proceedings of the Twenty-first Annual Joint Conference of IEEE 
Computer and Communications Societies 2002:1678-1687) describes a 
model for the movement of a mobile computer. Assume that a mobile 
computer moves within the region A bounded by the x axis, the line x =1, 
and the line y = x in such a way that if (X,Y) denotes the position of the 
computer at a given time, the joint density of X and Y is given by 
Find P(X>0.5 and Y<0.5).
  





 0 ( ) 8 ( ) 
,
, x,y A
xy x,y A
f x y X Y
Answer
Probability & Statistics - 19
• Example 2.56:
We integrate the joint probability density 
function over the indicated region:
 
 
0.375
4
0.5 and 0.5 8
1
0.5
1
0.5
0.5
0
2
1
0.5
0.5
0



  


 

 xdx
xy dx
X Y xydydx
y
y P
Answer
Probability & Statistics - 20
• Example 2.56:
Find the marginal density of X.
To compute fX
(x), the marginal density of 
X, we fix x and integrate the joint density 
along the vertical line through x, as 
shown in Figure. The integration is with 
respect to y, and the limitation are y = 0
to y = x.  
4 for 0 1
4
8
3
0
2
0   



 
x x
xy
f x xydy
y x
y
x X
Answer
Probability & Statistics - 21
• Example 2.56:
Find the marginal density of Y.
To compute fY
(y), the marginal density of 
Y, we fix y and integrate the joint density 
along the horizontal line through y, as 
shown in Figure. The integration is with 
respect to x, and the limitation are x = y
to x = 1.  
4 4 for 0 1
4
8
3
1
2
1    



 
y y y
x y
f y xydx
x
x y
y Y
Conditioning
• Recall that conditional probability provides us with a way 
to reason about the outcome of an experiment, based on 
partial information
• In the same spirit, latter, we can define conditional 
distribution function (a PMF or a PDF), given the 
occurrence of a certain event or given the value of 
another random variable
Probability & Statistics - 22
Conditioning a Random Variable on an Event (1/2)
• The conditional PMF of a random variable X , 
conditioned on a particular event A with , is 
defined by (where X and A are associated with the same experiment) 
• Normalization Property
– Note that the events are disjoint for different 
values of X , their union is A
Probability & Statistics - 23
   
  
A
X x A
pX A x X x A
P
P
P
 
  
Total probability theorem
P(A) > 0
PX  x A
       
x
P A P X x A
 
  
 
  
 
 
   1
 

 
 

  A
A
A
X x A
A
X x A
p x
x
x x
X A P
P
P
P
P
P
Conditioning a Random Variable on an Event (2/2)
• A graphical illustration
Probability & Statistics - 24
 
X x A
p x X A
that give rise to and belong to the conditioning event 
is obtained by adding the probabilities of the outcomes

Example
• Example 2.12. Let X be the roll of a fair six-sides die and A
be the event that the roll is an even number
Probability & Statistics - 25
   
 
 


 


 
0, otherwise 1/ 3, if 2,4,6
is even
and is even
roll is even
xX
X x X
p x X x X A P
P
P
Discrete Conditional Distributions (1/2)
• Let X and Y be jointly discrete random variables, with 
joint probability density function pX,Y(x,y), let pX
(x) denote 
the marginal probability mass function of X and let x be 
any number for which pX
(x) > 0.
– The conditional probability mass function of Y given X = x is
– Note that for any particular values of x and y, the value of pY|X
(y|x) 
is just the conditional probability P(Y=y|X=x)
Probability & Statistics - 26
   
 
 
 
p x
p x y
X x
X x Y y p y x Y y X x
X
X Y
Y X
,
,
, 

 
    P
P
P
Discrete Conditional Distributions (2/2)
• The conditional PMF can also be used to calculate the 
marginal PMFs
• Visualization of the conditional PMF 
Probability & Statistics - 27
pX Y            
y
Y X Y
y
X X Y p x p x, y p y p x y ,
 
 
 
 
   

x X Y X Y
Y X Y X Y p x y
p x y
p y
p x y
p x y
,
,
,
,
,
,
Continuing Example 2.52, 2.53
Probability & Statistics - 28
• Compute the conditional probability mass 
function .
The possible values for Y are y = 15 and y = 16.
   
 
 
0.60
0.70
0.42
130
15, 130
| 15 |130 15 | 130  

 

   X
Y X
pY X Y X
P
P
P
p y130 Y X
   
0.40
1 0.60
| 16 |130 1 | 15 |130 
 
pY X   pY X
Continuous Conditional Distributions
• Let X and Y be jointly continuous random variables, 
with joint probability density function fX,Y(x,y), let fX
(x) 
denote the marginal density function of X and let x be any 
number for which fX
(x) > 0.
– The conditional probability function of Y given X = x is
Probability & Statistics - 29
 
 
f x
f x y
f y x
X
X Y
Y X
,
, 
Continuing Example 2.54
Probability & Statistics - 30
• Marginal PDFs
• Example 2.61:
1. Find the conditional probability density function of Y given X =1.2.
2. Find the probability that the hole diameter is less than or equal to 
4.8 mm given that the thickness is 1.2 mm.
   4.5 for 1 2
6
1
f X x  x   x     1.5 for 4 5
6
1
fY y  y   y 
 
 



     

0 otherwise 
 if 1 2 and 4 5 6
1
,
, x y x y
f x y X Y
Answer
Probability & Statistics - 31
• Marginal PDFs
1. 2.
   4.5 for 1 2
6
1
f X x  x   x     1.5 for 4 5
6
1
fY y  y   y 
 
 



     

0 otherwise 
 if 1 2 and 4 5 6
1
,
, x y x y
f x y X Y
 
 
 
 
 
 



  






  




0 otherwise
 if 4 5
5.7
1.2
0 otherwise 
 if 4 5
1/ 6 1.2 4.5
1/ 6 1.2
1.2
1.2,
| |1.2
y
y
y
y
f
f y
f y
X
Y X    
0.786
5.7
1.2
4.8 | 1.2 |1.2
4.8
4
4.8
| 


  

 dy y
Y X f y dy P Y X
Conditional Expectation
• Expectation is another term for mean 
• A conditional expectation is an expectation, or mean, 
calculated using the conditional probability mass function 
or conditional probability density function
• The conditional expectation of Y given X = x is denoted by 
E(Y|X = x) or μY|X=x
Probability & Statistics - 32
More on Conditional Expectation
• Let X and Y be two random variables associated with 
the same experiment.
– The conditional expectation of X given event A
with , is defined by
• For a function , it is given by
Probability & Statistics - 33
Eé
ë
g(X) Aù
û
= g(x) pX A
(x)
x
å
P(A) > 0
g(X)
Eé
ë
X Aù
û
= xpX A
(x)
x
å    


X A  xf x dx E X A
       


g X A  g x f x dx E X A
Total Expectation Theorem (1/2)
• The conditional expectation of X given a value y of Y 
is defined by
– We have
• Let be disjoint events that form a partition of 
sample space, and assume that , for all i. 
Then,
Probability & Statistics - 34
      
y
Y E X p y E[X Y y]
P(Ai
) > 0 A An
, , 1 
     
x
X Y E X Y y xp x y
E[X] = P(Ai
)
i=1
n
å E X Ai
é
ë
ù
û
X Y y xf x ydx  X Y


E  
     


X  X Y  y f y dy E E Y
        i
n
i
E g X P Ai E g X A
 
1
Total Expectation Theorem (2/2)
• Let be disjoint events that form a partition of the 
sample space, and for any event B with , for 
all i. Then,
• Verification of total expectation theorem
Probability & Statistics - 35 PAi  B  0 A An
, , 1 
Eé
ë
X Bù
û
= P(Ai
B)
i=1
n
å Eé
ë
X Ai
ÇBù
û
     
   
   
p y X Y y
p y xp x y
x p y p x y
X xp x x p x y
y Y
y x Y X Y
x y Y X Y
x y X Y
x X
 


  
 
 
  
E
E ,
,
Example (1/4)
Probability & Statistics - 36
• Chunk will go shopping for probability books for K hours. Here, K is a 
random variable and is equally likely to be 1, 2 ,3, or 4. The number of 
books N that he buys is random and depends on how long he shops. We 
are told that 
a. Find the join PMF of K and N.
b. Find the marginal PMF of N.
c. Find the conditional PMF of K given that N = 2.
d. We are now told that he bought at least 2 but no more than 3 books. 
Find the conditional mean and variance of K, given this piece of 
information.
  , for 1, , . 1
n k
k p n k N K
  
Example
Probability & Statistics - 37
• Solutions
– a.
 


 

0, otherwise 1/ k, for n 1, , k;
p n k N K    

 

0, otherwise 1/ 4, for k 1,,4;
p k K
  

  

0, otherwise 1/ 4( ), if 1,2,3,4 and 1,..., ;
,
k k n k
p n k N,K  ,      to arrive at the following joint PMF:
, p n k p n k p k N K N K K
 
Example
Probability & Statistics - 38
• Solutions
– b.
– c.
 



  
  
   
    

0, otherwise
1/16 3/ 48, 4; 1/12 1/16 7 / 48, 3; 1/ 8 1/12 1/16 13/ 48, 2; 1/ 4 1/ 8 1/12 1/16 25/ 48, 1; n
n
n
n
p n N
       
k k n
N N K k p n p n k
4
, 4
1
,
 
 
 




 


 
0, otherwise
3/13, 4; 4 /13, 3; 6 /13, 2; 2
2, 2
, k
k
k
p
p k
p k
N
N K
K N
Example
Probability & Statistics - 39
• Solutions
– d. Let A be the event 2  N  3. 
We first find the conditional PMF of K given A.
 




  
 

 
0, otherwise 
, 4; 16
1
16
1
, 3; 12
1
12
1
, 2; 8
1
, k
k
k
P K k A
 
 
A
K k A
p k K A P
P 
,
       12
5 P A  pN 2  pN 3 
 




 



0, otherwise 
, 4; 10
3
, 3; 5
2
, 2; 10
3
k
k
k
p k K A        3
k
K A E K A k p k      
      5
3
4 3
10
3
3 3
5
2
2 3
10
3
var
2 2 2
2         K A  E K E K A A
MORE ON INDEPENDENCE
Two Independent Random Variables (1/2)
• Two random variables X and Y are independent if 
or
• If a random variable X is independent of an random 
variable Y 
Probability & Statistics - 41 P(X = x and Y = y) = P(X = x)P(Y = y), for all x, y
 
 
 
   
 
 , for all with   0 all
,
,
|
p x y p y x p y
p x p y
p y
p x y
p x y
X
Y X Y
Y X Y X Y  


pX,Y
(
x, y) = pX
(
x) pY
(
y), for all x, y
pX Y
(x y
)
= pX
(
x), for all y with pY
(
y) > 0 all x
Two Independent Random Variables (2/2)
• Random variables X and Y are said to be conditionally
independent, given a positive probability event A , if
– Or equivalently,
• Note here that, as in the case of events, conditional 
independence may not imply unconditional independence 
and vice versa 
Probability & Statistics - 42
pX,Y A
(
x, y) = pX A
(
x) pY A
(
y), for all x, y
pX Y,A
(x y
)
= pX A
(
x), for all y with pY A
(
y) > 0 and all x
Example (1/2)
• Example 2.15. Example illustrating that conditional 
independence may not imply unconditional independence
– For the PMF shown, the random variables X and Y are not 
independent
• To show X and Y are not independent, we only have to find 
a pair of values of X and Y that
– For example, X and Y are not
independent
Probability & Statistics - 43 ( x, y) p x y p x X Y  X     20
3
11  0  X 1 
X Y p p
Example (2/2)
• To show X and Y are not dependent, we only have to 
find all pair of values of X and Y that
– For example, X and Y are independent, conditioned on the 
event 
Probability & Statistics - 44 (
x, y) A  X  2,Y  3
pX Y,A (1 3) =
2 / 20
6 / 20
=
1
3
,    
 
Y y A
X x Y y A
A p x y X Y A
 
   
 
P
P
P , , 20
9
pX Y,A (1 4) =
1/ 20
3 / 20
=
1
3
pX Y,A (2 3) =
4 / 20
6 / 20
=
2
3
,
pX Y,A (2 4) =
2 / 20
3 / 20
=
2
3
pX A
(1) =
3/ 20
9 / 20
=
1
3
pX A
(2) =
6 / 20
9 / 20
=
2
3
pX Y
( x y
)
= pX
(
x)
Functions of Two Independent Random Variables
• Given X and Y be two independent random variables, 
let and be two functions of X and Y , 
respectively. Show that and are independent.
Probability & Statistics - 45 Let U = g(X)
and V = h(Y), then
   
 
   
 
   
   
p up v
p x p y
p x p y
p u v p x y
U V
x g x u y h y v X Y
x y g x u h y v X Y
x y g x u h y v U V X Y



  


 
 
 
( ) ( )
( , ) ( ) , ( )
( , ) ( ) , ( )
, , , ,
g(X) h(Y )
g(X) h(Y )
Summary on Independence (1/2)
• Random variables X1
, …, Xn
are independent, provided that:
– If X1
, …, Xn
are jointly discrete, the joint probability mass function 
is equal to the product of the marginals:
– If X1
, …, Xn
are jointly continuous, the joint probability density 
function is equal to the product of the marginals:
Probability & Statistics - 46       n X X n p x x p x p x 1 
1 1

n
, ,

      n X X n
f x x f x f x 1 
1 1

n
, ,

Summary on Independence (2/2)
• If X and Y are independent random variables, then:
– If X and Y are jointly discrete, and x is a value for which 
pX
(x) > 0, then
– If X and Y are jointly continuous, and x is a value for 
which
Probability & Statistics - 47 p y x p y Y X

Y
|
|
f y x f y Y X

Y
|
|
Means of Two Independent Random Variables
• If X and Y are independent random variables, then
– As shown by the following calculation
• Similarly, if X and Y are independent random variables, 
then
Probability & Statistics - 48 E[XY] = E[X]E[Y]
   
   
   
X  Y 
xp x yp y
xyp x p y
XY xyp x y
x y X Y
Y
x y X
x y X Y E E
E






 

  

 ,
,
E g(X)h(Y)
é
ë
ù
û
= E g(X)
é
ë
ù
û
E h(Y)
é
ë
ù
û
by independence
Covariance
• Let X and Y be random variables with means μX
and μY
– The covariance of X and Y is
– An alternative formula is
Probability & Statistics - 49      X X Y Y
Cov X Y    
,
  Cov X Y   XY   X Y
,
measure of the linear relationship
between X and Y
Example
Probability & Statistics - 50
• Example 2.67: Continue Example 2.56, a mobile computer is moving in 
the region A bounded by the x axis, the line x =1, and the line y = x. If 
(X,Y) denotes the position of the computer at a given time, the joint 
density of X and Y is given by 
Find Cov(X,Y).
  





 0 ( ) 8 ( ) 
,
, x,y A
xy x,y A
f x y X Y
Answer
Probability & Statistics - 51
• Example 2.67:
We will use the formula 
To compute the integral over this region, 
we fix a value of x as shown. We compute 
the inner integral by integrating with 
respect to y along the vertical line 
through x. The limits of integration along 
this line are y = 0 to y = x. Then we 
compute the outer integral by integrating 
with respect to x over all possible values 
of x, so the limits of integration on the 
outer integral are x = 0 to x = 1.
 
9
4
18
8
3
8
3
8
8
8
1
0
6
1
0
5
0
1
0
2 3
1
0 0
2 2
1
0 0
  






 



 
 

 x dx x dx x y
x y dy dx
xy xy dydx
y x
y
x
x  XY   Cov X Y   XY   X Y
,
Answer (continue)
Probability & Statistics - 52
• Example 2.67:
  225
4
15
8
5
4
9
4
,  










 Cov X Y   XY   X Y
 
 
  

   



  

0 otherwise 4 4 0 1 0 otherwise 4 0 1 3
3 y y y
f y
x x
f x
Y
X  
5
4
5
4
4
1
0
5
1
0
4   



 x
x dx
xf x dx  X X
 
 
15
8
5
4
3
4
4 4
1
0
3 5
1
0
2 4     



 y y
y y dy
yf y dy Y Y
Correlation
• Let X and Y be jointly distributed random variables with 
standard deviations σX and σY
– The correlation between X and Y is denoted ρX,Y and is given by
• For any two random variables X and Y
Probability & Statistics - 53
 
X Y
X Y
Cov X Y
 

,
, 
1  X ,Y 1
Covariance, Correlation, and Independence
• If Cov(X,Y) = ρX,Y = 0, then X and Y are said to be 
uncorrelated
• If X and Y are independent, then X and Y are uncorrelated
• It is mathematically possible for X and Y to be 
uncorrelated without being independent. This rarely 
occurs in practice
Probability & Statistics - 54
Example
• The pair of random variables (X, Y ) takes 
the values (1, 0), (0, 1), (−1, 0), and (0,−1), 
each with probability ¼ 
Thus, the marginal PMFs of X and Y are symmetric around 
0, and E[X] = E[Y ] = 0
• Furthermore, for all possible value pairs (x, y), either x or y 
is equal to 0, which implies that XY = 0 and E[XY ] = 0. 
Therefore, Cov(X, Y ) = E[XY ] − E[X]E[Y ] = 0, and X and Y 
are uncorrelated
• However, X and Y are not independent since, for example, 
a nonzero value of X fixes the value of Y to zero
Probability & Statistics - 55
Variance of a Linear Combination of 
Random Variables (1/2)
• If X1
, …, Xn
are random variables and c1
, …, cn
are constants, 
then
Probability & Statistics - 56
nXn X n Xn c X c  
 c   c  1 1 1 1
   

  
 
   
1
1 1
2 2 2 2
1
2 2 ,
1 1 1
n
i
n
j i
c X c X X n X i jCov Xi X j c c c c
n n n
    
Variance of a Linear Combination of 
Random Variables (2/2)
• If X1
, …, Xn
are independent random variables and c1
, …, cn
are constants, then
– In particular,
Probability & Statistics - 57
2 2 2 2
1
2
1 1 nXn X1 n Xn c X c  
 c   c 
2 2 2
X1 Xn X1 Xn
 
 
Summary
• Random variables: discrete and continuous
• Probability mass functions (PMF, pmf)
• Probability density functions (PDF, pdf)
• Cumulative distribution functions (CDF, cdf)
• Means and variances for random variables (, 2
)
• Linear functions of random variables
• Mean and variance of a sample mean
• Jointly distributed random variables
Probability - 58


## 【Prob_Stat_08-Commonly Used Distributions(I).pdf】

Commonly Used Distribution – I
Yi-Fen Liu
Department of IECS, FCU
References:
- Dimitri P. Bertsekas and John N. Tsitsiklis, Introduction to Probability, Chapter 3
- Walpole R. E., Myers R. H., Myers S. L. and Ye K., Probability & Statistics for Engineers & Scientists, Ch. 5
- William Navidi, Statistics for Engineers and Scientists, Chapter 4
- Slides are credited from Prof. Berlin Chen, NTNU. 
How to Estimate Population (Distribution) 
Parameters?
Probability & Statistics - 2
- Unbiased Estimate ?
- Estimation Uncertainty ?
Propagation Error
Probability & Statistics - 3
• Any measuring procedure contains error
– This causes measured values to differ from the true values that are 
measured
• Errors in measurement produce error in calculated values 
(like the mean)
• Definition: When error in measurement produces error in 
calculated values, we say that error is propagated from the 
measurements to the calculated value
• Having knowledge concerning the sizes of the errors in 
measurement → Obtaining knowledge concerning the likely 
size of the error in a calculated quantity
from Ch.3 Propagation Error
Measurement Error
Probability & Statistics - 4
• A geologist weighs a rock on a scale and gets the following 
measurements:
251.3 252.5 250.8 251.1 250.4
• None of the measurements are the same and none are 
probably the actual measurement
• The error in the measured value is the difference between a 
measured value and the true value
Parts of Error
Probability & Statistics - 5
• We think of the error of the measurement as being 
composed of two parts:
– Systematic error (or bias)
– Random error
• Bias is error that is the same for every measurement
– E.g., a imperfectly calibrated scale always gives you a reading that is 
too low
• Random error is error that varies from measurement to 
measurement and averages out to zero in the long run
– E.g., Parallax (視差) error
• The difference in the position of dial indicator when observed 
from different angles
Measured Value = True Value + Bias + Random Error
random variable constant constant random variable ERandom Error  0
from Ch.3 Propagation Error
Two Aspects of the Measuring Process (1/4)
Probability & Statistics - 6
• We are interested in accuracy
– Accuracy is determined by bias
• The bias in the measuring process is the difference between the mean 
measurement μ and the true value: 
bias = μ - true value
– The smaller the bias, the more accurate the measuring process
• Unbiased: the mean measurement is equal to the true value
• The other aspect is precision
– Precision refers to the degree to which repeated measurements of 
the same quantity tend to agree with each other
– If repeated measurements come out nearly the same every time, 
the precision is high
– The uncertainty in the measuring process is the standard deviation σ
• The smaller the uncertainty, the more precise the measuring process
from Ch.3 Propagation Error
Two Aspects of the Measuring Process (2/4)
Probability & Statistics - 7
• Example: Figures 3.1 and 3.2
How about bias? (True value is often unknown in real life)
bias is large;
uncertainty is small
both bias and 
uncertainty are large
both bias and 
uncertainty are small
bias is small;
uncertainty is large
uncertainty 
is small
uncertainty 
is large
uncertainty 
is small
uncertainty 
is large
Two Aspects of the Measuring Process (3/4)
Probability & Statistics - 8
• Let X1
,…,Xn be independent measurements, all made by the 
same process on the same quantity
– The sample standard deviation s can be used to estimate the 
uncertainty
– Estimates of uncertainty are often crude, especially when based on 
small samples
– If the true value is known, the sample mean, , can be used to 
estimate the bias:
– If the true value is unknown, the bias cannot be estimated from 
repeated measurements
X
bias  X  true value from Ch.3 Propagation Error
Two Aspects of the Measuring Process (4/4)
Probability & Statistics - 9
• From now on, we will describe measurements in the form
– Where is the uncertainty in the process that produced the 
measured value
– Assume that bias has reduced to a negligible level
Measured value
from Ch.3 Propagation Error
Linear Combinations of Measurements
Probability & Statistics - 10
• Each measurement can be viewed as a random variable
– Its standard deviation represents the uncertainty for it
• How to compute uncertainties in scaled measurements or 
combinations of independent measurements?
– If X is a measurement and c is a constant, then
– If X1
,…,Xn
are independent measurements and c1
,…,cn
are constants, 
then
cX X   c
2 2 2 2
1 1 nXn 1 X1 n Xn c X c  
 c   c 
from Ch.3 Propagation Error
Example
Probability & Statistics - 11
• Example 3.6: A surveyor is measuring the perimeter of a 
rectangular lot. He measures two adjacent sides to be 50.11 ±
0.05m and 75.21 ± 0.08m. These measurements are independent. 
Estimate the perimeter of the lot and find the uncertainty in the 
estimate.
– Solution:
Let X = 50.11 and Y = 75.21 be the two measurements. The 
perimeter is estimated by P = 2X + 2Y = 250.64m, and the
uncertainty in P is
So the perimeter is 250.64 ± 0.19m.
4 4 40.05 40.08 0.19m
2 2 2 2
 P
 2X 2Y
  X   Y
  
from Ch.3 Propagation Error
Repeated Measurements
Probability & Statistics - 12
• One of the best ways to reduce uncertainty is to take 
independent measurements and average them (why?)
– The measurements can be viewed as a simple random sample from 
a population
– Their average is therefore the sample mean
• If X1
,…,Xn
are independent measurements, each with mean 
 and standard deviation  , then the sample mean, , is a 
measurement with mean (cf. Sections 2.5 & 2.6) 
and with uncertainty
X
   X n
X

 
The uncertainty is reduced by a factor equal 
to the square root of the sample size
from Ch.3 Propagation Error
Example
Probability & Statistics - 13
• Example 3.8: A length of a component is to be measured by 
a process whose uncertainty is 0.05 cm. If 25 independent 
measurements are made and the average of these is used to 
estimate the length, what will the uncertainty be? How 
much more precise is the average of 25 measurements than 
a single measurement?
– Solution:
The uncertainty is cm. The average of 25 
independent measurements is five times more precise than a 
single measurement.0.05/ 25  0.01
Sample Mean and Variance
Probability & Statistics - 14
• Point estimation is the attempt to estimate some fixed but 
unknown quantity  of a random variable by using sample data
• Let 𝕏 = {𝑥
1
, … , 𝑥
𝑛
}= be a set of n i.i.d. samples of a random 
variable X, a point estimator or statistic is a function of the data:
– The value is called estimate of 
• Sample mean: 
• Sample variance: 
• How good are these estimators?
  
i
i
X x
n
X
1 ( ) ˆ  
(1) ( )
, ,
ˆ
n
n   g x  x  
2 2 2 ( ) ˆ 1
 ˆ   
i
X
i
X x
n
s  
from Prof. Wu, Shan-Hung’s slide  n
ˆ
Bias & Variance
Probability & Statistics - 15
• Bias of an estimator
E𝕏 𝜃෠
𝑛 − 𝜃
– Here, the expectation is defined over all possible 𝕏’s of size n, i.e., 
E𝕏 𝜃መ
መ 𝜃׬ = 
𝑛𝑑P 𝕏
• We call a statistic unbiased estimator iff it has zero bias
• Variance of an estimator: 
Var𝕏 𝜃෠
𝑛 = E𝕏 𝜃෠
𝑛 − E𝕏 𝜃෠
𝑛
2
• Is an unbiased estimator of X
(population mean) ?
• What much is Var𝕏 𝜇
Ƹ
X
 
i
i
X x
n
1 ( ) ˆ
 n 
ˆ
bias from Prof. Wu, Shan-Hung’s slide
Yes
Variance of 
Probability & Statistics - 16
Var𝕏 𝜇ො𝑋 = E𝕏 𝜇ො − E𝕏 𝜇ො
2 = E 𝜇ො
2 − 𝜇
2
• The variance of diminishes as n 

ˆ
X
 
from Prof. Wu, Shan-Hung’s slide  X
ˆ
 
    
        
        

 
   
  
   




  
 
 
 
2 2 2 2 2
( )2 ( ) ( ) 2
2
( ) ( ) ( ) ( ) 2
2
2
, ( ) ( ) 2
2
, ( ) ( ) 2
E
( 1) 1 E
1 E 1 E E
1 E E
1 E
1 1 E
  


 
X
n n
n X
n
x n n x x n
x x x x n
x x n
x x n
i j
i
i
i j
i j
i j
i j
i j
i j
i j
i j
1
𝑛
𝜎𝑋
2
n
X

 
uncertainty of
 X
ˆ
Unbiased Estimator of (population variance) 
Probability & Statistics - 17
• Is an unbiased estimator of ? 
E𝕏
• What’s the unbiased estimator of ? 
    
i X
i
X x
n
2 2 ( ) ˆ 1

ˆ

from Prof. Wu, Shan-Hung’s slide 2  X
   
      
 
2 2 2 2 2
2
( )2 2 ( )2 2
( )2 ( ) 2
2 ( )
1 1
 
 E ˆ E E ˆ 1
ˆ 1 E
2 ˆ ˆ 1
ˆ E
1 E
    

 
  
n
n
n
x n
n
x n
n
x x n
x n
i
i
i
i
i i
i
i
i
i
i

    
 
   
  




  





    




    
   
≠ 𝜎
2
2  X
2  X          

i X
i
i X
i
X x x
n n
n 2 ( ) 2 2 ( ) ˆ ) ˆ 1
( 1

ˆ
 
1
𝑛 − 1
E 𝑋
2 E 𝑋 − 𝜇
2 + 2𝑋𝜇 − 𝜇
2 E 𝜇ො
2
𝜎
2 + 𝜇
2 Var 𝜇ො + E 𝜇ො
2
 
 


n
i
Xi X
n
s
1
2 2
1
1
2 ˆ
 X
The Bernoulli Distribution
Probability & Statistics - 18
• We use the Bernoulli distribution when we have an 
experiment which can result in one of two outcomes
– One outcome is labeled “success,” and the other outcome is labeled 
“failure”
– The probability of a success is denoted by p. The probability of a 
failure is then 1 – p
• Such a trial is called a Bernoulli trial with success probability 
p
Examples
Probability & Statistics - 19
• The simplest Bernoulli trial is the toss of a coin. The two 
outcomes are heads and tails. If we define heads to be the 
success outcome, then p is the probability that the coin 
comes up heads. For a fair coin, p = ½
• Another Bernoulli trial is a selection of a component from a 
population of components, some of which are defective. If 
we define “success” to be a defective component, then p is 
the proportion of defective components in the population
from Ch.3 Propagation Error
X ~ Bernoulli(p)
Probability & Statistics - 20
• For any Bernoulli trial, we define a random variable X as 
follows:
– If the experiment results in a success, then X = 1. Otherwise, X = 0. It 
follows that X is a discrete random variable, with probability mass 
function p(x) defined by
  

 

if = 0 if =1 1 , 
, x
x
p
p
p x X
Mean and Variance of Bernoulli
Probability & Statistics - 21
• If X ~ Bernoulli(p), then
–
–
X  xp x p  p p
x
 X
 E   X
1  0 1       
  X   X  p p p p
X x p x p p p
X X X
x
X X        
        
1
1 0 1
2 2 2 2 2
2 2 2 2
2
2
E E
E
  

The Binomial Distribution
Probability & Statistics - 22
• If a total of n Bernoulli trials are conducted, and The trials 
are independent
– Each trial has the same success probability p
– X is the number of successes in the n trials
• Then X has the binomial distribution with parameters n and 
p, denoted X ~ Bin(n,p)
Bin(10, 0.4) Bin(20, 0.1)
pmf, Mean and Variance of Binomial (1/2)
Probability & Statistics - 23
• If X ~ Bin(n, p), the probability mass function of X is
– Mean:
 
 




  
   
 0, otherwise 1 , 0,1,2 , !( )!
!
( ) p p x n
x n x
n
p x X x
x n x
X  P
!( )!
!
x n x
n
x
n 






       
  p  p np
x n x
n
p p np
x n x
n
np
p p
x n x
n
p p x
x
n
p p x
x
n
xp x x
n
x
x n x n
x
x n x
n
x
x n x n
x
x n x n
x
x n x
x X X  
 

 
 




  




   




    
   


 

 






1
' 0
1 ' ' 1
1
0 1 1
1
'!( 1 ')!
( 1)! 1
( 1)!( )!
( 1)!
1
!( )!
!
 1 1
1
     


   






n
k
k n k
n
k
X p p
k
n
p x
0 0
1 1
pmf, Mean and Variance of Binomial (2/2)
Probability & Statistics - 24
• If X ~ Bin(n, p), the probability mass function of X is
– Variance:
 
 




  
   
 0, otherwise 1 , 0,1,2 , !( )!
!
( ) p p x n
x n x
n
p x X x
x n x
X  P
     (to be verified later on!)
2 2 E X  E X  X  E X
            
     
            nn p np n p np p X X X X X X
p p n n p
x n x n
n n p
p p
x n x n
p p x x
xn X X X X x x
X
n
x
x n x
n
x
x n x n
x
x n x
     
     
  
 

 


   




      
 

 




1 1
1 1
( 2)!( )!
( 2)! 1
1
!( )!
! 1 1 1 1
2 2 2
2 2 2 2 2
2
2
2 2
0 2
2 E E E E E
E E

1
Examples (1/2)
Probability & Statistics - 25
• The probability that a certain kind of component will survive a shock test 
is 3/4. Find the probability that exactly 2 of the next 4 components tested 
survive. (某種元件將在某撞擊測試中通過的機率為 3/4，請找出在測
試的 4 個元件中有兩個通過的機率。)
– Solution:
    128
27
4
3
2!2!
4!
4
1
4
3
2
4
2 4
2
2 2












 

















pX x  P X  
    p  p k n
k
n
p x X k
k n k
X 1 ,  0,1,, 





  
 P
Examples (2/2)
Probability & Statistics - 26
• The probability that a patient recovers from a rare blood disease is 0.4. If 
15 people are known to have contracted this disease, what is the 
probability that (a) at least 10 survive, (b) 3 to 8 survive, and (c) exactly 
5 survive? (患者從某種罕見的血液疾病中復原的機率為 0.4，如果有
15 個人已知患有這種疾病，則 (a) 至少 10 人存活；(b) 3 至 8 人存
活；(c) 恰好 5 人存活的機率是多少?)
– Solution:
(a)
(b) 
(c)        
0.0338
0.4 1 0.4 1 0.9662
15
10 1 10 1
9
0
15 
   




       

k
k k
X k p x P X P X
     
   
0.9050 0.0271 0.8779
0.4 1 0.4
15
0.4 1 0.4
15
0.4 1 0.4
15
3 8
8
0
2
0
15 15
8
3
15   
 




   




 
 




      

 
 


k k
k k k k
k
k k X k k
k p x P X
    0.4 1 0.4 0.1859
5
15
5
5 15 5   





  
 pX x P X
Another Use of the Binomial
Probability & Statistics - 27
• Assume that a finite population contains items of two types, 
successes and failures, and that a simple random sample is 
drawn from the population. Then if the sample size is no 
more than 5% of the population, the binomial distribution 
may be used to model the number of successes
– Sample items can be therefore assumed to be independent of each 
other
– Each sample item is a Bernoulli trial
More on the Binomial
Probability & Statistics - 28
• Assume n independent Bernoulli trials are conducted
• Each trial has probability of success p
• Let Y1
, …, Yn be defined as follows: Yi = 1 if the i-th trial 
results in success, and Yi = 0 otherwise (Each of the Yi has 
the Bernoulli(p) distribution)
• Now, let X represent the number of successes among the n 
trials. So, X = Y1 + …+ Yn
This shows that a binomial random variable can be 
expressed as a sum of Bernoulli random variables
Estimate of p
Probability & Statistics - 29
• If X ~ Bin(n, p), then the sample proportion 
is used to estimate the success probability p
• Note:
– Bias is the difference
– is unbiased
– The uncertainty in is
– In practice, when computing , we substitute for p, since p is 
unknown ( ) number of trials
number of sucesses ˆ
1 2
n
Y Y Y
n
X
p
   n    
 p
ˆ  p p
ˆ  p
ˆ  p  0
p
ˆ
 
   
n
p p
n
np p
p Y Y Yn n 



  

1 1
ˆ /  
1 2   p
ˆ
p
ˆ
The Poisson Distribution
Probability & Statistics - 30
• One way to think of the Poisson distribution is as an 
approximation to the binomial distribution when n is large 
and p is small
• It is the case when n is large and p is small the mass function 
depends almost entirely on the mean np, very little on the 
specific values of n and p
• We can therefore approximate the binomial mass function 
with a quantity λ = np; this λ is the parameter in the Poisson 
distribution
pmf, Mean and Variance of Poisson (1/2)
• If X ~ Poisson(), the probability mass function of X is
• Note: X must be a discrete random variable and λ must be a 
positive constant   


 
  
 0, otherwise 
, for 0,1,2
!
( ) x 
x
e
p x X x
x
X


P
Probability Histogram
Probability & Statistics - 31
pmf, Mean and Variance of Poisson (2/2)
Probability & Statistics - 32
• If X ~ Poisson(), the probability mass function of X is
– Mean:
– Variance:
  


 
  
 0, otherwise 
, for 0,1,2
!
( ) x 
x
e
p x X x
x
X


P
   
  


       

       


 
 


 
' 0
' 0 1
1
! 1 ! '! x
x
x x
x x
x X
x
e
x x
xe
x
E X xp x xe
1
   
   
     
          
  
 





  
  
        
    
















   



       
   


 

 



 
 


 


2 2 2 2
2
' 0
'
' 0
'
' 0
'
1
1 1
1
0
2 2 2
var 1
'! '!
'
'!
' 1
! 1 ! 1 !
X X X
X
x
e
x
x e
x
x e
x
xe
x x
x xe
x X x p x x e
x
x
x
x
x
x
x
x x
x
x
x
x X E E
E
E
 X
   
2
X
1
Examples (1/3)
Probability & Statistics - 33
• During a laboratory experiment, the average number of radioactive 
particles passing through a counter in 1 millisecond is 4. What is the 
probability that 6 particles enter the counter in a given millisecond? (在
某實驗室的實驗程序中，在一毫秒內通過某個計數器的放射粒子的
平均數量為 4，在一個給定的毫秒內有 6 個粒子進入計數器的機率
是多少?)
– Solution:
   
0.8893 0.7851 0.1042
!
4
!
4
6!
4
6
5
0
6
0
6
4   
     


 
k
k
k
k
k
k
X k
e
k p x P X e e
  


 
  
 0, otherwise 
, for 0,1,2
!
( ) x 
x
e
p x X x
x
X


P
Examples (2/3)
Probability & Statistics - 34
• Ten is the average number of oil tankers arriving each day at a certain 
port. The facilities at the port can handle at most 15 tankers per day. 
What is the probability that on a given day tankers have to be turned 
away? (每天到達某個港口的油輪平均數量為 10 艘。該港口的設施
單位每天最多可處理 15 艘油輪，在任意的某一天，油輪必須被迫
趕離的機率是多少?)
– Solution:
    1 0.9513 0.0487
!
10 15 1
15
0
10
      


k
k
X k p x P X e
  


 
  
 0, otherwise 
, for 0,1,2
!
( ) x 
x
e
p x X x
x
X


P
Examples (3/3)
Probability & Statistics - 35
• Example 4.18: Particles are suspended in a liquid medium at a 
concentration of 6 particles per mL. A large volume of the suspension is 
thoroughly agitated, and then 3 mL are withdrawn. What is the 
probability that exactly 15 particles are withdrawn?
– Solution: X ~ Poisson()
    0.0786
15!
18 15
The mean number of particles of a 3mL volume is18. ( 18)
15
18    

 p x X e X P

  


 
  
 0, otherwise 
, for 0,1,2
!
( ) x 
x
e
p x X x
x
X


P
Relation between Binomial and Poisson
Probability & Statistics - 36
• The Poisson PMF with parameter λ is a good approximation 
for a binomial PMF with parameters n and p, provided that λ 
= np, n is very large and p is very small
 
 
 
   
       
 
 


  
 
 
 
 
 

 





 





 




  





 





 





 
  







 



     
   


 





e
k
e n
x n n
n k n
n
n
n
k n n
n n n k
k
k n n
n n n k n
p p np p
n k k n
p p
kn
k n
x n
n
n k k n
n k
k
k n
k n k n
k n k n
k n k n
!
lim
1 ( lim 1 ) 1 1
!
lim
1
1 1
!
lim
1
! 1 1
lim
1 ( )
! !
!
lim
lim 1   


Poisson Distribution to Estimate Rate
Probability & Statistics - 37
• Let λ denote the mean number of events that occur in one 
unit of time or space. Let X denote the number of events 
that are observed to occur in t units of time or space
• If X ~ Poisson(λt), we estimate λ with
• Note:
– is unbiased
– The uncertainty in is
– In practice, we substitute for λ, since λ is unknown
t
X
 
ˆ

ˆ     ) 1 1 ˆ
( ˆ    
     





  t
t
X
t t
X E E E

ˆ
t
t
t t X
t
X

    
   
2
2
ˆ 2
1 1 
ˆ
Example
Probability & Statistics - 38
• Example 4.24: A 5 mL sample of a suspension is withdrawn, and 47 
particles are counted. Estimate the mean number of particles per mL, 
and find the uncertainty in the estimate?
– Solution: 
If X ~ Poisson(λt), we estimate λ with
The uncertainty in the estimate is 
1.4
5
9.4
ˆ 


t

 
t
X
 
ˆ
9.4
5
47 ˆ
  
Some Other Discrete Distributions
Probability & Statistics - 39
• Consider a finite population containing two types of items, 
which may be called successes and failures
– A simple random sample is drawn from the population
– Each item sampled constitutes a Bernoulli trial
– As each item is selected, the probability of successes in the 
remaining population decreases or increases, depending on 
whether the sampled item was a success or a failure
– For this reason the trials are not independent, so the number of 
successes in the sample does not follow a binomial distribution
• The distribution that properly describes the number of 
successes is the hypergeometric distribution
pmf of Hypergeometric
Probability & Statistics - 40
• Assume a finite population contains N items, of which R are 
classified as successes and N – R are classified as failures
– Assume that n items are sampled from this population, and let X 
represent the number of successes in the sample
– Then X has a hypergeometric distribution with parameters N, R, and 
n, which can be denoted X ~ H(N,R,n). The probability mass 
function of X is
   
   




   











 






   
0, otherwise 
, if max 0, R n N x min n, R
nN
n x N R
xR
p x X x X P
Binomial PMF: sampling 
with replacement of 
each item to ensure 
independence between 
trials
Example
Probability & Statistics - 41
• Lots of 40 components each are deemed unacceptable if they contain 3 or 
more defectives. The procedure for sampling a lot is to select 5 
components at random and to reject the lot if a defective is found. What 
is the probability that exactly 1 defective is found in the sample if there 
are 3 defectives in the entire lot? (每批貨有 40 個元件，如果含有 3 個
或更多個瑕疵品，則該批貨被認為是不可接受的，抽樣的程序是隨
機選擇 5 個元件，如果發現有瑕疵，則拒絕該批貨。如果一批貨中
有 3 個瑕疵，那麼在樣本中發現正好有 1 個瑕疵的機率是多少?)
– Solution:
    0.3011, 0 3
5
40
4
37
1
3
1   


















p x  X   x X P
How about P(X1)?
   
   




   











 






   
0, otherwise 
, if max 0, R n N x min n, R
nN
n x N R
xR
p x X x X P
Mean and Variance of Hypergeometric
Probability & Statistics - 42
• If X ~ H(N, R, n), then
– Mean of X:
– Variance of X:
N
nR
 X






 







 






1
1
2
N
N n
N
R
N
R
 X n
Geometric Distribution
Probability & Statistics - 43
• Assume that a sequence of independent Bernoulli trials is 
conducted, each with the same probability of success, p
• Let X represent the number of trials up to and including the 
first success
– Then X is a discrete random variable, which is said to have the 
geometric distribution with parameter p.
– We write X ~ Geom(p).
pmf, Mean and Variance of Geometric
Probability & Statistics - 44
• If X ~ Geom(p), then
– The pmf of X is 
– Mean of X is
– Variance of X is
p
X
1
 
2
2 1
p
p
X   
 
 


  
  
 0, otherwise 1 , 1,2
( )
1
p p x  p x X x
x
X P
Mean and Variance of the Geometric
• Consider a geometric random variable with a PMF
Probability - 45   1  , 1,2 ,
1
  

 p x p p x
x
X
     
 q p
p
dq
q
d
p
dq
d q
p
X xp x x p p p xq q p
x
x
x
x
x
x
x X 1
1
1 1
1
1 (let 1 1)
2
0
1
1
0
1 







 






 
      

  




 

 E
         
 
 
 
             
   
2 2 2
2 2 2 2
2 3 2
2
2
2
2
2
0
2 1
2 1 1 1 1
var 2 1
1
1 2
1
1
1 1 1 1 (let 1 1)
p
p
p p p
p X X X X X X X
p
p
q
pq
d q
q
d
pq x x q pq X X X X x x p p pq x x q q p
x
x
x
x
x
x

  


     









 
  
           
 





 

 E E E E E
E E
     (to be verified later on!)
2 2 E X  E X  X  E X
, for 1
1
1 Note that :
0

  

 r
r
r
k
k
Example
Probability & Statistics - 48
• At a “busy time,” a telephone exchange is very near capacity, so callers 
have difficulty placing their calls. It may be of interest to know the 
number of attempts necessary in order to make a connection. Suppose 
that we let p = 0.05 be the necessary in order to make a connection 
during a busy time. We are interested in knowing the probability that 5 
attempts are necessary for a successful call. (在「繁忙時間」中電話交
換機非常接近滿載，因此打電話者要打通電話可能會有困難。我們
想知道成功通話所需要嘗試的次數。假設我們令 p = 0.05 是繁忙時
間連接成功的紀律，則成功通話需要 5 次嘗試的機率為何?)
– Solution:
   5 1 0.05 0.05 0.95 0.05 0.041 5 1 4
     
 pX x P X
 
 


  
  
 0, otherwise 1 , 1,2
( )
1
p p x  p x X x
x
X P
Negative Binomial Distribution
Probability & Statistics - 49
• The negative binomial distribution is an extension of the 
geometric distribution. Let r be a positive integer.
• Assume that independent Bernoulli trials, each with success 
probability p, are conducted, and let X denote the number 
of trials up to and including the r-th success
– Then X has the negative binomial distribution with parameters r and 
p. We write X ~ NB(r,p)
• Note: If X ~ NB(r,p), then X = Y1 + …+ Yr where Y1
,…,Yr
are 
independent random variables, each with Geom(p) 
distribution
0,…, 1, 0,…, 1, 0,…, 1, ……, 0,….., 1 x trials in total
y1 y2 yr
pmf, Mean and Variance of Negative Binomial
Probability & Statistics - 50
• If X ~ NB (r, p), then
– The pmf of X is 
– Mean of X is
– Variance of X is
p
r
 X

 
2
2 1
p
r p
X   
 
 




    




 

  
 0, otherwise 1 , , 1
1
1
( ) p p x r r 
r
x
p x X x
r x r X P
Example
• In an NBA championship series, the team that wins four games out of seven is 
the winner. Suppose that teams A and B face each other in the championship 
games and that team A has probability 0.55 of winning a game over team B.
(a) What is the probability that team A will win the series in 6 games?
(b) What is the probability that team A will win the series?
(c) If team A and B were facing each other in a regional playoff series, which 
is decided by winning three out of five games, what is the probability that 
tea A would win the series?
– Solution:
(a) 
(b)
(c)     0.55 1 0.55 0.1853
4 1
6 1
6
4 6 4   




 

  
 pX x P X
             
0.0915 0.1647 0.1853 0.1668 0.6083
4 7 4 5 6 7
7
4     
            
 p x X p x X X X X
x
X P X P P P P
           
0.1664 0.2246 0.2021 0.5931
3 5 3 4 5
5
3    
          
 p x X p x X X X
x
X P X P P P
 
 




    




 

  
 0, otherwise 1 , , 1
1
1
( ) p p x r r 
r
x
p x X x
r x r X P
Probability & Statistics - 51
Multinomial Distribution
Probability & Statistics - 52
• Bernoulli trial is a process that results in one of two possible 
outcomes. A generalization of the Bernoulli trial is the 
multinomial trial, which is a process that can result in any of 
k outcomes, where k ≥ 2. We denote the probabilities of the 
k outcomes by p1
,…,pk
(p1+…+pk=1 )
• Now assume that n independent multinomial trials are 
conducted each with k possible outcomes and with the 
same probabilities p1
,…,pk
. Number the outcomes 1, 2, …, k. 
For each outcome i, let Xi denote the number of trials that 
result in that outcome. Then X1
,…,Xk
are discrete random 
variables. The collection X1
,…,Xk
is said to have the 
multinomial distribution with parameters n, p1
,…,pk
. We 
write X1
,…,Xk ~ MN(n, p1
,…,pk
)
pmf of Multinomial
Probability & Statistics - 53
• If X1
,…,Xk ~ MN(n, p1
,…,pk
), then the pmf of X1
,…,Xk
is
• Note that if X1
,…,Xk ~ MN(n, p1
,…,pk
), then for each i, Xi ~ 
Bin(n, pi
)
   



  
   
0, otherwise 
, 01 2 ; and
! ! !
!
1 2 1 2
1 2
p p p x , , , ,n x n
x x x
n
p x X x
i i x
k
x x
k
X  k 
 P
Can be viewed as a joint probability mass function of X1
,…,Xk
Example
Probability & Statistics - 54
• For a certain airport containing three runways it is known that in the 
ideal setting the following are the probabilities that the individual 
runways are accessed by a randomly arriving commercial jet:
Runway 1: p1
= 2/9, Runway 2: p2
= 1/6, Runway 3: p3
= 11/18
What is the probability that 6 randomly arriving airplanes are 
distribution in the following fashion?
Runway 1: 2 airplanes, 
Runway 2: 1 airplane, 
Runway 3: 3 airplanes
– Solution:
  0.1127
18
11
6
1
9
2
2!1!3!
6!
18
11
6
1
9
2
2,1,3
6
2 1 3 2 1 3
 























   























pX x 
   



  
   
0, otherwise 
, 01 2 ; and
! ! !
!
1 2 1 2
1 2
p p p x , , , ,n x n
x x x
n
p x X x
i i x
k
x x
k
X  k 
 P


## 【Prob_Stat_09-Commonly Used Distributions(II).pdf】

Commonly Used Distribution – II
Yi-Fen Liu
Department of IECS, FCU
References:
- Dimitri P. Bertsekas and John N. Tsitsiklis, Introduction to Probability, Chapter 3
- Walpole R. E., Myers R. H., Myers S. L. and Ye K., Probability & Statistics for Engineers & Scientists, Ch. 5
- William Navidi, Statistics for Engineers and Scientists, Chapter 4
- Slides are credited from Prof. Berlin Chen, NTNU. 
CONTINUOUS DISTRIBUTION
The Normal Distribution
Probability & Statistics - 3
• The normal distribution (also called the Gaussian 
distribution) is by far the most commonly used distribution 
in statistics. This distribution provides a good model for 
many, although not all, continuous populations
• The normal distribution is continuous rather than discrete. 
The mean of a normal population may have any value, and 
the variance may have any positive value
pdf, Mean and Variance of Normal
Probability & Statistics - 4
• The probability density function of a normal population with 
mean μ and variance σ
2
is given by
• If X ~ N(μ, σ2
), then the mean and variance of X are given by
 X
 
 
 
    


f x e - x
x
X
, 2
1 2
2
2

 
2 2  X

bell shape
68-95-99.7% Rule
Probability & Statistics - 5
• The above figure represents a plot of the normal probability 
density function with mean μ and standard deviation σ. 
Note that the curve is symmetric about μ, so that μ is the 
median as well as the mean. It is also the case for the 
normal population
– About 68% of the population is in the interval μ ± σ
– About 95% of the population is in the interval μ ± 2σ
– About 99.7% of the population is in the interval μ ± 3σ
Standard Units
Probability & Statistics - 6
• The proportion of a normal population that is within a given 
number of standard deviations of the mean is the same for 
any normal population
• For this reason, when dealing with normal populations, we 
often convert from the units in which the population items 
were originally measured to standard units
• Standard units tell how many standard deviations an 
observation is from the population mean
Standard Normal Distribution
Probability & Statistics - 7
• In general, we convert to standard units by subtracting the 
mean and dividing by the standard deviation. Thus, if x is an 
item sampled from a normal population with mean μ and 
variance σ
2
, the standard unit equivalent of x is the number 
z, where
• The number z is sometimes called the “z-score” of x. The z￾score is an item sampled from a normal population with 
mean 0 and standard deviation of 1. This normal 
distribution is called the standard normal distribution
– pdf
z  x  /
      

f z e - z
z
Z
, 2
1 2
2

The Proof
• Mean and Variance of the Normal Random Variable X
Probability & Statistics - 8
 
       
 
     
    


 

 
0
0
2
1
2
1 2 2
2 2 X Y
Y y e dy e
y y
E E
E
 
 
 
2
2 var
var
var 

  X 
X
 Y
 
 
    


f x e - x
x
X
, 2
1 2
2
2


       



f y e - y
X
y
Y
, 2
1 Let Y 2
2
 

? (see the end of Sec. 4.5)
    
1
0 1
2
1
2
1
2
1
2
1
var
2 2 2 2
2
2
2 2 2
2

 



 





   
    
 

 

 

 

 y e dy ye e dy
Y y Y e dy
y y y
y   
 E





  






 

2 2 2
2
2 2
2 y y
y y e e
dy
d ye

1
Examples
Probability & Statistics - 9
1. Q: Aluminum sheets used to make beverage cans have 
thicknesses (in thousandths of an inch) that are normally 
distributed with mean 10 and standard deviation 1.3. A 
particular sheet is 10.8 thousandths of an inch thick. Find 
the z-score:
2. Q: Use the same information as in 1. The thickness of a 
certain sheet has a z-score of -1.7. Find the thickness of the 
sheet in the original units of thousandths of inches:
Ans.: z = (10.8 – 10)/1.3 = 0.62
Ans.: -1.7 = (x – 10)/1.3 x = -1.7(1.3) + 10 = 7.8
Finding Areas Under the Normal Curve
Probability & Statistics - 10
• The proportion of a normal population that lies within a 
given interval is equal to the area under the normal 
probability density above that interval. This would suggest 
integrating the normal pdf; this integral have no closed form 
solution
• So, the areas under the curve are approximated numerically 
and are available in Table A.2 (Z-table). This table provides 
area under the curve for the standard normal density. We 
can convert any normal into a standard normal so that we 
can compute areas under the curve
– The table gives the area in the left-hand tail of the curve
– Other areas can be calculated by subtraction or by using the fact 
that the total area under the curve is 1
Z-Table (1/2)
Probability & Statistics - 11
Z-Table (2/2)
Probability & Statistics - 12
Examples
Probability & Statistics - 13
1. Q: Find the area under normal curve to the left of z = 0.47
2. Q: Find the area under the curve to the right of z = 1.38
Ans.: From the z table, the area is 0.6808
Ans.: From the z table, the area to the left of 1.38 is 0.9162.
Therefore the area to the right is 1 – 0.9162 = 0.0838
More Examples
Probability & Statistics - 14
1. Q: Find the area under normal curve between z = 0.71 and 
z = 1.28 
2. Q: What z-score corresponds to the 75th percentile of a 
normal curve? The 25th percentile?
Ans.: The area to the left of z = 1.28 is 0.8997. The area to the
left of z = 0.71 is 0.7611. So the area between is 0.8997 –
0.7611 = 0.1386
Ans.: To answer this question, we use the z table in reverse.
We need to find the z-score for which 75% of the area of curve
is to the left. From the body of the table, the closest area to
75% is 0.7486, corresponding to a z-score of 0.67
   
z
z z
for all
  1 , 
Estimating the Parameters of Normal
Probability & Statistics - 15
• X1
,…,Xn
are a random sample from a N(μ,σ2
) distribution, μ
is estimated with the sample mean and σ
2
is estimated 
with the sample variance 
• As with any sample mean, the uncertainty in is 
which we replace with , if σ is unknown. The mean 
is an unbiased estimator of μ
 
n
i
Xi
n
X
1
1  
 


n
i
Xi X
n
s
1
2 2
1
1
unbiased estimator asymptotically unbiased estimator?
X  / n
s/ n
X
2
s
Sample Variance is an Asymptotically 
Unbiased Estimator (1/3)
Probability & Statistics - 16
• Sample variance is an asymptotically unbiased estimator 
of the population variance σ
2
     
   
n X n X
n X nX
n X n X nX
X X X X
n X X
n
s
n
i
i
n
i
i
n
i
i
n
i
i i
n
i
i
2
1
2
2
1
2
2 2
1
2
1
2 2
1
2
2
2
2
1
1
E E
E
E
E
E E
   



 






 




 






   




 





    





  










2
s
 
X n X
X X
n
s
n
i
i
n
i
i
   





1
1
2 2
1
1
Sample Variance is an Asymptotically 
Unbiased Estimator (2/3)
Probability & Statistics - 17
 
   
 
2 2
2
2
2 2
2
1
2
2
 1 
 
  







   

   



  
n
n
n
n
n n
n X n X
s
n
i E i E
E
      
    
2
2
2
2
2
2 2
2
Var

 

    
  
n
X
n
X
X X
n
X
E E
E E
      
    
2 2 2 2 2
2 2 2 Var
  

    
  
i i
i i i
X X
X X X
E E
E E
when n = 
The size of the observed sample
Sample Variance is an Asymptotically 
Unbiased Estimator (3/3)
Probability & Statistics - 18
The size of the observed sample
(a kind of uncertainty)
The Lognormal Distribution
Probability & Statistics - 19
• For data that contain outliers (on the right of the axis), the 
normal distribution is generally not appropriate. The 
lognormal distribution, which is related to the normal 
distribution, is often a good choice for these data sets
• If X ~ N(μ,σ2
), then the random variable Y = e
X has the 
lognormal distribution with parameters μ and σ
2
• If Y has the lognormal distribution with parameters μ and σ
2
, 
then the random variable X = lnY has the N(μ,σ2
) 
distribution
Probability Density Function
  0, 1
a lognormal distribution with parameters
pdf, Mean and Variance of Lognormal
Probability & Statistics - 20
• The pdf of a lognormal random variable with parameters μ
and σ
2
is
• The mean E[Y] and variance Var(Y) are given by
– Can be shown by advanced methods (?)
 
 





 




 

0, otherwise 
ln , 0
2
1
exp
2
1 2
2 y y
y
f y Y

  
 
/ 2
2  E Y  e  
2 2 2 2 2 Var    Y  e  e
pdf, Mean and Variance of Lognormal
Probability & Statistics - 21
• Recall “Derived Distributions”
 
   
 
 





   
   
2
2
log
2
1
exp
2
1
1
log
log
log
log

 
y
y
y
f y
dy
d y
d y
dF y
dy
dF y
f y
X
Y X
Y
 
       

      
 F y Y y e y x y F y
Y e X N
X
X
Y
X
( ) log log
, ~ , 2
P P P
 
Test of “Lognormality”
Probability & Statistics - 22
• Transform the data by taking the natural logarithm (or any 
logarithm) of each value
• Plot the histogram of the transformed data to determine 
whether these logs come from a normal population
Probability Histogram
taking the natural logarithm on the 
values of the data
The Exponential Distribution
Probability & Statistics - 23
• The exponential distribution is a continuous distribution 
that is sometimes used to model the time that elapses 
before an event occurs
– Such a time is often called a waiting time
• The probability density of the exponential distribution 
involves a parameter, which is a positive constant λ whose 
value determines the density function’s location and shape
• We write X ~ Exp(λ)
pdf, cdf, Mean and Variance of Exponential
Probability & Statistics - 24
• The pdf of an exponential r.v. is
• The cdf of an exponential r.v. is
• The mean of an exponential r.v. is
• The variance of an exponential r.v. is
  

 

 0, otherwise
e , x 0
f x
x
X
 
 X
1/ 
Probability Density Function
2 2  X
1/ 
  

  

  1 , 0
0, 0 e x
x
F x X x
The Proof
• Mean and Variance of the Exponential Random Variable X
Integration by parts, c.f. http://en.wikipedia.org/wiki/Integration_by_parts Probability & Statistics - 25     dx
dx
du dx uv v
dx
dv   u


 

 0, otherwise, e , if x 0, f x
x
X
 
   
 


 
 1 1
0
0
0 0
0 0   
  
            

 
x
x x
x Xe
xe e dx
E X x f x dx x e dx
Integration by parts
 
  2 0
0 0
2
0
2 2 2 2
2
1
0
2
 




 

  




      
 


        x e dx X
x e xe dx
X x e dx
x
x x
x E
E
 






 
  

x x
x
xe e
dx
d xe  

 
 






 
  

x x
x
x e xe
dx
d x e  

 2
2
2

      
2
2 2 1
var

 X  E X  E X 
The Exponential Distribution and the 
Poisson Process
Probability & Statistics - 26
• If events follow a Poisson process with rate parameter , 
and if T represents the waiting time from any starting point 
until the next event, then T ~ Exp(λ)
Example
Probability & Statistics - 27
• Example 4.58: A radioactive mass emits particles according to a Poisson 
process at a mean rate of 15 particles per minute. At some point, a 
clock is started.
– What is the probability that more than 5 seconds will elapse before 
the next emission?
– What is the mean waiting time until the next particle is emitted?
The mean waiting time is seconds.
   
   
0.2865
1 1
5 1 5
1.25
0.25 5 

  
   

 e
e
P T P T
4
0.25
1
T
 
The mean rate of emission is 0.25 
per second, so the rate parameter 
is  = 0.25, and T~Exp(0.25).
Example
Probability & Statistics - 28
• Suppose that a system contains a certain type of component whose time, 
in years, to failure is given by T. The random variable is T modeled 
nicely by the exponential distribution with mean time to failure equal to 
5 . If 5 of theses components are installed in different systems, what is 
the probability that at least 2 are still functioning at the end of 8 years? 
(假設某系統包含某種類型的元件，該類型元件在故障前使用的時間
T 以年作為計算單位，該連續隨機變數 T 為指數函數，該類型元件
平均故障時間為 5 年，如果這些元件有5個分別安裝在不同的系統
中，在 8 年結束時至少還有 2 個仍在運行的機率是多少?)
– Solution:
•  = 1/ t   = 1/5 
 2 0.2 1 0.2 1 0.2 1 0.2 1 0.7373 0.2627
1
0
5
5
2
5     




    




    



x
x x
x
x x
x
n
x
n
P X
   
a a
a a
x x X a e dx e e e
    
   
           P 0
- the average # of 
outcomes per unit time 
(arrival rate) 
- Also could be per unit 
length, area, or volume, 
rather than time
 8 0 0.2
5
8
5
8
8
8
5 5  






      
  

   T e dt e e e
t t
P 
Lack of memory Property for Exponential
Probability & Statistics - 29
• The exponential distribution has a property known as the 
lack of memory property: If T ~ Exp(λ), and t and s are 
positive numbers, then
PT  t  s|T  s  PT  t
 
   
 
 
 
 
 
   
T t e F t e
e F s F t s T s T t sT s T t s T s T t s T s
T
t s
t s T
T
 
   

 


 


   
   


  P
P
P
P
P
P
1
1
1
|



Example
Probability & Statistics - 30
• Example 4.59: The lifetime of a particular integrated circuit has an 
exponential distribution with mean 2 years. 
– Find the probability that the circuit lasts longer than three years?
• Example 4.60: Assume the circuit is now four years old and is still 
functioning. 
– Find the probability that it functions for more than three additional 
years. Compare this probability with the probability that a new 
circuit functions for more than three years, which calculated in 
above example.
   
   
0.223
1 1
3 1 3
1.5
0.5 3 

  
   

 e
e 2, 0.5
P T P T
0.5
1
T
   
T~Exp(0.5).
Solution to Example 4.60
Probability & Statistics - 31
– Solution: 
– The probability that a 4-year-old circuit lasts 3 additional years is 
exactly the same as the probability that a new circuit lasts 3 years.
PT  3  0.223
A new circuit
 
   
 
 
 
 
 
 
 
  0.223
1 4
1 7
4
7
4
7 4
4 3| 4
0.5 3 1.5
0.5 4
0.5 7    







  
   
 

 e e
e
e F
F
T
T
T
T T
T T
T
T P
P
P
P
P
Estimating the Parameter of Exponential
Probability & Statistics - 32
• If X1
,…,Xn
are a random sample from Exp(λ), then the 
parameter λ is estimated with This estimator is 
biased. This bias is approximately equal to . The 
uncertainty in is estimated with
• This uncertainty estimate is reasonably good when the 
sample size n is more than 20
X n
1
ˆ 
 

ˆ
1/ X

ˆ  / n
The Gamma Distribution (1/2)
Probability & Statistics - 33
• Let’s consider the gamma function
– For r > 0, the gamma function is defined by
– The gamma function has the following properties:
• If r is any integer, then 
• For any r, 
•
r 1  rr
 
    
0
1
r t e dt r t r  r 1! 1/ 2  
The Gamma Distribution (2/2)
Probability & Statistics - 34
• The pdf of the gamma distribution 
with parameters r > 0 and λ > 0 is
• The mean and variance of Gamma distribution are given by
– , respectively
• If X1
,…,Xr
are independent random variables, each 
distributed as Exp(λ), then the sum X1+…+Xr
is distributed as 
a gamma random variable with parameters r and λ, denoted 
as
    






 
  0, 0 
, 0
1
x
x
r
x e
f x
r x X
 
2 2  X
 r /  and  X
 r /  r,
Example
Probability & Statistics - 35
• Example 4.65: Assume that arrival times at a drive-through window 
follow a Poisson process with mean λ = 0.2 arrivals per minute. Let T be 
the waiting time until the third arrival.
– Find the mean and variance of T. Find P(T20).
   
 
      
 
0.7619
1 4 8
2!
4
1!
4
0!
4
1
1 0 1 2
1 2
20 3
4 4 4
2
4
1
4
0
4 
   





    
      
  
  
  
   e e e
e e e X X X
X
T X
P P P
P
P P
75
0.2
3
15 0.2
3
2 2
2
     


 
r r
T T
T  20 means that the third event occurs within 
20 minutes. This is the same as saying that the 
number of events that occurs within 20 minute 
is greater or equal to 3. 
Now, the mean of X is (20)(0.2) = 4, and X has 
a Poisson distribution, so X ~ Poisson(4). PT  20  PX  3
The Weibull Distribution (1/2)
Probability & Statistics - 36
• The Weibull distribution is a continuous random variable 
that is used in a variety of situations
• A common application of the Weibull distribution is to 
model the lifetimes of components
• The Weibull probability density function has two 
parameters, both positive constants, that determine the 
location and shape. We denote these parameters α and β
• If α = 1, the Weibull distribution is the same as the 
exponential distribution with parameter λ = β
The Weibull Distribution (2/2)
Probability & Statistics - 37
• The pdf of the Weibull distribution is
• The mean of the Weibull is
• The variance of the Weibull is
 
 







  0, 0 
, 0
1
x
x e x
f x
x
X
     





  
 

1
1
1
X




















   





  
2
2
2 1
1
2
1
1
  
 X
Some Principles of Point Estimation
Probability & Statistics - 38
• We collect data for the purpose of estimating some numerical 
characteristic of the population from which they come.
• A quantity calculated from the data is called a statistic, and a 
statistic that is used to estimate an unknown constant, or 
parameter, is called a point estimator. Once the data has 
been collected, we call it a point estimate. 
• Let X ~ Bin(10, p) where p is unknown, and we observed X = 
3, then the number is a point estimate of the 
unknown parameter p. p
ˆ
 3/10
Questions of Interest
Probability & Statistics - 39
• Given a point estimator, how do we determine how good it 
is?
• What methods can be used to construct good point 
estimators?
Notation:  is used to denote an unknown parameter, and 

ˆ
to denote an estimator of .
Measuring the Goodness of an Estimator
Probability & Statistics - 40
• The accuracy of an estimator is measured by its bias, and the 
precision is measured by its standard deviation, or 
uncertainty.
• To measure the overall goodness of an estimator, we used 
the mean squared error (MSE) which combines both bias and 
uncertainty.
Mean Squared Error
Probability & Statistics - 41
• Let  be a parameter, and an estimator of . The mean 
squared error (MSE) of is
An equivalent expression for the MSE is 

ˆ

ˆ 
2
ˆ 2 MSE ˆ ˆ   
   
 
2
ˆ MSE ˆ  
 
 
The bias of the estimator 

ˆ
Example
Probability & Statistics - 42
• Example 4.67: Let X ~ Bin(n, p) where p is unknown. Find the MSE of the 
estimator .
– Solution:
We compute the bias and variance of using above equation. As 
shown in Section 4.2 (Binomial distribution), the bias of is 0, and 
the variance is . Therefore the MSE is .
p
ˆ
 X / n  
2
ˆ 2 MSE ˆ ˆ   
   
p
ˆ
p
ˆ
p1 p/ n 0  p1 p/ n
The Method of Maximum Likelihood
Probability & Statistics - 43
• The idea is to estimate a parameter with the value that 
makes the observed data most likely.
• When a probability mass function (pmf) or probability 
density function (pdf) is considered to be a function of the 
parameters, it is called a likelihood function.
• The maximum likelihood estimate is the value of the 
estimators that when substituted in for the parameters 
maximizes the likelihood function.
Desirable Properties
Probability & Statistics - 44
• Maximum likelihood is the most commonly used method of 
estimation. The main reason for this is that in most cases 
that arise in practice, MLEs have two very desirable 
properties,
1. In most cases, as the sample size n increases, the bias of the MLE 
converges to 0.
2. In most cases, as the sample size n increases, the variance of the 
MLE converges to a theoretical minimum. 
Let X ~ Bin(20, p) where p is unknown. Suppose we observe the value X
= 7. The pmf is 
   
7 13 1
7!13!
20!
f 7; p  p  p
Note: the quantity that 
maximizes the logarithm of 
a function is always the 
same quantity that 
maximize the function itself.
ln f 7; p  ln 20!ln 7!ln13!7ln p 13ln1 p
  20
7
0 ˆ 1
7 13 ln 7;   

  p
p p
f p
dp
d
Probability (Quantile-Quantile) Plots for 
Finding a Distribution
Probability & Statistics - 45
• Scientists and engineers often work with data that can be 
thought of as a random sample from some population
– In many cases, it is important to determine the probability 
distribution that approximately describes the population
• More often than not, the only way to determine an 
appropriate distribution is to examine the sample to find a 
sample distribution that fits
Finding a Distribution (1/4)
Probability & Statistics - 46
• Probability plots are a good way to determine an appropriate 
distribution
• Here is the idea: Suppose we have a random sample X1
,…,Xn
– We first arrange the data in ascending order
– Then assign increasing, evenly spaced values between 0 and 1 to 
each Xi
• There are several acceptable ways to this; the simplest is to 
assign the value (i – 0.5)/n to Xi
• The distribution that we are comparing the X’s to should have a 
mean and variance that match the sample mean and variance
– We want to plot (Xi
, F(Xi
)), if this plot resembles the cdf of the 
distribution that we are interested in, then we conclude that that is 
the distribution the data came from
Finding a Distribution (2/4)
Probability & Statistics - 47
• Example: Given a sample Xi
’s arranged in increasing order
sample mean = 5.00
sample standard deviation s = 2.00
3.01, 3.35, 4.79, 5.96, 7.89
The curve is the cdf of N(5, 22
).
If the sample point Xi
’s came 
from the distribution, they are 
likely to lie close to the curve. 
X
Q5
Q4
Q3
Q2
Q1
Finding a Distribution (3/4)
Probability & Statistics - 48
• When you use a software package, then it takes the (i –
0.5)/n assigned to each Xi
and calculates the quantile (Qi
) 
corresponding to that number from the distribution of 
interest. Then it plots each (Xi
, Qi
), 
– E.g., for the previous example (normal probability plot)
– If this plot is a reasonably straight line then you may conclude that 
the sample came from the distribution that we used to find 
quantiles
or (Empirical Quantile, Quantile) 
Qi Percentile
Finding a Distribution (4/4)
Probability & Statistics - 49
• A good rule of thumb is to require at least 30 points before 
relying on a probability plot
– E.g., a plot of the monthly productions of 255 gas wells
• The monthly productions follow a lognormal distribution!
monthly productions natural logs of monthly productions
The Central Limit Theorem (1/3)
Probability & Statistics - 50
• The Central Limit Theorem
– Let X1
,…,Xn be a random sample from a population with mean μ and 
variance σ
2
(n is large enough)
– Let be the sample mean
– Let Sn = X1+…+Xn be the sum of the sample observations. Then if n is 
sufficiently large,
•
• And approximately
n
X X
X
  n 
1 







n
X N
2
,


sample mean is approximately normal !
 
2 Sn
~ N n,n
The Central Limit Theorem (2/3)
Probability & Statistics - 51
• Example
• Rule of Thumb
– For most populations, if the sample size is greater than 30, the 
Central Limit Theorem approximation is good
Solid lines: real distribution of 
sample mean
Dashed lines: normal distributions
The Central Limit Theorem (3/3)
Probability & Statistics - 52
• Example 4.70: Let X denotes the flaws in an 1 in. length of 
copper wire, and its corresponding pmf, mean and variance 
are
– One hundred wires are sampled from this population. What is the 
probability that the average number of flaws per wire in this sample 
is less than 0.5 ?
0.5244
0.66
2




 the sample mean ~ 0.66,0.005244
Following the central limit theorem, we known that
X N

2.21  0.5  2.21 0.0136
0.005244
0.5 0.66
The -score of 0.5        



z X Z
z X
P P
Normal Approximation to the Binomial
Probability & Statistics - 53
• X ~ Bin(n,p) and if np > 10, and n(1-p) >10, then
– X ~ N(np, np(1-p)) approximately
– And approximately
 
 
  X Nnp np p n
p p N p
n Y Y Y
nX
p
n Y Y Y p X Y Y Y X n p X
n
n
n





     
  
   
 can be approximated by , 1
and
1
 ˆ be approximated by , Following the central limit theorem,if islarge enough then where , , , is a sample from Bernoulli
 Recall that ~ Bin , , then can be represented as
1 2
1 2
1 2 


 





 

n
p p
p N p
1
ˆ ,
Bin(100, 0.2) approximated by N(20, 16)
Normal Approximation to the Poisson
Probability & Statistics - 54
• Normal Approximation to the Poisson: If X ~ Poisson(λ), 
where λ > 10, then X ~ N(λ, λ)
– The Poisson can be first approximated by Binomial and then by 
Normal
1  1  if 1
2   np  p    p   p 
Note that variance of binomial
Continuity Correction
Probability & Statistics - 55
• The binomial distribution is discrete, while the normal 
distribution is continuous
• The continuity correction is an adjustment, made when 
approximating a discrete distribution with a continuous one, 
that can improve the accuracy of the approximation
– If you want to include the endpoints in your probability 
calculation, then extend each endpoint by 0.5. 
Then proceed with the calculation
– If you want exclude the endpoints in your probability
calculation, then include 0.5 less from each endpoint
in the calculation
e.g., P45  X  55 e.g., P45  X  55
Summary
Probability & Statistics - 56
• We considered various discrete distributions: Bernoulli, 
Binomial, Poisson, Hypergeometric, Geometric, Negative 
Binomial, and Multinomial
• Then we looked at some continuous distributions: Normal, 
Exponential, Gamma, and Weibull
• We learned about the Central Limit Theorem
• We discussed Normal approximations to the Binomial and 
Poisson distributions


