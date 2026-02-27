import { Bloom, EffectComposer, Noise } from '@react-three/postprocessing';
import Cursor from './Cursor';
import SateLlite from './Satellite';
import Diqiu from './Diqiu';
import Light from './allLight';
import { AdditiveBlending } from 'three';
import { Center, Float, Gltf, Scroll, Text3D } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useControls } from 'leva';
const Experience = () => {
  const viewport = useThree((state) => state.viewport);
  const { trailCount } = useControls('卫星数量', {
    trailCount: {
      value: 45,
      min: 10,
      max: 100,
      step: 1,
    },
  });
  const { carSize, carTextIntensity, carTextColor, carTextSize, carPositionY } =
    useControls('汽车参数', {
      carSize: {
        value: 1.8,
        min: 0.5,
        max: 5,
        step: 0.1,
      },
      carTextIntensity: {
        value: 8,
        min: 2,
        max: 12,
        step: 0.1,
      },
      carTextColor: '#457b9d',
      carTextSize: {
        value: 2,
        min: 0.5,
        max: 5,
        step: 0.1,
      },
      carPositionY: {
        value: 3,
        min: -5,
        max: 8,
        step: 0.1,
      },
    });
  return (
    <>
      <Scroll>
        <SateLlite countTrails={trailCount} />
        <Float
          rotationIntensity={1}
          floatIntensity={2}
          speed={4}
          position-y={-viewport.height}
        >
          <Text3D
            position={[-5, carPositionY, 0]}
            size={2}
            scale={1}
            font="/fonts/helvetiker_regular.typeface.json"
          >
            My Car!
            <meshStandardMaterial
              color={carTextColor}
              emissive={carTextColor}
              emissiveIntensity={carTextIntensity}
            />
          </Text3D>
          <Gltf src="/models/saiche.gltf" scale={carSize} />
        </Float>
        <Float
          rotationIntensity={1}
          floatIntensity={2}
          speed={4}
          position-y={-viewport.height * 2}
        >
          <Text3D
            position={[-5, 0, 0]}
            size={carTextSize}
            font="/fonts/helvetiker_regular.typeface.json"
          >
            My Future!
            <meshNormalMaterial />
          </Text3D>
        </Float>
      </Scroll>
      <Cursor />
      <Diqiu />
      <Light />
      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={1.2} />
        <Noise blendFunction={AdditiveBlending} opacity={0.03} />
      </EffectComposer>
    </>
  );
};

export default Experience;
