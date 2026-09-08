import os
import pypdf
from win32com import client as wc
import time

def extract_pdf(pdf_path, txt_path):
    try:
        with open(pdf_path, 'rb') as f:
            reader = pypdf.PdfReader(f)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Extracted {pdf_path} to {txt_path}")
    except Exception as e:
        print(f"Failed to extract {pdf_path}: {e}")

def extract_doc(doc_path, txt_path):
    try:
        # Use python-docx if it's docx masquerading as doc, or try win32com
        word = wc.Dispatch("Word.Application")
        doc = word.Documents.Open(os.path.abspath(doc_path))
        text = doc.Content.Text
        doc.Close()
        word.Quit()
        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Extracted {doc_path} to {txt_path}")
    except Exception as e:
        print(f"Failed to extract {doc_path} via Word COM: {e}")
        # fallback to reading as text if possible
        try:
            with open(doc_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                with open(txt_path, 'w', encoding='utf-8') as fw:
                    fw.write(content[:1000])
        except:
            pass

base_path = r"c:\Users\Cupid\Downloads\Study-space\Reference\Transfer\中央大學報到\FCU Syllabus"
pdf1 = os.path.join(base_path, "國立中央大學學分抵免辦法(113.1.10).pdf")
pdf2 = os.path.join(base_path, "中央大學資訊管理學系學分抵免辦法.pdf")
doc1 = os.path.join(base_path, "05 學分抵免申請表.doc")

extract_pdf(pdf1, "pdf1.txt")
extract_pdf(pdf2, "pdf2.txt")
extract_doc(doc1, "doc1.txt")
