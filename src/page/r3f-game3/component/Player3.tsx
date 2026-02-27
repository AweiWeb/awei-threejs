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
import { degToRad, MathUtils } from 'three/src/math/MathUtils.js';
import * as THREE from 'three';
const normalizeAngle = (angle: any) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};
/*
 *  物理刚体直接旋转版本
 */
const lerpAngle = (start: any, end: any, t: any) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};
const Player = () => {
  const cameraTarget = useRef<any>(null);
  const cameraPosition = useRef<any>(null);
  const cameraWorldPosition = useRef(new THREE.Vector3());
  const cameraWorldTarget = useRef(new THREE.Vector3());
  const cameraLookAt = useRef(new THREE.Vector3());
  const rb = useRef<RapierRigidBody>(null);
  const container = useRef<any>(null);
  const character = useRef<any>(null);
  const rotaionTarget = useRef(0);
  const characterRotation = useRef(0);
  const [_, get] = useKeyboardControls();
  const [animation, setAnimation] = useState('idle');

  /*
   * 相机向量版本
   */
  const cameraPositionVec = useRef(new THREE.Vector3(0, 4, -4));
  const cameraTargetVec = useRef(new THREE.Vector3(0, 1.5, 0));
  /*
   * 调试面板
   */
  const { ROTATION_SPEED, WALK_SPEED, RUN_SPEED } = useControls('角色', {
    WALK_SPEED: {
      value: 1,
      min: 0.1,
      max: 4,
      step: 0.1,
    },
    RUN_SPEED: {
      value: 3,
      min: 1,
      max: 6,
      step: 0.1,
    },
    ROTATION_SPEED: {
      value: degToRad(0.5),
      min: degToRad(0.1),
      max: degToRad(5),
      step: degToRad(0.1),
    },
  });
  useFrame(({ camera }, delta) => {
    if (!rb.current || !character.current) return;
    const vel = rb.current.linvel();
    const moveVector = { x: 0, y: 0, z: 0 };
    const { forward, back, left, right, run, jump } = get();
    if (forward) moveVector.z = 1;
    if (back) moveVector.z = -1;
    if (left) moveVector.x = 1;
    if (right) moveVector.x = -1;
    const speed = run ? RUN_SPEED : WALK_SPEED;
    // rotaionTarget也是当前行走的方向
    if (moveVector.x !== 0) {
      console.log(moveVector);

      rotaionTarget.current += moveVector.x * ROTATION_SPEED;
    }
    if (moveVector.z !== 0 || moveVector.x !== 0) {
      /*
       * 处理人物旋转逻辑
       */
      characterRotation.current = Math.atan2(moveVector.x, moveVector.z);
      vel.x =
        Math.sin(rotaionTarget.current + characterRotation.current) * speed;
      vel.z =
        Math.cos(rotaionTarget.current + characterRotation.current) * speed;
      console.log(vel);

      if (run) {
        setAnimation('run');
      } else {
        setAnimation('walk');
      }
    } else {
      setAnimation('idle');
    }
    //处理无group版本
    // character.current.rotation.y = lerpAngle(
    //   character.current.rotation.y,
    //   rotaionTarget.current + characterRotation.current,
    //   0.1
    // );
    rb.current.setLinvel(vel, true);
    // 摄像机跟随

    //处理无group版本
    character.current.rotation.y = lerpAngle(
      character.current.rotation.y,
      rotaionTarget.current + characterRotation.current,
      0.1
    );
    const characterPos = container.current.getWorldPosition(
      new THREE.Vector3()
    );
    const rotationMartrix = new THREE.Matrix4().makeRotationY(
      rotaionTarget.current
    );
    const cameraEndPos = characterPos
      .clone()
      .add(cameraPositionVec.current.clone().applyMatrix4(rotationMartrix));
    const cameraEndTarget = characterPos
      .clone()
      .add(cameraTargetVec.current.clone().applyMatrix4(rotationMartrix));
    camera.position.lerp(cameraEndPos, 0.1);
    camera.lookAt(cameraEndTarget);
  });
  return (
    <RigidBody colliders={false} lockRotations position={[0, 10, 0]} ref={rb}>
      <group ref={container}>
        <group ref={character}>
          <Character scale={0.18} position-y={-0.23} animation={animation} />
        </group>
      </group>
      {/* 胶囊体 */}
      <CapsuleCollider args={[0.08, 0.15]} />
    </RigidBody>
  );
};

export default Player;
