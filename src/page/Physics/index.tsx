import { Canvas } from '@react-three/fiber';
import Home from './components/home';
import { OrbitControls } from '@react-three/drei';
import { Leva } from 'leva';
const PhysicsExample = () => {
  return (
    <>
      {/* <Leva /> */}
      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [5, 6, 15],
        }}
      >
        <Home />
        <OrbitControls makeDefault />
      </Canvas>
    </>
  );
};

export default PhysicsExample;
