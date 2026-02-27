import { Canvas } from '@react-three/fiber';
import Experience from './components/Experience';
import { Leva } from 'leva';
import { Scroll, ScrollControls } from '@react-three/drei';
import UI from './components/UI';
const Wass01 = () => {
  return (
    <>
      <Leva collapsed={true} />
      <Canvas camera={{ fov: 45, position: [0, 3, 20] }}>
        <color attach="background" args={['#131017']} />
        <ScrollControls pages={4} damping={0.2}>
          <Experience />
          <Scroll html>
            <UI />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </>
  );
};

export default Wass01;
