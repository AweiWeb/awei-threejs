import {
  CameraControls,
  Environment,
  Gltf,
  Lightformer,
  Sky,
} from '@react-three/drei';
import Map from './Map';
import Car from './Car';
import CarColliders from './Player';
import {
  Physics,
  RigidBody,
  CuboidCollider,
  useRapier,
} from '@react-three/rapier';
import { Suspense, useEffect, useRef } from 'react';
import useCargame from '../store';
import { useControls } from 'leva';
const Operate = () => {
  // console.log(11111);
  const { isDebug } = useControls(`是否调试物理`, {
    isDebug: false,
  });
  const controls = useRef<any>(null);
  return (
    <>
      <ambientLight intensity={0.4} />
      {/* <Sky
        distance={10}
        sunPosition={[2, 10, 10]}
        inclination={1}
        mieCoefficient={0.0001} //大气颗粒越大空气🈷️浑浊
        turbidity={10}
      /> */}
      <Environment>
        <Lightformer
          form="rect"
          position={[5, 5, 5]}
          intensity={1}
          color="white"
          scale={[10, 10, 0]}
          target={[0, 0, 0]}
        />
      </Environment>
      <directionalLight position={[10, 10, 10]} intensity={0.4} />
      <pointLight intensity={2.5} position={[0, 5, 0]} distance={10} />
      <pointLight
        intensity={12.5}
        position={[5, 5, 0]}
        distance={15}
        color={'pink'}
      />
      <pointLight
        intensity={12.5}
        position={[-5, 5, 0]}
        distance={15}
        color={'blue'}
      />
      <Physics debug={isDebug} gravity={[0, -9.8, 0]}>
        <CarColliders />
        <RigidBody type="fixed" friction={0}>
          <Map />
        </RigidBody>
        <Gltf src="/models/game2/map_road.glb" position-y={-0.12} />
      </Physics>
    </>
  );
};

export default Operate;
