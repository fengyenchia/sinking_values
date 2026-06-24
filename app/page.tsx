'use client';

import FadeIn from "@/components/fadeIn";
import LoopVideo from "@/components/loopVideo";
import TextType from '@/components/TextType';
import ActionButton from "@/components/ActionButton";

export default function Home() {  
  
  return (
    <div className="w-full h-screen bg-background">
      <LoopVideo videoSrc="/video/boat.mp4" />
      
      <FadeIn className="w-full absolute top-1/3 left-1/2 transform -translate-x-1/2 text-center">
        <div className="flex flex-col justify-center items-center gap-40">
          <div className="font-serif flex flex-col justify-center items-center gap-8">
            <h1 className="text-4xl md:text-6xl font-bold text-primary">Sinking Values</h1>
            <TextType 
              className="text-md md:text-xl font-bold text-secondary"
              text={["一場關於靈魂承載量的心理測驗…"]}
              typingSpeed={90}
              pauseDuration={2000}
              cursorCharacter="|"
              deletingSpeed={90}
            />
          </div>
          <ActionButton
            text="啟航"
            href="/description"
            variant="white"
            className="absolute -bottom-24 md:-bottom-16"
          />

        </div>
      </FadeIn>
    </div>
  );
}