import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
const Character = ({ actionName, ...props }: any) => {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(
    '/models/game3/character.glb',
  ) as any;
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    if (actionName) {
      actions[actionName]?.reset().fadeIn(0.2).play();
    }
    return () => {
      actions[actionName]?.fadeOut(0.2);
    };
  }, [actionName]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="fall_guys">
          <skinnedMesh
            name="body"
            geometry={nodes.body.geometry}
            material={materials.Material}
            skeleton={nodes.body.skeleton}
          />
          <skinnedMesh
            name="eye"
            geometry={nodes.eye.geometry}
            material={materials.Material}
            skeleton={nodes.eye.skeleton}
          />
          <skinnedMesh
            name="hand-"
            geometry={nodes['hand-'].geometry}
            material={materials.Material}
            skeleton={nodes['hand-'].skeleton}
          />
          <skinnedMesh
            name="leg"
            geometry={nodes.leg.geometry}
            material={materials.Material}
            skeleton={nodes.leg.skeleton}
          />
          <primitive object={nodes._rootJoint} />
        </group>
      </group>
    </group>
  );
};
useGLTF.preload('/models/game3/character.glb');
export default Character;
