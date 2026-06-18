import os
import glob
import torch
import pypdfium2 as pdfium
from transformers import AutoProcessor, AutoModelForImageTextToText

def ocr_pdf(pdf_path, model, processor, device):
    print(f"Processing {pdf_path} with GOT-OCR-2.0...")
    text = ""
    try:
        pdf = pdfium.PdfDocument(pdf_path)
        for i in range(len(pdf)):
            print(f"  Page {i+1}/{len(pdf)}")
            page = pdf[i]
            # render page
            bitmap = page.render(scale=2)
            pil_image = bitmap.to_pil()
            
            # ocr
            inputs = processor(pil_image, return_tensors="pt", format=True).to(device)
            generate_ids = model.generate(
                **inputs,
                do_sample=False,
                tokenizer=processor.tokenizer,
                stop_strings="<|im_end|>",
                max_new_tokens=4096,
            )
            
            output = processor.decode(
                generate_ids[0, inputs["input_ids"].shape[1]:], 
                skip_special_tokens=True
            )
            text += output + "\n"
    except Exception as e:
        print(f"Error processing {pdf_path}: {e}")
        text += f"Error processing {pdf_path}: {e}\n"
    return text

def main():
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")
    
    print("Loading model stepfun-ai/GOT-OCR-2.0-hf...")
    # trust_remote_code=True is required for this model
    model = AutoModelForImageTextToText.from_pretrained(
        "stepfun-ai/GOT-OCR-2.0-hf", 
        device_map=device, 
        trust_remote_code=True
    )
    processor = AutoProcessor.from_pretrained(
        "stepfun-ai/GOT-OCR-2.0-hf", 
        trust_remote_code=True
    )
    
    # Process 英文
    eng_dir = os.path.join("Reference", "台聯大考古題", "英文")
    if os.path.exists(eng_dir):
        eng_pdfs = glob.glob(os.path.join(eng_dir, "*.pdf"))
        eng_pdfs.sort(reverse=True)
        eng_output_path = os.path.join(eng_dir, "歷屆英文_OCR_cache.md")
        
        print(f"Found {len(eng_pdfs)} PDFs in {eng_dir}")
        with open(eng_output_path, "w", encoding="utf-8") as f:
            f.write("# 國立台灣聯合大學系統 歷屆英文 考古題 OCR 辨識結果\n\n")
            f.write("> **說明**：本檔案由 GOT-OCR-2.0 模型自動提取原始 PDF 考卷內容。\n\n")
            for pdf in eng_pdfs:
                f.write(f"## 【{os.path.basename(pdf)}】\n\n")
                f.write("```text\n")
                extracted_text = ocr_pdf(pdf, model, processor, device)
                f.write(extracted_text)
                f.write("\n```\n\n---\n")
                f.flush()
        print(f"English OCR Done! Output saved to {eng_output_path}")
    else:
        print(f"Directory {eng_dir} not found.")

if __name__ == "__main__":
    main()
