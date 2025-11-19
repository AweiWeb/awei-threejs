import { Canvas } from '@react-three/fiber';
import Home from './components/home';
import { OrbitControls } from '@react-three/drei';
import { Leva } from 'leva';
const ProcessingExample = () => {
  return (
    <>
      <Leva />
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true }}
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [1, 2, 7],
        }}
      >
        <ambientLight intensity={0.5} />
        <Home />
        <OrbitControls makeDefault />
      </Canvas>
    </>
  );
};

export default ProcessingExample;
