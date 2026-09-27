# Cindy's Birthday Card PWA (iOS Native Experience) 🎂✨

專為 iPhone Safari 與 iOS PWA 獨立運行模式 (Standalone) 深度調優的偽裝原生生日賀卡應用。

---

## 🌟 核心特色

1. **iOS 獨立模式強制檢測 (Standalone Mode Check)**
   - 一般 Safari 或非主畫面開啟時，隱藏密碼輸入框，並展示精緻的 iOS 樣式圖解指引（指示使用者點擊底部分享按鈕 ➔「加入主畫面」）。
   - 從 iPhone 桌面點開時，自動進入全螢幕原生無邊框體驗。
2. **端到端安全防護 (Vercel Serverless Function)**
   - 賀卡標題、私密祝福信、照片連結及祝願清單全數封裝在 [`api/verify.js`](file:///Users/tating/Desktop/cindyBirthCard/api/verify.js)，前端無任何明文硬編碼，杜絕透過開發者工具窺探。
   - 預設密碼為 `0322`，亦可透過 Vercel 環境變數 `BIRTHDAY_PASSWORD` 自由設定。
3. **「奔跑貓咪」3 秒 Loading 動畫**
   - 密碼驗證通過後，畫面精準倒數延遲 3 秒。
   - 採用純向量 SVG / CSS Keyframes 繪製擺動四肢、搖尾巴與踏步噴氣的可愛奔跑小貓，無需依賴外部圖檔。
4. **離線快取與本地持久化 (免重複登入)**
   - 驗證成功後自動快取至 `localStorage`，壽星隨時由主畫面點開皆能即時重溫祝福。
   - 支援離線快取 (Service Worker) 與一鍵重新上鎖。
5. **歡慶彩蛋**
   - 解鎖瞬間綻放滿版慶祝彩帶 (Canvas Confetti)。
   - 內建 Web Audio API 合成輕快生日旋律，無須載入龐大外部音訊檔案。

---

## 📁 專案目錄結構

```text
cindyBirthCard/
├── api/
│   └── verify.js          # 後端驗證 Serverless Function (安全保護賀卡資料)
├── public/
│   ├── index.html         # 前端主頁面 (PWA Meta、狀態機、跑貓動畫、賀卡)
│   ├── manifest.json      # PWA 應用配置文件
│   ├── sw.js              # Service Worker (離線快取支援)
│   └── icon-512.png       # 512x512 高解析度 iOS App 桌面圖示
├── server.js              # 本地零依賴預覽伺服器 (模擬 Vercel Serverless)
├── vercel.json            # Vercel 路由與緩存標頭配置
├── package.json           # 專案依賴與腳本 (Node.js ESM)
└── README.md              # 說明文件
```

---

## 🚀 本地開發與即時預覽

本專案提供零外部依賴的本地伺服器，可在無須安裝任何額外套件的情況下即開即用：

```bash
# 啟動本地開發伺服器
npm run dev
# 或
node server.js
```

- **正式體驗網址**：`http://localhost:3000`
- **跳過獨立模式檢測 (電腦瀏覽器直接預覽)**：`http://localhost:3000/?bypass=true`
- **預設通關密碼**：`0322`

---

## ☁️ 部署到 Vercel (0 秒冷啟動、免費方案)

### 方式 A：透過 Vercel CLI (推薦)
```bash
# 安裝或執行 Vercel 部署
npx vercel
```

### 方式 B：透過 GitHub + Vercel Dashboard
1. 將本專案上傳至 GitHub 私人或公開儲存庫。
2. 前往 [Vercel Dashboard](https://vercel.com/dashboard) 點擊 **"Add New Project"** 匯入此儲存庫。
3. （可選）在 **Environment Variables** 新增：
   - 鍵名：`BIRTHDAY_PASSWORD`
   - 鍵值：妳想指定的生日密碼（例：`0322`）
4. 點擊 **Deploy**，約數十秒即可獲得正式的 HTTPS 專屬賀卡網址！
