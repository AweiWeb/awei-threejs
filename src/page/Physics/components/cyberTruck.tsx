import { Clone, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { useRef } from 'react';

const CyberTruck = () => {
  const cyber = useGLTF('/models/cybtruck.gltf');
  return (
    <RigidBody colliders="hull" mass={50}>
      <primitive object={cyber.scene} scale={0.8} />
    </RigidBody>
  );
};

useGLTF.preload('/models/cybtruck.gltf');
export default CyberTruck;
