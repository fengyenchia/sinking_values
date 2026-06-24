"use client"
import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function BgMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const handleFirstClickRef = useRef<() => void>(() => {});
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio("/audio/bgMusic.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    // 定義首次點擊自動播放的邏輯
    const handleFirstClick = () => {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => console.log("播放被阻擋:", err));
      
      document.removeEventListener("click", handleFirstClick);
    };

    // 將 reference 存起來，讓 toggleBgm 也能存取並移除它
    handleFirstClickRef.current = handleFirstClick;
    document.addEventListener("click", handleFirstClick);

    return () => {
      audio.pause();
      document.removeEventListener("click", handleFirstClick);
    };
  }, []);

  const toggleBgm = () => {
    if (!audioRef.current) return;

    // 使用者一旦主動點了按鈕，不論是開是關，都解除全域的監聽，避免自動播放邏輯干擾
    if (handleFirstClickRef.current) {
      document.removeEventListener("click", handleFirstClickRef.current);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => console.log("播放被阻擋:", err));
    }
  };

  return (
    <button
      onClick={toggleBgm}
      data-html2canvas-ignore="true"
      className="fixed top-4 right-4 z-50 p-2 rounded-full hover:scale-105 transition-all"
    >
      {isPlaying ? <Volume2 className="w-5 h-5 text-primary/80" /> : <VolumeX className="w-5 h-5 text-primary/80" />}
    </button>
  );
}