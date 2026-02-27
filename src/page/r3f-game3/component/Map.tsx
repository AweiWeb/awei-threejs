import { useAnimations, useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
export const MapSelect = [
  {
    name: 'animal_crossing_map',
    scale: 20,
    position: [-15, -1, 10],
  },
  {
    name: 'castle_on_hills',
    scale: 3,
    position: [-6, -7, 0],
  },
  {
    name: 'city_scene_tokyo',
    scale: 0.72,
    position: [0, -1, -3.5],
  },
  {
    name: 'de_dust_2_with_real_light',
    scale: 0.3,
    position: [-5, -3, 13],
  },
  {
    name: 'medieval_fantasy_book',
    scale: 0.4,
    position: [-4, 0, -6],
  },
];
const GameMap = ({ MapId = 2, props }: any) => {
  const map = useRef(null);
  const { scene, animations } = useGLTF(
    `/models/game3/${MapSelect[MapId].name}.glb`
  );
  const { actions } = useAnimations(animations, map);
  useEffect(() => {
    console.log('切换地图');
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);
  useEffect(() => {
    //  存在动画就播放
    if (actions && animations.length > 0) {
      actions[animations[0].name]?.play();
    }
    console.log(actions);
  }, [actions]);
  return (
    <group>
      <RigidBody type="fixed" colliders="trimesh">
        <primitive
          object={scene}
          {...props}
          scale={MapSelect[MapId].scale}
          position={MapSelect[MapId].position}
          ref={map}
        />
      </RigidBody>
    </group>
  );
};
MapSelect.forEach((item) => {
  useGLTF.preload(`/models/game3/${item.name}.glb`);
});

export default GameMap;
