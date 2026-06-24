'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { Environment, Stars, OrbitControls } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

function Model() {
  // 1. 載入合併後的單一 .glb 檔案
  const { scene, animations } = useGLTF('/3d/all.glb');

  const groupRef = useRef<THREE.Group>(null);
  
  // 2. 傳入 animations，並綁定到 groupRef
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      // 3. 因為沒有拆分 Action，這裡會直接啟動整條場景時間軸，海浪與船會一起動
      Object.values(actions).forEach((action) => {
        action?.reset().fadeIn(0.5).play();
      });
    }
  }, [actions]);

  return (
    // 4. 務必用 group 包住 primitive 並綁上 ref
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// 預載入確保不掉材質
useGLTF.preload('/3d/all.glb');

export default function ThreeD() {
  // 建立一個狀態來決定目前是否為手機板（預設為 false 避免 SSR 報錯）
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 偵測畫面的函式（以 768px 作為手機與電腦的斷點）
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 元件掛載時先執行一次
    handleResize();

    // 監聽視窗大小改變
    window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
  return (
    <div className="w-screen scrollbar-y-auto!">
      <Canvas
        style={{ width: '100vw', height: '100vh' }}

        camera={{
          position: isMobile ? [0, 0, 10] : [0, 0, 8],
          fov: 45,
        }}
        gl={{ alpha: true }}
      >
        {/* 環境光 */}
        <Environment preset="night" background={false} backgroundBlurriness={1} />

        {/* 自動旋轉 */}
        <OrbitControls autoRotate={true} autoRotateSpeed={0.5} />

        <ambientLight intensity={3} />
        <directionalLight position={[0, 0, 10]} intensity={5} color="#ffffff" />
        <directionalLight position={[0, 0, -10]} intensity={5} color="#ffffff" />

        {/* 將 Suspense 包裹剛剛建立的 Model 元件 */}
        <Suspense fallback={null}>
          <Model />
          {/* <AddModel /> */}
        </Suspense>

        {/* 星星 */}
        {/* <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} /> */}
        
        {/* 發光效果 */}
        {/* <EffectComposer>
          <Bloom intensity={0.01} />
        </EffectComposer> */}

      </Canvas>
    </div>
  );
}