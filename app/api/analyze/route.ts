// /app/api/analyze/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// 初始化 Gemini 官方最新 SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(request: Request) {
  try {
    const { answers, finalWords } = await request.json();

    // 驗證前端資料
    if (!answers || !finalWords) {
      return NextResponse.json({ error: "缺少答案或告別文字" }, { status: 400 });
    }

    // 設定給 Gemini 的 Prompt 調性
    const systemInstruction = `
    你是一場名為《Sinking Values》（沉沒價值）心理測驗的靈魂分析師。
    這場測驗關於一艘在迷霧中逐漸下沉的木船，考驗玩家面對價值犧牲與靈魂承載量的本質。
    
    請根據玩家提供的 5 題選擇題答案與最後的一段話，生成一份深刻、典雅、帶有一點哲學神祕感的靈魂分析報告。
    
    【重要規範】
    你必須嚴格只回傳 JSON 格式的字串，不要包含任何 \`\`\`json 等 Markdown 的標記或多餘的文字。JSON 格式必須包含以下四個欄位：
    {
        "soulType": "靈魂稱號（如：沈默的觀測者、過載的引渡人）",
        "tags": ["產出2~3個符合他個性的精簡標籤，不需加#號（如：["孤獨觀測者", "極致理性"]）"],
        "analysis": "100字左右的深度內文分析，探討他的價值觀與靈魂承載狀態。",
        "advice": "給他靈魂的一句啟示與建議。"
    }
    `;

    const userPrompt = `
      玩家測驗紀錄如下：
      - 選擇題紀錄：${JSON.stringify(answers)}
      - 面對沉船，對靈魂留下的最後話語："${finalWords}"
    `;

    // 呼叫 Gemini 2.5 或 1.5 系列中最適合生成文字的 models.generateContent
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // 速度極快、成本低，非常適合生成測驗 JSON 的主力模型
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        // 強制 Gemini 輸出標準 JSON 格式
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const aiResult = response.text;

    if (!aiResult) {
    throw new Error("Gemini 回傳內容為空");
    }

    // 🌟 保險清洗：把可能不小心夾帶的 ```json 或 ``` 標籤徹底清除
    const cleanedResult = aiResult
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/, "")
    .trim();

    // 解析乾淨的字串並回傳
    return NextResponse.json(JSON.parse(cleanedResult));

  } catch (error: unknown) {
    console.error("Gemini API Error:", error);
    
    // 🌟 修正：把 error 轉為標準 Error 物件來安全讀取 message，消滅 any 錯誤
    const errInstance = error instanceof Error ? error : new Error(String(error));
    
    return NextResponse.json(
      { error: `Gemini 分析失敗: ${errInstance.message}` }, 
      { status: 500 }
    );
  }
}