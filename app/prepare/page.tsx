'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { usePsyStore } from "../../store/question"; // 請確認你的 store 相對路徑
import FadeIn from "@/components/fadeIn";
import LoopVideo from "@/components/loopVideo";

export default function Prepare() {
  const psyData = usePsyStore((state) => state.psyData);
  const setAiReport = usePsyStore((state) => state.setAiReport);
  const router = useRouter();
  
  const [loadingText, setLoadingText] = useState("正在打撈靈魂的碎片...");
  const hasFetched = useRef(false);

  // 在 useEffect 外部把這兩個值拿出來
  const userAnswers = psyData.answers;
  const userFinalWords = psyData.finalWords;

  useEffect(() => {
    // 檢查是否有答案，沒有就踢回首頁
    if (!userAnswers || !userAnswers.Q1) {
      router.push("/");
      return;
    }

    // 阻擋重複打 API
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function getAIResult() {
      try {
        const payload = {
          answers: userAnswers,
          finalWords: userFinalWords
        };

        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "請求失敗");
        }
        
        const resultData = await response.json();
        console.log("Gemini 分析出來的最終 JSON 報告：", resultData);

        setAiReport(resultData);
        router.push("/result");

      } catch (err: unknown) {
        console.error("前端抓到爆掉的原因：", err);
        // 檢查 err 是不是一個帶有 message 的標準 Error 物件
        const errorMessage = err instanceof Error ? err.message : "請檢查後端 Terminal";
        setLoadingText(`迷霧過於濃烈：${errorMessage}`);
      }
    }

    // 🌟 修正：getAIResult 必須寫在 catch 的外面，確保正常流程會執行它
    getAIResult();
    
    // 🌟 修正：正確閉合 useEffect 的大括號與依賴陣列
  }, [router, setAiReport, userAnswers, userFinalWords]);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center font-serif">
        <LoopVideo videoSrc="/video/description.mp4" />
      <FadeIn className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="text-xl md:text-2xl tracking-widest animate-pulse mb-4 text-primary">{loadingText}</div>
        <div className="text-sm md:text-md text-primary/40 tracking-wider">木船正在逐漸隱入深處...</div>
      </FadeIn>
    </div>
  );
}
