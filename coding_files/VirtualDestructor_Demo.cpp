#include <iostream>
#include <memory> // 情境四智慧指標需要

using namespace std;

class Base {
public:
    Base() { cout << "B "; }
    
    // 【實驗動手做】
    // 步驟 1. 先保持現在這樣（沒有 virtual），編譯執行看結果（會發現情境 3, 4 出現 Bug）。
    // 步驟 2. 把下面這行的註解「//」拿掉，變成 virtual ~Base()，再執行一次對比差異！
    virtual ~Base() { cout << "~B \n"; }
};

class Derived : public Base {
public:
    Derived() { cout << "D "; }
    ~Derived() { cout << "~D "; }
};

int main() {
    // =========================================================================
    cout << "--- 情境一：最基礎的 Stack 物件 (離開大括號會自動死亡) ---\n";
    {
        cout << "[建構] ";
        Derived obj; 
        cout << "\n[解構] ";
    } // obj 在這裡離開範疇，觸發解構
    
    // =========================================================================
    cout << "\n--- 情境二：指標與實體型態一致 (Heap 物件，手動 delete) ---\n";
    cout << "[建構] ";
    Derived* obj2 = new Derived();
    cout << "\n[解構] ";
    delete obj2; // 手動引發解構

    // =========================================================================
    cout << "\n--- 情境三：經典的「物件切割 Object Slicing」 (注意看建構與解構的怪異現象) ---\n";
    {
        cout << "[建構] ";
        // 這裡會先建構一個暫時的 Derived，然後複製給 Base 型態的 obj3
        Base obj3 = Derived(); 
        cout << "\n[解構] ";
    } // obj3 在這裡離開範疇

    // =========================================================================
    cout << "\n--- 情境四：現代 C++ 的智慧指標 Unique Pointer (離開大括號自動 delete) ---\n";
    {
        cout << "[建構] ";
        // 視角是 Base，肚子裡裝的是 Derived
        unique_ptr<Base> obj4 = make_unique<Derived>(); 
        cout << "\n[解構] ";
    } // obj4 小管家在這裡死亡，自動幫你對內部的 Base* 指標呼叫 delete

    cout << "=========================================================================\n";
    return 0;
}
