import { Canvas } from '@react-three/fiber';
import Experience from './components/Experence-demo';
import Experence from './components/Experience';
const Wass04 = () => {
  return (
    <>
      <Canvas shadows dpr={[1.5, 2]} gl={{ antialias: true }}>
        <Experence />
      </Canvas>
    </>
  );
};

export default Wass04;
