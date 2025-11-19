import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { First } from './component/mode1';
import BufferModel from './component/buffer';
const Fiber1 = () => {
  return (
    <Canvas
      dpr={[1, 2]} //这里是屏幕像素比，1，2就是大于2的取2小于2的取1
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputEncoding: THREE.sRGBEncoding,
      }}
      camera={{ fov: 45, near: 0.1, far: 100, position: [1, 2, 7] }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight intensity={2} position={[1, 2, 3]} />
      <BufferModel />
      <First />
    </Canvas>
  );
};

export default Fiber1;
