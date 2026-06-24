'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

interface VideoTextureProps {
  videoSrc: string;
}

function Model({ videoSrc }: VideoTextureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  
  // 用來記錄目前是正向播放 (1) 還是逆向播放 (-1)
  const directionRef = useRef<number>(1); 

  useEffect(() => {
    // 1. 建立 HTML5 video 標籤
    const video = document.createElement('video');
    video.src = videoSrc;
    
    // 2. 關鍵：關閉原生 loop，由 useFrame 接管來回播放邏輯
    video.loop = false; 
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    
    // 3. 正常 1.0 倍速播放
    video.play().catch(err => console.log("Video play interrupted:", err));
    videoRef.current = video;

    // 4. 建立 Three.js 影片紋理
    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    textureRef.current = texture;

    if (materialRef.current) {
      materialRef.current.map = texture;
      materialRef.current.needsUpdate = true;
    }

    return () => {
      video.pause();
      video.src = '';
      video.load();
      texture.dispose();
    };
  }, [videoSrc]);

  // 🌟 每幀監聽：實現 1.0 倍速的正反切換
  useFrame((state, delta) => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return; // 確保影片已準備就緒

    if (directionRef.current === 1) {
      // 【正傳模式】快到結尾時（保留 0.1 秒緩衝避開硬跳），切換成逆向
      if (video.currentTime >= video.duration - 0.1) {
        directionRef.current = -1;
        video.pause();
      }
    } else {
      // 【逆傳模式】手動扣除時間倒帶。乘以 2 可讓 1.0 倍速的正反動態視覺上完美對稱
      video.currentTime -= delta * 2; 

      // 快到開頭時，重設時間並切換回正傳
      if (video.currentTime <= 0.1) {
        video.currentTime = 0;
        directionRef.current = 1;
        video.play().catch(() => {});
      }
    }
  });

  return (
    // 5. 3D 空間中的影片平面
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[16, 9]} /> 
      <meshBasicMaterial 
        ref={materialRef}
        transparent={true} 
        depthWrite={false} // 確保透明背景不會遮擋後面的 <Stars />
        side={THREE.DoubleSide}
        toneMapped={false} 
      />
    </mesh>
  );
}


export default function ThreeD({ videoSrc }: VideoTextureProps) {
  // 響應式手機板相機判定
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#2b2b38]">
      <Canvas
        style={{ width: '100vw', height: '100vh' }}
        camera={{
          position: isMobile ? [0, 0, 10] : [0, 0, 8],
          fov: 45,
        }}
        gl={{ alpha: true }}
      >
        {/* 3D 影片組件 */}
        <Suspense fallback={null}>
          <Model videoSrc={videoSrc} />
        </Suspense>

        {/* 星星背景 */}
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={2} />
      </Canvas>
    </div>
  );
}
