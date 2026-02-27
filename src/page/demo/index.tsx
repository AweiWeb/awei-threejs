import { RigidBody, RapierRigidBody, quat } from '@react-three/rapier';
import useCargame from '../store';
import Car from './Car';
import { useEffect, useRef, useState } from 'react';
import { useKeyboardControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from 'leva';
import { degToRad } from 'three/src/math/MathUtils.js';

const CarColliders = () => {
  const car = useCargame((state: any) => state.car);
  const { camera } = useThree();
  const CarRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // 记录相机的水平旋转角度 (Y轴) 和 垂直旋转角度 (X轴)
  const cameraRotation = useRef(new THREE.Vector3(0, 0, 0));

  const [isLock, setIsLock] = useState(false);
  const [sub, get] = useKeyboardControls();
  const rb = useRef<RapierRigidBody>(null!);

  // 相机参数
  const cameraDistance = 3;
  const cameraHeight = 1;

  const { CAR_SPEED, ROTATION_SMOOTHNESS } = useControls('car', {
    CAR_SPEED: { value: 5, min: 1, max: 20, step: 0.1 },
    ROTATION_SMOOTHNESS: { value: 0.15, min: 0.01, max: 1, step: 0.01 }, // 转向平滑度
  });

  // --- 锁屏逻辑 (保持不变) ---
  useEffect(() => {
    const handleLock = () => {
      if (!isLock) {
        document.body.requestPointerLock();
        setIsLock(true);
      }
    };
    document.addEventListener('click', handleLock);
    return () => {
      document.removeEventListener('click', handleLock);
    };
  }, [isLock]);

  useEffect(() => {
    const handleMouseMoce = (event: MouseEvent) => {
      if (isLock) {
        mouseRef.current.x = event.movementX;
        mouseRef.current.y = event.movementY;
      }
    };
    const handleLockMouse = () => {
      setIsLock(document.pointerLockElement === document.body);
    };
    document.addEventListener('mousemove', handleMouseMoce);
    document.addEventListener('pointerlockchange', handleLockMouse);
    return () => {
      document.removeEventListener('mousemove', handleMouseMoce);
      document.removeEventListener('pointerlockchange', handleLockMouse);
    };
  }, [isLock]);

  // --- 核心逻辑 ---
  useFrame((state, delta) => {
    if (!rb.current || !CarRef.current) return;

    // 1. 获取当前刚体的位置和速度
    const playerPosition = rb.current.translation();
    const curVel = rb.current.linvel();
    const { forward, back, left, right } = get();

    // 2. 更新相机角度 (基于鼠标移动)
    if (isLock) {
      cameraRotation.current.x -= mouseRef.current.y * 0.003; // 俯仰角
      cameraRotation.current.y -= mouseRef.current.x * 0.003; // 偏航角 (水平旋转)

      // 限制俯仰角，防止相机翻转
      cameraRotation.current.x = Math.max(
        -Math.PI / 2 + 0.1,
        Math.min(Math.PI / 2 - 0.1, cameraRotation.current.x)
      );

      // 重置鼠标差值
      mouseRef.current = { x: 0, y: 0 };
    }

    // 3. 计算基于相机视角的移动向量
    // 我们只关心水平移动，所以基于 cameraRotation.current.y 来计算
    const moveVector = new THREE.Vector3(0, 0, 0);
    const inputVector = new THREE.Vector3(0, 0, 0);

    // 原始输入 (Z是前后，X是左右)
    if (forward) inputVector.z -= 1;
    if (back) inputVector.z += 1;
    if (left) inputVector.x -= 1;
    if (right) inputVector.x += 1;

    // 只有当有输入时才计算
    if (inputVector.length() > 0) {
      inputVector.normalize(); // 归一化，防止斜着走速度变快

      // 关键点：将输入向量 旋转 到相机的朝向
      // 我们创建一个欧拉角，只包含相机的Y轴旋转
      const euler = new THREE.Euler(0, cameraRotation.current.y, 0);
      moveVector.copy(inputVector).applyEuler(euler);

      // 应用速度
      moveVector.multiplyScalar(CAR_SPEED);
    }

    // 4. 应用物理速度
    rb.current.setLinvel(
      {
        x: moveVector.x,
        y: curVel.y, // ！！！重要：保留原有的垂直速度（重力），否则车会悬空或无法下落
        z: moveVector.z,
      },
      true
    );

    // 5. 车辆旋转逻辑 (让车头朝向移动方向)
    if (inputVector.length() > 0) {
      // 计算目标角度：Math.atan2(x, z)
      // 注意：Rapier和ThreeJS坐标系对应，通常是 atan2(x, z) 或 atan2(x, -z) 取决于模型朝向
      // 这里我们直接利用 moveVector 计算世界坐标下的目标角度
      const targetAngle = Math.atan2(moveVector.x, moveVector.z);

      // 获取当前刚体的旋转四元数
      const currentRotation = rb.current.rotation();
      const currentQuat = new THREE.Quaternion(
        currentRotation.x,
        currentRotation.y,
        currentRotation.z,
        currentRotation.w
      );

      // 创建目标四元数
      const targetQuat = new THREE.Quaternion();
      targetQuat.setFromEuler(new THREE.Euler(0, targetAngle, 0)); // 假设车原本是朝向+Z或-Z的，根据模型调整

      // 平滑插值旋转 (Slerp)
      currentQuat.slerp(targetQuat, ROTATION_SMOOTHNESS);

      // 应用旋转给刚体
      rb.current.setRotation(currentQuat, true);
    }

    // 6. 相机跟随逻辑
    // 计算相机位置：目标位置 + 偏移量(由三角函数计算)
    const cameraOffset = new THREE.Vector3(
      Math.sin(cameraRotation.current.y) * cameraDistance,
      cameraHeight + Math.sin(cameraRotation.current.x) * 2, // 简单的高度处理
      Math.cos(cameraRotation.current.y) * cameraDistance
    );

    const cameraPos = new THREE.Vector3(
      playerPosition.x,
      playerPosition.y,
      playerPosition.z
    ).add(cameraOffset);

    // 平滑相机移动 (可选，让相机不那么生硬)
    camera.position.lerp(cameraPos, 0.1);

    // 让相机看着车
    const lookAtTarget = new THREE.Vector3(
      playerPosition.x,
      playerPosition.y + 0.5,
      playerPosition.z
    );
    camera.lookAt(lookAtTarget);
  });

  return (
    <RigidBody
      ref={rb}
      position={[0, 2, 0]} // 初始位置抬高一点防止卡地
      gravityScale={1} // 稍微加大重力让车贴地更稳
      type="dynamic"
      colliders="hull" // 或者 cuboid，取决于你的车模型精度要求
      mass={1}
      friction={1} // 增加摩擦力，防止停车后滑行太远
      lockRotations={false} // 允许物理旋转，但我们主要靠代码控制Y轴
      enabledRotations={[false, true, false]} // 仅允许绕Y轴旋转，防止翻车 (根据需要开启)
    >
      {/* 注意：这里的 rotation-y Math.PI 
         是因为很多3D模型默认是背对相机的，如果你的车倒着走，就把这个去掉或者改成 0 
      */}
      <Car scale={0.2} model={car} ref={CarRef} rotation-y={Math.PI} />
    </RigidBody>
  );
};

export default CarColliders;
