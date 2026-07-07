import os
from PIL import Image, ImageDraw, ImageFont
import glob

def add_text_overlay(image_path, text, output_path):
    try:
        # Load image
        img = Image.open(image_path).convert("RGBA")
        width, height = img.size
        
        # Create a drawable layer
        overlay = Image.new('RGBA', img.size, (255, 255, 255, 0))
        draw = ImageDraw.Draw(overlay)
        
        # Try to load a bold Chinese font, fallback to default if not found
        font_size = int(width * 0.05) # Adjust font size based on image width
        font_size = max(24, font_size) # Minimum font size
        
        try:
            # Windows default JhengHei Bold
            font = ImageFont.truetype("C:\\Windows\\Fonts\\msjhbd.ttc", font_size)
        except IOError:
            try:
                # Standard JhengHei
                font = ImageFont.truetype("C:\\Windows\\Fonts\\msjh.ttc", font_size)
            except IOError:
                font = ImageFont.load_default()

        # Calculate text bounding box
        try:
            left, top, right, bottom = draw.textbbox((0, 0), text, font=font)
            text_width = right - left
            text_height = bottom - top
        except AttributeError:
            text_width, text_height = draw.textsize(text, font=font)
        
        # Padding for the background strip
        padding = 20
        strip_height = text_height + (padding * 2)
        
        # Draw a semi-transparent black strip at the bottom
        strip_y = height - strip_height - 20 # 20px from bottom
        draw.rectangle(
            [(0, strip_y), (width, strip_y + strip_height)],
            fill=(0, 0, 0, 180) # Semi-transparent black
        )
        
        # Draw the text in the center of the strip
        text_x = (width - text_width) // 2
        text_y = strip_y + padding
        
        # Draw shadow
        draw.text((text_x + 2, text_y + 2), text, font=font, fill=(0, 0, 0, 255))
        # Draw main text (White or Yellow for highlight)
        text_color = (255, 223, 0, 255) if "專修" in text or "保固" in text else (255, 255, 255, 255)
        draw.text((text_x, text_y), text, font=font, fill=text_color)
        
        # Merge layers and save
        final_img = Image.alpha_composite(img, overlay).convert("RGB")
        final_img.save(output_path, quality=95)
        
    except Exception as e:
        print(f"處理 {image_path} 時發生錯誤: {e}")

# 所有需要的文字變化
texts = [
    "專修連點 / 滾輪跳動 / 游標不動",
    "支援 Logitech Lift 維修，細心拆卸",
    "為利於完整測試，寄修請隨附 USB 接收器",
    "MX Vertical / Master 2S 實機維修紀錄",
    "完修後均妥善防撞包裝寄回"
]

input_dir = "shopee_images_input"
output_dir = "shopee_images_output"

if __name__ == "__main__":
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    # 抓取資料夾內所有圖檔 (含 webp)
    image_files = []
    for ext in ('*.webp', '*.jpg', '*.jpeg', '*.png'):
        image_files.extend(glob.glob(os.path.join(input_dir, ext)))
        
    if not image_files:
        print(f"資料夾 '{input_dir}' 內沒有任何圖片！請將蝦皮下載的檔案直接放入。")
    else:
        print(f"找到 {len(image_files)} 張圖片。")
        print("因為蝦皮下載的檔名為亂碼，程式將為『每張圖片』分別產生 5 種不同的加字版本...")
        print("-" * 50)
        
        for idx, img_path in enumerate(image_files):
            # 為每一張圖片產生 5 種文字的圖片
            for text_idx, text in enumerate(texts):
                out_name = f"圖{idx+1}_字樣{text_idx+1}.jpg"
                out_path = os.path.join(output_dir, out_name)
                add_text_overlay(img_path, text, out_path)
            print(f"已完成圖片 {idx+1} 的 5 種字樣產生。")
                
        print("-" * 50)
        print(f"處理完成！所有圖片皆已存為 JPG 格式。")
        print(f"請打開 '{output_dir}' 資料夾，以視覺挑選最正確的組合上傳至蝦皮，其餘不匹配的直接刪除即可！")
