import { Cloud, Clouds } from '@react-three/drei';
import { useControls } from 'leva';
import { MeshBasicMaterial } from 'three';

const ClouldFire = () => {
  const { cloud1Color, cloud2Color, cloud3Color } = useControls('Clouds ☁️', {
    cloud1Color: '#54496c',
    cloud2Color: 'orange',
    cloud3Color: '#9d7796',
  });
  return (
    <>
      {/* <Clouds material={MeshBasicMaterial}>
        <Cloud
          position={[0, -5, 0]}
          scale={1}
          seed={1}
          color={cloud1Color}
          volume={8}
          fade={1000}
        />
        <Cloud
          position={[-8, 0, 8]}
          scale={2}
          seed={2}
          color={cloud2Color}
          volume={6}
          fade={100}
        />
        <Cloud
          position={[8, 0, 0]}
          scale={1}
          seed={5}
          color={cloud3Color}
          volume={12}
          fade={100}
        />
      </Clouds> */}
    </>
  );
};

export default ClouldFire;
