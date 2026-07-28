import os
from playwright.sync_api import sync_playwright

def run():
    print("🚀 啟動自動化瀏覽器中...")
    with sync_playwright() as p:
        # 開啟看得見的瀏覽器
        browser = p.chromium.launch(headless=False)
        context = browser.new_context()
        page = context.new_page()
        
        # 導向逢甲課程查詢系統
        page.goto("https://coursesearch01.fcu.edu.tw/main.aspx")
        print("✅ 瀏覽器已開啟！請在彈出的瀏覽器中正常登入，並找到你的課程大綱頁面。")
        
        save_dir = "FCU_Syllabus_PDFs"
        os.makedirs(save_dir, exist_ok=True)
        
        print("\n" + "="*50)
        print("【✨ 半自動 PDF 下載神器 ✨】")
        print(f"儲存資料夾: {os.path.abspath(save_dir)}")
        print("操作說明：")
        print("1. 在彈出的瀏覽器中，點開你要下載的「教學大綱」網頁。")
        print("2. 回到這個終端機視窗，輸入該課程的名字（例如：資料結構），然後按 Enter。")
        print("3. 程式會自動將目前網頁轉成高畫質 PDF 存下來！(完全不用點系統列印)")
        print("4. 輸入 'q' 即可離開程式。")
        print("="*50 + "\n")
        
        while True:
            course_name = input("👉 輸入課程名稱 (按 Enter 預設使用網頁標題，輸入 'q' 離開): ").strip()
            if course_name.lower() == 'q':
                break
            
            # 如果沒有輸入，就用網頁標題當檔名
            if not course_name:
                course_name = page.title().replace("/", "_").replace("\\", "_").replace(":", "_")
            
            file_path = os.path.join(save_dir, f"{course_name}.pdf")
            try:
                # Playwright 內建的 PDF 渲染功能，完美避開原生列印視窗
                page.pdf(path=file_path, format="A4", print_background=True)
                print(f"✅ 成功儲存 PDF: {file_path}\n")
            except Exception as e:
                print(f"❌ 儲存失敗: {e}\n")
                
        browser.close()
        print("👋 程式已結束，瀏覽器已關閉。")

if __name__ == "__main__":
    run()
