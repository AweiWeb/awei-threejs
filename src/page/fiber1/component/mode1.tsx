import { extend, useFrame, useThree, Object3DNode } from '@react-three/fiber';
import { useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
// extend({ OrbitControls });
declare module '@react-three/fiber' {
  interface ThreeElements {
    orbitControls: Object3DNode<OrbitControls, typeof OrbitControls>;
  }
}
// console.log(extend);
export const First = () => {
  const boxRef = useRef<THREE.Mesh>(null!);
  const { gl, camera } = useThree();
  useFrame((state, delta) => {
    boxRef.current.rotation.y += delta;
    const time = state.clock.elapsedTime;
    state.camera.position.x = Math.cos(time) * 10;
    state.camera.position.z = Math.sin(time) * 10;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <orbitControls args={[camera, gl.domElement]} />
      <group>
        <mesh position={[2, 0, 0]}>
          <sphereGeometry />
          <meshStandardMaterial />
        </mesh>
        <mesh ref={boxRef} position={[-2, 0, 0]}>
          <boxGeometry />
          <meshStandardMaterial color={'mediumpurple'} />
        </mesh>
        <mesh position-y="-1" scale={10} rotation-x={-Math.PI * 0.5}>
          <planeGeometry />
          <meshStandardMaterial color={'greenyellow'} />
        </mesh>
      </group>
    </>
  );
};
