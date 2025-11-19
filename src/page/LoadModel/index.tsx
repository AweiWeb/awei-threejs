import { Canvas } from '@react-three/fiber';
import Home from './components/home';
import {
  OrbitControls,
  OrthographicCamera,
  useHelper,
} from '@react-three/drei';
const LoadModel = () => {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true }}
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 100,
        position: [4, 3, 7],
      }}
    >
      <Home />
      <OrbitControls makeDefault />
    </Canvas>
  );
};

export default LoadModel;
