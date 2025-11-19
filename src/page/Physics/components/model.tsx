import { useGLTF } from '@react-three/drei';
import { CylinderCollider, RigidBody } from '@react-three/rapier';

const PhyModel = () => {
  const model = useGLTF('/models/saiche.gltf');
  return (
    <RigidBody colliders="cuboid" position={[0, 4, 0]} mass={100}>
      <primitive object={model.scene} scale={1.5} />
      {/* <CylinderCollider args={[0.3, 0.8]} /> */}
    </RigidBody>
  );
};
useGLTF.preload('/models/saiche.gltf');
export default PhyModel;
