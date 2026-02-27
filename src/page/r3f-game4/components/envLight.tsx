import { Box } from '@react-three/drei';

const EnvLight = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <group position={[0, 5, 0]}>
        <directionalLight intensity={2} />
        <Box scale={0.1} visible={false}>
          <meshBasicMaterial transparent={true} color="white" />
        </Box>
      </group>
      <group
        position={[
          -18.975020980834962, 2.4076802432537079, -14.575502395629883,
        ]}
      >
        <pointLight color="pink" intensity={12} />
        <Box scale={0.1} visible={false}>
          <meshBasicMaterial transparent={true} color="white" />
        </Box>
      </group>
    </>
  );
};

export default EnvLight;
