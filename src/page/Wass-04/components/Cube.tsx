import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import useBuildWorld from '../store';
import { RepeatWrapping, SRGBColorSpace } from 'three';
import { useTexture } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';
import { useRef } from 'react';
const Cubes = () => {
  const floorTexture = useTexture(
    '/environmentMaps/world/worn_tile_floor_diff_4k.jpg',
  );
  floorTexture.colorSpace = SRGBColorSpace;
  floorTexture.repeat.set(1 / 4, 1 / 4);
  floorTexture.wrapS = floorTexture.wrapT = RepeatWrapping;
  const worldCubeArr = useBuildWorld((state: any) => state.worldCubeArr);
  console.log(worldCubeArr);
  return (
    <>
      {worldCubeArr.map((item: any) => {
        return (
          <Cube key={item.id} position={item.position} texture={floorTexture} />
        );
      })}
    </>
  );
};

const Cube = ({ position, texture, ...props }: any) => {
  const addCube = useBuildWorld((state: any) => state.addCube);
  const cubeRef = useRef<RapierRigidBody>(null!);
  const clickCube = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const { x, y, z } = cubeRef.current.translation() as any;
    const index = Math.floor(e.faceIndex! / 2);
    const addDir = [
      [x + 2, y, z],
      [x - 2, y, z],
      [x, y + 2, z],
      [x, y - 2, z],
      [x, y, z + 2],
      [x, y, z - 2],
    ]; /*
     *  点击立方体位置
     */
    addCube(addDir[index]);
  };
  return (
    <RigidBody position={position} type="fixed" ref={cubeRef}>
      <mesh onPointerDown={(e) => clickCube(e)}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </RigidBody>
  );
};

export default Cubes;
