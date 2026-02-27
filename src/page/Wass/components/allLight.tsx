import { Box } from '@react-three/drei';

const Light = () => {
  return (
    <>
      <ambientLight intensity={7} />
      <directionalLight
        position={[-20, 20, -20]}
        intensity={4}
        color={'#e4c64e'}
      />
      <pointLight
        distance={10}
        position={[-1, 1, 1]}
        intensity={14}
        color="red"
      />
      <pointLight
        position-z={-5}
        position-x={1}
        position-y={1}
        intensity={10}
        distance={12}
        color="blue"
      />
    </>
  );
};

export default Light;
