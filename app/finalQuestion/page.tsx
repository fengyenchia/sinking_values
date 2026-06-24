'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePsyStore } from "@/store/question"; // 請確認你的 store 相對路徑

import ActionButton from '@/components/ActionButton';
import LoopVideo from "@/components/loopVideo";
import FadeIn from "@/components/fadeIn";

export default function FinalQuestion() {
  // 1. 拿出整個測驗資料物件
  const psyData = usePsyStore((state) => state.psyData);
  const ans = psyData.answers;

  // 2. 使用 useEffect 在頁面一載入時，直接在瀏覽器主控台印出來
  useEffect(() => {
    console.log("從前面選擇題傳過來的完整答案物件：", ans);
    // 如果想看某一特定題目（例如第一題）的明確文字：
  }, [ans]);

  
  const setFinalWords = usePsyStore((state) => state.setFinalWords);
  const router = useRouter();
  
  const [inputValue, setInputValue] = useState("");
  const [warning, setWarning] = useState("");

  function handleSubmit() {
    // 阻擋空白內容，維持測驗儀式感
    if (!inputValue.trim()) {
      setWarning("請留下一點文字，讓靈魂承載...");
      return;
    }

    // 🌟 呼叫你的 Zustand Action 儲存明確文字
    setFinalWords(inputValue);
    
    // 前往結果準備頁面面
    router.push("/prepare");
  }

  return (
    <>
      <div className="w-full h-screen bg-background">
        {/* 延續使用的海浪影片 */}
        <LoopVideo videoSrc="/video/final.mp4" />
        
        <FadeIn className="w-11/12 md:w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-serif">
          <div className="flex flex-col justify-center items-center gap-8">
            
            {/* 標題 */}
            <div className="font-bold text-primary text-xl md:text-2xl border-b border-primary tracking-wider">
              最後的傾聽
            </div>
            
            {/* 引導內文 */}
            <div className="text-secondary w-5/6 md:w-3/5 flex flex-col gap-6">
              <div className="text-md md:text-xl text-primary tracking-wide">
                在你做出決定後，被指名的人（或你自己）默默站了起來，準備翻過船身。在身體落海、沒入深藍海面的最後一秒，他回頭望向你，眼神裡充滿了複雜的情緒。
              </div>

              {/* 🌟 莫蘭迪極簡毛玻璃輸入框 */}
              <div className="relative w-full">
                <textarea
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (warning) setWarning("");
                  }}
                  placeholder="在對方（或你自身）沉入虛無的最後一刻，請寫下你最後的理由、懺悔、或告別的話（限 30 字）"
                  maxLength={30}
                  rows={4}
                  className="w-full p-4 text-primary bg-[#ffffff05] border border-[#ffffff20] backdrop-blur-md rounded-sm focus:outline-none focus:border-[#ffffff60] focus:ring-1 focus:ring-white/30 transition-all duration-300 resize-none text-sm md:text-md tracking-wider placeholder:text-primary/30 font-serif custom-scrollbar"
                />
                {/* 字數計數器 */}
                <div className="absolute bottom-3 right-3 text-xs text-primary/40">
                  {inputValue.length} / 30
                </div>
              </div>
            </div>

            {/* 錯誤警告顯示 */}
            {warning && <div className="text-xs font-bold text-red-400 tracking-wider animate-pulse">{warning}</div>}
            
            {/* 功能按鈕組 */}
            <div className="w-5/6 md:w-3/5 flex justify-end">
              <ActionButton 
                text="看結果" 
                onClick={handleSubmit} 
                variant="white"
                className=""
              />
            </div>

          </div>
        </FadeIn>
      </div>
    </>
  );
}
