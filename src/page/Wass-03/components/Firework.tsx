import VFXEmitter from '@/page/Wass-02/component/VFXEmitter';
import { useFireworks } from '../store/firework';
import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { degToRad } from 'three/src/math/MathUtils.js';
import { Box, PositionalAudio } from '@react-three/drei';

// 发射器
const Fireworks = () => {
  const fireworks = useFireworks((state: any) => state.fireworks);
  return (
    <>
      {fireworks.map((item: any) => (
        <Firework key={item.id} {...item} />
      ))}
    </>
  );
};

const Firework = ({ velocity, position, colorS, colorE, delay }: any) => {
  const fireRef = useRef(null!) as any;
  const age = useRef(0) as any;
  const aduioPlayer = useRef(null) as any;
  useEffect(() => {
    setTimeout(() => {
      aduioPlayer.current.play();
    }, delay * 1000);
  }, []);
  useFrame((_, delta) => {
    /*
     * 曲线运动
     */
    if (fireRef) {
      fireRef.current.position.x += velocity[0] * delta;
      fireRef.current.position.y +=
        velocity[1] * 1.2 * delta + age.current * age.current * -9.0 * delta;
      fireRef.current.position.z += velocity[2] * delta;

      age.current += delta;
      console.log(age.current);
    }
  });

  return (
    <group ref={fireRef} position={position}>
      <PositionalAudio
        url="/sfxs/firecracker-corsair-4-95046.mp3"
        loop={false}
        autoplay={false}
        ref={aduioPlayer}
        distance={20}
      />
      <VFXEmitter
        emitter={'awei'}
        debug={false}
        settings={{
          colorStart: colorS,
          colorEnd: colorE,
          size: [0.01, 0.3],
          speed: [1, 5],
          spawnMode: 'brust',
          nbParticles: 5000,
          duration: 1,
          delay: delay + 0.2,
          startPositionMin: [-0.1, -0.1, -0.1],
          startPositionMax: [0.1, 0.1, 0.1],
          startRotationMin: [degToRad(-90), 0, 0],
          startRotationMax: [degToRad(90), 0, 0],
          rotationSpeedMin: [0, 0, 0],
          rotationSpeedMax: [3, 3, 3],
          directionMin: [-1, -1, -1],
          directionMax: [1, 1, 1],
          loop: false,
          particleLifeTime: [0.1, 2],
        }}
      />
      <PositionalAudio
        url="/sfxs/firework-whistle-190306.mp3"
        loop={false}
        autoplay
        distance={20}
      />
      <VFXEmitter
        emitter={'awei'}
        debug={false}
        settings={{
          colorStart: colorS,
          colorEnd: colorE,
          size: [0.01, 0.2],
          speed: [0, 1],
          nbParticles: 100 * delay,
          spawnMode: 'time',
          duration: delay,
          particleLifeTime: [0.1, 0.6],
          startPositionMin: [-0.02, 0, -0.02],
          startPositionMax: [0.02, 0, 0.02],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          rotationSpeedMin: [-12, -12, -12],
          rotationSpeedMax: [12, 12, 12],
          directionMin: [-1, -1, -1],
          directionMax: [1, 1, 1],
          loop: false,
        }}
      />
    </group>
  );
};

export default Fireworks;
