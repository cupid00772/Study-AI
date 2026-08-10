# IC995 測試機台數據匯出教學

這份文件是要給 IC995 的朋友，說明如何使用 Python 將機台測試的數據輸出成 CSV 或 Excel 檔案。

## 方案一：輸出成 CSV 檔案 (最簡單、不需安裝額外套件)

CSV 是一種純文字格式，Excel 可以直接打開。Python 內建支援這個格式，適合用來記錄簡單的報表。

### 範例程式碼

```python
import csv
import datetime

# 假設這是從機台讀取到的測試數據
# 通常數據會是一個列表 (list)，裡面包含多筆紀錄 (dictionary)
test_data = [
    {"測試時間": "2026-07-20 10:00", "產品型號": "IC-A01", "電壓(V)": 3.3, "電流(mA)": 150, "結果": "PASS"},
    {"測試時間": "2026-07-20 10:05", "產品型號": "IC-A02", "電壓(V)": 3.2, "電流(mA)": 148, "結果": "PASS"},
    {"測試時間": "2026-07-20 10:10", "產品型號": "IC-A03", "電壓(V)": 3.4, "電流(mA)": 155, "結果": "FAIL"},
]

# 設定輸出的檔案名稱
filename = f"測試紀錄_{datetime.date.today()}.csv"

# 開啟檔案準備寫入，加上 encoding='utf-8-sig' 可以避免 Excel 打開時中文變成亂碼
with open(filename, mode='w', newline='', encoding='utf-8-sig') as file:
    # 定義欄位名稱 (Excel 的第一列標題)
    fieldnames = ["測試時間", "產品型號", "電壓(V)", "電流(mA)", "結果"]
    
    # 建立 CSV 寫入器
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    
    # 寫入標題列
    writer.writeheader()
    
    # 逐筆寫入測試數據
    for data in test_data:
        writer.writerow(data)

print(f"資料已成功匯出至 {filename}")
```

---

## 方案二：輸出成真正的 Excel 檔案 (.xlsx)

如果對方希望是真正的 Excel 檔案，可以使用 `pandas` 套件。這個方法寫起來更簡潔，處理大量資料也方便，但需要先安裝套件。

**安裝套件：**
請對方在終端機 (命令提示字元) 輸入以下指令安裝：
```bash
pip install pandas openpyxl
```

### 範例程式碼

```python
import pandas as pd
import datetime

# 假設這是從機台讀取到的測試數據
test_data = [
    {"測試時間": "2026-07-20 10:00", "產品型號": "IC-A01", "電壓(V)": 3.3, "電流(mA)": 150, "結果": "PASS"},
    {"測試時間": "2026-07-20 10:05", "產品型號": "IC-A02", "電壓(V)": 3.2, "電流(mA)": 148, "結果": "PASS"},
    {"測試時間": "2026-07-20 10:10", "產品型號": "IC-A03", "電壓(V)": 3.4, "電流(mA)": 155, "結果": "FAIL"},
]

# 將數據轉換成 pandas 的資料表 (DataFrame)
df = pd.DataFrame(test_data)

# 設定輸出的檔案名稱
filename = f"測試紀錄_{datetime.date.today()}.xlsx"

# 直接將資料表匯出成 Excel 檔案
# index=False 代表不要輸出左側預設的 0, 1, 2 索引列
df.to_excel(filename, index=False, engine='openpyxl')

print(f"資料已成功匯出至 {filename}")
```

---

## 給 IC995 朋友的後續實作建議

因為不知道機台實際是怎麼運作的，所以他在套用上面的程式碼時，可以參考以下步驟思考：

1. **確認機台的讀取方式**：機台是用什麼方式把數值傳給 Python 的？
   * 是一串從 Serial/COM port (RS232) 讀到的文字？
   * 還是機台自己會產生純文字檔 (TXT)？
   * 只要知道怎麼抓到這些數值，把數值塞進上面範例程式碼裡的 `test_data` 列表裡面就可以了。
2. **選擇儲存格式**：
   * 如果只是要單純的報表，選 **方案一 (CSV)** 就好，不用額外安裝東西。
   * 如果之後還想讓 Python 自動標記顏色 (例如 FAIL 標紅字)，再考慮用 **方案二 (Excel)** 搭配 `openpyxl` 去進階操作。
3. **資料寫入的時機**：
   * 他可以設定成「每測試完一顆 IC 就立刻寫入一行 (Append 模式)」，這樣萬一當機資料才不會不見。
   * 或者是「測試完一批，累積一整天，再一起產生一個新的檔案」。
