'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePsyStore } from "@/store/question"; // 請確認你的 store 相對路徑
import html2canvas from "html2canvas-pro";

import ActionButton from '@/components/ActionButton';
import LoopVideo from "@/components/loopVideo";
import FadeIn from "@/components/fadeIn";

export default function Result() {
  const psyData = usePsyStore((state) => state.psyData);
  const reset = usePsyStore((state) => state.reset);
  const router = useRouter();

  const report = psyData.aiReport;

  const printAreaRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  // 防呆機制
  useEffect(() => {
    if (!report) {
      router.push("/");
    }
  }, [report, router]);

  function handleRetry() {
    reset();
    router.push("/");
  }

  async function handleCapture() {
    if (!printAreaRef.current || isCapturing) return;

    try {
      setIsCapturing(true);

      const canvas = await html2canvas(printAreaRef.current, {
        useCORS: true,
        scale: 2,         // 雙倍高畫質
        backgroundColor: null,
        logging: false,
        // 強制指定 Canvas 的擷取長寬，確保比例絕對不會被螢幕寬度拉扁
        width: 420,
        height: 640
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `SinkingValues_${report?.soulType || "Soul"}.png`;
      link.click();
    } catch (err) {
      console.error("截圖保存失敗：", err);
    } finally {
      setIsCapturing(false);
    }
  }

  if (!report) return null;

  return (
    <>
      <div className="w-full h-screen overflow-hidden relative bg-[#13131a]">
        {/* 背景：網頁上實際播放的動態影片 */}
        <LoopVideo videoSrc="/video/final.mp4" />
        
        {/* 1. 網頁上實際顯示的 UI */}
        <FadeIn className="w-11/12 md:w-5/6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-serif flex flex-col justify-center items-center gap-6 z-10">
          
          <div className="w-full max-w-xl p-8 md:px-6 md:py-8 bg-[#ffffff05] border border-[#ffffff15] backdrop-blur-xl rounded-sm text-center shadow-2xl flex flex-col gap-6 tracking-wider">
            <div className="flex flex-col gap-1 items-center">
              <span className="text-sm text-secondary/60 tracking-[0.2em]">你的靈魂質地</span>
              <h1 className="text-xl md:text-2xl font-bold text-primary">
                {report.soulType}
              </h1>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {report.tags?.map((tag, idx) => (
                <span 
                  key={idx} 
                  className="text-xs text-primary/70 bg-secondary/30 backdrop-blur-xl px-2 py-1 rounded-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="text-xs md:text-base text-secondary leading-relaxed text-justify px-2 md:px-4">
              {report.analysis}
            </div>

            <div className="w-full bg-primary/10 px-4 py-2 md:p-4 rounded-sm">
              <p className="text-xs text-primary/60 mb-1 tracking-[0.15em]">給靈魂的備忘錄</p>
              <p className="text-xs md:text-sm text-primary/80 italic">
                「 {report.advice} 」
              </p>
            </div>
          </div>

          {/* 雙功能按鈕組 */}
          <div className="w-full text-sm md:text-md max-w-xl flex flex-row gap-4 justify-center">
            <ActionButton 
              text={isCapturing ? "刻印中..." : "保存靈魂印記"} 
              onClick={handleCapture} 
              variant="white"
              disabled={isCapturing}
              className="w-full"
            />
            <ActionButton 
              text="再度啟航" 
              onClick={handleRetry} 
              variant="white"
              className="w-full"
            />
          </div>
        </FadeIn>

        {/* 🌟 2. 專門給截圖用的隱藏海報層（精準控制直式海報比例，不被壓縮） 🌟 */}
        <div className="absolute top-0 left-0 opacity-0 pointer-events-none select-none z-0">
          <div 
            ref={printAreaRef}
            className="relative flex flex-col items-center justify-between text-center font-serif tracking-wider"
            style={{
              width: "420px",
              height: "600px",
              padding: "48px 32px",
              boxSizing: "border-box",
              // 使用多重背景：上層莫蘭迪暗色濾鏡遮罩，下層 bg.png，完美融合不偏色
              background: "linear-gradient(rgba(26, 26, 36, 0.1), rgba(26, 26, 36, 0.1)), url('/images/bg.png') no-repeat center/cover",
            }}
          >
            {/* 標題與稱號 */}
            <div className="flex flex-col gap-2 items-center w-full">
              <span className="text-xs tracking-[0.2em]" style={{ color: "rgba(255, 255, 255, 0.5)" }}>你的靈魂質地</span>
              <h1 className="text-2xl font-bold" style={{ color: "#ffffff", marginTop: "4px" }}>
                {report.soulType}
              </h1>
            </div>

            {/* Hashtags 標籤區塊 */}
            <div className="flex flex-wrap justify-center gap-3 w-full">
              {report.tags?.map((tag, idx) => (
                <span 
                  key={idx} 
                  style={{
                    fontSize: "11px",
                    color: "rgba(255, 255, 255, 0.85)",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    padding: "4px 10px",
                    borderRadius: "2px",
                    letterSpacing: "0.05em"
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* 剖析內文 */}
            <div 
              className="text-xs leading-relaxed text-justify px-2 w-full" 
              style={{ color: "rgba(255, 255, 255, 0.8)", minHeight: "140px" }}
            >
              {report.analysis}
            </div>

            {/* 備忘錄區塊 */}
            <div 
              className="w-full rounded-sm text-center"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", padding: "20px 16px" }}
            >
              <p className="text-xs tracking-[0.15em]" style={{ color: "rgba(255, 255, 255, 0.5)", marginBottom: "6px" }}>給靈魂的備忘錄</p>
              <p className="text-xs md:text-sm italic" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                「 {report.advice} 」
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
