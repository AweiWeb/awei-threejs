import { useAnimations, useFBX, useGLTF } from '@react-three/drei';
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { useEffect, useMemo } from 'react';
import { loadMixamoAnimation } from './LoaderMixAnimation';
import { useControls } from 'leva';
import { useFrame } from '@react-three/fiber';
import { lerp } from 'three/src/math/MathUtils.js';
const Avatar = ({ avatar, ...props }: any) => {
  const { scene, userData } = useGLTF(
    `/models/${avatar}`,
    undefined,
    undefined,
    (loader) => {
      console.log(loader);
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
  console.log(scene, userData);
  // 拿到当前的模型
  const currentVrm = userData.vrm;
  console.log(currentVrm);

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
  console.log(currentVrm);

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
  useEffect(() => {
    if (animation === '') return;
    actions[animation]?.play();
    return () => {
      actions[animation]?.stop();
    };
  }, [animation, actions]);
  const lerpSetExpression = (name: any, value: any, lerpFactor: any) => {
    userData.vrm.expressionManager.setValue(
      name,
      lerp(userData.vrm.expressionManager.getValue(name), value, lerpFactor)
    );
  };
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
    // 表情管理
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
    userData.vrm.update(delta);
  });
  return (
    <group {...props}>
      <primitive
        object={scene}
        rotation-y={avatar !== '3636451243928341470.vrm' ? Math.PI : 0}
      />
    </group>
  );
};
export default Avatar;
