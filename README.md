# Sinking Values — 一場關於靈魂承載量的心理測驗

一個基於 Next.js 14 與 Gemini AI 打造的沉浸式心理測驗網頁專案。玩家將置身於一艘逐漸下沉的木船，面對擺渡人的拷問，透過一連串價值犧牲的抉擇，最終打撈出內心深處的靈魂質地與核心價值觀。


## 技術棧

- **前端框架**：Next.js 14 (App Router) + TypeScript
- **樣式管理**：Tailwind CSS
- **狀態管理**：Zustand (全域管理玩家答案與 AI 報告)
- **人工智慧**：Google GenAI SDK (`gemini-2.5-flash` 輸出標準化 JSON)
- **截圖套件**：`html2canvas-pro` (客製化直式海報克隆導出)
- **動畫效果**：CSS 漸入動畫 (FadeIn)

## 環境變數設定
請在專案根目錄建立 .env.local 檔案，並填入你的 Gemini API Key：
```
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
```
*專案內附帶 .env.example 檔案，可複製該檔案並直接重新命名為 .env.local*


## 配樂
**On the Shore**

Attribution Code
"On the Shore" Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 License
http://creativecommons.org/licenses/by/4.0/