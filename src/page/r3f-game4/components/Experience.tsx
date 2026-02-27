import {
  Environment,
  KeyboardControls,
  OrbitControls,
  PointerLockControls,
  Sky,
  useGLTF,
} from '@react-three/drei';
import GameMap from './Map';
import FirstPlayer from './FirstViewPlayer';
import { Physics } from '@react-three/rapier';
import Thing from './Thing';
import { useEffect, useMemo } from 'react';
import { useControls } from 'leva';
import useTreatureGame from '../store';
import MouseBoss from './MouseBoss';
import FloorTable from './FloorTable';
import EnvLight from './envLight';
import SnowParticle from './SnowParticle';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
const modelSrc = ['cybtruck', 'macbook', 'saiche'];
const Experience = () => {
  const { COUNT } = useControls('物品', {
    COUNT: {
      value: 10,
      min: 3,
      max: 15,
      step: 1,
    },
  });
  const allThing = useTreatureGame((state: any) => state.allThing);
  const snow = useTreatureGame((state: any) => state.snow);
  console.log(snow, 'xuedalhd');

  return (
    <>
      <EnvLight />
      {/* <Sky /> */}
      {/* <Environment files="/environmentMaps/0/2k.hdr" /> */}
      <SnowParticle snowCount={snow} />
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
          { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
          { name: 'right', keys: ['ArrowRight', 'KeyD'] },
          { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
          { name: 'jump', keys: ['Space'] },
          { name: 'run', keys: ['Shift'] },
        ]}
      >
        {/* 
        1. 增加堆积宝物地点 
        2. 增加ui拾起交互
        3. 拾起后物体消失
        4. 射线检测
        5. 开始进入界面加载动画
        */}

        <Physics debug={false} gravity={[0, -9.8, 0]}>
          <MouseBoss />
          <FirstPlayer />
          <FloorTable />
          <GameMap />
          {/* 物品 */}
          {allThing.map((item: any) => {
            return (
              item.visible && (
                <Thing
                  position={item.position}
                  key={item.key}
                  name={item.name}
                  object={item.object}
                  isRotation={item.isRotation}
                  isForce={item.isForce}
                />
              )
            );
          })}
        </Physics>
      </KeyboardControls>
      {/* <OrbitControls /> */}
      <PointerLockControls />
      {/* 后期处理 */}
      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={1} />
      </EffectComposer>
    </>
  );
};

export default Experience;
