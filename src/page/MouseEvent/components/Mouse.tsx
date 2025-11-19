import { useGLTF, meshBounds, useHelper } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Perf } from 'r3f-perf';
import { useEffect, useRef } from 'react';
const MouseModel = () => {
  const directionRef = useRef<THREE.DirectionalLight>(null!);
  useHelper(directionRef, THREE.DirectionalLightHelper, 1);
  const cube = useRef<THREE.Mesh>(null!);
  // 事件练习
  // 阻止射线穿透 使用  event.stopPropagation();
  // 使用meshBounds来包裹原始的盒子 不需要那么精确的点击 也可以使用meshbvh
  //meshBounds 不用给引入的模型使用
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
      }
    })
  }, [])
  const { scene } = useGLTF('/models/vino.glb');
  return (
    <>
      <directionalLight
        castShadow
        ref={directionRef}
        intensity={4}
        position={[1, 2, 3]}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera args={[-10, 10, 10, -10]} near={0.1} far={10} />
      </directionalLight>
      <Perf position="top-left" />
      <mesh
        castShadow
        ref={cube}
        raycast={meshBounds}
        scale={1.5}
        position={[2, 0, 0]}
        onClick={(event) => {
          cube.current.material.color.set(
            `hsl(${Math.random() * 360}, 70%, 35%)`
          );
          console.log(event);
        }}
      >
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <mesh
        castShadow
        position={[-2, 0, 0]}
        onClick={(event) => {
          event.stopPropagation();
          console.log(event);
        }}
      >
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
      <mesh receiveShadow position={[0, -1, 0]} rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="yellowgreen" />
      </mesh>
      <primitive
        object={scene}
        position={[0, 1, 0]}
        scale={1.5}
        onClick={(event:any) => {
          event.stopPropagation();
          console.log(11111);
        }}
      />
    </>
  );
};
export default MouseModel;
