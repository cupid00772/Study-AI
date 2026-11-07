import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def create_tem_report():
    doc = Document()

    # Set page margins (Standard A4: 2.54 cm / 1 inch)
    for section in doc.sections:
        section.top_margin = Inches(0.9)
        section.bottom_margin = Inches(0.9)
        section.left_margin = Inches(0.9)
        section.right_margin = Inches(0.9)
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)

    # Base font setting function
    def format_run(run, font_name="微軟正黑體", size_pt=10.5, bold=False, italic=False, color_rgb=(0, 0, 0)):
        run.font.name = font_name
        run._element.rPr.rFonts.set(qn('w:eastAsia'), font_name)
        run.font.size = Pt(size_pt)
        run.font.bold = bold
        run.font.italic = italic
        run.font.color.rgb = RGBColor(*color_rgb)

    def add_p(text="", align=WD_ALIGN_PARAGRAPH.LEFT, space_before=0, space_after=3, line_spacing=1.15):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.line_spacing = line_spacing
        if text:
            r = p.add_run(text)
            format_run(r, size_pt=10.5)
        return p

    def add_heading_1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        format_run(r, size_pt=14, bold=True, color_rgb=(20, 50, 90))
        return p

    def add_heading_2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        format_run(r, size_pt=12, bold=True, color_rgb=(30, 70, 120))
        return p

    def add_heading_3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        format_run(r, size_pt=10.5, bold=True, color_rgb=(40, 40, 40))
        return p

    def add_caption(fig_label, caption_text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.15
        
        r1 = p.add_run(fig_label + "　")
        format_run(r1, size_pt=9.5, bold=True, color_rgb=(40, 40, 40))
        
        r2 = p.add_run(caption_text)
        format_run(r2, size_pt=9.5, bold=False, color_rgb=(60, 60, 60))
        return p

    def set_cell_border_none(cell):
        tcPr = cell._element.get_or_add_tcPr()
        tcBorders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>\n'
            f'  <w:top w:val="none"/>\n'
            f'  <w:left w:val="none"/>\n'
            f'  <w:bottom w:val="none"/>\n'
            f'  <w:right w:val="none"/>\n'
            f'</w:tcBorders>'
        )
        tcPr.append(tcBorders)

    def add_side_by_side_images(img1_path, cap1_label, cap1_text, img2_path, cap2_label, cap2_text):
        tbl = doc.add_table(rows=2, cols=2)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        tbl.autofit = False

        col_widths = [Inches(3.2), Inches(3.2)]

        # Row 0: Images
        row0 = tbl.rows[0]
        for col_idx, cell in enumerate(row0.cells):
            set_cell_border_none(cell)
            cell.width = col_widths[col_idx]
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            img_p = img1_path if col_idx == 0 else img2_path
            if os.path.exists(img_p):
                r = p.add_run()
                r.add_picture(img_p, width=Inches(3.05))

        # Row 1: Captions
        row1 = tbl.rows[1]
        for col_idx, cell in enumerate(row1.cells):
            set_cell_border_none(cell)
            cell.width = col_widths[col_idx]
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(6)
            p.paragraph_format.line_spacing = 1.15
            
            lbl = cap1_label if col_idx == 0 else cap2_label
            txt = cap1_text if col_idx == 0 else cap2_text
            
            r1 = p.add_run(lbl + "　")
            format_run(r1, size_pt=9.0, bold=True, color_rgb=(40, 40, 40))
            r2 = p.add_run(txt)
            format_run(r2, size_pt=9.0, bold=False, color_rgb=(60, 60, 60))

        # Blank space after table
        p_after = doc.add_paragraph()
        p_after.paragraph_format.space_before = Pt(0)
        p_after.paragraph_format.space_after = Pt(4)

    def add_single_image(img_path, cap_label, cap_text, width_inches=4.8):
        if os.path.exists(img_path):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(2)
            r = p.add_run()
            r.add_picture(img_path, width=Inches(width_inches))
        add_caption(cap_label, cap_text)

    # Base image dir
    img_dir = r"c:\Users\Cupid\Downloads\Study-space\Reference\NCU_Classes\通識地球物理\校園實習\校園地電實習\report\images_tem"

    # --- Document Header ---
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(12)
    p_title.paragraph_format.space_after = Pt(4)
    r_title = p_title.add_run("通識地球物理：地電交流法 (TEM) 實習心得報告")
    format_run(r_title, size_pt=17, bold=True, color_rgb=(20, 50, 90))

    p_meta = doc.add_paragraph()
    p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_meta.paragraph_format.space_before = Pt(2)
    p_meta.paragraph_format.space_after = Pt(14)
    r_meta = p_meta.add_run("系級：資管二　　姓名：張承新　　實習日期：2026 年 10 月 12 日")
    format_run(r_meta, size_pt=10.5, bold=False, color_rgb=(70, 70, 70))

    # --- 引言 ---
    p_intro = add_p()
    r = p_intro.add_run(
        "地電探勘為應用地球物理學中極具代表性之電磁探測技術，透過在地表激發並觀測電磁場響應，用以反演地下地層之電阻率 ρ 與電導率 σ 分布。相較於前次以人工注入穩態直流電為基礎的「地電直流法（Direct Current Resistivity Method）」，本次實習採用屬於時間域電磁法（Time-Domain Electromagnetic Method, TDEM）的暫態電磁法（Transient Electromagnetic Method, 簡稱 TEM）。"
    )
    format_run(r)

    p_intro2 = add_p()
    r = p_intro2.add_run(
        "TEM 技術無須在地面打入金屬電極棒，而是利用「地表發射線圈（Transmitter, Tx）」與「接收線圈（Receiver, Rx）」進行純電磁感應耦合。本報告分為三大核心章節：第一部分闡述 TEM 法之物理原理與「時間換取深度」的電磁擴散機制；第二部分詳述於中央大學科學一館前進行的五項經典物理模擬實驗（包含良導體鋁板與非導體地層之響應對比、背景電磁雜訊測定、鋁板增厚效應、鋁板內部電磁波傳遞速率測定、以及封閉迴圈模擬渦電流現象）；第三部分完整記錄於中央大學地下水觀測井場進行的野外網格化實測、金屬井蓋干擾效應剖析，並比對各深度時間閘門（Time Window）導電性反演結果與校園地下水層之空間分布；最後針對本次實習流程、儀器操作細節與物理現象提出深入的理性心得與反思。"
    )
    format_run(r)

    # --- 1. TEM 原理 ---
    add_heading_1("1. TEM 原理")
    p_p1 = add_p()
    r = p_p1.add_run(
        "暫態電磁法（TEM）之基本物理架構奠基於法拉第電磁感應定律（Faraday's Law of Induction）與安培－馬克士威定律（Ampère-Maxwell Law）。其基本量測配置為在地表鋪設發射線圈（Tx）與接收線圈（Rx），其實驗運作與地下電磁響應流程如下（如圖 1 所示）："
    )
    format_run(r)

    p_steps = add_p()
    p_steps.paragraph_format.left_indent = Inches(0.2)
    r = p_steps.add_run(
        "1. 一次磁場之建立：在地表發射線圈 Tx 中通入穩定直流電（數安培至十數安培），在周圍空間與地下介質中建立起穩態的一次磁場（Primary Magnetic Field, Bp）。\n"
        "2. 急遽關斷與渦電流激發：當一次磁場穩定後，發射機在極短時間內（斜坡關斷時間 Turn-off time，約數微秒至數十微秒，μs）強制切斷發射電流。依據法拉第定律 ∇×E = -∂B/∂t，磁場之急遽消失迫使地下導電地層內部感應出同心圓封閉狀之感應電動勢，進而產生「渦電流（Eddy currents）」。\n"
        "3. 感應煙圈向下擴散（Smoke Rings）：地下渦電流的強度並非停滯不變，而是因地層介質具有電阻而逐漸發生歐姆損耗（Ohmic dissipation）。較淺部的渦電流衰減消失，同時在更深、更廣的地下介質中誘發出新的感應電流，如同向下、向外擴散沉降的「煙圈（Smoke rings）」。\n"
        "4. 二次磁場觀測與「時間即深度」：地下擴散之渦電流衰減過程中向地表輻射二次感應磁場（Secondary Magnetic Field, Bs）。置於地表的接收線圈 Rx 透過量測二次磁場隨時間變化的感應電壓衰減曲線 V(t) = -∂Φ/∂t，即可推估地下介質之電導性。關斷後的極早期（Early-time）反映淺部地層；關斷後的晚期時域（Late-time）則反映深部地層，實現「以時間換取深度」之核心優勢。"
    )
    format_run(r)

    add_single_image(
        os.path.join(img_dir, "fig1_tem_principle.jpg"),
        "圖 1",
        "TEM 暫態電磁法探勘原理示意圖：地表發射線圈 Tx 通入直流電建立一次磁場，電流切斷瞬間因電磁感應在地下導電介質激發渦電流圈，隨時間如煙圈般向下擴散，其二次磁場被地表 Rx 線圈接收。",
        width_inches=5.6
    )

    # --- 2. TEM 物理模擬 ---
    add_heading_1("2. TEM 物理模擬")
    p_m_intro = add_p()
    r = p_m_intro.add_run(
        "TEM 儀器本質上是一部電腦化、具備超高速取樣與高動態範圍（High Dynamic Range）之微微電壓計（Micro-voltmeter），專門量測發射線圈 Tx 斷電後，接收線圈 Rx 端所感應出的微弱暫態電壓衰減響應曲線。本次實習採用 Monash Geoscope TerraTEM 探勘系統，於中央大學科學一館北側草坪展開物理模擬與野外觀測。"
    )
    format_run(r)

    add_heading_2("2.0 實驗架設與系統監控")
    p_m_sys = add_p()
    r = p_m_sys.add_run(
        "全套實驗系統由控制主機、外接顯示螢幕、筆記型電腦、專用發射/接收線圈箱、外接電源箱及訊號傳輸纜線所組成（圖 2.0A）。儀器初始化後執行 RUN #1 基準檢測（圖 2.0B），系統即時顯示發射線圈電阻 Tx: 4.04 Ω、斜坡關斷時間 Ramp: 5.8 μs、發射電流 Amps: 5.98 A、工作電壓 24.3 V。以雙對數座標（x 軸為對數時間 ms，y 軸為振幅 μV/A）呈現的波形在 0.001~0.1 ms 間可見電流關斷引起的強烈暫態震盪，隨後平穩衰減，為後續物理模擬奠定精確基準。"
    )
    format_run(r)

    add_side_by_side_images(
        os.path.join(img_dir, "fig2_0a_overview.jpg"),
        "圖 2.0A",
        "TEM 實驗整體儀器架設與野外教學全景：林老師於中央大學科一館草坪解說系統操作，筆電置於橘色箱上，外接螢幕即時監控波形，導線連接至線圈箱。",
        os.path.join(img_dir, "fig2_0b_system_screen.jpg"),
        "圖 2.0B",
        "TerraTEM 操控系統介面與初始衰減曲線（RUN #1）：讀數 Tx: 4.04 Ω、Ramp: 5.8 μs、電流 5.98 A、電壓 24.3 V，雙對數座標清楚展現關斷暫態與大地衰減曲線。"
    )

    add_heading_2("2.1 導體鋁板與非導體水泥地 / 草地之響應對比")
    add_heading_3("原理簡述")
    p = add_p()
    r = p.add_run(
        "地下介質之電導率 σ 直接決定了感應渦電流之衰減期。非導體（乾燥水泥地、乾燥土壤）電導率極低，感應渦電流瞬間因高電阻耗散而衰亡，故晚期時域訊號幾近於零；相對地，良導體（如金屬鋁板，電導率約 3.5×10⁷ S/m）電阻極小，渦電流可持續循環流動，產生強大且長效的二次感應磁場。"
    )
    format_run(r)

    add_heading_3("架設說明與結果分析")
    p = add_p()
    r = p.add_run(
        "將含有發射與接收線圈的橘色線圈箱安置於草坪測線上，旁側放置高純度金屬鋁板進行物理模擬（圖 2.1A）。圖 2.1B 顯示測得參數為發射線圈電阻 Tx: 16.38 Ω、Ramp: 62.3 μs、電流 Amps: 1.47 A、電壓 24.2 V。與一般地層相比，波形在 0.1~10 ms 的中晚期時域出現異常突起的巨大凸波（隆起波峰，振幅高達 10⁴~10⁵ μV/A），隨後維持平緩衰減，遲至數十毫秒後才逐漸落入雜訊基底。此結果直觀證明：良導體之存在會使晚期時域之 TEM 感應電壓維持在高振幅狀態，是野外金屬礦脈探測的經典診斷特徵。"
    )
    format_run(r)

    add_side_by_side_images(
        os.path.join(img_dir, "fig2_1a_aluminum_setup.jpg"),
        "圖 2.1A",
        "導體鋁板物理模擬實驗架設：橘色線圈箱置於草坪，旁側平鋪高導電金屬鋁板並引接導線，模擬地下高導電金屬體對暫態電磁場的擾動。",
        os.path.join(img_dir, "fig2_1b_aluminum_curve.jpg"),
        "圖 2.1B",
        "良導體鋁板激發之暫態電磁波形響應：讀數 Tx: 16.38 Ω、Ramp: 62.3 μs、電流 1.47 A、電壓 24.2 V，中晚期時域（0.1~10 ms）出現顯著波峰，證實良導體具備長效二次場。"
    )

    add_heading_2("2.2 背景雜訊之訊號（發射線圈不送電）")
    add_heading_3("原理簡述與觀測結果")
    p = add_p()
    r = p.add_run(
        "周遭環境充斥著各類人為與天然電磁雜訊（如 60 Hz 工頻交流電磁場、廣播無線電訊號、大氣雷電 Sferics 等）。為精準扣除背景干擾並評估儀器信噪比門檻，必須執行發射機不送電的雜訊測定（Noise Run）。如圖 2.2 所示，發射線圈 Tx 切斷電源不通電，僅由接收線圈 Rx 開啟通道收錄周圍電磁波。量測結果顯示，波形圍繞零電壓基線上下微幅劇烈抖動，沒有任何單調衰減特徵，振幅極低（大多小於 1~10 μV/A）。此實驗確立了實習場域之電磁背景雜訊底限，驗證了多次信號疊加（Stacking 250~2000 次）消除隨機雜訊之必要性。"
    )
    format_run(r)

    add_single_image(
        os.path.join(img_dir, "fig2_2_noise.jpg"),
        "圖 2.2",
        "發射線圈未送電時的環境電磁背景雜訊：發射線圈不送電，接收線圈記錄之訊號圍繞零線微弱震盪，呈現無規則分佈，確立了實習場域之電磁背景雜訊底限。",
        width_inches=4.2
    )

    add_heading_2("2.3 鋁板增厚之 TEM 訊號（單層鋁板 vs. 雙層鋁板疊加）")
    add_heading_3("原理簡述")
    p = add_p()
    r = p.add_run(
        "地下導電體的厚度與體積大小直接影響感應渦電流之總能量容量及自感係數 L。當導體厚度增加時，其等效電阻 R 下降、自感 L 上升，導致放電時間常數 τ = L/R 大幅增加，使得二次場在晚期時域的強度更強、衰減更為遲緩。"
    )
    format_run(r)

    add_heading_3("架設說明與結果分析")
    p = add_p()
    r = p.add_run(
        "如圖 2.3A 所示，林老師指導同學進行雙層鋁板疊加實驗，將兩張相同規格的鋁板完全貼合重疊，模擬地下導電構造層厚度加倍的情境。圖 2.3B 清楚展示了單層鋁板（Z-1，藍點）與雙層疊加厚鋁板（Z，實線）的即時疊圖比對（Tx: 16.38 Ω, Ramp: 72.0 μs, 電流 1.47 A）。在早期時域兩者響應相近，但在進入 1~10 ms 晚期時域時，雙層厚鋁板的實線波形振幅明顯高於單層虛線波形，且其衰減斜率更為平緩。此現象在物理上完美驗證了 TEM 具備依據晚期時域衰減曲線的能量強度與斜率，解析地下導體厚度與規模之強大解析力。"
    )
    format_run(r)

    add_side_by_side_images(
        os.path.join(img_dir, "fig2_3a_thick_aluminum_setup.jpg"),
        "圖 2.3A",
        "雙層鋁板疊加（導體增厚）模擬現場教學：老師於草坪旁指導同學將兩張鋁板進行疊加，藉由倍增導體厚度與截面積，模擬地下導電構造層規模擴大之響應。",
        os.path.join(img_dir, "fig2_3b_thick_aluminum_curve.jpg"),
        "圖 2.3B",
        "單層與雙層鋁板暫態訊號對比（Z-1 與 Z）：讀數 Tx: 16.38 Ω、Ramp: 72.0 μs、電流 1.47 A，厚鋁板（實線 Z）在晚期時域（1~10 ms）振幅顯著高於單層板（虛線 Z-1），衰減更慢。"
    )

    add_heading_2("2.4 鋁板內的 TEM 傳遞速率量測")
    add_heading_3("原理簡述與定量計算")
    p = add_p()
    r = p.add_run(
        "真空中電磁波以光速 c = 3×10⁸ m/s 傳播；然而在良導體（金屬鋁板）內部，電磁波為強耗散性擴散波，其擴散傳播速度受到集膚效應與渦電流耦合的強烈抑制，等效傳播速率大幅降低至每秒數公尺等級。為測定電磁波在鋁板內的傳遞速率，固定發射線圈 Tx，將接收線圈 Rx 水平向外平移 Δx = 5 cm = 0.05 m，比對移動前後兩次量測之特徵波峰到達時間差 Δt（圖 2.4）。"
    )
    format_run(r)

    p_calc = add_p()
    p_calc.paragraph_format.left_indent = Inches(0.2)
    r = p_calc.add_run(
        "• 觀測時間延遲：由圖形可知波峰時間差 Δt ≈ 50 ms = 0.05 s。\n"
        "• 傳遞速率計算：v = Δx / Δt = 0.05 m / 0.05 s = 1.0 m/s。\n"
        "• 物理意義分析：傳遞速率（1.0 m/s）遠低於真空光速，體現了良導體內部「磁擴散（Magnetic diffusion）」之物理本質。正因暫態電磁波在地下導電介質中的傳播速率如此緩慢，儀器才能在毫秒（ms）的時間尺度下精確分辨地層由淺至深的各層結構。"
    )
    format_run(r)

    add_single_image(
        os.path.join(img_dir, "fig2_4_velocity.jpg"),
        "圖 2.4",
        "Rx 線圈移動 5 cm 之時間延遲與傳遞速率估算：接收線圈 Rx 平移 5 cm 後，觀測特徵時間差約為 50 ms，由此計算出 TEM 在鋁板內之擴散傳播速率約為 1.0 m/s，展示了導體內電磁波之慢速擴散特質。",
        width_inches=5.0
    )

    add_heading_2("2.5 封閉迴圈之 TEM 響應（模擬地下封閉渦電流圈）")
    add_heading_3("原理簡述與相位特性")
    p = add_p()
    r = p.add_run(
        "根據 TEM 基本物理模型，地下導體被感應出的是環狀封閉渦電流。實驗中利用一圈閉合金屬導線（Closed Wire Loop）環繞放置，直接模擬地下單一封閉導電環對斷電暫態的響應（圖 2.5）。當 Tx 斷電時，閉合導線迴圈內產生顯著感應電流，接收線圈測得之衰減曲線猶如偵測到一獨立塊狀金屬導體。此外，當 Rx 放置於 Tx 之「內圈」時感應電壓為正；當 Rx 移至 Tx 之「外圈」時，磁力線方向反轉，導致感應波形發生 180° 完全反相（圖形上下顛倒），在實驗中直觀印證了磁偶極場之空間幾何對稱性。"
    )
    format_run(r)

    add_single_image(
        os.path.join(img_dir, "fig2_5_loop.jpg"),
        "圖 2.5",
        "以閉合導線迴圈模擬地下渦電流之 TEM 響應：金屬閉合導線圈激發出猶如塊狀導體的強烈感應衰減波形；且 Rx 置於 Tx 內圈與外圈時，波形呈現 180 度反相倒轉，驗證磁偶極空間幾何特性。",
        width_inches=4.5
    )

    # --- 3. TEM 野外實測 ---
    add_heading_1("3. TEM 野外實測")
    p = add_p()
    r = p.add_run(
        "野外實測基地選定於中央大學科學一館北側草坪「中大地下水觀測井場」。該井場為中大地科學院重要的水文地質實習觀測基地，地下設有鋼質金屬套管（Casing），並已知賦存透水之砂礫石含水層。"
    )
    format_run(r)

    add_heading_2("3.1 測線佈設與線圈箱架設（金屬井蓋 vs. 草皮地層響應對比）")
    add_heading_3("架設說明與結果分析")
    p = add_p()
    r = p.add_run(
        "實測採用一體化線圈箱（Tx 與 Rx 組合於同一箱體內，In-loop 配置），便於沿測線網格搬移施測。為了對比人工金屬結構與天然地層的響應差異，首先將線圈箱分別架設於「金屬觀測井蓋正上方」與「遠離井蓋的純淨草皮上方」進行觀測："
    )
    format_run(r)

    p_compare = add_p()
    p_compare.paragraph_format.left_indent = Inches(0.2)
    r = p_compare.add_run(
        "• 金屬井蓋測點（圖 3.1A, 3.1B）：線圈箱置於金屬井蓋正上方。RUN #3 量測顯示，因井蓋與地下鋼套管為極佳導體，斷電瞬間激發出極強之近地表金屬二次場，造成早期時域（< 0.1 ms）波形劇烈畸變與跳變，中晚期曲線呈現無規則的大幅擾動，完全遮蔽了深部地層訊號。\n"
        "• 天然草坪測點（圖 3.1C, 3.1D）：移至遠離金屬物的開闊草皮測點。RUN #15 顯示系統讀數 Tx: 4.06 Ω、Ramp: 5.6 μs、電流 5.87 A、電壓 24.0 V。曲線呈現標準沉積地層之平滑指數階梯衰減，早期振幅達 10⁴ μV/A，隨後穩定衰減，真實反映地下土壤與基岩介質之電性特徵。"
    )
    format_run(r)

    add_side_by_side_images(
        os.path.join(img_dir, "fig3_1a_well_setup.jpg"),
        "圖 3.1A",
        "地下水井金屬井蓋旁線圈箱架設：線圈箱置於金屬井蓋上方，檢驗強人工金屬導體對電磁訊號的干擾效應。",
        os.path.join(img_dir, "fig3_1b_well_curve.jpg"),
        "圖 3.1B",
        "金屬井蓋之強導體畸變曲線（RUN #3）：受金屬井蓋與鋼套管影響，波形在早期與中期出現劇烈畸變與飽和震盪。"
    )

    add_side_by_side_images(
        os.path.join(img_dir, "fig3_1c_lawn_setup.jpg"),
        "圖 3.1C",
        "科一館草坪均質測點架設：線圈箱移至遠離人為金屬之草坪，以天然地層與地下水為探測對象。",
        os.path.join(img_dir, "fig3_1d_lawn_curve.jpg"),
        "圖 3.1D",
        "草坪標準暫態衰減曲線（RUN #15）：讀數 Tx: 4.06 Ω、Ramp: 5.6 μs、電流 5.87 A，電壓 24.0 V，波形平滑展現真實地層響應。"
    )

    add_heading_2("3.2 中大地下水井場 TEM 測點分布與連續網格觀測")
    p = add_p()
    r = p.add_run(
        "實習中沿科一館北側草坪設定網格化測線，逐點搬移線圈箱進行高密度空間採樣（測點分布如圖 3.2A 所示）。測區共規劃三條主要南北向測線（Easting 11 m、14 m、17 m），測點涵蓋 Northing 6 m 至 28 m，連續施測編號包含 RUN #15 至 RUN #67（測站資料集 1012.BIN，共計 60 組完整記錄）。圖 3.2B（RUN #27）讀數顯示 Tx: 4.04 Ω、Ramp: 5.6 μs、電流 5.91 A、電壓 24.0 V，前後雙次曲線高度重疊，證明大地耦合狀態穩定；圖 3.2C（RUN #51）推進至草坪深部，Tx: 4.06 Ω、Ramp: 5.6 μs、電流 5.85 A，晚期時域階梯訊號清晰，提供了高品質剖面數據體。透過 TEMPlot 軟體繪製全區多測線暫態衰減曲線疊圖（圖 3.2D），可見早期時域（< 0.1 ms）訊號強勁穩定，中期（0.1~1.5 ms）呈現平滑指數衰減，中晚期（> 1.5 ms）逐漸落入隨機雜訊，為後續時間閘門反演選取奠定了可靠基準。"
    )
    format_run(r)

    add_single_image(
        os.path.join(img_dir, "fig3_2_stations_map.jpg"),
        "圖 3.2A",
        "中央大學科學一館北側井場 TEM 測點分布平面網格圖（10/12 實測）：標註三條南北向測線（Easting 11, 14, 17 m）與測點坐標（Northing 6~28 m），為連續網格反演奠定空間基礎。",
        width_inches=5.4
    )

    add_side_by_side_images(
        os.path.join(img_dir, "fig3_2b_run27.jpg"),
        "圖 3.2B",
        "網格測點連續觀測（RUN #27）：讀數 Tx: 4.04 Ω、Ramp: 5.6 μs、電流 5.91 A，前後兩次曲線重疊良好，資料可信度高。",
        os.path.join(img_dir, "fig3_2c_run51.jpg"),
        "圖 3.2C",
        "地下水井場深部探測（RUN #51）：讀數 Tx: 4.06 Ω、Ramp: 5.6 μs、電流 5.85 A，晚期時域階梯訊號清晰，穿透深度充裕。"
    )

    add_single_image(
        os.path.join(img_dir, "fig3_2d_decay_lines.jpg"),
        "圖 3.2D",
        "網格實測多測線衰減波形疊圖（LINE 11.00, 14.00, 17.00）：以雙對數座標檢視 1012.BIN 之 60 組觀測記錄，展示關斷暫態、大地衰減與晚期雜訊震盪，確立有效反演時窗。",
        width_inches=4.1
    )

    add_heading_2("3.3 各深度（Time Window）導電性分布反演與地下水層詮釋")
    add_heading_3("數據處理與時間閘門原理")
    p = add_p()
    r = p.add_run(
        "TEM 採集到的暫態衰減電壓訊號，經由系統進行時間閘門積分分段（Window 分段，Window 1 至 Window 60）。在時間域中，Window 數值越小代表斷電後極早時間，對應淺部地層；Window 數值越大代表晚期時域，對應更深部擴散之電磁感應響應。本實習依據實測訊號衰減趨勢，選取由淺至深連續發展之代表性時間閘門（Window 23、26、30、40、45、53，涵蓋斷電後約 0.103 ms 至 5.000 ms），進行二維空間等值線繪圖與導電度分布反演。"
    )
    format_run(r)

    add_heading_3("反演圖層解讀與地質比對")
    p = add_p()
    r = p.add_run(
        "圖 3.3 為中大地下水井場依據 10/12 實測數據（1012.BIN）經空間插值繪製之各深度時間閘門導電度分布圖（紅色代表高導電高振幅區、藍紫色代表低導電低振幅區），各子圖下方緊湊標註對應之 Window 編號：\n"
        "1. 淺部特徵（Window 23，約 0.103 ms）：測區北側（Northing > 18 m）呈現大範圍低導電之藍紫色均質背景（振幅約 1000~2000 nV/Amp），反映中央大學科一館北側草坪表層乾燥紅土夾礫石層之低含水量高阻特性。\n"
        "2. 空間閉合高導電異常（Window 26 至 Window 40，約 0.146~0.800 ms）：隨著時間閘門向深部推展，於測區南側 Northing 10~12 m、Easting 14 m 處，持續且穩定地發育出一個同心圓狀之高振幅閉合異常區（黃色至亮綠色中心，振幅高達 5000~6400 nV/Amp）；而在西南角（Northing 6 m、Easting 11 m）亦記錄到極高振幅響應。比對科一館地下水觀測井誌，該閉合異常精確對應富水砂礫石含水層主流通道，西南角則與金屬鋼套管及地下水匯流處產生之耦合二次場密切相符。\n"
        "3. 訊號衰減與晚期雜訊過渡（Window 45 至 Window 53，約 1.500~5.000 ms）：至 Window 45 時整體振幅大幅減弱（降至 50 nV/Amp 以下）；推展至極晚期 Window 53 時，大地感應二次場已衰減至環境背景雜訊門檻以下，等值線呈現橫向雜散之不規則條紋狀，直接印證了教學簡報中強調「繪圖選取無雜訊時間區間」之物理重要性。"
    )
    format_run(r)

    add_single_image(
        os.path.join(img_dir, "fig3_3_inversion.jpg"),
        "圖 3.3",
        "中大地下水井場各深度（Window 23~53）導電度分布等值線圖：依據 10/12 實測數據（1012.BIN）緊湊排列繪製，各子圖下方依序標註 Window 23、Window 26、Window 30、Window 40、Window 45、Window 53。分析顯示 Window 23~40 清楚圈定 Northing 10~12 m、Easting 14 m 之封閉高導電含水異常中心；Window 45~53 則展現深部訊號落入環境雜訊之過渡歷程。",
        width_inches=6.0
    )

    # --- 4. 心得 ---
    add_heading_1("4. 實習心得與反思")
    p_c1 = add_p()
    r = p_c1.add_run(
        "這是我在通識地球物理課程中參與的第二次野外地電探勘實習。相較於前次地電直流法需要大家在草坪上費力敲打金屬電極棒、拉設數十公尺導線並灌注鹽水降低接觸電阻的勞動過程，本次交流暫態電磁法（TEM）展現了截然不同且更具科技感的探測思維——僅憑地表擺放的兩個感應線圈，就能穿透地表岩層探知數十公尺深的地下構造，令我深受啟發。"
    )
    format_run(r)

    p_c2 = add_p()
    r = p_c2.add_run(
        "回顧 10 月 12 日實習當天，天候晴朗但帶有秋日微風，陽光穿透科學一館前老樹的枝葉灑在草坪上。在強烈的光影反差下，同學們圍在橘色儀器箱與 ViewSonic 外接螢幕旁（圖 4），一邊用手遮擋強光辨識螢幕上的衰減波形，一邊聆聽林老師講解電流關斷的瞬間微觀物理歷程。這種結合理論、現場數據與具體環境的學習氛圍，讓我對地球物理產生了多層次的理性反思："
    )
    format_run(r)

    p_refl1 = add_p()
    p_refl1.paragraph_format.left_indent = Inches(0.2)
    r = p_refl1.add_run(
        "第一，「時間換取深度」的物理直觀具象化。在電磁學教科書中，馬克士威方程組往往以抽象的微分形式存在；但在本次實驗中，我看著發射電流在 5.6 微秒內被強制歸零，隨後接收線圈在毫秒尺度上記錄下指數衰減的電壓波形，瞬間領悟到整個大地本質上就是一個巨大的電感與電阻並聯放電系統。早期時域的訊號反映淺層土壤，而晚期時域的訊號則來自於深部擴散的感應「煙圈」，這種透過記錄時間來解析深度維度的邏輯，是物理思維在工程探勘上的極致展現。"
    )
    format_run(r)

    p_refl2 = add_p()
    p_refl2.paragraph_format.left_indent = Inches(0.2)
    r = p_refl2.add_run(
        "第二，物理模擬中的對比與反相驗證。在鋁板實驗中，當加入良導體鋁板時，原本單調衰減的波形在中晚期時域硬生生被拉出一座巨大的隆起波峰，而在雙層鋁板疊加時波峰衰減更慢，這極具視覺衝擊力地證明了導體厚度與二次場存續時間的物理正相關。更讓我驚豔的是將接收線圈移至發射線圈外側時，波形在螢幕上瞬間上下 180 度翻轉（反相），這讓過去在課堂上死記硬背的法拉第定律與磁力線回閉幾何，在眼前變成了生動的實驗事實。"
    )
    format_run(r)

    p_refl3 = add_p()
    p_refl3.paragraph_format.left_indent = Inches(0.2)
    r = p_refl3.add_run(
        "第三，野外雜訊識別與資料解讀的審慎性。在金屬井蓋上的量測經驗是一堂極佳的批判性思考課程。井蓋與鋼套管激發的超強二次場徹底破壞了衰減曲線的正常結構，這讓我警醒到：地球物理儀器測得的數據「永遠是真實物理場的響應，但不一定是我們想探測的地質目標」。如果探勘人員盲目依賴反演演算法而忽視了現場環境中的鐵絲網、地下管線或井蓋干擾，將會得出完全錯誤的地質結論。"
    )
    format_run(r)

    p_c_end = add_p()
    r = p_c_end.add_run(
        "整體而言，從室內與走廊的物理模擬，到科學一館草坪上的網格實測，再到最後看見 Window 23~53 清楚映射出中大地下水脈的分布，這趟實習將課本理論、儀器訊號與真實地球完整串聯在一起。在大學生涯中能有這樣親手碰觸儀器、觀察暫態衰減、並理性推敲地底下看不見的世界之機會，是一次極具科學價值與思維啟發的珍貴體驗。"
    )
    format_run(r)

    add_single_image(
        os.path.join(img_dir, "fig4_reflection.jpg"),
        "圖 4",
        "儀器主控台前之現場操作、數據討論與探勘實作：同學們聚集於儀器箱與外接顯示器旁，在老師帶領下即時檢視每一 Run 的衰減曲線變化，將抽象之時間域電磁擴散理論轉化為具體的地球物理觀測數據。",
        width_inches=4.8
    )

    # --- 附錄：照片索引表 ---
    add_heading_1("附錄：實習相片清單與分類索引表")
    p_app = add_p()
    r = p_app.add_run(
        "為符合實習作業規格與資料查驗要求，下表整理本次報告中挑選使用之現場照片與實測分析圖（照片皆取自 2026/10/12 實習現場實拍，圖表皆源自 1012.BIN 實測數據），依實驗流程分類並標註儀器讀數與物理意涵："
    )
    format_run(r)

    # Table of photos
    tbl_data = [
        ("圖 2.0A", "20261012_042126578_iOS.jpg", "04:21:26", "2.0 實驗架設", "科一館草坪、儀器箱、外接螢幕", "實習整體環境全景，展示發射與接收系統佈設。"),
        ("圖 2.0B", "20261012_045402165_iOS.jpg", "04:54:02", "2.0 系統監控", "Tx: 4.04 Ω, 5.8 μs, 5.98 A, 24.3 V", "RUN #1 系統基準衰減曲線，呈現關斷暫態與背景衰減。"),
        ("圖 2.1A", "20261012_051200034_iOS.jpg", "05:12:00", "2.1 導體對比", "橘色線圈箱、單張良導體鋁板", "導體物理模擬架設，模擬地下強導電性目標物。"),
        ("圖 2.1B", "20261012_052148657_iOS.jpg", "05:21:48", "2.1 導體對比", "Tx: 16.38 Ω, 62.3 μs, 1.47 A, 24.2 V", "導體激發出中晚期顯著波峰，證實良導體二次場衰減緩慢。"),
        ("圖 2.3A", "20261012_054027267_iOS.jpg", "05:40:27", "2.3 鋁板增厚", "老師現場講解、雙層鋁板重疊", "導體增厚教學，倍增金屬厚度模擬導電構造層規模擴大。"),
        ("圖 2.3B", "20261012_052654914_iOS.jpg", "05:26:54", "2.3 鋁板增厚", "Tx: 16.38 Ω, 72.0 μs, 1.47 A, 24.2 V", "單層（Z-1）與雙層（Z）疊圖比對，驗證厚導體晚期衰減平緩。"),
        ("圖 3.1A", "20261012_050205748_iOS.jpg", "05:02:05", "3.1 實測對比", "線圈箱置於地下水金屬井蓋正上方", "檢驗近地表人為金屬強導體之強大屏蔽與暫態干擾效應。"),
        ("圖 3.1B", "20261012_050237579_iOS.jpg", "05:02:37", "3.1 實測對比", "RUN #3、金屬井蓋測點波形", "金屬套管引起早期過飽和跳變與波形嚴重畸變。"),
        ("圖 3.1C", "20261012_055519326_iOS.jpg", "05:55:19", "3.1 實測對比", "開闊草坪測點、橘色線圈箱", "移開金屬井蓋至均質地層上方，為地下水探測提供天然背景。"),
        ("圖 3.1D", "20261012_060000053_iOS.jpg", "06:00:00", "3.1 實測對比", "Tx: 4.06 Ω, 5.6 μs, 5.87 A, 24.0 V", "RUN #15 標準地層階梯衰減曲線，為地下水反演提供高品質輸入。"),
        ("圖 3.2A", "1012.BIN 測點網格", "10/12 實測", "3.2 網格實測", "Easting 11~17 m, Northing 6~28 m", "實習測線網格分布圖，確立三條測線 60 組測點空間坐標。"),
        ("圖 3.2B", "20261012_060624286_iOS.jpg", "06:06:24", "3.2 網格實測", "Tx: 4.04 Ω, 5.6 μs, 5.91 A, 24.0 V", "RUN #27 連續網格施測，Z-1 與 Z 重疊良好，確認耦合穩定度。"),
        ("圖 3.2C", "20261012_061450789_iOS.jpg", "06:14:50", "3.2 網格實測", "Tx: 4.06 Ω, 5.6 μs, 5.85 A, 24.0 V", "RUN #51 深部探測數據，晚期階梯信號清晰，確認探測深度。"),
        ("圖 3.2D", "1012.BIN 衰減曲線疊圖", "10/12 實測", "3.2 網格實測", "LINE 11.00, 14.00, 17.00", "全區多測線暫態衰減曲線疊圖檢驗，確認訊噪比與時間區間。"),
        ("圖 3.3", "1012.BIN Window 23~53", "10/12 實測", "3.3 導電反演", "Window 23, 26, 30, 40, 45, 53", "各深度時間閘門導電度分布圖，揭示地下水富水層高導電異常與晚期雜訊過渡。"),
        ("圖 4", "20261012_042215859_iOS.jpg", "04:22:15", "4 心得反思", "同學圍觀儀器、即時討論數據", "實地操作、數據討論與反思之真實寫照，印證理論結合實作。"),
    ]

    tbl = doc.add_table(rows=len(tbl_data) + 1, cols=6)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    tbl.autofit = False

    col_widths = [Inches(0.8), Inches(1.5), Inches(0.7), Inches(0.9), Inches(1.2), Inches(1.5)]
    headers = ["報告圖號", "原始相片檔名", "時間", "所屬章節", "關鍵讀數 / 對象", "核心物理意義"]

    hdr_row = tbl.rows[0]
    for idx, text in enumerate(headers):
        cell = hdr_row.cells[idx]
        cell.width = col_widths[idx]
        tcPr = cell._element.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="EBF1F5"/>')
        tcPr.append(shd)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        r = p.add_run(text)
        format_run(r, size_pt=8.5, bold=True, color_rgb=(20, 50, 90))

    for row_idx, data_row in enumerate(tbl_data):
        row = tbl.rows[row_idx + 1]
        for col_idx, val in enumerate(data_row):
            cell = row.cells[col_idx]
            cell.width = col_widths[col_idx]
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if col_idx in [0, 2] else WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            r = p.add_run(val)
            format_run(r, size_pt=8.0, bold=(col_idx == 0))

    # Save to report paths
    out_dir = r"c:\Users\Cupid\Downloads\Study-space\Reference\NCU_Classes\通識地球物理\校園實習\校園地電實習\report"
    path1 = os.path.join(out_dir, "資管二張承新.docx")
    path2 = os.path.join(out_dir, "資管二張承新_TEM.docx")

    doc.save(path1)
    doc.save(path2)
    print(f"Report saved to:\n  - {path1}\n  - {path2}")

if __name__ == "__main__":
    create_tem_report()
