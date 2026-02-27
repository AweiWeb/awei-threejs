import { RigidBody } from '@react-three/rapier';

const Louti = () => {
  return (
    <RigidBody type="kinematicPosition" position={[0, 0.5, -3]}>
      <group>
        <mesh position={[0, -1, 0]}>
          <boxGeometry args={[3, 0.5, 0.8]} />
          <meshStandardMaterial />
        </mesh>
        <mesh position={[0, 0, 1]}>
          <boxGeometry args={[3, 0.5, 0.8]} />
          <meshStandardMaterial />
        </mesh>
        <mesh position={[0, 1, 2]}>
          <boxGeometry args={[3, 0.5, 0.8]} />
          <meshStandardMaterial />
        </mesh>
        <mesh position={[0, 2, 3]}>
          <boxGeometry args={[3, 0.5, 0.8]} />
          <meshStandardMaterial />
        </mesh>
        <mesh position={[0, 3, 4]}>
          <boxGeometry args={[3, 0.5, 0.8]} />
          <meshStandardMaterial />
        </mesh>
        <mesh position={[0, 4, 5]}>
          <boxGeometry args={[3, 0.5, 0.8]} />
          <meshStandardMaterial />
        </mesh>
      </group>
    </RigidBody>
  );
};

export default Louti;
