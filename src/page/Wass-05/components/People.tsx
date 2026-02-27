import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
const People = ({...props}: any) => {
  const peopleRef = useRef(null!);
  const { scene, nodes, animations } = useGLTF(
    '/wass-05/models/Animated Wizard.glb',
  );
  // CharacterArmature|Run
  //  CharacterArmature|Idle
  const [animation, setAnimation] = useState('CharacterArmature|Idle');
  const { actions } = useAnimations(animations, peopleRef);
  console.log(nodes, animations);

  /*
   * 开启阴影
   */
  useEffect(() => {
    scene.traverse((item) => {
      if (item instanceof THREE.Mesh) {
        item.castShadow = true;
        item.receiveShadow = true;
      }
    });
  }, [scene]);
  /*
   * 处理动画
   */
  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.3).play();
    return () => {
      actions[animation]?.fadeOut(0.3);
    };
  }, [animation, actions]);
  return (
    <group {...props}>
      <primitive object={scene} ref={peopleRef} />
    </group>
  );
};

useGLTF.preload('/wass-05/models/Animated Wizard.glb');
export default People;
