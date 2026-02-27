import { useRef } from 'react';
import { useControls } from 'leva';
import { useFrame, useThree } from '@react-three/fiber';
import SimpleTrail from './SimpleTrail';
import * as THREE from 'three';
const Cursor = () => {
  const meshRef = useRef(null!) as any;
  const tmpVec = new THREE.Vector3();
  const { color, size, opacity, intensity, height, duration } = useControls(
    '鼠标参数',
    {
      color: '#dfbcff',
      size: {
        value: 0.2,
        min: 0.1,
        max: 3,
        step: 0.1,
      },
      opacity: {
        value: 0.5,
        min: 0.1,
        max: 1,
        step: 0.01,
      },
      intensity: {
        value: 4.5,
        min: 1,
        max: 10,
        step: 0.1,
      },
      height: {
        value: 0.1,
        min: 0.05,
        max: 1,
        step: 0.02,
      },
      duration: {
        value: 20,
        min: 1,
        max: 100,
        step: 1,
      },
    }
  );
  const viewport = useThree((state) => state.viewport);
  console.log(viewport);

  useFrame(({ clock, pointer }, delta) => {
    /*
     * pointer 的 x 和 y 值是在 -1 到 1 之间的
     */
    // console.log(pointer);

    tmpVec.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );

    meshRef.current.position.lerp(tmpVec, delta * 10);
  });
  return (
    <>
      <group ref={meshRef}>
        <mesh>
          <sphereGeometry args={[size / 2, 32, 32]} />
          <meshStandardMaterial
            emissive={color}
            emissiveIntensity={intensity}
            color={color}
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>
      <SimpleTrail
        height={height}
        color={color}
        opacity={opacity}
        target={meshRef}
        duration={duration}
      />
    </>
  );
};

export default Cursor;
