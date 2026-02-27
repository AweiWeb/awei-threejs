import { RigidBody } from '@react-three/rapier';

const Floor = () => {
  return (
    <RigidBody type='fixed' friction={0.5}>
      <mesh rotation-x={-Math.PI * 0.5} position={[0, -1.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={'black'}/>
      </mesh>
    </RigidBody>
  );
};

export default Floor;
