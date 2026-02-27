import { useAnimations, useFBX } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useEffect } from 'react';
import useTreatureGame from '../store';

const MouseBoss = () => {
  const playAduio = useTreatureGame((state: any) => state.playAduio);
  const nodes = useFBX('/models/Taunt.fbx');
  const { actions } = useAnimations(nodes.animations, nodes) as any;
  useEffect(() => {
    if (actions) {
      actions[nodes.animations[0].name].reset().fadeIn(0.3).play();
    }
    return () => {
      actions[nodes.animations[0].name].reset().fadeIn(0.3);
    };
  }, []);
  return (
    <RigidBody
      lockRotations
      lockTranslations
      position={[-18.975020980834962, 0.15, -16.575502395629883]}
    >
      <group
        onClick={() => {
          // 播放音频
          playAduio('laoshu');
        }}
      >
        <primitive scale={0.009} object={nodes} />
      </group>
    </RigidBody>
  );
};
useFBX.preload('/models/Taunt.fbx');
export default MouseBoss;
