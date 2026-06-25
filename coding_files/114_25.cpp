#include <iostream>
using namespace std;

// 新增一個全域變數來記錄目前是第幾層遞迴，用來畫出漂漂亮亮的縮排結構
int recursion_depth = 0;

int totalised(int n) {
    // 根據目前的遞迴深度，產生對應數量的空格，這樣看輸出結果會非常直覺！
    string indent = string(recursion_depth * 4, ' '); 
    
    static int accum = 0;

    // 印出：剛進入函數時，n 的值與 static 變數當前被污染（或保留）的狀態
    cout << indent << "===> [進入函數] n = " << n << ", 當前 static accum = " << accum << endl;

    if (n == 0) {
        cout << indent << "   [觸發終止條件 n == 0] 直接回傳當前的 accum = " << accum << endl;
        return accum;
    }

    // 盲點位置 1：執行累加
    accum += n;
    cout << indent << "   [執行 accum += n] 運算後 accum 變成了 = " << accum << endl;

    // 準備進入下一層遞迴，深度 + 1
    recursion_depth++;
    
    cout << indent << "   [準備呼叫遞迴] 計算: " << n << " + totalised(" << n - 1 << ")..." << endl;
    
    // 呼叫遞迴並拿到下一層傳回來的結果
    int sub_result = totalised(n - 1);
    
    // 從下一層遞迴回來了，深度 - 1
    recursion_depth--;
    
    // 盲點位置 2：這裡又把 n 拿來加上下一層傳回來的結果
    int my_return_value = n + sub_result;
    
    // 印出：回傳時的精準計算過程
    cout << indent << "<=== [離開函數] n = " << n << " 時，回傳值 = " << n << " + (下層回傳的 " << sub_result << ") = " << my_return_value << " (此時 accum 依舊是 " << accum << ")" << endl;

    return my_return_value;
}

int main() {
    cout << "--- 第一次呼叫 totalised(3) 開始 ---" << endl;
    int first = totalised(3);
    cout << ">>> 第一次呼叫最終輸出結果: " << first << "\n\n" << endl; 

    // 重置遞迴深度計數器（不影響 static 變數，純粹讓第二次呼叫的排版漂亮）
    recursion_depth = 0; 

    cout << "--- 第二次呼叫 totalised(2) 開始 ---" << endl;
    int second = totalised(2);
    cout << ">>> 第二次呼叫最終輸出結果: " << second << "\n\n" << endl; 

    cin.get();
    return 0;
}
