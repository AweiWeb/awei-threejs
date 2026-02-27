import { Canvas } from '@react-three/fiber';
import Experence from './components/Experience';
import UI from './components/UI';
import './styles/index.scss';
const Wass05 = () => {
  return (
    <div className="wass-05">
      <div className="canvas-3d">
        <Canvas
          shadows
          camera={{ position: [1, 6, 12], fov: 50 }}
          gl={{ antialias: true }}
          dpr={[1.5, 2]}
        >
          <Experence />
        </Canvas>
      </div>
      <UI />
    </div>
  );
};

export default Wass05;
