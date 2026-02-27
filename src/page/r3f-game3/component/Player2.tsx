import {
  RigidBody,
  CapsuleCollider,
  RapierRigidBody,
} from '@react-three/rapier';
import { Character } from './Character';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { useControls } from 'leva';
import * as THREE from 'three';
/*
* 向量相机版本版本
*/
const Player = () => {
  const rb = useRef<RapierRigidBody>(null);
  const character = useRef<any>(null);
  const [_, get] = useKeyboardControls();
  const [animation, setAnimation] = useState('idle');

  // 相机偏移（相对角色坐标）
  const cameraOffset = new THREE.Vector3(0, 4, -4);
  const targetOffset = new THREE.Vector3(0, 1.5, 0);

  const { ROTATION_SPEED, WALK_SPEED, RUN_SPEED } = useControls('角色', {
    WALK_SPEED: { value: 1, min: 0.1, max: 4 },
    RUN_SPEED: { value: 3, min: 1, max: 6 },
    ROTATION_SPEED: { value: THREE.MathUtils.degToRad(2), min: 0.01, max: 0.5 },
  });
  const rotationTarget = useRef(0);
  const currentYaw = useRef(0);

  useFrame(({ camera }, delta) => {
    if (!rb.current) return;

    const { forward, back, left, right, run } = get();
    const moveDir = new THREE.Vector2(0, 0);

    if (forward) moveDir.y += 1;
    if (back) moveDir.y -= 1;
    if (left) moveDir.x += 1;
    if (right) moveDir.x -= 1;

    const moving = moveDir.lengthSq() > 0;
    const speed = run ? RUN_SPEED : WALK_SPEED;

    if (moving) {
      moveDir.normalize();
      // 移动方向（摄像机相对世界坐标）
      const targetYaw = Math.atan2(moveDir.x, moveDir.y);
      // 平滑插值旋转刚体朝向

      if (moveDir.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * moveDir.x;
      }
      currentYaw.current = THREE.MathUtils.lerp(
        currentYaw.current,
        targetYaw + rotationTarget.current,
        ROTATION_SPEED
      );
      // 应用刚体旋转
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0, currentYaw.current, 0)
      );
      rb.current.setRotation(q, true);

      // 推速度（朝向 + 前向）
      console.log(targetYaw, currentYaw.current);

      const forwardDir = new THREE.Vector3(0, 0, 1).applyEuler(
        new THREE.Euler(0, currentYaw.current, 0)
      );
      rb.current.setLinvel(
        {
          x: forwardDir.x * speed,
          y: rb.current.linvel().y,
          z: forwardDir.z * speed,
        },
        true
      );

      setAnimation(run ? 'run' : 'walk');
    } else {
      setAnimation('idle');
      rb.current.setLinvel({ x: 0, y: rb.current.linvel().y, z: 0 }, true);
    }

    /*
     * 相机跟随（纯向量版）
     */
    const pos = character.current.getWorldPosition(new THREE.Vector3());
    const yawMatrix = new THREE.Matrix4().makeRotationY(currentYaw.current);

    const finalCameraPos = pos
      .clone()
      .add(cameraOffset.clone().applyMatrix4(yawMatrix));
    const finalTarget = pos
      .clone()
      .add(targetOffset.clone().applyMatrix4(yawMatrix));

    camera.position.lerp(finalCameraPos, 0.1);
    camera.lookAt(finalTarget);
  });

  return (
    <RigidBody ref={rb} colliders={false} lockRotations position={[0, 3, 0]}>
      <group ref={character}>
        <Character scale={0.18} animation={animation} position-y={-0.23} />
      </group>

      <CapsuleCollider args={[0.08, 0.15]} />
    </RigidBody>
  );
};

export default Player;
