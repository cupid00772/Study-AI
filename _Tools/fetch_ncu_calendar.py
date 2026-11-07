#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
中央大學官方校曆重要日程同步工具 (NCU Academic Calendar Sync)
負責擷取與維護 NCU 教務處公告之重大日程（115 學年度 2026 ~ 2027 最新校曆）
並同步更新至 academic_tracker.json
"""

import json
import os
import sys

TRACKER_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "academic_tracker.json")

# 中央大學官方校曆重要里程碑 (115 學年度 2026 ~ 2027 最新經第822次行政會議通過日程)
NCU_CALENDAR_EVENTS = [
    {
        "id": "ncu-115-1-start",
        "title": "115-1 註冊與開始上課日",
        "category": "Milestone",
        "startDate": "2026-09-07",
        "endDate": "2026-09-07",
        "scope": "全校",
        "description": "國立中央大學 115 學年度第一學期全校學生註冊與開始上課",
        "isMajor": True
    },
    {
        "id": "ncu-115-1-midterm",
        "title": "115-1 期中成績評量週",
        "category": "Official_Exam",
        "startDate": "2026-10-27",
        "endDate": "2026-11-02",
        "scope": "全校課程",
        "description": "國立中央大學 115 學年度第一學期期中評量（評量時間由各授課教師自行排定日程）",
        "isMajor": True
    },
    {
        "id": "ncu-115-sports-day",
        "title": "全校運動大會（全校停課）",
        "category": "Holiday",
        "startDate": "2026-11-11",
        "endDate": "2026-11-11",
        "scope": "全校",
        "description": "國立中央大學全校運動大會，日間部全校停課",
        "isMajor": True
    },
    {
        "id": "ncu-115-2-course-selection",
        "title": "115-2 次學期課程初選",
        "category": "Milestone",
        "startDate": "2026-12-11",
        "endDate": "2026-12-18",
        "scope": "全校學生",
        "description": "115 學年度第二學期網路選課初選階段",
        "isMajor": True
    },
    {
        "id": "ncu-115-1-final",
        "title": "115-1 期末考試週",
        "category": "Official_Exam",
        "startDate": "2026-12-21",
        "endDate": "2026-12-24",
        "scope": "全校課程",
        "description": "國立中央大學 115 學年度第一學期期末考試週（各授課教師自行排定日程）",
        "isMajor": True
    },
    {
        "id": "ncu-115-winter-break",
        "title": "寒假開始（行憲紀念日）",
        "category": "Holiday",
        "startDate": "2026-12-25",
        "endDate": "2027-02-22",
        "scope": "全校",
        "description": "115 學年度寒假開始，同日逢行憲紀念日放假",
        "isMajor": True
    },
    {
        "id": "ncu-115-2-start",
        "title": "115-2 註冊與開始上課日",
        "category": "Milestone",
        "startDate": "2027-02-23",
        "endDate": "2027-02-23",
        "scope": "全校",
        "description": "115 學年度第二學期全校學生註冊、開始上課",
        "isMajor": True
    },
    {
        "id": "ncu-115-2-midterm",
        "title": "115-2 期中成績評量週",
        "category": "Official_Exam",
        "startDate": "2027-04-08",
        "endDate": "2027-04-14",
        "scope": "全校課程",
        "description": "115 學年度第二學期期中評量（各授課教師自行排定日程）",
        "isMajor": True
    },
    {
        "id": "ncu-115-2-final",
        "title": "115-2 期末成績評量週",
        "category": "Official_Exam",
        "startDate": "2027-05-31",
        "endDate": "2027-06-04",
        "scope": "全校課程",
        "description": "115 學年度第二學期期末考試週",
        "isMajor": True
    },
    {
        "id": "ncu-115-summer-break",
        "title": "暑假開始",
        "category": "Holiday",
        "startDate": "2027-06-21",
        "endDate": "2027-08-31",
        "scope": "全校",
        "description": "115 學年度暑假開始",
        "isMajor": True
    }
]

def sync_calendar():
    if not os.path.exists(TRACKER_FILE):
        print(f"Error: {TRACKER_FILE} not found!")
        return False

    with open(TRACKER_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    data['calendar_events'] = NCU_CALENDAR_EVENTS
    data['last_updated'] = "2026-11-07T20:15:00Z"

    with open(TRACKER_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Successfully updated {len(NCU_CALENDAR_EVENTS)} calendar events in {TRACKER_FILE} (115 學年度)")
    return True

if __name__ == '__main__':
    sync_calendar()
