import {
  RigidBody,
  CapsuleCollider,
  RapierCollider,
  RapierRigidBody,
  useRapier,
} from '@react-three/rapier';
import { Character } from './Character';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useKeyboardControls } from '@react-three/drei';
import { degToRad, radToDeg } from 'three/src/math/MathUtils.js';
import useTreatureGame from '../store';
const FirstPlayer = () => {
  const cameraInitPosition = useRef(new THREE.Vector3());
  const [animate, setAnimate] = useState('idle');
  const [peopleInitPosition] = useState(
    () =>
      new THREE.Vector3(
        5 + Math.random() * 10,
        20 + Math.random() * 2,
        Math.random() * 10
      )
  );
  const rb = useRef<RapierRigidBody>(null!);
  const character = useRef<any>(null!);
  const [_, get] = useKeyboardControls();
  const { rapier, world } = useRapier() as any;
  const directionCamera = useRef(new THREE.Vector3());
  const { findTreature } = useTreatureGame() as any;
  console.log(findTreature);
  const movement = { x: 0, y: 0 };
  const peopleMoveParams = {
    WALK: 1,
    RUN: 1.5,
    JUMP: 0.3,
  };
  /*
   * 第一人称视角
   */
  // const v1 = new THREE.Vector3(1, 0, 0).normalize();
  // const v2 = new THREE.Vector3(1, 2, 0).normalize();
  // console.log(v1.dot(v2), Math.acos(v1.dot(v2)), radToDeg(Math.acos(v1.dot(v2))));
  // console.log(degToRad(radToDeg(Math.acos(v1.dot(v2)))));
  const v1 = new THREE.Vector3(1, 0, 0);
  const v2 = new THREE.Vector3(1, 0, 2);
  const cameraRotation = new THREE.Vector3();
  // console.log(v1.cross(v2));
  const v3 = new THREE.Vector3();
  v3.crossVectors(v1, v2);
  console.log(v3, '向量');
  // useEffect(() => {
  //   window.addEventListener('mousemove', (event: MouseEvent) => {
  //     movement.x = event.movementX;
  //     movement.y = event.movementY;
  //     console.log(movement);
  //   });
  //   return () => {
  //     window.addEventListener('mousemove', (event: MouseEvent) => {});
  //   };
  // }, []);
  useFrame((state, delta) => {
    const { forward, backward, right, left, run, jump } = get();
    const vel = rb.current.linvel();
    let speed = 0;
    const moveVector = new THREE.Vector3(0, 0, 0);
    const camera = state.camera;

    camera.getWorldDirection(directionCamera.current);
    // if (movement.x || movement.y) {
    //   cameraRotation.y -= movement.x * 0.003;
    //   cameraRotation.x -= movement.y * 0.003;
    //   const cameraEluer = new THREE.Euler(0, cameraRotation.y, 0);
    //   camera.setRotationFromEuler(cameraEluer);
    //   // camera.rotation.set(cameraRotation.x, 0, 0);
    //   movement.x = 0;
    //   movement.y = 0;
    // }
    /*
     * 人物旋转 拿到 x z的坐标来计算任务旋转多少角度 y的话暂时不管
     */
    const rotationTarget = Math.atan2(
      directionCamera.current.x,
      directionCamera.current.z
    );
    directionCamera.current.normalize();
    const quaternion = new THREE.Quaternion();
    const eluer = new THREE.Euler(0, rotationTarget, 0);
    rb.current.setRotation(
      quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationTarget),
      true
    );
    /*
     * 处理奔跑逻辑
     */
    run ? (speed = peopleMoveParams.RUN) : (speed = peopleMoveParams.WALK);

    /*
     * 处理射线逻辑
     */
    /*
     * 人物移动
     */
    const next = forward || backward || left || right ? 'walk' : 'idle';
    setAnimate((prev) => (prev === next ? prev : next));
    if (run) {
      setAnimate('run');
    }
    if (forward) moveVector.z = 1;
    if (backward) moveVector.z = -1;
    if (left) moveVector.x = 1;
    if (right) moveVector.x = -1;
    moveVector.multiplyScalar(speed * 3).applyEuler(eluer);
    /*
     * 处理跳跃逻辑
     */
    if (jump) {
      const origin = rb.current?.translation() as any;
      console.log(origin, 'kai');
      const direction = { x: 0, y: -1, z: 0 };
      const ray = new rapier.Ray(origin, direction);
      console.log(ray, 'shexian ');

      const hit = world.castRay(
        ray,
        10,
        true,
        rapier.QueryFilterFlags.ONLY_STATIC,
        undefined,
        undefined,
        rb.current
      );
      console.log(hit);
      console.log(hit.timeOfImpact, hit, 'sdjhalkhdhak');
      if (hit.timeOfImpact < 1) {
        // console.log('tiao', );
        setAnimate('dive');
        vel.y += peopleMoveParams.JUMP;
      }
    }

    rb.current.setLinvel({ x: moveVector.x, y: vel.y, z: moveVector.z }, true);

    /*
     * 同步相机的位置
     */
    const currentPlayerPosition = rb.current.translation() as any;
    cameraInitPosition.current
      .copy(currentPlayerPosition)
      .add(new THREE.Vector3(-0.1, 1, -0.25));

    camera.position.lerp(cameraInitPosition.current, delta * 5);
  });
  return (
    <>
      <RigidBody
        ref={rb}
        colliders={false}
        gravityScale={1.1}
        lockRotations
        angularDamping={0.001}
        friction={0.1}
        position={peopleInitPosition}
        onCollisionEnter={(e) => {
          const other = e.rigidBodyObject?.userData;
          console.log(other);
          // if (other?.type === 'bao') {
          //   findTreature(other.flag);
          //   // e.rigidBody?.setEnabled(false);
          //   console.log('找到宝物了');
          //   /*
          //    * 盒子变小然后飞起来，展示ui交互，点击按钮可以收集到背包里
          //    *
          //    */
          // }
        }}
      >
        <group ref={character}>
          <Character name={animate} scale={0.5} position-y={-0.6} />
        </group>
        <CapsuleCollider args={[0.16, 0.45]} />
      </RigidBody>
    </>
  );
};

export default FirstPlayer;
