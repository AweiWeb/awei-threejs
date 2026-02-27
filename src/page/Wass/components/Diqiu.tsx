const Diqiu = () => {
  return (
    <>
      <mesh position={[0, -25, -20]}>
        <sphereGeometry args={[20, 64, 64]} />
        <meshPhysicalMaterial color="#191929" iridescence={0.3} />
      </mesh>
    </>
  );
};

export default Diqiu;
