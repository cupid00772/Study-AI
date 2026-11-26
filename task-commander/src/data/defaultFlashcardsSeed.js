// Default fallback seed synchronized with Review_Dashboard/Active_Recall_Flashcards.md
// Used only when local disk & cloud storage have not initialized flashcards yet (e.g. Web/Preview bootstrap).

export const DEFAULT_FLASHCARDS_SEED_MD = `# ⚡ 116 台聯大 A4 主動回憶閃卡庫 (Active Recall Flashcards)

> **使用方式**：遮住「答案與口訣」欄，每天花 5–10 分鐘口頭快答。凡是猶豫超過 3 秒或答錯者，代表記憶正在衰減，必須於下次測驗強制回馬槍抽考。
> **同步來源**：初始種子萃取自你的 **115 實考真實失分點** 與 **高遺忘冷門公式**，後續將由 \`Mock Exam Generator\`、\`Question Sweeper\` 與 Task Commander 刷題戰情室自動追加。

---

## 💻 一、計算機概論：防遺忘高危名詞快篩（半衰期 3–5 天）

| # | 主動回憶提問 (Prompt) | 精準答案與一句話口訣 (Answer & Mnemonic) |
| :-: | :--- | :--- |
| CS-01 | **NP 的英文全名是什麼？$P$ 與 $NP$ 的集合關係？** | **Nondeterministic Polynomial**（絕對不是 Non-polynomial！）。**所有 $P$ 都在 $NP$ 裡面 ($P \\subseteq NP$)**；若 $P \\neq NP$，則沒有任何 NPC 可在多項式時間解出。 |
| CS-02 | **BST 刪除有兩個子節點的節點時，Inorder Successor 與 Predecessor 怎麼找？** | **Successor（後繼者）＝右子樹最左（最小）**；**Predecessor（前驅者）＝左子樹最右（最大）**。口訣：「**後右小、前左大**」。 |
| CS-03 | **Linked List 在 \`p\` (B) 後插入 \`newNode\` (C)，兩行指標寫法與順序？** | \`newNode->next = p->next; p->next = newNode;\`。口訣：**先接尾巴 (\`newNode->next\`) 再斷頭 (\`p->next\`)，永遠要看清有沒有 \`->next\`！** |
| CS-04 | **NAT 封包由內網送往外部伺服器時，Source 與 Destination 怎麼變？** | **Source 改為 NAT Public IP:Port**，**Destination 維持外部伺服器 IP:Port 不變**。口訣：「**出門換公家發件人，收件人永遠不變**」。 |
| CS-05 | **Ethernet Frame 開頭 7-byte Preamble (10101010...) 的核心用途？** | 讓接收端網卡**時鐘同步 (Clock Synchronization)**，與 MAC 位址或錯誤偵測無關。 |
| CS-06 | **IEEE 754 單精度中，Exponent 全為 1 (255) 時如何區分 $\\pm\\infty$ 與 NaN？** | **Fraction 全為 0 → $\\pm\\infty$**；**Fraction 非 0 → NaN**。Bias = 127，隱藏位元 \`1.\` 不寫入 Fraction。 |
| CS-07 | **C++ 父類別指標指向子類別物件 (\`Base *p = new Derived()\`)，沒加 \`virtual\` 會呼叫誰？** | **沒加 \`virtual\` → 靜態綁定呼叫 \`Base\`**；**有加 \`virtual\` → 動態綁定查 vtable 呼叫 \`Derived\`**。多型基底解構子必加 \`virtual\` 防 Memory Leak！ |
| CS-08 | **Hybrid Encryption（Alice 傳大檔給 Bob）如何搭配對稱與非對稱加密？** | **對稱 Session Key 加密大檔**（快）＋ **Bob 的 Public Key 加密 Session Key**（只有 Bob 私鑰解得開）。 |
| CS-09 | **Digital Signature 提供哪三項安全服務？唯獨「不」提供哪一項？** | 提供 **身分驗證 (Authentication)、完整性 (Integrity)、不可否認性 (Non-repudiation)**；**不提供機密性 (Confidentiality)**！ |
| CS-10 | **TCP 3-way Handshake 三段封包 Flags 依序為何？** | \`Client → SYN\` ⇒ \`Server → SYN + ACK\` ⇒ \`Client → ACK\`。 |

---

## 📐 二、微積分：易忘公式與零容錯檢核閃卡（半衰期 5–7 天）

| # | 主動回憶提問 (Prompt) | 精準答案與一句話口訣 (Answer & Mnemonic) |
| :-: | :--- | :--- |
| CA-01 | **旋轉曲面面積（繞 $x$ 軸）與弧長元素 $ds$ 公式？** | $S = \\int 2\\pi y \\, ds$，其中 $ds = \\sqrt{1 + (y')^2}\\,dx = \\sqrt{(x')^2 + (y')^2}\\,dt$。 |
| CA-02 | **球座標體積元素 $dV$ 與柱座標體積元素 $dV$？** | 球座標：$\\rho^2 \\sin\\phi \\, d\\rho \\, d\\phi \\, d\\theta$；柱座標：$r \\, dz \\, dr \\, d\\theta$。口訣：「**球要平方再乘 $\\sin\\phi$**」。 |
| CA-03 | **方向導數公式 $D_{\\mathbf{v}} f(P)$ 最致命的遺漏陷阱？** | $D_{\\mathbf{u}} f = \\nabla f \\cdot \\hat{\\mathbf{u}}$，**務必先把 $\\mathbf{v}$ 除以 $\\|\\mathbf{v}\\|$ 化為單位向量**！ |
| CA-04 | **Green / Stokes / Divergence 三大定理邊界對應口訣？** | **Green**：平面封閉曲線 $\\leftrightarrow$ 2D 面積；**Stokes**：空間封閉曲線 $\\leftrightarrow$ 曲面旋度 $\\nabla \\times \\mathbf{F}$；**Divergence**：封閉曲面 $\\leftrightarrow$ 3D 體積散度 $\\nabla \\cdot \\mathbf{F}$。 |
| CA-05 | **$\\ln(1+x)$ 與 $\\ln(1-x)$ 的 Maclaurin 級數展開與收斂區間？** | $\\ln(1+x) = \\sum_{n=1}^{\\infty} (-1)^{n-1} \\frac{x^n}{n}$ ($-1 < x \\le 1$)；$\\ln(1-x) = -\\sum_{n=1}^{\\infty} \\frac{x^n}{n}$ ($-1 \\le x < 1$)。 |
| CA-06 | **有界閉區域求絕對極值（如半圓盤 $x^2+y^2\\le 1, y\\ge 0$）三步驟？** | **(1) 內部臨界點 $\\nabla f = 0$（絕不可漏！）** → **(2) 各段邊界化為單變數求極值** → **(3) 邊界端點／交點全數代回比大小**。 |
| CA-07 | **線性變數代換 Jacobian 計算與防抄錯規則？** | $dA = \\left|\\frac{\\partial(x,y)}{\\partial(u,v)}\\right| du\\,dv = \\frac{1}{\\left|\\frac{\\partial(u,v)}{\\partial(x,y)}\\right|} du\\,dv$；**動筆積分前必二次核對四條邊界常數！** |

---

## 📘 三、英文：115 實考失分學術字彙與必考文法閃卡（半衰期 4–5 天）

| # | 主動回憶提問 (Prompt) | 精準答案與易混對照 (Answer & Contrast) |
| :-: | :--- | :--- |
| EN-01 | **\`impervious to\` vs \`susceptible to\` 正負向？** | **\`impervious to\` = 不受影響的、油鹽不進的**（\`im-\` 否定 + 穿透）；**\`susceptible to\` = 易受影響的、脆弱的**。兩者完全相反！ |
| EN-02 | **\`ambiguous\` vs \`unequivocal\` / \`lucid\`？** | **\`ambiguous\` = 模稜兩可、允許多重解讀**；**\`unequivocal\` = 明確無疑的**（\`un-\` 否定 + \`equivocal\` 含糊）；**\`lucid\` = 清晰易懂的**。 |
| EN-03 | **\`mitigate / alleviate\` vs \`exacerbate / aggravate\`？** | **\`mitigate / alleviate\` = 緩解、減輕（正向）**；**\`exacerbate / aggravate\` = 惡化、加劇（負向）**。 |
| EN-04 | **\`representative\` vs \`negligible\`（樣本語境）？** | **\`representative\` = 具代表性的**（統計樣本必考）；**\`negligible\` = 微不足道、可忽略的**（源自 \`neglect\`）。 |
| EN-05 | **\`compelling\` vs \`competing\`（論點語境）？** | **\`compelling argument\` = 具強大說服力的論點**；**\`competing\` = 互相競爭的**（字形陷阱！）。 |
| EN-06 | **\`empirical evidence\` 與 \`mutually exclusive\` 精確含義？** | **\`empirical\` = 實證的、基於實驗觀察的**；**\`mutually exclusive\` = 互斥的、無法共存結合的 (impossible to combine)**。 |
| EN-07 | **看到 \`It is essential / vital / imperative / crucial that + S + ____\` 動詞怎麼填？** | **一律填「原形動詞 \`(should) V\`」**（含被動 \`be + p.p.\`），**絕對不加 \`-s\`！**（同 \`require / suggest / insist / demand that\`） |
| EN-08 | **\`The data ____ analyzed before conclusions were drawn.\` 時態與單複數？** | 主句動作在 \`before conclusions were drawn\`（過去式）之前或同步發生，必用過去時態（不可用現在完成式 \`has been\`）；正式學術考題優先視 \`data\` 為複數 **\`were\`**。 |
`;
