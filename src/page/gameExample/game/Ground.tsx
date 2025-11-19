import { RigidBody, CuboidCollider } from '@react-three/rapier';

const Ground = () => {
  return (
    <RigidBody type="fixed" colliders={false}>
      <mesh  position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[100, 1, 100]} />
        <meshStandardMaterial color="yellowgreen" />
      </mesh>
      <CuboidCollider args={[50, 0.5, 50]} />
    </RigidBody>
  );
};

export default Ground;
