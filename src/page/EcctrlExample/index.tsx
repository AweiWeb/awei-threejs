import { Canvas } from '@react-three/fiber';
import Experience from './component/Experience';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useState } from 'react';

const EcctrlExample = () => {
  const [cubeCount, setCubeCount] = useState(0);
  return (
    <>
      <Canvas
        onClick={() => setCubeCount(() => cubeCount + 1)}
        gl={{ antialias: true }}
        shadows
        camera={{ fov: 45, near: 0.1, far: 100, position: [2, 0, 4] }}
      >
        <Experience count={cubeCount} />
        <EffectComposer>
          <Bloom />
        </EffectComposer>
      </Canvas>
    </>
  );
};
export default EcctrlExample;
