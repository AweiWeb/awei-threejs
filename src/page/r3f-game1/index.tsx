import { Canvas } from '@react-three/fiber';
import Experience from './component/Experience';
import { Leva } from 'leva';
const R3fGame1 = () => {
  return (
    <>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true }}
        camera={{ fov: 45, near: 0.1, far: 100, position: [1, 2, 12] }}
      >
        <Experience />
      </Canvas>
    </>
  );
};

export default R3fGame1;
