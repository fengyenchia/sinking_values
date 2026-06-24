'use client';

import FadeIn from "@/components/fadeIn";
import LoopVideo from "@/components/loopVideo";
import TextType from '@/components/TextType';
import ActionButton from "@/components/ActionButton";

export default function Description() {  
  
  return (
    <div className="w-full h-screen">
      <LoopVideo videoSrc="/video/description.mp4" />
      
      <FadeIn className="w-full absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center">
        <div className="flex flex-col justify-center items-center gap-40">
          <div className="flex flex-col justify-center items-center w-1/2">
            <TextType 
              className="font-serif text-lg/8 md:text-2xl/10 text-secondary"
              text={["一睜開眼，四周只有無邊無際的深藍海面。我發現自己正坐在一艘孤零零的木船上，身後還坐著三個神祕的陌生人。", "船頭站著一位面無表情的擺渡人，他緩緩划著篙，聲音沙啞地打破沉默：「這艘船正駛向彼岸的轉生之門。但海面下的『虛無』正在腐蝕船底，這艘船無法承載所有人抵達。", "在接下來的航程中，每當船沉下一分，你們就必須拋棄一些東西。否則……所有人將一同沉入虛無。」", "看著腳下正緩緩滲入的海水，我知道，為了活著看到彼岸的微光，我必須開始做出一連串違背本心的抉擇。"]}
              typingSpeed={90}
              pauseDuration={2000}
              cursorCharacter="|"
              deletingSpeed={50}
              loop={false}
            />
          </div>
        </div>
      </FadeIn>
      <ActionButton
        text="開始"
        href="/question"
        variant="white"
        className="z-10 absolute bottom-24 md:bottom-16"
      />
    </div>
  );
}