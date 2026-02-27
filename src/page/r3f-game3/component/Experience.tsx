import { Environment, OrbitControls } from '@react-three/drei';
import Map from '@/page/r3f-game3/component/Map';
import Player from './Player';
import Cube from './Cube';
import { InstancedRigidBodies, Physics, RigidBody } from '@react-three/rapier';
import { Perf } from 'r3f-perf';
import { useControls } from 'leva';
import Sphere from './Sphere';
import { useEffect, useMemo } from 'react';
const Experience = () => {
  const { isdeBug } = useControls('性能调试', {
    isdeBug: false,
  });
  const { mapId } = useControls('地图', {
    mapId: { value: 0, options: [0, 1, 2, 3, 4] },
  });
  const { SphereCount, cubeCount } = useControls('基础刚体', {
    SphereCount: {
      value: 8,
      min: 1,
      max: 20,
      step: 1,
    },
    cubeCount: {
      value: 5,
      min: 1,
      max: 20,
      step: 1,
    },
  });
  useEffect(() => {
    return () => {
      instanceArr.splice(0);
    };
  }, [cubeCount]);
  useEffect(() => {
    return () => {
      sphereData.splice(0);
    };
  }, [SphereCount]);

  // cube数据
  const instanceArr = useMemo(() => {
    const s = Math.max(Math.random(), 0.3);

    const instance = [] as any;
    for (let i = 0; i < cubeCount; i++) {
      instance.push({
        key: `instance${i}`,
        position: [(Math.random() - 0.5) * 10, 3, (Math.random() - 0.5) * 10],
        scale: [s, s, s],
      });
    }
    return instance;
  }, [cubeCount]);
  // sphere数据
  const sphereData = useMemo(() => {
    const instacne = [] as any;
    const s = Math.max(Math.random(), 0.5);
    for (let i = 0; i < SphereCount; i++) {
      instacne.push({
        key: `sphere${i}`,
        position: [(Math.random() - 0.5) * 15, 3, (Math.random() - 0.5) * 15],
        scale: [s, s, s],
      });
    }
    return instacne;
  }, [SphereCount]);
  return (
    <>
      <Perf position="top-left" />
      <Environment files="/environmentMaps/0/2k.hdr" />
      <directionalLight
        castShadow
        shadow-mapSize={[1024, 1024]}
        position={[-15, 10, 15]}
        intensity={1.5}
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10]} />
      </directionalLight>
      <Physics debug={isdeBug} key={mapId} gravity={[0, -9.8, 0]}>
        <Player />
        <Map MapId={mapId} />
        <Cube />
        <Sphere />
        {/* 随机立方体尺寸 */}
        <InstancedRigidBodies
          type="dynamic"
          key={cubeCount}
          instances={instanceArr}
        >
          <instancedMesh
            castShadow
            receiveShadow
            args={[undefined, undefined, cubeCount]}
          >
            <boxGeometry />
            <meshStandardMaterial color="tomato" />
          </instancedMesh>
        </InstancedRigidBodies>
        {/* 随机球体尺寸 */}
        <InstancedRigidBodies
          type="dynamic"
          key={SphereCount}
          instances={sphereData}
          colliders="ball"
        >
          <instancedMesh
            castShadow
            receiveShadow
            args={[undefined, undefined, SphereCount]}
          >
            <sphereGeometry args={[0.3, 64, 64]} />
            <meshStandardMaterial color="orange" />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>

      <OrbitControls />
    </>
  );
};

export default Experience;
