# 計算機概論 學習狀態追蹤 (Learning Status)

| 章節 (Chapter) | 精熟度 | 上次測驗日期 | 易錯盲點紀錄 (Weaknesses & Pitfalls) |
| :--- | :---: | :--- | :--- |
| 計算機組織 (Cache) | 🟡 | 2026-06-08 | 混淆 L1/L2 快取大小與速度、Write-through/Write-back 差異、TLB 的功用 |
| 資料結構與演算法 (Heap) | 🟡 | 2026-06-08 | 不清楚從無序陣列建構 Max-Heap 的最佳時間複雜度為 O(n) |
| 作業系統 (Process States) | 🟡 | 2026-06-08 | 不熟悉 Running 到 Ready 狀態轉換的原因 (如 Timer interrupt) |
| 作業系統 (Virtual Memory) | 🟡 | 2026-06-08 | 誤以為 Page Fault 是因為記憶體空間滿了，不清楚是因為頁面不在實體記憶體中 |
| 演算法 (P vs NP) | 🟡 | 2026-06-08 | 對 P, NP, NP-complete 的定義與關係不熟悉 |
| 作業系統 (Process Management) | 🟡 | 2026-06-08 | 不了解 Zombie Process 的成因 (子行程結束但父行程未讀取其狀態) |
| 計算機組織 (Pipeline Hazards) | 🔴 | 2026-06-08 | 遇到 RAW Data Hazard 不會推算 Stall cycles，忽略 WB 和 ID 的前後半週期設計 |
| 網路原理 (Subnetting) | 🔴 | 2026-06-08 | 忘記計算 Network ID 需將 IP 與 Subnet Mask 做 AND 運算，不熟網段範圍推導 |
| 計算機組織 (IEEE 754) | 🔴 | 2026-06-08 | 忘記特殊值定義，特別是 Exponent 全為 1 時 Infinity 與 NaN 的判斷 |
| 作業系統 (Page Replacement) | 🔴 | 2026-06-08 | 對 Belady's Anomaly 不熟，忘記只有 FIFO 會發生，其他都是 Stack Algorithm |
