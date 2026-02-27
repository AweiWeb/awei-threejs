import { RigidBody } from '@react-three/rapier';

const Sphere = () => {
  return (
    <>
      <RigidBody>
        <mesh>
          <sphereGeometry args={[0.2, 64, 64]} />
          <meshStandardMaterial color={'orange'} />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Sphere