import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  RigidBody,
  RapierRigidBody,
  CuboidCollider,
} from '@react-three/rapier';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/*
 * 创建陷阱模块
 */
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const startMaterial = new THREE.MeshStandardMaterial({
  color: '#f1e0a8',
});
const trapMaterial = new THREE.MeshStandardMaterial({ color: '#f1e0a8' });
const obstacleMaterial = new THREE.MeshStandardMaterial({
  color: '#aec7ff',
});
const endMaterial = new THREE.MeshStandardMaterial({ color: 'f1e0a8' });
const wallMaterial = new THREE.MeshStandardMaterial({ color: '#92af83' });
const Start = ({ position = [0, 0, 0], size }: any) => {
  return (
    <group position={position}>
      <mesh
        castShadow
        receiveShadow
        geometry={boxGeometry}
        material={startMaterial}
        scale={[4, 0.2, 4]}
        position={[0, -0.1, 0]}
      />
    </group>
  );
};

/*
 * 旋转
 */
const StickTrap = ({ position = [0, 0, 0], size }: any) => {
  const stick = useRef<RapierRigidBody>(null!);
  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? 1 : -1)
  );
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    stick.current.setNextKinematicRotation(rotation);
  });
  return (
    <group position={position}>
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={trapMaterial}
        scale={size}
        position={[0, -0.1, 0]}
      />
      <RigidBody
        ref={stick}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        friction={0}
        restitution={0.2}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
        />
      </RigidBody>
    </group>
  );
};
/*
 * 上下波动
 */
const ThirdTrap = ({ position = [0, 0, 0], size }: any) => {
  const stick = useRef<RapierRigidBody>(null);
  const [initOffset] = useState(() => Math.random() * 2 * Math.PI);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const y = Math.sin(time + initOffset) + 1.15;
    stick.current?.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });
  return (
    <group position={position}>
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={trapMaterial}
        scale={size}
        position={[0, -0.1, 0]}
      />
      <RigidBody
        ref={stick}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        friction={0}
        restitution={0.2}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
        />
      </RigidBody>
    </group>
  );
};
/*
 * 面板左右移动
 */
const BroadTrap = ({ position = [0, 0, 0], size }: any) => {
  const axe = useRef<RapierRigidBody>(null);
  const [initOffset] = useState(() => Math.random() * 2 * Math.PI);
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const x = Math.sin(time + initOffset) * 1.1;
    axe.current?.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });
  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={trapMaterial}
        receiveShadow
        castShadow
        scale={size}
        position={[0, -0.1, 0]}
      />
      <RigidBody
        ref={axe}
        type="kinematicPosition"
        position={[0, 0.75, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          receiveShadow
          castShadow
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
        />
      </RigidBody>
    </group>
  );
};
/*
 * 围墙与地面
 */
const Bounds = ({ length = 1 }: any) => {
  return (
    <>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          castShadow
          receiveShadow
          position={[2.1, 0.75, -(length * 2) + 2]}
          scale={[0.2, 1.5, length * 4]}
        />
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          castShadow
          receiveShadow
          position={[-2.1, 0.75, -(length * 2) + 2]}
          scale={[0.2, 1.5, length * 4]}
        />
        <mesh
          geometry={boxGeometry}
          material={wallMaterial}
          castShadow
          receiveShadow
          position={[0, 0.75, -(length * 4) + 2]}
          scale={[4, 1.5, 0.2]}
        />
        {/* 地面 */}
        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, -(length * 2) + 2]}
          friction={1}
          restitution={0.2}
        />
      </RigidBody>
    </>
  );
};
/*
 * 终点
 */
const EndGoal = ({ position = [0, 0, 0], size }: any) => {
  const model = useGLTF('/models/cybtruck.gltf');
  useEffect(() => {
    model.scene.traverse((item) => {
      if (item instanceof THREE.Mesh) {
        item.castShadow = true
      }
    })
  }, [])
  return (
    <group position={position}>
      <mesh
        position={[0, -0.1, 0]}
        geometry={boxGeometry}
        material={endMaterial}
        scale={size}
        receiveShadow
      />
      <RigidBody type="fixed" friction={0} restitution={0.2}>
        <primitive object={model.scene} scale={0.5} />
      </RigidBody>
    </group>
  );
};

// 场景搭建
const Level = ({
  types = [BroadTrap, ThirdTrap, StickTrap],
  count = 10,
}: any) => {
  const floorSize = [4, 0.2, 4];
  const blocks = useMemo(() => {
    const blocks = [];
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }
    return blocks;
  }, [types, count]);
  return (
    <>
      <Start size={floorSize} />
      {blocks.map((Item, index) => {
        return (
          <Item
            key={index}
            position={[0, 0, -(index + 1) * 4]}
            size={floorSize}
          />
        );
      })}
      <EndGoal position={[0, 0, -(count + 1) * 4]} size={floorSize} />
      <Bounds length={count + 2} />
    </>
  );
};

export default Level;
