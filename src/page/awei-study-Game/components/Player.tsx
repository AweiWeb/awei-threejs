import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RapierRigidBody, RigidBody, useRapier } from '@react-three/rapier';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import useGameStore from '../store/useGameStore';
const Player = () => {
  const playRef = useRef<RapierRigidBody>(null);
  const [sub, get] = useKeyboardControls();
  const { rapier, world } = useRapier() as any;
  const [smoothCameraPosition] = useState(() => new THREE.Vector3(10, 10, 10));
  const [smoothCameraTarget] = useState(() => new THREE.Vector3());
  const start = useGameStore((state: any) => state.start);
  const restart = useGameStore((state: any) => state.restart);
  const end = useGameStore((state: any) => state.end);
  const obstacleCount = useGameStore((state: any) => state.obstacleCount);

  console.log(rapier, world);
  // 跳跃函数
  const jump = () => {
    /*
     * 跳跃时需要监听物体距离地面高度
     */
    const origin = playRef.current?.translation() as any; //获取当前物体位置
    origin.y -= 0.31; //减去球体半径 然后底部检测底部到地面的距离5
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction); //跳起来向下发射的射线
    const hit = world.castRay(ray, 10);
    console.log(hit);

    if (hit.toi < 0.2) {
      playRef.current?.applyImpulse({ x: 0, y: 0.5, z: 0 }, true);
    }
  };
  /*
   * 重制到初始静止状态
   */
  const reset = () => {
    if (playRef.current) {
      playRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true); //线速度为零
      playRef.current.setTranslation({ x: 0, y: 1, z: 0 }, true); //物体位置归零
      playRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true); //旋转速度为零
    }
  };
  //sub为订阅函数，get为获取函数
  useEffect(() => {
    const unsubJump = sub(
      (state) => state.jump,
      (value) => {
        if (value) {
          jump();
        }
      }
    );
    const unsubStart = sub(() => {
      //监听键盘按下，全部按键
      start();
    });
    // 监听是否改变状态
    const unRest = useGameStore.subscribe(
      (state: any) => state.gameState,
      (value) => {
        console.log(value);
        if (value === 'ready') {
          reset();
        }
      }
    );
    return () => {
      unsubJump();
      unsubStart();
      unRest();
    };
  }, []);
  // 判断人物角色的高度
  useFrame((state, delta) => {
    /*
     * 监听键盘按键按下事件
     * 移动物体随后相机跟随
     * 增加力和施加扭矩 =》 也就是旋转
     */
    const { forward, back, right, left, jump } = get();
    // console.log(forward, back, left, right);
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };
    const impulseStrength = delta * 0.6;
    const torqueStrength = delta * 0.2;
    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }
    if (back) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }
    if (left) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }
    if (right) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }
    playRef.current?.applyImpulse(impulse, true); //施加力
    playRef.current?.applyTorqueImpulse(torque, true); //施加扭矩

    /*
     * 相机跟随
     * 相机的位置是在物体的后上方
     * 所以需要先拿到移动的物体的位置
     */
    const playPosition = playRef.current?.translation() as any; //获取角色位置
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(playPosition);
    cameraPosition.z += 2;
    cameraPosition.y += 0.65;
    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(playPosition);
    cameraTarget.y += 0.25;
    // 增加相机平滑移动动画
    smoothCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothCameraTarget.lerp(cameraTarget, 5 * delta);
    state.camera.position.copy(smoothCameraPosition);
    state.camera.lookAt(smoothCameraTarget);

    /*
     * 判断是否结束的状态
     */
    if (playPosition.z < -(obstacleCount * 4 + 2)) end();
    if (playPosition.y <= -4)
      /*
       * 如果掉落下去重新开始
       */
      restart();
  });
  return (
    // 增加空气阻尼
    <RigidBody
      colliders="hull"
      ref={playRef}
      friction={1}
      restitution={0.2}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color="#dd7050" />
      </mesh>
    </RigidBody>
  );
};

export default Player;
