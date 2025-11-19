import { Canvas } from '@react-three/fiber';
import Ground from './game/ground';
import Obstacle from './game/Obstacle';
import Player from './game/Player';
import Environment from './game/Environment';
import { Suspense, useMemo } from 'react';
import { Perf } from 'r3f-perf';
import { Physics } from '@react-three/rapier';
import { KeyboardControls, OrbitControls } from '@react-three/drei';
import { Leva } from 'leva';

const gameExample = () => {
  const keyMap = useMemo(() => {
    const map = [
      { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
      { name: 'back', keys: ['ArrowDown', 'KeyS'] },
      { name: 'right', keys: ['ArrowRight', 'KeyD'] },
      { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
      { name: 'jump', keys: ['Space'] },
    ];
    return map;
  }, []);
  return (
    <>
      <Leva collapsed />
      <KeyboardControls map={keyMap}>
        <Canvas
          dpr={[1, 2]}
          camera={{ fov: 45, near: 0.1, far: 100, position: [1, 10, 6] }}
          gl={{ antialias: true }}
          shadows
        >
          <Perf position="top-left" />
          <ambientLight intensity={0.5} />

          <Environment />
          <Physics gravity={[0, -9.8, 0]} debug={true}>
            <Ground />
            <Obstacle />
            <Player />
          </Physics>
          <OrbitControls />
        </Canvas>
      </KeyboardControls>
    </>
  );
};

export default gameExample;
