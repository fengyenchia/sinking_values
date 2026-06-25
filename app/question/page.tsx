'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePsyStore } from "../../store/question";

import ActionButton from '@/components/ActionButton';
import { ProgressBar } from '@heroui/react';
import LoopVideo from "@/components/loopVideo";
import FadeIn from "@/components/fadeIn";

export default function Question() {
  const psyData = usePsyStore((state) => state.psyData);
  const setPsyAnswer = usePsyStore((state) => state.setAnswer);
  const router = useRouter();

  const questionData = psyData.questionData;
  const ans = psyData.answers;

  const [questionIndex, setQuestionIndex] = useState(0);
  const questionPercent = ((questionIndex + 1) / questionData.length) * 100;
  const [warning, setWarning] = useState("");

  useEffect(() => {
    if (ans && questionData.length >= 5) {
      console.log("[問題一]" + questionData[0].title + "[答案一]" + ans.Q1 + ", " 
                + "[問題二]" + questionData[1].title + "[答案二]" + ans.Q2 + ", " 
                + "[問題三]" + questionData[2].title + "[答案三]" + ans.Q3 + ", " 
                + "[問題四]" + questionData[3].title + "[答案四]" + ans.Q4 + ", " 
                + "[問題五]" + questionData[4].title + "[答案五]" + ans.Q5);
    }
  }, [ans, questionData]);

  function nextQuestion(optionText: string) {
    const questionKey = `Q${questionIndex + 1}`;
    setPsyAnswer(questionKey, optionText);
    setWarning("");
    
    if (questionIndex === questionData.length - 1) {
      router.push("/finalQuestion");
    } else {
      setQuestionIndex(questionIndex + 1);
    }
  }
  
  function prevQuestionButton() {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  }

  return (
    <>
      <div className="w-full h-screen bg-background">
        <LoopVideo videoSrc="/video/middle.mp4" />
        
        <FadeIn className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-serif">
          <div className="flex flex-col justify-center items-center gap-8">
            
            {/* 進度條 */}
            <ProgressBar value={questionPercent} className="w-full max-w-xs md:max-w-md progress-bar--lg">
              <ProgressBar.Track className="bg-secondary/60 h-0.5 rounded-full">
                <ProgressBar.Fill className="bg-primary h-0.5 rounded-full transition-all duration-600" />
              </ProgressBar.Track>
            </ProgressBar>
            
            {/* 大題目標題 */}
            <div className="font-bold text-primary text-xl md:text-2xl border-b border-primary tracking-wider">
              {questionData[questionIndex].mainTitle}
            </div>
            
            {/* 題目內文與選項 */}
            <div className="text-secondary w-5/6 md:w-3/5 flex flex-col gap-4">
              <div className="font-bold text-md md:text-xl mb-2 text-primary">{questionData[questionIndex].title}</div>

              {questionData[questionIndex].options.map(
                (option: { text: string }, index: number) => {
                  const questionKey = `Q${questionIndex + 1}`;
                  
                  // 將對比條件改為 option.text，字串與字串相比才會正確
                  const selected = psyData.answers && psyData.answers[questionKey] === option.text;
                  const baseButtonClass = "flex justify-center items-center w-full border text-xs md:text-lg px-4 py-2 backdrop-blur-sm tracking-wider hover:scale-101 active:scale-99 transition-all duration-600 rounded-sm text-primary border-[#ffffff20] bg-[#ffffff80] hover:bg-[#ffffff95] hover:border-[#ffffff] cursor-pointer";                  
                  // 選中時的亮白框樣式
                  const stateClass = selected ? "ring-2 ring-white/90 bg-[#ffffff20] shadow-lg" : "";

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => nextQuestion(option.text)}
                      aria-pressed={selected}
                      className={`${baseButtonClass} ${stateClass}`}
                    >
                      {option.text}
                    </button>
                  );
                }
              )}
            </div>
            

            {/* 功能按鈕 */}
            {warning && <div className="text-xs font-bold text-red-400">{warning}</div>}
            
            <div className="w-5/6 md:w-3/5 flex justify-start mt-2">
              <ActionButton 
                text="返回" 
                onClick={prevQuestionButton} 
                disabled={questionIndex === 0} 
                variant="white"
              />
            </div>

          </div>
        </FadeIn>
      </div>
    </>
  );
}
