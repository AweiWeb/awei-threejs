import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

export function Character({name, ...props}: any) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF(
    '/models/game3/character.glb'
  ) as any;
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    console.log(actions, animations, 'renwu');
    actions[name]?.reset().fadeIn(0.3).play();
    return () => {
      actions[name]?.fadeOut(0.3);
    };
  }, [name]);
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
}

useGLTF.preload('/models/game3/character.glb');
