import { Canvas } from '@react-three/fiber';
import MouseModel from './components/Mouse';

import { OrbitControls, useHelper } from '@react-three/drei';
import { useRef } from 'react';
const MouseEventPage = () => {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 100,
        position: [1, 3, 7],
      }}
      gl={{ antialias: true }}
      onPointerMissed={() => {
        console.log('清空所有选项');
      }}
    >
      <ambientLight intensity={0.5} />

      <MouseModel />
      <OrbitControls />
    </Canvas>
  );
};

export default MouseEventPage;
