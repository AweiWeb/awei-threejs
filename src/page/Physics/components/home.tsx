import { Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  Physics,
  RigidBody,
  RapierRigidBody,
  CuboidCollider,
  InstancedRigidBodies,
} from '@react-three/rapier';
import * as THREE from 'three';
import PhyModel from './model';
import CyberTruck from './cyberTruck';
import { Perf } from 'r3f-perf';
import { useEffect, useMemo, useRef } from 'react';
import { useControls } from 'leva';
const Home = () => {
  const cubeRef = useRef<RapierRigidBody>(null!);
  const gunzi = useRef<RapierRigidBody>(null!);

  const { debugVisible, cubeCount } = useControls('物理引擎', {
    debugVisible: false,
    cubeCount: { value: 100, min: 0, max: 200 },
  });
  const changeForce = () => {
    // console.log(cubeRef.current);
    const mass = cubeRef.current.mass();
    // console.log(mass);

    cubeRef.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 }, true);
    cubeRef.current.applyTorqueImpulse(
      {
        x: (Math.random() - 0.5) * 5,
        y: (Math.random() - 0.5) * 5,
        z: (Math.random() - 0.5) * 5,
      },
      true
    );
  };
  const collision = () => {
    // console.log('撞到了');
  };
  useEffect(() => {
    return () => {
      instances.splice(0);
    };
  }, [cubeCount]);
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    // console.log(time);
    const eluerRotation = new THREE.Euler(0, time * 3, 0);
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eluerRotation);
    gunzi.current.setNextKinematicRotation(quaternionRotation);
    // console.log(quaternionRotation);
    // console.log(gunzi);
    const angle = time * 0.5;
    const x = Math.cos(angle);
    const z = Math.sin(angle);
    gunzi.current.setNextKinematicTranslation({ x, y: 0, z });
    // console.log(cubeRef.current);
  });
  // 增加多个正方体
  const instances = useMemo(() => {
    const instance = [] as any;
    for (let i = 0; i < cubeCount; i++) {
      instance.push({
        key: `instance${i + 1}`,
        position: [
          (Math.random() - 0.5) * 8,
          6 + i * 0.2,
          (Math.random() - 0.5) * 8,
        ],
        rotation: [Math.random(), Math.random(), Math.random()],
      });
    }
    return instance;
  }, [cubeCount]);
  return (
    <>
      <Perf position="top-left" />
      <Environment
        files={['/environmentMaps/0/2k.hdr']}
        backgroundBlurriness={0}
        environmentIntensity={1}
      />
      <ambientLight intensity={0.5} />
      <directionalLight
        intensity={2}
        position={[1, 2, 3]}
        castShadow
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera args={[-10, 10, 10, -10]} near={0.1} far={10} />
      </directionalLight>
      <Physics debug={debugVisible} gravity={[0, -9.8, 0]}>
        {/* 物体一旦静止不动就会进入睡眠状态 */}
        <RigidBody
          colliders={false}
          gravityScale={1}
          ref={cubeRef}
          restitution={1}
          position={[-2, 5, 0]}
          onSleep={() => {
            console.log('睡眠中');
          }}
          onContactForce={() => {
            // console.log('被推了');
          }}
          onWake={() => {
            // console.log('醒了');
          }}
        >
          <mesh castShadow onClick={changeForce}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
          <CuboidCollider mass={2} args={[0.5, 0.5, 0.5]} />
        </RigidBody>

        <RigidBody
          mass={2}
          restitution={1}
          gravityScale={0.5}
          colliders="ball"
          friction={0}
        >
          <mesh castShadow position={[2, 5, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>
        <RigidBody type="fixed" friction={0.7} restitution={0}>
          <mesh receiveShadow position={[0, -1.5, 0]}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="yellowgreen" />
          </mesh>
        </RigidBody>
        <RigidBody
          type="kinematicPosition"
          ref={gunzi}
          friction={0}
          onCollisionEnter={collision}
          onCollisionExit={() => {
            // console.log('dingdong');
          }}
          onIntersectionExit={() => {
            // console.log('dingdong2');
          }}
        >
          <mesh castShadow position={[0, -1, 0]}>
            <boxGeometry args={[0.5, 0.5, 4]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>
        {/* 增加四面墙 */}
        <RigidBody type="fixed">
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 0.8, 5.4]} />
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 0.8, -5.4]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[-5.4, 0.8, 0]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[5.4, 0.8, 0]} />
        </RigidBody>
        <PhyModel />
        <CyberTruck />
        {/* 增加多个物体 */}
        <InstancedRigidBodies key={cubeCount} instances={instances}>
          <instancedMesh
            castShadow
            receiveShadow
            args={[null!, null!, cubeCount]}
          >
            <boxGeometry />
            <meshStandardMaterial color="tomato" />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  );
};

export default Home;
