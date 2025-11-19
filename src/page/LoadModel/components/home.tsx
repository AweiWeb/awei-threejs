import { Perf } from 'r3f-perf';
import Model from './model';
import Duck from './Duck';
import HamBuger from './hambuger';
import Ham from './ham';
import Fox from './Fox';
import * as THREE from 'three';
import { Suspense, useRef } from 'react';
import { useHelper, OrthographicCamera } from '@react-three/drei';
const Home = () => {
  const directionRef = useRef<THREE.DirectionalLight>(null!);
  useHelper(directionRef, THREE.DirectionalLightHelper, 1);
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        ref={directionRef}
        castShadow
        intensity={5}
        shadow-mapSize={[2024, 2024]}
        position={[-2, 2, 3]}
        shadow-normalBias={0.2}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
      </directionalLight>
      <Perf position="top-left" />
      <group>
        <mesh rotation-x={-Math.PI * 0.5} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="yellowgreen" />
        </mesh>
      </group>
      <Suspense
        fallback={
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
            <meshBasicMaterial color="red" wireframe />
          </mesh>
        }
      >
        <Model />
        <Duck position={[2, 0, 2]} />
        <Fox />
        <HamBuger scale={0.3} />
        <Ham scale={0.2} />
      </Suspense>
    </>
  );
};

export default Home;
