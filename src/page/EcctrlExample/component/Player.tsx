import { useEffect, useRef, useState } from 'react';
import { useGLTF, useAnimations, useKeyboardControls } from '@react-three/drei';
import {
  RigidBody,
  BallCollider,
  CapsuleCollider,
  RapierRigidBody,
} from '@react-three/rapier';
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
const Player = (props: any) => {
  /*
   * 变量
   */
  const [animate, setAnimate] = useState('Idle');
  const peopleRef = useRef<THREE.Group>(null!);
  const [_, get] = useKeyboardControls();
  const rb = useRef<RapierRigidBody>(null!);
  const rotationTarget = useRef(0); //人物当前旋转的角度
  const characterRotation = useRef(0);
  const peopleAllParams = useRef({
    ROTATO_SPEED: THREE.MathUtils.degToRad(0.5),
    WALK_SPEED: 2,
    RUN_SPEED: 5,
  }); //人物的所有动态参数
  /*
   * 引入模型和动画部分
   */
  const { nodes, materials, animations } = useGLTF(
    '/models/Floating Character.glb'
  ) as any;
  const { actions } = useAnimations(animations, peopleRef) as any;
  const { animationName } = useControls('角色控制', {
    animationName: {
      value: animate,
      options: animations.map((item: any) => item.name),
    },
  }) as any;
  useEffect(() => {
    actions[animationName].reset().fadeIn(0.3).play();
    return () => {
      actions[animationName].fadeOut(0.3);
    };
  }, [actions, animationName]);
  useEffect(() => {
    actions[animate].reset().fadeIn(0.3).play();
    return () => {
      actions[animate].fadeOut(0.3);
    };
  }, [animate]);
  /*
   * 处理人物移动 跳跃 转向 相机跟随
   */
  useFrame((state, delta) => {
    if (!peopleRef.current || !rb.current) return;
    /*
     * 获取键盘是否按下 分为前后左右 跳跃 奔跑
     */
    const moveVector = new THREE.Vector3(0, 0, 0); //记录向量;
    const { forward, backward, jump, leftward, rightward, run, fight } = get();
    const currentLv = rb.current.linvel();

    /*
     * 改变 记录当前向量
     */
    if (forward) moveVector.z += 1;
    if (backward) moveVector.z -= 1;
    if (rightward) moveVector.x -= 1;
    if (leftward) moveVector.x += 1;
    if (fight) setAnimate('AttackCombo');

    if (moveVector.x !== 0) {
      moveVector.normalize(); //向量归一化
      /*
       * 计算旋转 的角度
       */
      rotationTarget.current +=
        peopleAllParams.current.ROTATO_SPEED * moveVector.x;
    }
    if (moveVector.z !== 0 || moveVector.x !== 0) {
      let speed = 0;
      run
        ? (speed = peopleAllParams.current.RUN_SPEED)
        : (speed = peopleAllParams.current.WALK_SPEED);
      /*
       * 改变人物当前位移向量
       */
      if (run) {
        setAnimate('Run');
      } else {
        setAnimate('Walk');
      }
      characterRotation.current = Math.atan2(moveVector.x, moveVector.z); //判断当前的方位
      currentLv.x =
        Math.sin(characterRotation.current + rotationTarget.current) * speed;
      currentLv.z =
        Math.cos(characterRotation.current + rotationTarget.current) * speed;
    }
    if (moveVector.z === 0 && moveVector.x === 0 && !fight) {
      setAnimate('Idle');
    }
    peopleRef.current.rotation.y = THREE.MathUtils.lerp(
      peopleRef.current.rotation.y,
      rotationTarget.current + characterRotation.current,
      0.1
    );
    rb.current.setLinvel(currentLv, true);

    /*
     * 处理相机跟随
     */
    const peoplePosition = peopleRef.current.getWorldPosition(
      new THREE.Vector3()
    ) as any;
    const yMatrix = new THREE.Matrix4().makeRotationY(rotationTarget.current);
    const camera = state.camera;
    const cameraPosition = new THREE.Vector3();
    const cameraTarget = new THREE.Vector3();
    /*
     *计算角色旋转， 相机需要偏移
     */
    cameraPosition
      .copy(peoplePosition)
      .add(new THREE.Vector3(0, 4.5, -4).applyMatrix4(yMatrix));
    camera.position.lerp(cameraPosition, 0.1);
    cameraTarget
      .copy(peoplePosition)
      .add(new THREE.Vector3(0, 1.5, 0).applyMatrix4(yMatrix));

    camera.lookAt(cameraTarget);
  });
  return (
    <RigidBody
      colliders={false}
      friction={0.01}
      angularDamping={0.001}
      ref={rb}
      lockRotations
    >
      <group
        ref={peopleRef}
        scale={0.8}
        position={[0, -0.5, 0]}
        {...props}
        dispose={null}
      >
        <group name="Scene">
          <group name="KayKit_Animated_Character">
            <skinnedMesh
              name="outline"
              geometry={nodes.outline.geometry}
              material={materials.outline}
              skeleton={nodes.outline.skeleton}
            />
            <skinnedMesh
              name="PrototypePete"
              geometry={nodes.PrototypePete.geometry}
              material={materials.PrototypePete}
              skeleton={nodes.PrototypePete.skeleton}
            />
            <primitive object={nodes.Body} />
          </group>
        </group>
      </group>
      <BallCollider args={[0.5]} position={[0, 0.55, 0]} />
      <CapsuleCollider args={[0.25, 0.3]} />
    </RigidBody>
  );
};

export default Player;
useGLTF.preload('/Floating Character.glb');
