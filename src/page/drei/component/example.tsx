import { useRef } from 'react';
import {
  PivotControls,
  TransformControls,
  MeshReflectorMaterial,
  Text,
  Float,
} from '@react-three/drei';
const Example = () => {
  const boxRef = useRef<THREE.Mesh>(null!);
  const sphereRef = useRef<THREE.Mesh>(null!);
  return (
    <>
      <group>
        <PivotControls
          anchor={[0, 0, 0]}
          depthTest={false}
          lineWidth={2} 
          fixed={true}
          scale={100}
          axisColors={['#9381ff', '#ff4d6d', '#7ae582']}
        >
          <mesh ref={sphereRef} position={[1, 0, 0]}>
            <sphereGeometry />
            <meshStandardMaterial />
          </mesh>
        </PivotControls>

        <mesh ref={boxRef} position={[-2, 0, 0]}>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
        <TransformControls object={boxRef} />
        <mesh scale={10} rotation-x={-Math.PI * 0.5} position={-2}>
          <planeGeometry />
          <MeshReflectorMaterial
            color="yellowgreen"
            resolution={1024}
            mirror={0.5}
            mixBlur={1}
            blur={[1000, 1000]}
          />
        </mesh>
        <Float speed={5} floatIntensity={2}>
          <Text
            fontSize={1}
            color="salmon"
            font="/bangers-v20-latin-regular.woff"
            position={[-1, 2, 0]}
            textAlign="center"
            maxWidth={6}
          >
            web-three阿伟
          </Text>
        </Float>
      </group>
    </>
  );
};

export default Example;
