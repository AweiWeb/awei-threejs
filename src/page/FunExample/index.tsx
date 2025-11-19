import { Canvas } from '@react-three/fiber';
import Fun from './components/home';
import './styles/index.scss'
import { OrbitControls } from '@react-three/drei';
const FunExample = () => {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true }}
      camera={{ fov: 45, near: 0.1, far: 2000, position: [1, 2, 6] }}
    >
      <Fun />
      {/* <OrbitControls /> */}
    </Canvas>
  );
};

export default FunExample;
