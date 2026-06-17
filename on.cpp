#include <bits/stdc++.h>
using namespace std;

class base {
public:
    virtual void print1() {
        cout << "base1 \n";
    }
};

class deri1 : public base {
public:
    virtual void print1() {
        cout << "deri1 \n";
    }
};

class deri2 : public deri1 {
public:
    void print1() {
        cout << "deri2 \n";
    }
};

signed main() {
    base *a;
    a = new deri2();   // 父類別指標指向子類別物件
    a -> print1();
    return 0;
}
