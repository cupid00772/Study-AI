import zipfile
import re
import os

docx_path = r'c:\Users\cupid\Downloads\Stuty-space\Reference\傅立葉分析\課堂學習單_06.16.docx'
out_path = r'c:\Users\cupid\Downloads\Stuty-space\Reference\傅立葉分析\docx_content.txt'

try:
    with zipfile.ZipFile(docx_path) as docx:
        xml_content = docx.read('word/document.xml').decode('utf-8')
        # 提取文字
        text_list = re.findall(r'<w:t(?: xml:space="preserve")?>(.*?)</w:t>', xml_content)
        text = '\n'.join(text_list)
        
        with open(out_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"成功提取 Word 內容並儲存至 {out_path}，請用文字編輯器開啟該檔案並將內容貼給 AI。")
        print("\n預覽內容：")
        print(text[:200] + "...\n")
except Exception as e:
    print(f"發生錯誤: {e}")
