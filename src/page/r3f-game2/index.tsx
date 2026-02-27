import { Canvas } from '@react-three/fiber';
import Experience from './components/Experience';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import UI from './components/UI';
import './styles/index.scss';
import { Leva, useControls } from 'leva';
import useCargame from './store';
import { Perf } from 'r3f-perf';
import { KeyboardControls } from '@react-three/drei';
/*
 * 1. 搭建 选择车模型主页场景
 * 2. 加载地图，包裹物理引擎
 * 3. 控制角色player视角 施加力 处理相机跟随
 * 4. 鼠标来控制当前移动的方向，键盘来移动位置
 */
const R3fGame2 = () => {
  const control = useControls('测试', {
    level: {
      value: 'select',
      options: ['select', 'operate'],
      onChange: (value) => {
        useCargame.getState().setGame(value);
      },
    },
  }) as any;
  const gameState = useCargame((state: any) => state.gameState);
  return (
    <div className="game2-rf3">
      <div className="game-canvas">
        <Leva />
        <KeyboardControls
          map={[
            { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
            { name: 'back', keys: ['ArrowDown', 'KeyS'] },
            { name: 'right', keys: ['ArrowRight', 'KeyD'] },
            { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
            { name: 'speedUp', keys: ['Shift'] },
          ]}
        >
          <Canvas
            dpr={[1.5, 2]}
            camera={{ fov: 45, near: 0.1, far: 100 }}
            gl={{ antialias: true }}
            shadows
          >
            <Perf position="top-left" />
            <color attach="background" args={['#333']} />
            <Experience />
            <EffectComposer>
              <Bloom luminanceThreshold={1} intensity={1.22} />
            </EffectComposer>
          </Canvas>
        </KeyboardControls>
      </div>
      {gameState === 'select' && <UI />}
    </div>
  );
};

export default R3fGame2;
