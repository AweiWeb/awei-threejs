import { useThree } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { useControls } from 'leva';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
const Cube = () => {
  const [cubeMesh, setCubeMesh] = useState([]) as any;
  const direction = useMemo(() => new THREE.Vector3(), []);
  const { camera } = useThree();
  const cubeRef = useRef<RapierRigidBody>(null!);
  const ShapeId = useRef('');
  const size = useRef(1);
  const { Shape, ShapeSize } = useControls('投掷物体', {
    Shape: {
      value: '球体',
      options: ['球体', '正方体', '长方体'],
    },
    ShapeSize: {
      value: 1,
      min: 0.1,
      max: 2,
    },
  });
  useEffect(() => {
    ShapeId.current = Shape;
    size.current = ShapeSize;
  }, [Shape, ShapeSize]);
  const createCube = () => {
    const shape = ShapeId.current;
    const scaleSize = size.current;
    const selectArr = {
      正方体: (
        <mesh
          scale={scaleSize}
          position={[
            camera.position.x,
            camera.position.y - 0.5,
            camera.position.z,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      ),
      球体: (
        <mesh
          scale={scaleSize}
          position={[
            camera.position.x,
            camera.position.y - 0.5,
            camera.position.z,
          ]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[0.25, 64]} />
          <meshStandardMaterial color="tomato" />
        </mesh>
      ),
      长方体: (
        <mesh
          scale={scaleSize}
          position={[
            camera.position.x,
            camera.position.y - 0.5,
            camera.position.z,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.5, 0.2, 0.2]} />
          <meshStandardMaterial color="mediumpurplea" />
        </mesh>
      ),
    } as any;
    console.log(selectArr[shape]);

    setCubeMesh((pre: any) => [...pre, selectArr[shape]]);
  };
  useEffect(() => {
    camera.getWorldDirection(direction);
    if (cubeRef.current) {
      cubeRef.current.setLinvel(
        {
          x: direction.x * 20,
          y: direction.y * 20,
          z: direction.z * 20,
        },
        true
      );
    }
  }, [cubeMesh]);
  useEffect(() => {
    window.addEventListener('click', createCube);
    return () => {
      window.removeEventListener('click', createCube);
    };
  }, []);
  return (
    <>
      {cubeMesh.map((item: any, index: number) => {
        return (
          <RigidBody key={index} ref={cubeRef}>
            {item}
          </RigidBody>
        );
      })}
    </>
  );
};

export default Cube;
