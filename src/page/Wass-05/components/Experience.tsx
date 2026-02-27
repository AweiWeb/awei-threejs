import { CameraControls, OrbitControls } from '@react-three/drei';
import Magic from './Magic';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
const Experence = () => {
  return (
    <>
      <fog attach="fog" args={['#574f5e', 10, 20]} />
      <directionalLight
        intensity={2}
        castShadow
        position={[1.5, 5, -5]}
        shadow-mapSize-width={128}
        shadow-mapSize-heigth={128}
      />
      <Magic />
      <EffectComposer>
        <Bloom intensity={1} luminanceThreshold={1} />
      </EffectComposer>
      <OrbitControls enabled={false} />
    </>
  );
};

export default Experence;
