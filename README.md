# 💘 IG 交友配對工具

IG 交友 Page 配對管理工具 — 收集自介、管理投稿人、一鍵複製轉發。

**技術棧：** React 18 + Vite + Tailwind CSS + Supabase + GitHub Pages

---

## 設定步驟

### Step 1：建立 Supabase 資料庫（免費）

1. 去 [supabase.com](https://supabase.com) 註冊 / 登入
2. 建立一個新 Project（Region 揀近你嘅，如 `Northeast Asia (Tokyo)`）
3. 等佢建立好後，去 **SQL Editor**
4. 貼上 `supabase-setup.sql` 入面嘅所有內容 → 撳 **Run**
5. 去 **Settings → API**，複製：
   - `Project URL`（即 `https://xxxxxxxx.supabase.co`）
   - `anon public` key（即 `eyJxxxxxxxx...`）

### Step 2：本地開發

```bash
# 1. 安裝依賴
npm install

# 2. 建立 .env 檔案
cp .env.example .env

# 3. 編輯 .env，填入你嘅 Supabase credentials
#    VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
#    VITE_SUPABASE_ANON_KEY=eyJxxxxxxxx...

# 4. 開發模式
npm run dev

# 5. 開 http://localhost:5173
```

### Step 3：部署到 GitHub Pages（免費）

1. 喺 GitHub 建立一個新 repo（例如叫 `matchmaker`）

2. 確認 `vite.config.js` 入面嘅 `base` 同你嘅 repo 名一致：
   ```js
   base: '/matchmaker/',  // ← 改成你嘅 repo 名
   ```

3. Push 代碼上去：
   ```bash
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/你嘅username/matchmaker.git
   git push -u origin main
   ```

4. 喺 GitHub repo → **Settings → Secrets and variables → Actions** 加兩個 secret：
   - `VITE_SUPABASE_URL` → 你嘅 Supabase URL
   - `VITE_SUPABASE_ANON_KEY` → 你嘅 Supabase anon key

5. 喺 GitHub repo → **Settings → Pages**：
   - Source 改成 **GitHub Actions**

6. Push 之後 GitHub Actions 會自動 build + deploy
7. 你嘅網站會喺 `https://你嘅username.github.io/matchmaker/`

---

## 使用方法

### 公開表單（💘 交友配對）
- 搜尋式下拉選單揀「想認識邊位」（支援 100+ 人）
- 填暱稱 + IG + 自我介紹 → 送出
- 防垃圾：3 分鐘冷卻 + 字數限制 + Honeypot

### 後台管理（🔒 後台）
- 密碼保護（預設 `1234`）
- 新增 / 編輯 / 上架 / 下架投稿人
- 查看所有提交，按投稿人分類
- 一鍵複製自介 → 貼去 IG DM
- 批量複製 + 標記已處理

---

## 配置

編輯 `src/utils/constants.js`：

```js
export const ADMIN_PIN = '1234';       // 後台密碼
export const COOLDOWN_SECS = 180;      // 冷卻秒數
export const INTRO_MIN_LENGTH = 10;    // 自介最少字數
export const INTRO_MAX_LENGTH = 2000;  // 自介最多字數
```

---

## 項目結構

```
matchmaker/
├── .github/workflows/deploy.yml   ← GitHub Pages 自動部署
├── supabase-setup.sql             ← Supabase 資料庫設定
├── .env.example                   ← 環境變數模板
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── utils/
    │   ├── supabase.js            ← Supabase client
    │   ├── constants.js           ← 設定常數
    │   └── helpers.js             ← 工具函數
    ├── hooks/
    │   ├── useSupabase.js         ← 資料庫 CRUD hooks
    │   ├── useCooldown.js         ← 冷卻計時器
    │   └── useToast.js            ← 通知
    └── components/
        ├── NavBar.jsx
        ├── PublicPage.jsx         ← 公開表單
        ├── AdminPage.jsx          ← 後台管理
        ├── SearchableDropdown.jsx ← 搜尋式下拉選單
        ├── CooldownBar.jsx        ← 冷卻倒數
        ├── PinGate.jsx            ← 密碼入口
        ├── SubmissionCard.jsx     ← 提交記錄卡片
        └── Toast.jsx              ← 通知提示
```
