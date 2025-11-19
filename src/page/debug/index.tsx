import { Canvas } from '@react-three/fiber';
import { StrictMode } from 'react';
import { OrbitControls } from '@react-three/drei';
import { Leva } from 'leva';
import Debug from './compontent/example';
const Fiber3 = () => {
  return (
    <StrictMode>
      <Leva collapsed />
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [1, 2, 7],
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[-2, 3, 0]} intensity={2} />
        <Debug />
        <OrbitControls />
      </Canvas>
    </StrictMode>
  );
};

export default Fiber3;
