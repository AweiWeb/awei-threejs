import { useAnimations, useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useEffect, useRef } from 'react';

const GameMap = () => {
  const gameMa = useRef(null!);
  const { scene, animations } = useGLTF(
    '/models/game3/medieval_fantasy_book.glb'
  );
  const { actions } = useAnimations(animations, gameMa);

  /*
   * 处理阴影
   */
  useEffect(() => {}, []);
  useEffect(() => {
    if (actions && animations.length > 0) {
      actions[animations[0].name]?.play();
    }
  }, [actions]);
  return (
    <>
      <RigidBody colliders="trimesh" type="fixed">
        <primitive ref={gameMa} object={scene} />
      </RigidBody>
    </>
  );
};
useGLTF.preload('/models/game3/medieval_fantasy_book.glb');
export default GameMap;
