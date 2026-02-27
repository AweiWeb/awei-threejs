import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
const colorR = new THREE.Color(93 / 255, 89 / 255, 97 / 255);
const FloorTable = () => {
  return (
    <RigidBody
      lockTranslations
      position={[-18.975020980834962, 0, -16.575502395629883]}
    >
      <group>
        <mesh>
          <cylinderGeometry args={[0.7, 0.8, 0.15]} />
          <meshBasicMaterial color={colorR} />
        </mesh>
      </group>
    </RigidBody>
  );
};

export default FloorTable;
