import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import useCargame from '../store';
import Car from './Car';
import { useEffect, useRef, useState } from 'react';
import { Tube, useKeyboardControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useControls } from 'leva';
import { degToRad } from 'three/src/math/MathUtils.js';
const normalizeAngle = (angle: any) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

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
const CarColliders = () => {
  const car = useCargame((state: any) => state.car);
  const { camera } = useThree();
  const CarRef = useRef<any>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cameraRotation = useRef(new THREE.Vector3());
  const carRotation = useRef(0);
  const rotationTarget = useRef(0);
  const [isLock, setIsLock] = useState(false);
  const [sub, get] = useKeyboardControls();
  const rb = useRef<RapierRigidBody>(null!);
  const cameraDistance = 3;
  const cameraHeight = 1;
  const smoothCameraPosition = new THREE.Vector3();
  const smoothCameraTarget = new THREE.Vector3();
  const { ROTATION_SPEED, CAR_SPEED, hightView, isCameraOffset, isLocked } =
    useControls('car', {
      ROTATION_SPEED: {
        value: degToRad(0.5),
        min: degToRad(0.1),
        max: degToRad(5),
        step: degToRad(0.1),
      },
      CAR_SPEED: {
        value: 500,
        min: 1,
        max: 100,
        step: 1,
      },
      hightView: false,
      isCameraOffset: false,
      isLocked: false,
    });
  /*
   * 锁屏
   */
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

  // 监听鼠标移动位置
  useEffect(() => {
    const handleMouseMoce = (event: MouseEvent) => {
      if (isLock) {
        console.log(event.movementX, event.movementY);

        mouseRef.current.x = event.movementX;
        mouseRef.current.y = event.movementY;
      }
    };
    // 监听锁屏变化
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
  /*
   * WASD 控制车辆的移动并且方向朝向
   * 鼠标来控制相机 车辆的转向
   * 根据鼠标移动的距离来控制车辆的旋转角度
   * 车辆移动相机跟随
   */
  useFrame((state, delta) => {
    if (!rb.current || !CarRef.current) return;
    const currentVel = rb.current.linvel();
    const moveVector = new THREE.Vector3(0, 0, 0);
    const directionVector = new THREE.Vector3(0, 0, 0);
    const { forward, back, left, right, speedUp } = get();
    if (forward) directionVector.z = -1;
    if (back) directionVector.z = 1;
    if (left) directionVector.x = -1;
    if (right) directionVector.x = 1;
    // console.log(forward, back, left, right);

    if (directionVector.x !== 0) {
      // 用在相机旋转吧
      rotationTarget.current += ROTATION_SPEED * directionVector.x;
    }

    if (directionVector.x !== 0 || directionVector.z !== 0) {
      const currentSpeed = speedUp ? 200 * delta : CAR_SPEED * delta;
      const targetAngle = Math.atan2(directionVector.x, directionVector.z);
      console.log(targetAngle, '角度');
      carRotation.current = targetAngle;
      // carRotation.current = lerpAngle(
      //   carRotation.current,
      //   targetAngle,
      //   5 * delta
      // );
      moveVector.x = Math.sin(carRotation.current) * currentSpeed;
      moveVector.z = Math.cos(carRotation.current) * currentSpeed;
      moveVector.y = currentVel.y;
    }

    const euler = new THREE.Euler(0, carRotation.current, 0);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(euler);

    rb.current.setRotation(quaternion, true);

    // console.log(currentVel);

    rb.current.setLinvel(moveVector, true);

    //处理相机跟随
    /*
     * 处理相机偏转
     */
    const cameraTarget = new THREE.Vector3(0, 0, 0);
    const cameraPosition = new THREE.Vector3(0, 0, 0);

    const currentPlayPosition = rb.current.translation() as any;
    cameraPosition.copy(currentPlayPosition);
    if (hightView) {
      cameraPosition.y += 5;
    } else {
      cameraPosition.y += 0.5;
    }
    if (isCameraOffset) {
      cameraPosition.z += cameraDistance * Math.cos(carRotation.current);
      cameraPosition.x += cameraDistance * Math.sin(carRotation.current);
    } else {
      cameraPosition.z += cameraDistance;
    }
    smoothCameraPosition.lerp(cameraPosition, 5 * delta);
    cameraTarget.copy(currentPlayPosition);

    smoothCameraTarget.lerp(
      new THREE.Vector3(cameraTarget.x, cameraTarget.y + 0.5, cameraTarget.z),
      5 * delta
    );
    camera.position.copy(smoothCameraPosition);
    camera.lookAt(smoothCameraTarget);

    /*
     * 判断游戏状态 掉落下去了就重新开始
     */
    // console.log(currentPlayPosition.y);

    // if (currentPlayPosition.y < -1) {
    //   rb.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    //   rb.current.setTranslation({ x: 0, y: 0, z: 0 }, true);
    // }
  });
  return (
    <>
      <RigidBody
        ref={rb}
        gravityScale={1}
        type="dynamic"
        colliders="hull"
        mass={1}
        friction={0.1}
      >
        <Car scale={0.2} model={car} ref={CarRef} rotation-y={Math.PI} />
      </RigidBody>
    </>
  );
};

export default CarColliders;
