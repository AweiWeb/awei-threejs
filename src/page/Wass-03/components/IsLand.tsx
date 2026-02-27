import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

const Island = (props: any) => {
  const { nodes, materials } = useGLTF('/models/SkyIsland.glb') as any;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Launcher002.geometry}
        material={materials.PaletteMaterial001}
        position={[1.004, -0.001, 3.284]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Lights.geometry}
        material={materials.PaletteMaterial002}
        position={[-1.388, 1.999, -2.364]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Lights002.geometry}
        material={materials.PaletteMaterial003}
        position={[-2.35, 2.026, -1.839]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Island_Baked.geometry}
        material={materials['MergedBake_Baked.022']}
        position={[0, 0.494, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Table_Baked.geometry}
        material={materials['MergedBake_Baked.022']}
        position={[1.723, 0.235, 1.398]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Lantern005_Baked.geometry}
        material={materials.PaletteMaterial004}
        position={[-1.561, -0.268, 3.256]}
        rotation={[-2.848, -1.209, -2.744]}
      />
    </group>
  );
};

useGLTF.preload('/models/SkyIsland.glb');

export default Island;
