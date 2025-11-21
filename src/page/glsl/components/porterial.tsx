import {
  useGLTF,
  useTexture,
  Sparkles,
  shaderMaterial,
} from '@react-three/drei';
import * as THREE from 'three';
import portalerVertex from '@/shader/shader-porterial/vertex.glsl';
import portalerFragment from '@/shader/shader-porterial/fragment.glsl';
import { extend, useFrame, Object3DNode } from '@react-three/fiber';
import { useRef } from 'react';
// console.log(11111); //懒加载时会执行
const PortShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorA: new THREE.Color('#ffffff'),
    uColorB: new THREE.Color('#000000'),
  },
  portalerVertex,
  portalerFragment
);
// 定义组件
extend({ PortShaderMaterial });
declare module '@react-three/fiber' {
  interface ThreeElements {
    portShaderMaterial: Object3DNode<
      typeof PortShaderMaterial,
      typeof PortShaderMaterial
    >;
  }
}
const Porterial = () => {
  const { nodes } = useGLTF('/models/portal.glb') as any;
  console.log(nodes);
  // 引入环境贴图
  const shaderRef = useRef<any>(null);
  const bakedTexture = useTexture('/models/baked.jpg');
  useFrame((state, delta) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value += delta * 5;
      //   console.log(shaderRef.current.uTime);
    }
  });
  return (
    <>
      <color attach="background" args={['#201919']} />
      <mesh geometry={nodes.baked.geometry}>
        <meshBasicMaterial map={bakedTexture} map-flipY={false} />
      </mesh>
      {/* 两个灯 */}
      <mesh
        geometry={nodes.poleLightA.geometry}
        position={nodes.poleLightA.position}
      >
        <meshBasicMaterial color="#ffffe5" />
      </mesh>
      <mesh
        geometry={nodes.poleLightB.geometry}
        position={nodes.poleLightB.position}
      >
        <meshBasicMaterial color="#ffffe5" />
      </mesh>
      {/* 传送门 */}
      <mesh
        geometry={nodes.portalLight.geometry}
        position={nodes.portalLight.position}
        rotation={nodes.portalLight.rotation}
      >
        <portShaderMaterial ref={shaderRef} />
        {/* <shaderMaterial
          ref={shaderRef}
          vertexShader={portalerVertex}
          fragmentShader={portalerFragment}
          uniforms={{
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color('#ffffff') },
            uColorB: { value: new THREE.Color('#000000') },
          }}
        /> */}
      </mesh>
      {/* 萤火虫 */}
      <Sparkles
        size={6}
        scale={[4, 2, 4]}
        position-y={1}
        speed={1}
        count={50}
      />
    </>
  );
};

export default Porterial;
