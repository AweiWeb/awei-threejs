import { Sky } from '@react-three/drei';
import { useControls } from 'leva';

const Environment = () => {
  const { skyPositionX, skyPositionY, skyPositionZ } = useControls('日光', {
    skyPositionX: { value: 1, min: -100, max: 100 },
    skyPositionY: { value: 5, min: -100, max: 100 },
    skyPositionZ: { value: 6, min: -100, max: 100 },
  });
  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[skyPositionX, skyPositionY, skyPositionZ]}
        inclination={1} 
        mieCoefficient={0.0001} //大气颗粒越大空气🈷️浑浊
        turbidity={10} //大气浑浊度
      />
      <directionalLight
        castShadow
        intensity={2}
        position={[skyPositionX, skyPositionY, skyPositionZ]}
        shadow-mapSize={[1024, 1024]}
        shadow-normalBias={0.2}
      >
        <orthographicCamera args={[-10, 10, 10, -10]} near={0.1} far={100} />
      </directionalLight>
    </>
  );
};

export default Environment;
