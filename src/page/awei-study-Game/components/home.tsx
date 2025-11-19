import { Physics } from '@react-three/rapier';
import { OrbitControls } from '@react-three/drei';
import Level from './Level';
import Light from './Light';
import Player from './Player';
import { Leva, useControls } from 'leva';
import { Perf } from 'r3f-perf';
import useGameStore from '../store/useGameStore';
const Home = () => {
  const { debugVisible } = useControls('物理网格显示', {
    debugVisible: false,
  });
  const obstacleCount = useGameStore((state: any) => state.obstacleCount);
  return (
    <>
      <Perf position="top-left" />
      <color attach="background" args={['#bdedfc']} />
      <Physics debug={debugVisible}>
        <Light />
        <Level count={obstacleCount} />
        <Player />
      </Physics>
      {/* <OrbitControls /> */}
    </>
  );
};

export default Home;
