import { useAnimations, useGLTF } from '@react-three/drei';
import { useControls } from 'leva';
import { useEffect } from 'react';

const Fox = () => {
  const { scene, animations } = useGLTF('/models/Fox/glTF/Fox.gltf');
  const action = useAnimations(animations, scene);
  const { foxScale, playName } = useControls('控制狐狸', {
    playName: { options: action.names },
    foxScale: { value: 0.02, min: 0.01, max: 0.1 },
  });
  console.log(action);
  /*
   * 组件重新渲染时候清除动画，每次开始时重制
   */
  useEffect(() => {
    const currentAction = action.actions[playName];
    console.log(currentAction);

    currentAction?.reset().fadeIn(0.5).play();
    return () => {
      //重新渲染组件时淡出
      currentAction?.fadeOut(0.5);
    };
  }, [playName]);
  return <primitive position={[0, 0, 3]} scale={foxScale} object={scene} />;
};
useGLTF.preload('/models/Fox/glTF/Fox.gltf');
export default Fox;
