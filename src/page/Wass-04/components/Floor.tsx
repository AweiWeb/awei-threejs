import { useTexture } from '@react-three/drei';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { RepeatWrapping, SRGBColorSpace } from 'three';

const Floor = () => {
  const floorTexture = useTexture(
    '/environmentMaps/world/sparse_grass_diff_4k.jpg',
  );
  const floorAhplaTexture = useTexture(
    '/environmentMaps/world/sparse_grass_mask_4k.png',
  );
  floorTexture.colorSpace = SRGBColorSpace;
  floorTexture.repeat.set(10, 10);
  floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
  return (
    <RigidBody colliders={false} type="fixed" position={[0, -0.1, 0]}>
      <mesh>
        <boxGeometry args={[100, 0.2, 100]} />
        <meshStandardMaterial alphaMap={floorAhplaTexture} map={floorTexture} />
      </mesh>
      <CuboidCollider args={[50, 0.1, 50]} />
    </RigidBody>
  );
};

export default Floor;
