import { Canvas } from '@react-three/fiber';
import Experience from './component/Experience';
import { KeyboardControls } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
const R3fGame3 = () => {
  return (
    <>
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
          { name: 'back', keys: ['KeyS', 'ArrowDown'] },
          { name: 'left', keys: ['KeyA', 'ArrowLeft'] },
          { name: 'right', keys: ['KeyD', 'ArrowRight'] },
          { name: 'run', keys: ['Shift'] },
          { name: 'jump', keys: ['Space'] },
        ]}
      >
        <Canvas
          gl={{ antialias: true }}
          camera={{ fov: 45, near: 0.1, far: 1000, position: [3, 3, 4] }}
          dpr={[1.5, 2]}
          shadows
        >
          <Experience />
          {/* <EffectComposer>
            <Bloom luminanceThreshold={1} intensity={1.22} />
          </EffectComposer> */}
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default R3fGame3;
