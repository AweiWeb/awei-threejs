import { Canvas } from '@react-three/fiber';
import Experience from './components/Experence';
import UI from './components/UI';
import './styles/index.scss';
import { Suspense } from 'react';
const Wass03 = () => {
  return (
    <>
      <div className="firework-home">
        <div className="virtul-world">
          <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
            <Suspense>
              <Experience />
            </Suspense>
          </Canvas>
        </div>
        <UI />
      </div>
    </>
  );
};

export default Wass03;
