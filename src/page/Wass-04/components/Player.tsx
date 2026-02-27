import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from '@react-three/rapier';
import Character from './Character';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { Matrix4, Vector3 } from 'three';
import { degToRad } from 'three/src/math/MathUtils.js';
import { useControls } from 'leva';

const normalizeAngle = (angle: number) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start: number, end: number, t: number) => {
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
  const [animate, setAnimate] = useState('idle');
  const [_, get] = useKeyboardControls();
  const characterRef = useRef(null!) as any;
  const rbRef = useRef<RapierRigidBody>(null!);
  const currentRotationTarget = useRef(0);
  const characterRotation = useRef(0);
  const cameraPosition = useRef(new Vector3(0, 5, -4));
  const cameraTarget = useRef(new Vector3(0, 1.5, 0));
  const { world, rapier } = useRapier() as any;
  const playParams = {
    Walk: 2,
    Rotate: degToRad(0.5),
    Run: 4,
    Jump: 0.3,
  };
  const { cameraTop, cameraBack, WalkSpeed, RunSpeed, JumpHight } = useControls(
    '角色信息 👨',
    {
      cameraTop: {
        value: 5,
        min: 3,
        max: 10,
        step: 0.1,
      },
      cameraBack: {
        value: -4,
        min: -10,
        max: 10,
        step: 0.1,
      },
      WalkSpeed: {
        value: 2,
        min: 1,
        max: 5,
        step: 0.1,
      },
      RunSpeed: {
        value: 5,
        min: 3,
        max: 15,
        step: 0.1,
      },
      JumpHight: {
        value: 2,
        min: 1,
        max: 4,
        step: 0.1,
      },
    },
  );
  useFrame(({ camera }, detla) => {
    playParams.Walk = WalkSpeed;
    playParams.Run = RunSpeed;
    playParams.Jump = JumpHight;
    if (!rbRef.current) return;
    const direction = new Vector3();
    const vel = rbRef.current.linvel();
    const { forward, back, left, right, jump, run } = get();
    let speed = 0;
    run ? (speed = playParams.Run) : (speed = playParams.Walk);
    if (forward) direction.z = 1;
    if (back) direction.z = -1;
    if (left) direction.x = 1;
    if (right) direction.x = -1;
    direction.normalize();
    if (direction.x !== 0) {
      currentRotationTarget.current += direction.x * playParams.Rotate;
    }
    if (direction.z !== 0 || direction.x !== 0) {
      characterRotation.current = Math.atan2(direction.x, direction.z);
      vel.x =
        Math.sin(currentRotationTarget.current + characterRotation.current) *
        speed;
      vel.z =
        Math.cos(currentRotationTarget.current + characterRotation.current) *
        speed;
      run ? setAnimate('run') : setAnimate('walk');
    } else {
      setAnimate('idle');
    }

    if (jump) {
      const origin = rbRef.current.translation() as any;
      const directionVec = { x: 0, y: -1, z: 0 };
      const ray = new rapier.Ray(origin, directionVec);
      const hit = world.castRay(ray, 10, true, null, null, null, rbRef.current);
      if (hit.timeOfImpact < 1.3) {
        vel.y += playParams.Jump;
        setAnimate('dive');
      }
    }

    rbRef.current.setLinvel(vel, true);
    characterRef.current.rotation.y = lerpAngle(
      characterRef.current.rotation.y,
      characterRotation.current + currentRotationTarget.current,
      0.1,
    );

    cameraPosition.current.y = cameraTop;
    cameraPosition.current.z = cameraBack;
    const characterPos = characterRef.current.getWorldPosition(new Vector3());
    const rotationMatrix = new Matrix4().makeRotationY(
      currentRotationTarget.current,
    );
    const cameraEndPos = characterPos
      .clone()
      .add(cameraPosition.current.clone().applyMatrix4(rotationMatrix));
    const cameraEndTarget = characterPos
      .clone()
      .add(cameraTarget.current.clone().applyMatrix4(rotationMatrix));
    camera.position.lerp(cameraEndPos, 0.1);
    camera.lookAt(cameraEndTarget);
  });
  return (
    <RigidBody position={[4, 2, 1]} ref={rbRef} colliders={false} lockRotations>
      <group ref={characterRef}>
        <Character actionName={animate} position={[0, -1.2, 0]} />
      </group>
      <CapsuleCollider args={[0.25, 1]} />
    </RigidBody>
  );
};

export default Player;
