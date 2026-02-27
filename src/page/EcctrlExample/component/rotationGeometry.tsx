import { useFrame } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { useRef } from 'react';
import * as THREE from 'three';
const RotationGeometry = () => {
  const boxRef = useRef<RapierRigidBody>(null);
  useFrame((state, delta) => {
    const elapsedtime = state.clock.getElapsedTime();
    if (boxRef.current) {
      const eluer = new THREE.Euler(0, elapsedtime, 0);
      const quaternion = new THREE.Quaternion();
      quaternion.setFromEuler(eluer);
      boxRef.current.setNextKinematicRotation(quaternion);
      boxRef.current.setNextKinematicTranslation({
        x: Math.sin(elapsedtime),
        y: -1,
        z: Math.cos(elapsedtime),
      });
    }
  });
  return (
    <RigidBody type="kinematicPosition" ref={boxRef}>
      <mesh>
        <boxGeometry args={[5, 0.3, 0.3]} />
        <meshStandardMaterial color={'mediumpurple'} />
      </mesh>
    </RigidBody>
  );
};

export default RotationGeometry;
