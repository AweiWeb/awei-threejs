import { useAnimations, useFBX, useGLTF } from '@react-three/drei';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import { loadMixamoAnimation } from './LoaderMixAnimation';
import { useControls } from 'leva';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { lerp } from 'three/src/math/MathUtils.js';
import { Face, Hand, Pose } from 'kalidokit';
import { useVideoRecognition } from '../store';
const Avatar = ({ avatar, ...props }: any) => {
  const peopleFace = useRef<any>();
  const peopleBody = useRef<any>();
  const peopleLeftHand = useRef<any>();
  const peopleRightHand = useRef<any>();
  const tmElur = new THREE.Euler(); //旋转角度
  const tmQuation = new THREE.Quaternion(); //四元数
  const videoElement = useVideoRecognition((state: any) => state.videoElement);
  const { scene, userData } = useGLTF(
    `/models/${avatar}`,
    undefined,
    undefined,
    (loader) => {
      //   console.log(loader);
      //安装一个vrm 的插件希望可以支持Vrm
      loader.register((parser: any): any => {
        console.log(parser);
        return new VRMLoaderPlugin(parser);
      });
    }
  );
  // 加载人物动画文件
  // 需要把这个文件配置到vrm人物模型上
  const asset1 = useFBX('/models/animations/Breathing Idle.fbx');
  const asset2 = useFBX('/models/animations/Swing Dancing.fbx');
  const asset3 = useFBX('/models/animations/Thriller Part 2.fbx');
  //   console.log(scene, userData);
  // 拿到当前的模型
  const currentVrm = userData.vrm;
  //   console.log(userData.vrm.humanoid, 'xin');

  // 处理加载后的的模型动画文件
  const animationClip1 = useMemo(() => {
    const clip = loadMixamoAnimation(currentVrm, asset1);
    clip.name = '摇摆';
    return clip;
  }, [asset1, currentVrm]);
  console.log(animationClip1);

  const animationClip2 = useMemo(() => {
    const clip = loadMixamoAnimation(currentVrm, asset2);
    clip.name = '跳舞';
    return clip;
  }, [asset2, currentVrm]);
  const animationClip3 = useMemo(() => {
    const clip = loadMixamoAnimation(currentVrm, asset3);
    clip.name = '跑路';
    return clip;
  }, [asset3, currentVrm]);
  //获取动画action
  const { actions } = useAnimations(
    [animationClip1, animationClip2, animationClip3],
    currentVrm.scene
  );
  //   console.log(currentVrm);

  const {
    animation,
    aa,
    ih,
    ee,
    ou,
    oh,
    blink,
    blinkLeft,
    blinkRight,
    angry,
    sad,
    happy,
  } = useControls('人物VRM', {
    aa: { value: 0, min: 0, max: 1 },
    ih: { value: 0, min: 0, max: 1 },
    ee: { value: 0, min: 0, max: 1 },
    ou: { value: 0, min: 0, max: 1 },
    oh: { value: 0, min: 0, max: 1 },
    blink: { value: 0, min: 0, max: 1 },
    blinkLeft: { value: 0, min: 0, max: 1 },
    blinkRight: { value: 0, min: 0, max: 1 },
    angry: { value: 0, min: 0, max: 1 },
    happy: { value: 0, min: 0, max: 1 },
    sad: { value: 0, min: 0, max: 1 },
    animation: { value: '', options: ['', '摇摆', '跳舞', '跑路'] },
  });
  // 播放人物动画
  useEffect(() => {
    if (animation === '') return;
    actions[animation]?.play();
    return () => {
      actions[animation]?.stop();
    };
  }, [animation, actions, videoElement]);
  //   获取视频数据

  // 获取改变数据函数
  const setResultCallBack = useVideoRecognition(
    (state: any) => state.setResultsCallback
  );
  // 映射视频数据到模型
  const resultCallback = useCallback(
    (results: any) => {
      if (!videoElement || !currentVrm) return;
      //   console.log(results, 11111);
      // 这里可以拿到 面部数据
      console.log(results);

      if (results.faceLandmarks) {
        // 设置面部数据
        peopleFace.current = Face.solve(results.faceLandmarks, {
          runtime: 'mediapipe',
          video: videoElement,
          imageSize: { width: 640, height: 480 },
          smoothBlink: false,
          blinkSettings: [0.25, 0.75],
        });
      }
      if (results.za && results.poseLandmarks) {
        peopleBody.current = Pose.solve(results.za, results.poseLandmarks, {
          runtime: 'mediapipe',
          video: videoElement,
        });
      }
      // 处理镜像问题
      if (results.leftHandLandmarks) {
        // console.log(results.leftHandLandmarks, '胳膊');
        peopleRightHand.current = Hand.solve(results.leftHandLandmarks, 'Right');
      }
      if (results.rightHandLandmarks) {
        peopleLeftHand.current = Hand.solve(
          results.rightHandLandmarks,
          'Left'
        );
      }
    },
    [currentVrm, videoElement]
  );
  // 骨骼函数
  const rotateBone = (
    boneName: any,
    value: any,
    slerpFactor: any,
    filp = { x: 1, y: 1, z: 1 }
  ) => {
    const bone = userData.vrm.humanoid.getNormalizedBoneNode(boneName);
    if (!bone) {
      return;
    }
    //这里对骨骼进行调整
    tmElur.set(value.x * filp.x, value.y * filp.y, value.z * filp.z);
    tmQuation.setFromEuler(tmElur);
    // console.log(bone.quaternion, 'siisisi', slerpFactor);
    bone.quaternion.slerp(tmQuation, slerpFactor);
  };
  // 更新数据
  useEffect(() => {
    setResultCallBack(resultCallback);
  }, [resultCallback]);
  //  平滑过度改变人物表情
  const lerpSetExpression = (name: any, value: any, lerpFactor: any) => {
    userData.vrm.expressionManager.setValue(
      name,
      lerp(userData.vrm.expressionManager.getValue(name), value, lerpFactor)
    );
  };
  //   配置vrm人物动画信息
  useEffect(() => {
    const vrm = userData.vrm;
    VRMUtils.removeUnnecessaryVertices(scene);
    VRMUtils.combineSkeletons(scene);
    VRMUtils.combineMorphs(vrm);
    vrm.scene.traverse((obj: any) => {
      obj.frustumCulled = false;
    });
  }, [scene]);
  useFrame((_, delta) => {
    if (!userData.vrm) {
      return;
    }
    // 动态更新表情管理
    if (!videoElement) {
      [
        { name: 'aa', value: aa },
        { name: 'ih', value: ih },
        { name: 'ee', value: ee },
        { name: 'ou', value: ou },
        { name: 'oh', value: oh },
        { name: 'blink', value: blink },
        { name: 'angry', value: angry },
        { name: 'happy', value: happy },
        { name: 'sad', value: sad },
        { name: 'blinkLeft', value: blinkLeft },
        { name: 'blinkRight', value: blinkRight },
      ].forEach((item) => lerpSetExpression(item.name, item.value, delta * 12));
    } else {
      //   console.log(peopleFace.current);
      if (peopleFace.current) {
        [
          { name: 'aa', value: peopleFace.current.mouth.shape.A },
          { name: 'ih', value: peopleFace.current.mouth.shape.I },
          { name: 'ee', value: peopleFace.current.mouth.shape.E },
          { name: 'ou', value: peopleFace.current.mouth.shape.U },
          { name: 'oh', value: peopleFace.current.mouth.shape.O },
          { name: 'blinkLeft', value: 1 - peopleFace.current.eye.l },
          { name: 'blinkRight', value: 1 - peopleFace.current.eye.r },
        ].forEach((item) =>
          lerpSetExpression(item.name, item.value, delta * 12)
        );
        if (lookAtTarget.current) {
          userData.vrm.lookAt.target = lookAtTarget.current;
          console.log(peopleFace.current);

          lookAtDestination.current.set(
            -2 * peopleFace.current.pupil.x,
            2 * peopleFace.current.pupil.y,
            0
          );
          lookAtTarget.current.position.lerp(
            lookAtDestination.current,
            delta * 5
          );
        }
      }
      rotateBone('neck', peopleFace.current.head, delta * 5, {
        x: 0.7,
        y: 0.7,
        z: 0.7,
      });
    }
    if (peopleBody.current) {
      // console.log(peopleBody.current);
      rotateBone('chest', peopleBody.current.Spine, delta * 5, {
        x: 0.3,
        y: 0.3,
        z: 0.3,
      });
      rotateBone('spine', peopleBody.current.Spine, delta * 5, {
        x: 0.3,
        y: 0.3,
        z: 0.3,
      });
      rotateBone('hips', peopleBody.current.Hips.rotation, delta * 5, {
        x: 0.7,
        y: 0.7,
        z: 0.7,
      });
      rotateBone('leftUpperArm', peopleBody.current.LeftUpperArm, delta * 5);
      rotateBone('leftLowerArm', peopleBody.current.LeftLowerArm, delta * 5);
      // RIGHT ARM
      rotateBone('rightUpperArm', peopleBody.current.RightUpperArm, delta * 5);
      rotateBone('rightLowerArm', peopleBody.current.RightLowerArm, delta * 5);
      if (peopleLeftHand.current) {
        rotateBone(
          'leftHand',
          {
            z: peopleBody.current.LeftHand.z,
            y: peopleLeftHand.current.LeftWrist.y,
            x: peopleLeftHand.current.LeftWrist.x,
          },
          delta * 12
        );
        rotateBone(
          'leftRingProximal',
          peopleLeftHand.current.LeftRingProximal,
          delta * 12
        );
        rotateBone(
          'leftRingIntermediate',
          peopleLeftHand.current.LeftRingIntermediate,
          delta * 12
        );
        rotateBone(
          'leftRingDistal',
          peopleLeftHand.current.LeftRingDistal,
          delta * 12
        );
        rotateBone(
          'leftIndexProximal',
          peopleLeftHand.current.LeftIndexProximal,
          delta * 12
        );
        rotateBone(
          'leftIndexIntermediate',
          peopleLeftHand.current.LeftIndexIntermediate,
          delta * 12
        );
        rotateBone(
          'leftIndexDistal',
          peopleLeftHand.current.LeftIndexDistal,
          delta * 12
        );
        rotateBone(
          'leftMiddleProximal',
          peopleLeftHand.current.LeftMiddleProximal,
          delta * 12
        );
        rotateBone(
          'leftMiddleIntermediate',
          peopleLeftHand.current.LeftMiddleIntermediate,
          delta * 12
        );
        rotateBone(
          'leftMiddleDistal',
          peopleLeftHand.current.LeftMiddleDistal,
          delta * 12
        );
        rotateBone(
          'leftThumbProximal',
          peopleLeftHand.current.LeftThumbProximal,
          delta * 12
        );
        rotateBone(
          'leftThumbMetacarpal',
          peopleLeftHand.current.LeftThumbIntermediate,
          delta * 12
        );
        rotateBone(
          'leftThumbDistal',
          peopleLeftHand.current.LeftThumbDistal,
          delta * 12
        );
        rotateBone(
          'leftLittleProximal',
          peopleLeftHand.current.LeftLittleProximal,
          delta * 12
        );
        rotateBone(
          'leftLittleIntermediate',
          peopleLeftHand.current.LeftLittleIntermediate,
          delta * 12
        );
        rotateBone(
          'leftLittleDistal',
          peopleLeftHand.current.LeftLittleDistal,
          delta * 12
        );
      }

      if (peopleRightHand.current) {
        rotateBone(
          'rightHand',
          {
            z: peopleBody.current.RightHand.z,
            y: peopleRightHand.current.RightWrist.y,
            x: peopleRightHand.current.RightWrist.x,
          },
          delta * 12
        );
        rotateBone(
          'rightRingProximal',
          peopleRightHand.current.RightRingProximal,
          delta * 12
        );
        rotateBone(
          'rightRingIntermediate',
          peopleRightHand.current.RightRingIntermediate,
          delta * 12
        );
        rotateBone(
          'rightRingDistal',
          peopleRightHand.current.RightRingDistal,
          delta * 12
        );
        rotateBone(
          'rightIndexProximal',
          peopleRightHand.current.RightIndexProximal,
          delta * 12
        );
        rotateBone(
          'rightIndexIntermediate',
          peopleRightHand.current.RightIndexIntermediate,
          delta * 12
        );
        rotateBone(
          'rightIndexDistal',
          peopleRightHand.current.RightIndexDistal,
          delta * 12
        );
        rotateBone(
          'rightMiddleProximal',
          peopleRightHand.current.RightMiddleProximal,
          delta * 12
        );
        rotateBone(
          'rightMiddleIntermediate',
          peopleRightHand.current.RightMiddleIntermediate,
          delta * 12
        );
        rotateBone(
          'rightMiddleDistal',
          peopleRightHand.current.RightMiddleDistal,
          delta * 12
        );
        rotateBone(
          'rightThumbProximal',
          peopleRightHand.current.RightThumbProximal,
          delta * 12
        );
        rotateBone(
          'rightThumbMetacarpal',
          peopleRightHand.current.RightThumbIntermediate,
          delta * 12
        );
        rotateBone(
          'rightThumbDistal',
          peopleRightHand.current.RightThumbDistal,
          delta * 12
        );
        rotateBone(
          'rightLittleProximal',
          peopleRightHand.current.RightLittleProximal,
          delta * 12
        );
        rotateBone(
          'rightLittleIntermediate',
          peopleRightHand.current.RightLittleIntermediate,
          delta * 12
        );
        rotateBone(
          'rightLittleDistal',
          peopleRightHand.current.RightLittleDistal,
          delta * 12
        );
      }
    }
    // 检索摄像机获取的信息，映射到人物模型的身上
    userData.vrm.update(delta);
  });
  // 眼睛看向方向
  const lookAtDestination = useRef(new THREE.Vector3(0, 0, 0));
  const camera = useThree((state) => state.camera);
  const lookAtTarget = useRef() as any;
  useEffect(() => {
    lookAtTarget.current = new THREE.Object3D();
    camera.add(lookAtTarget.current);
  }, [camera]);
  return (
    <group {...props}>
      {/* <Suspense> */}
      <primitive
        object={scene}
        rotation-y={avatar !== '3636451243928341470.vrm' ? Math.PI : 0}
      />
      {/* </Suspense> */}
    </group>
  );
};
export default Avatar;
