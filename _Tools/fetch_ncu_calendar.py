#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
中央大學官方校曆重要日程同步工具 (NCU Academic Calendar Sync)
負責擷取與維護 NCU 教務處公告之重大日程（期中考、期末考、加退選、假期等）
並同步更新至 academic_tracker.json
"""

import json
import os
import sys

TRACKER_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "academic_tracker.json")

# 中央大學官方校曆重要里程碑 (含 113-1, 113-2, 114-1)
NCU_CALENDAR_EVENTS = [
    {
        "id": "ncu-113-1-midterm",
        "title": "113-1 期中成績評量週",
        "category": "Official_Exam",
        "startDate": "2024-11-11",
        "endDate": "2024-11-22",
        "scope": "全校課程",
        "description": "中央大學 113 學年度第一學期期中評量（由授課教師自行排定日程）",
        "isMajor": True
    },
    {
        "id": "ncu-113-1-final",
        "title": "113-1 期末考試週",
        "category": "Official_Exam",
        "startDate": "2024-12-16",
        "endDate": "2024-12-20",
        "scope": "全校課程",
        "description": "中央大學 113 學年度第一學期期末考試週（若教師另有訂定從其規定）",
        "isMajor": True
    },
    {
        "id": "ncu-113-1-flexible",
        "title": "113-1 彈性教學週 (第17~18週)",
        "category": "Milestone",
        "startDate": "2024-12-30",
        "endDate": "2025-01-10",
        "scope": "全校",
        "description": "教師彈性教學與期末綜合評量",
        "isMajor": False
    },
    {
        "id": "ncu-113-winter-break",
        "title": "寒假開始",
        "category": "Holiday",
        "startDate": "2025-01-13",
        "endDate": "2025-02-16",
        "scope": "全校",
        "description": "113 學年度寒假",
        "isMajor": False
    },
    {
        "id": "ncu-113-2-start",
        "title": "113-2 開學日",
        "category": "Milestone",
        "startDate": "2025-02-17",
        "endDate": "2025-02-17",
        "scope": "全校",
        "description": "113 學年度第二學期開始上課",
        "isMajor": True
    },
    {
        "id": "ncu-113-2-midterm",
        "title": "113-2 期中成績評量週",
        "category": "Official_Exam",
        "startDate": "2025-04-14",
        "endDate": "2025-04-25",
        "scope": "全校課程",
        "description": "113 學年度第二學期期中評量（授課教師自行安排）",
        "isMajor": True
    },
    {
        "id": "ncu-113-2-final",
        "title": "113-2 期末成績評量週",
        "category": "Official_Exam",
        "startDate": "2025-06-02",
        "endDate": "2025-06-20",
        "scope": "全校課程",
        "description": "113 學年度第二學期期末評量與彈性週",
        "isMajor": True
    },
    {
        "id": "ncu-114-1-start",
        "title": "114-1 開學上課日",
        "category": "Milestone",
        "startDate": "2025-09-01",
        "endDate": "2025-09-01",
        "scope": "全校",
        "description": "114 學年度第一學期開始上課",
        "isMajor": True
    },
    {
        "id": "ncu-114-1-midterm",
        "title": "114-1 期中成績評量週",
        "category": "Official_Exam",
        "startDate": "2025-10-20",
        "endDate": "2025-10-23",
        "scope": "全校課程",
        "description": "114 學年度第一學期期中評量（各授課教師自行安排）",
        "isMajor": True
    }
]

def sync_calendar():
    if not os.path.exists(TRACKER_FILE):
        print(f"Academic tracker file not found at: {TRACKER_FILE}")
        return False
        
    try:
        with open(TRACKER_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        data["calendar_events"] = NCU_CALENDAR_EVENTS
        
        with open(TRACKER_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
        print(f"Successfully synced {len(NCU_CALENDAR_EVENTS)} NCU calendar events to academic_tracker.json")
        return True
    except Exception as e:
        print(f"Error syncing calendar events: {e}")
        return False

if __name__ == "__main__":
    sync_calendar()

