import fitz  # PyMuPDF
import sys
import os

def extract_pdf(filepath):
    try:
        doc = fitz.open(filepath)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        filepath = sys.argv[1]
        print(extract_pdf(filepath)[:500]) # Print first 500 characters
    else:
        for file in os.listdir('.'):
            if file.endswith('.pdf'):
                print(f"--- {file} ---")
                text = extract_pdf(file)
                if text.strip():
                    print("Text found:", text[:100].replace('\n', ' '))
                else:
                    print("No text found. OCR might be needed.")
