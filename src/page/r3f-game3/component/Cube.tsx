import { RigidBody } from '@react-three/rapier';

const Cube = () => {
  return (
    <>
      <RigidBody restitution={0} mass={1}>
        <mesh name="cube">
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={'mediumpurple'} />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Cube;
