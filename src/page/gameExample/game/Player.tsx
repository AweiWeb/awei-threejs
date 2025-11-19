import { useGLTF, useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RigidBodyProps } from '@react-three/rapier';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
const Player = () => {
  const [sub, get] = useKeyboardControls();
  const mode = useGLTF('/models/cybtruck.gltf');
  // 第一次渲染开启模型的阴影
  console.log(mode);
  const speed = 5;
  const frontVertor = new THREE.Vector3();
  const sideVertor = new THREE.Vector3();
  const playerDirection = new THREE.Vector3();
  const cyberRef = useRef<RigidBodyProps | any>(null!);
  useEffect(() => {
    console.log(get, sub);

    console.log(mode);
    mode.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, []);
  useFrame((state, delta) => {
    const { jump, forward, left, right, back } = get() as any;
    // 人物移动的向量
    const velocity = cyberRef.current.linvel();
    frontVertor.set(0, 0, forward - back);
    sideVertor.set(left - right, 0, 0);
    playerDirection
      .subVectors(frontVertor, sideVertor)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(state.camera.rotation);
    cyberRef.current.setLinvel({
      x: playerDirection.x,
      y: velocity.y,
      z: playerDirection.z,
    });
    if (jump) cyberRef.current.setLinvel({ x: 0, y: 3, z: 0 });
    // 更新相机的位置
    // 先获取玩家中的位置
    const playPos = cyberRef.current.translation();
    const offsetPos = new THREE.Vector3(0, 2, 4);
  });
  return (
    <RigidBody gravityScale={1} ref={cyberRef} colliders="cuboid">
      <primitive object={mode.scene} position={[0, 4, 0]} scale={0.8} />
    </RigidBody>
  );
};

useGLTF.preload('/models/cybtruck.gltf');

export default Player;
