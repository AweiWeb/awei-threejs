import { OrbitControls } from '@react-three/drei';
import { Grid } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  CuboidCollider,
  Physics,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { useRef } from 'react';
import { Vector3 } from 'three';
const Experience = () => {
  return (
    <>
      <Physics debug={true}>
        <ChuiGeometry />
        <RigidBody position={[0, 2, 0]}>
          <mesh>
            <boxGeometry />
            <meshNormalMaterial />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed" colliders={false}>
          <Grid cellColor={'red'} sectionColor={'black'} args={[100, 100]} />
          <CuboidCollider args={[50, 0.01, 50]} />
        </RigidBody>
      </Physics>
      <OrbitControls />
    </>
  );
};

const ChuiGeometry = ({ vec = new Vector3(), dir = new Vector3() }) => {
  const ref = useRef<RapierRigidBody>(null);
  useFrame(({ pointer, viewport, camera }, delta) => {
    if (ref.current) {
      vec.set(pointer.x, pointer.y, 0.5).unproject(camera);
      dir.copy(vec).sub(camera.position).normalize();
      vec.add(dir.multiplyScalar(camera.position.length()));
      ref.current.setNextKinematicTranslation(vec);
    }
  });
  return (
    <RigidBody type="kinematicPosition" ref={ref} position={[0, 2, 0]}>
      <mesh>
        <boxGeometry args={[1]} />
        <meshBasicMaterial />
      </mesh>
      <CuboidCollider args={[0.5, 0.5, 0.5]} />
    </RigidBody>
  );
};
export default Experience;
