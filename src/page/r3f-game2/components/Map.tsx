import { useGLTF } from '@react-three/drei';

const Map = () => {
  const { scene } = useGLTF('/models/game2/map_buildings.glb');
  return (
    <group>
      <primitive object={scene} />
      <mesh position-y={-0.05} rotation-x={Math.PI * 0.5}>
        <planeGeometry args={[18, 18]} />
        <meshBasicMaterial transparent={true} />
      </mesh>
    </group>
  );
};
useGLTF.preload('/models/game2/map_builfings.glb');
useGLTF.preload('/models/game2/map_road.glb');
export default Map;
