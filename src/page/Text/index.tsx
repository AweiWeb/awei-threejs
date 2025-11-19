import { Canvas } from '@react-three/fiber';
import TextExample from './components/text';
import { OrbitControls } from '@react-three/drei';
import { Perf } from 'r3f-perf';
const TextDebug = () => {
  const create = ({ gl, scene }: any) => {};
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true }}
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 100,
        position: [1, 2, 7],
      }}
      onCreated={create}
    >
      <Perf position="top-left" />
      <TextExample />
      <OrbitControls makeDefault />
    </Canvas>
  );
};

export default TextDebug;
