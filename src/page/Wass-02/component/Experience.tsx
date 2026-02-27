import { OrbitControls } from '@react-three/drei';
import VFXParticle from './VFX1';
import VFXEmitter from './VFXEmitter';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
const Experience = () => {
  const emit1 = useRef(null!) as any;
  const emit2 = useRef(null!);
  useFrame(({ clock }, delta) => {
    if (!emit1.current) {
      return;
    }
    const elapsedTime = clock.getElapsedTime();
    // emit1.current.position.x = Math.cos(elapsedTime * 2) * 1.5;
    // emit1.current.position.y = Math.sin(elapsedTime * 3) * 1.5;
    // emit1.current.position.z = Math.cos(elapsedTime * 4) * 1.5;
  });
  return (
    <>
      <color attach={'background'} args={['rgb(17, 21, 17)']} />
      <VFXParticle
        geometry={<capsuleGeometry args={[0.02, 0.2, 1, 8]} />}
        settings={{ nbParticle: 100000, intensity: 1.5, fadeSize: [0.1, 0.9], gravity: [0, -9.8, 0] }}
        vfxName={'awei'}
      />
      <VFXEmitter
        emitter={'awei'}
        ref={emit1}
        debug={true}
        settings={{
          colorStart: ['#50ff7c'],
          colorEnd: ['#ffffff'],
          size: [0.1, 1],
          speed: [1, 5],
          nbParticles: 5000,
          startPositionMin: [-1, -1, -1],
          startPositionMax: [1, 1, 1],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          rotationSpeedMin: [8, 0, 8],
          rotationSpeedMax: [8, 0, 8],
          directionMin: [-0.5, 0, -0.5],
          directionMax: [0.5, 1, 0.5],
          loop: false,
          particleLifeTime: [0.1, 1],
        }}
      />
      <EffectComposer>
        <Bloom intensity={1} luminanceThreshold={1} mipmapBlur />
      </EffectComposer>
      <OrbitControls />
    </>
  );
};

export default Experience;
