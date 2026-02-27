import { Gltf, useGLTF, useTexture } from '@react-three/drei';
import People from './People';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { degToRad, lerp } from 'three/src/math/MathUtils.js';
import { Vector3 } from 'three';
import VFXParticle from '@/page/Wass-02/component/VFX1';
import VFXEmitter from '@/page/Wass-02/component/VFXEmitter';
import { button, useControls } from 'leva';
import {useMagic} from '../store';

/*
 * 创建技能界面
 */
const Magic = () => {
  const addSpell = useMagic((state: any) => state.addSpell);
  const spell = useMagic((state: any) => state.spell);
  const magicPeople = useRef(null) as any;
  const pointerRef = useRef(null) as any;
  const pointerPosition = useRef(new Vector3(0, 0.001, 0));
  //   const { scene } = useGLTF('/wass-05/models/Icicle.glb') as any;
  useFrame(({ clock }, delta) => {
    const elapsedTime = clock.getElapsedTime();
    if (pointerRef.current && pointerPosition.current) {
      pointerRef.current.position.lerp(pointerPosition.current, 0.1);

      /*
       * 设置动画
       */
      pointerRef.current.scale.x =
        pointerRef.current.scale.y =
        pointerRef.current.scale.z =
          lerp(
            pointerRef.current.scale.z,
            2 + Math.sin(elapsedTime * 4 + 0.5),
            0.1,
          );
    }
    magicPeople.current.lookAt(pointerPosition.current);
  });
  return (
    <group>
      {/* 技能发射器 */}
      <VFX />
      <Spells />
      <group position-z={5} ref={magicPeople}>
        <People scale={0.4} />
      </group>
      <mesh
        receiveShadow
        rotation-x={-Math.PI / 2}
        position-y={0.01}
        onPointerMove={(e) => {
          pointerPosition.current.set(e.point.x, e.point.y, e.point.z);
        }}
        onClick={() => {
          console.log('放技能了');

          addSpell({ name: spell, position: pointerPosition.current.clone() });
        }}
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial opacity={0.4} transparent />
      </mesh>
      <mesh ref={pointerRef} rotation-x={degToRad(-90)} position-y={0.001}>
        <circleGeometry args={[0.1, 32]} />
        <meshStandardMaterial emissive={'skyblue'} emissiveIntensity={2.5} />
      </mesh>
      <Gltf scale={0.5} src="/wass-05/models/WizardTraining.glb" />
    </group>
  );
};

const VFX = () => {
  const voidTexture = useTexture('/wass-05/textures/magic_01.png');
  console.log(voidTexture, 'dhakhdkahdkah');
  /*
   * 引入冰雕模型
   */
  const { nodes } = useGLTF('/wass-05/models/Icicle.glb') as any;
  return (
    <>
      <VFXParticle
        geometry={<coneGeometry args={[0.5, 1, 8, 1]} />}
        settings={{
          nbParticle: 100000,
          renderMode: 'bill',
          intensity: 1.5,
          fadeSize: [0.1, 0.1],
        }}
        vfxName={'sparks'}
      />
      <VFXParticle
        geometry={<sphereGeometry args={[1, 32, 32]} />}
        settings={{
          nbParticle: 1000,
          intensity: 1.5,
          fadeSize: [0.7, 0.9],
        }}
        vfxName={'spheres'}
      />
      <VFXParticle
        geometry={<circleGeometry args={[1, 32]} />}
        alphaMap={voidTexture}
        settings={{
          nbParticle: 100,
          fadeSize: [0.3, 0.9],
        }}
        vfxName={'writings'}
      />
      <VFXParticle
        geometry={<primitive object={nodes.icicle.geometry} />}
        settings={{
          nbParticle: 100,
          fadeSize: [0.2, 0.8],
          fadeAlpha: [0, 1.0],
        }}
        vfxName={'ice'}
      />
    </>
  );
};

const Spells = () => {
  const spells = useMagic((state: any) => state.spells);
  return (
    <>
      {spells.map((spell: any) =>
        spell.name === 'Void' ? (
          <Void key={spell.id + '-' + spell.name} position={spell.position} />
        ) : spell.name === 'Fire' ? (
          <Fire key={spell.id + '-' + spell.name} position={spell.position} />
        ) : (
          <Ice key={spell.id + '-' + spell.name} position={spell.position} />
        ),
      )}
    </>
  );
};

/*
 * 技能1
 */
const Void = ({ ...props }) => {
  return (
    <group {...props}>
      <VFXEmitter
        emitter="sparks"
        settings={{
          duration: 0.5,
          spawnMode: 'time',
          colorStart: ['#4902ff'],
          colorEnd: ['#ffffff'],
          size: [0.1, 0.4],
          speed: [1, 5],
          nbParticles: 20,
          startPositionMin: [-0.5, 0, -0.5],
          startPositionMax: [0.5, 1, 0.5],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          rotationSpeedMin: [0, 0, 0],
          rotationSpeedMax: [0, 0, 0],
          directionMin: [0, 0, 0],
          directionMax: [0, 0.1, 0],
          loop: false,
          particleLifeTime: [0.5, 1],
        }}
      />
      <VFXEmitter
        emitter="spheres"
        settings={{
          spawnMode: 'brust',
          duration: 0.5,
          delay: 0.5,
          colorStart: ['#4902ff'],
          colorEnd: ['#ffffff'],
          size: [0.5, 0.5],
          speed: [1, 5],
          nbParticles: 1,
          startPositionMin: [0, 0.5, 0],
          startPositionMax: [0, 0.5, 0],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          rotationSpeedMin: [0, 10, 0],
          rotationSpeedMax: [0, 10, 0],
          directionMin: [0, 0, 0],
          directionMax: [0, 0, 0],
          loop: false,
          particleLifeTime: [0.5, 0.5],
        }}
      />
      <VFXEmitter
        emitter="writings"
        position-y={0.2}
        rotation-x={-Math.PI / 2}
        settings={{
          spawnMode: 'brust',
          duration: 1,
          delay: 0,
          colorStart: ['#e885ff'],
          colorEnd: ['#ffffff'],
          size: [1, 1],
          speed: [1, 5],
          nbParticles: 1,
          startPositionMin: [0, 0, 0],
          startPositionMax: [0, 0, 0],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          rotationSpeedMin: [0, 0, 5],
          rotationSpeedMax: [0, 0, 5],
          directionMin: [0, 0, 0],
          directionMax: [0, 0, 0],
          loop: false,
          particleLifeTime: [1, 1],
        }}
      />
      {/* 爆炸 */}
      <VFXEmitter
        emitter="sparks"
        settings={{
          duration: 1,
          delay: 1,
          spawnMode: 'brust',
          colorStart: ['#ffffff'],
          colorEnd: ['#5b18ff'],
          size: [0.05, 0.1],
          speed: [2, 8],
          nbParticles: 300,
          startPositionMin: [-0.1, -0.1, -0.1],
          startPositionMax: [0.1, 0.1, 0.1],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          rotationSpeedMin: [0, 10, 0],
          rotationSpeedMax: [0, 10, 0],
          directionMin: [-1, 0, -1],
          directionMax: [1, 1, 1],
          loop: false,
          particleLifeTime: [0.1, 1],
        }}
      />
    </group>
  );
};

/*
 * 技能2
 */
const Fire = ({ ...props }) => {
  const fireRef = useRef(null) as any;
  const time = useRef(0);
  useFrame((state, delta) => {
    time.current += delta;
    if (fireRef.current) {
      fireRef.current.position.y = Math.cos(time.current * Math.PI) * 5;
    }
  });
  return (
    <group {...props}>
      <VFXEmitter
        emitter="spheres"
        ref={fireRef}
        settings={{
          spawnMode: 'time',
          duration: 1,
          delay: 0,
          colorStart: ['orange'],
          colorEnd: ['red'],
          size: [0.05, 0.2],
          speed: [1, 5],
          nbParticles: 100,
          startPositionMin: [0, 0, 0],
          startPositionMax: [0, 0, 0],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          rotationSpeedMin: [0, 10, 0],
          rotationSpeedMax: [0, 10, 0],
          directionMin: [0, 0, 0],
          directionMax: [0, 0, 0],
          loop: false,
          particleLifeTime: [0.1, 0.1],
        }}
      />
      <VFXEmitter
        emitter="sparks"
        settings={{
          spawnMode: 'time',
          duration: 0.5,
          delay: 0,
          colorStart: ['orange'],
          colorEnd: ['red'],
          size: [0.01, 0.1],
          speed: [0.1, 5],
          nbParticles: 1000,
          startPositionMin: [-0.1, 0, -0.1],
          startPositionMax: [0.1, 0, 0.1],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          rotationSpeedMin: [0, 10, 0],
          rotationSpeedMax: [0, 10, 0],
          directionMin: [-1, -1, -1],
          directionMax: [1, 1, 1],
          loop: false,
          particleLifeTime: [0.5, 1],
        }}
      />
      <VFXEmitter
        emitter="writings"
        position-y={0.2}
        rotation-x={-Math.PI / 2}
        settings={{
          spawnMode: 'brust',
          duration: 1,
          delay: 0,
          colorStart: ['yellow'],
          colorEnd: ['red'],
          size: [1, 1],
          speed: [0.1, 5],
          nbParticles: 1,
          startPositionMin: [0, 0, 0],
          startPositionMax: [0, 0, 0],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          rotationSpeedMin: [0, 0, 5],
          rotationSpeedMax: [0, 0, 5],
          directionMin: [0, 0, 0],
          directionMax: [0, 0, 0],
          loop: false,
          particleLifeTime: [0.6, 0.6],
        }}
      />
      {/* 爆炸 */}
      <VFXEmitter
        emitter="sparks"
        settings={{
          duration: 1,
          delay: 1,
          spawnMode: 'brust',
          colorStart: ['red'],
          colorEnd: ['orange'],
          size: [0.05, 0.1],
          speed: [2, 8],
          nbParticles: 1200,
          startPositionMin: [-0.1, -0.1, -0.1],
          startPositionMax: [0.1, 0.1, 0.1],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          rotationSpeedMin: [0, 0, 0],
          rotationSpeedMax: [0, 0, 0],
          directionMin: [-1, 0, -1],
          directionMax: [1, 1, 1],
          loop: false,
          particleLifeTime: [0.1, 1],
        }}
      />
    </group>
  );
};

const Ice = ({ position }: any) => {
  const IceRef = useRef(null) as any;
  const time = useRef(0);
  useFrame((state, delta) => {
    time.current += delta;
    IceRef.current.position.y = Math.cos(time.current * Math.PI) * 4;
  });
  return (
    <group position={position}>
      <VFXEmitter
        emitter="writings"
        position-y={0.01}
        rotation-x={-Math.PI / 2}
        settings={{
          spawnMode: 'brust',
          duration: 1,
          delay: 0,
          colorStart: ['skyblue'],
          colorEnd: ['skyblue'],
          size: [1, 1],
          speed: [0.1, 3],
          nbParticles: 1,
          startPositionMin: [0, 0, 0],
          startPositionMax: [0, 0, 0],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          rotationSpeedMin: [0, 0, 5],
          rotationSpeedMax: [0, 0, 5],
          directionMin: [0, 0, 0],
          directionMax: [0, 0, 0],
          loop: false,
          particleLifeTime: [0.6, 0.6],
        }}
      />
      <VFXEmitter
        emitter="spheres"
        ref={IceRef}
        settings={{
          spawnMode: 'time',
          duration: 1,
          delay: 0,
          colorStart: ['skyblue'],
          colorEnd: ['skyblue'],
          size: [0.05, 0.2],
          speed: [1, 5],
          nbParticles: 100,
          startPositionMin: [0, 0, 0],
          startPositionMax: [0, 0, 0],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          rotationSpeedMin: [0, 10, 0],
          rotationSpeedMax: [0, 10, 0],
          directionMin: [0, 0, 0],
          directionMax: [0, 0, 0],
          loop: false,
          particleLifeTime: [0.1, 0.1],
        }}
      />
      <VFXEmitter
        emitter="sparks"
        settings={{
          spawnMode: 'brust',
          duration: 0.5,
          delay: 0.5,
          loop: false,
          speed: [0.5, 2],
          nbParticles: 120,
          startPositionMin: [-0.5, 0, -0.5],
          startPositionMax: [0.5, 1, 0.5],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          rotationSpeedMin: [0, 0, 0],
          rotationSpeedMax: [0, 0, 0],
          directionMin: [-1, 0, -1],
          directionMax: [1, 1, 1],
          size: [0.01, 0.1],
          colorStart: ['white'],
          colorEnd: ['skyblue'],
          particleLifeTime: [0.5, 1],
        }}
      />
      <VFXEmitter
        emitter="sparks"
        settings={{
          spawnMode: 'brust',
          duration: 0.5,
          delay: 0,
          colorStart: ['white'],
          colorEnd: ['skyblue'],
          nbParticles: 1000,
          startPositionMin: [-0.1, 0, -0.1],
          startPositionMax: [0.1, 0, 0.1],
          startRotationMin: [0, 0, 0],
          startRotationMax: [0, 0, 0],
          rotationSpeedMin: [0, 0, 0],
          rotationSpeedMax: [0, 0, 0],
          directionMin: [-1, 1, -1],
          directionMax: [1, 1, 1],
          size: [0.01, 0.1],
          speed: [0.1, 3],
          loop: false,
          particleLifeTime: [0.1, 1.5],
        }}
      />

      <VFXEmitter
        emitter="ice"
        position-y={0.01}
        settings={{
          duration: 1,
          delay: 0.5,
          spawnMode: 'brust',
          colorStart: ['skyblue'],
          colorEnd: ['white'],
          size: [0.5, 1],
          speed: [2, 8],
          nbParticles: 5,
          startPositionMin: [-0.5, 0, -0.5],
          startPositionMax: [0.5, 0, 0.5],
          startRotationMin: [degToRad(180 - 20), 0, degToRad(-30)],
          startRotationMax: [degToRad(180 + 20), 0, degToRad(30)],
          rotationSpeedMin: [0, 0, 0],
          rotationSpeedMax: [0, 0, 0],
          directionMin: [0, 0, 0],
          directionMax: [0, 0, 0],
          loop: false,
          particleLifeTime: [1, 1],
        }}
      />
    </group>
  );
};
export default Magic;
