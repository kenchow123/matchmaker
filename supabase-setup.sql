-- ============================================
-- 💘 交友配對 — Supabase 資料庫設定
-- 喺 Supabase Dashboard → SQL Editor 貼上執行
-- ============================================

-- 1. 投稿人 (出 pool 嘅人)
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 提交記錄 (有興趣嘅人嘅自介)
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ig TEXT DEFAULT '',
  intro TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 索引 (加速查詢)
CREATE INDEX idx_submissions_target ON submissions(target);
CREATE INDEX idx_submissions_read ON submissions(read);

-- ============================================
-- Row Level Security (RLS)
-- 公開表單：任何人可以讀 profiles + 寫 submissions
-- 後台：用 app 層面嘅密碼保護（唔經 Supabase Auth）
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- 任何人可以讀取 active 嘅 profiles
CREATE POLICY "Anyone can read active profiles"
  ON profiles FOR SELECT
  USING (active = TRUE);

-- 任何人可以讀取所有 profiles（後台用，包括 inactive）
CREATE POLICY "Anyone can read all profiles for admin"
  ON profiles FOR SELECT
  USING (TRUE);

-- 任何人可以新增 profiles（後台新增投稿人）
CREATE POLICY "Anyone can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (TRUE);

-- 任何人可以更新 profiles（後台編輯）
CREATE POLICY "Anyone can update profiles"
  ON profiles FOR UPDATE
  USING (TRUE);

-- 任何人可以刪除 profiles（後台刪除）
CREATE POLICY "Anyone can delete profiles"
  ON profiles FOR DELETE
  USING (TRUE);

-- 任何人可以新增 submission（公開表單提交）
CREATE POLICY "Anyone can insert submissions"
  ON submissions FOR INSERT
  WITH CHECK (TRUE);

-- 任何人可以讀取 submissions（後台查看）
CREATE POLICY "Anyone can read submissions"
  ON submissions FOR SELECT
  USING (TRUE);

-- 任何人可以更新 submissions（標記已處理）
CREATE POLICY "Anyone can update submissions"
  ON submissions FOR UPDATE
  USING (TRUE);

-- 任何人可以刪除 submissions（後台刪除）
CREATE POLICY "Anyone can delete submissions"
  ON submissions FOR DELETE
  USING (TRUE);

-- ============================================
-- 速率限制函數（防洗版）
-- 同一個 IP/瀏覽器 3 分鐘內只能提交一次
-- 用 name + ig 組合做簡單 fingerprint
-- ============================================

CREATE OR REPLACE FUNCTION check_rate_limit(p_name TEXT, p_ig TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM submissions
    WHERE name = p_name
      AND ig = p_ig
      AND created_at > now() - INTERVAL '3 minutes'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
