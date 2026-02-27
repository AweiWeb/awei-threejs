import { useFrame } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { useEffect, useRef } from 'react';

const Thing = ({ isForce, isRotation, flag, object, name, ...props }: any) => {
  const thingRef = useRef<any>(null!);
  const boxRb = useRef<RapierRigidBody>(null!);
  useEffect(() => {
    if (isForce) {
      boxRb.current.applyImpulse({ x: 0.1, y: 0, z: 0 }, true);
      boxRb.current.applyTorqueImpulse({ x: 0.1, y: 0, z: 0 }, true);
    }
  }, [isForce]);
  useFrame((state, delta) => {
    if (isRotation) {
      thingRef.current.rotation.y += delta * 2;
    }
  });
  return (
    <RigidBody
      ref={boxRb}
      colliders={flag ? 'hull' : 'cuboid'}
      userData={{ type: 'bao', flag: name }}
      {...props}
    >
      <group ref={thingRef}>{object}</group>
    </RigidBody>
  );
};

export default Thing;
