import { StrictMode } from 'react';
import { Canvas, RootState } from '@react-three/fiber';
import * as THREE from 'three';
import Debug from './component/Example';
import { Leva } from 'leva';
import { OrbitControls } from '@react-three/drei';
const EnvExample = () => {
  const create = ({ gl, scene }: RootState) => {
    // console.log(THREE.ACESFilmicToneMapping);
    // gl.setClearColor('red');
    // scene.background = new THREE.Color('#ff0000');
    // gl.toneMapping = THREE.CineonToneMapping;
  };
  return (
    <StrictMode>
      <Leva collapsed />
      <Canvas
        dpr={[1, 2]}
        shadows
        gl={{ antialias: true }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          position: [1, 2, 7],
        }}
        onCreated={create}
      >
        <Debug />
        <OrbitControls />
      </Canvas>
    </StrictMode>
  );
};

export default EnvExample;
