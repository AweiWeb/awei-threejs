import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Example from './component/example';
const Fiber2 = () => {
  return (
    <Canvas
      gl={{ antialias: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 100,
        position: [1, 2, 8],
      }}
    >
      <ambientLight />
      <directionalLight />
      <Example />
      <OrbitControls makeDefault />
    </Canvas>
  );
};

export default Fiber2;
