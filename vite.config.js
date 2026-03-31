import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // ⬇️ 改成你嘅 GitHub repo 名
  // 例如 repo 叫 "matchmaker" → base: '/matchmaker/'
  // 如果用 username.github.io → base: '/'
  base: '/matchmaker/',
});
