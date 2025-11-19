import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Porterial from './components/porterial';
const GlslExample = () => {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ fov: 45, near: 0.1, far: 100, position: [1, 2, 5] }}
      flat
    >
      <Porterial />
      <OrbitControls />
    </Canvas>
  );
};

export default GlslExample;
