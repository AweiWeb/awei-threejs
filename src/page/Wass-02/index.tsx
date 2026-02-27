import { Canvas } from '@react-three/fiber';
import Experience from './component/Experience';
import { Perf } from 'r3f-perf';
const Wass02 = () => {
  return (
    <Canvas>
      <Perf position='top-left'/>
      <Experience />
    </Canvas>
  );
};

export default Wass02;
