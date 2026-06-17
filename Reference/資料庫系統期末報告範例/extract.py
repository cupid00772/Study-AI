import os
import sys
import docx
from pypdf import PdfReader

def extract_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join([p.text for p in doc.paragraphs])

def extract_pdf(file_path):
    reader = PdfReader(file_path)
    return "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])

def main():
    files = [
        "Project 06期末報告說明.docx",
        "第九組.pdf",
        "第九組專題企畫書.pdf"
    ]
    for f in files:
        try:
            if f.endswith(".docx"):
                text = extract_docx(f)
            elif f.endswith(".pdf"):
                text = extract_pdf(f)
            else:
                continue
            
            with open(f + ".txt", "w", encoding="utf-8") as out_f:
                out_f.write(text)
            print(f"Extracted {f}")
        except Exception as e:
            print(f"Failed to extract {f}: {e}")

if __name__ == "__main__":
    main()
