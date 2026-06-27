import os
import glob
import urllib.request
import pypdfium2 as pdfium
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

TESSDATA_DIR = os.path.abspath("tessdata")
os.environ["TESSDATA_PREFIX"] = os.path.abspath(".")
CHI_TRA_URL = "https://github.com/tesseract-ocr/tessdata/raw/main/chi_tra.traineddata"
ENG_URL = "https://github.com/tesseract-ocr/tessdata/raw/main/eng.traineddata"
TESSDATA_FILE = os.path.join(TESSDATA_DIR, "chi_tra.traineddata")
ENG_FILE = os.path.join(TESSDATA_DIR, "eng.traineddata")

def setup_tessdata():
    if not os.path.exists(TESSDATA_DIR):
        os.makedirs(TESSDATA_DIR)
    if not os.path.exists(TESSDATA_FILE):
        print("Downloading chi_tra.traineddata...")
        urllib.request.urlretrieve(CHI_TRA_URL, TESSDATA_FILE)
        print("Download complete.")
    if not os.path.exists(ENG_FILE):
        print("Downloading eng.traineddata...")
        urllib.request.urlretrieve(ENG_URL, ENG_FILE)
        print("Download complete.")

def ocr_pdf(pdf_path):
    print(f"Processing {pdf_path}...")
    text = ""
    try:
        pdf = pdfium.PdfDocument(pdf_path)
        for i in range(len(pdf)):
            page = pdf[i]
            # render page
            bitmap = page.render(scale=2)
            pil_image = bitmap.to_pil()
            # ocr
            custom_config = f'--tessdata-dir {TESSDATA_DIR} -l eng+chi_tra'
            page_text = pytesseract.image_to_string(pil_image, config=custom_config)
            text += page_text + "\n"
    except Exception as e:
        print(f"Error processing {pdf_path}: {e}")
        text = f"Error processing {pdf_path}: {e}\n"
    return text

def main():
    setup_tessdata()
    
    pdfs = glob.glob("*.pdf")
    pdfs.sort(reverse=True) # newest first
    
    with open("歷屆計算機概論_OCR_cache.md", "w", encoding="utf-8") as f:
        f.write("# 國立台灣聯合大學系統 歷屆計算機概論 考古題 OCR 辨識結果\n\n")
        f.write("> **說明**：本檔案由 OCR 程式自動提取原始 PDF 考卷內容。\n\n")
        
        for pdf in pdfs:
            f.write(f"## 【{pdf}】\n\n")
            f.write("```text\n")
            extracted_text = ocr_pdf(pdf)
            f.write(extracted_text)
            f.write("\n```\n\n---\n")
            f.flush()
    print("OCR Done! Output saved to 歷屆計算機概論_OCR_cache.md")

if __name__ == "__main__":
    main()
