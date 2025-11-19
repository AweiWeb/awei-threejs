import { Center, Text3D, useHelper, useMatcapTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
const tourGeometry = new THREE.TorusGeometry(1, 0.6, 32, 64);
const material = new THREE.MeshMatcapMaterial();
const TextExample = () => {
  const directionRef = useRef<THREE.DirectionalLight>(null!);
  const tourCount = useRef<any>([]);
  //   const [tourGeometry, setTourGeometry] = useState<any>(null!);
  //   const [material, setMaterial] = useState<any>(null!);
  //   useHelper(directionRef, THREE.DirectionalLightHelper, 1);
  const [matcapTexture] = useMatcapTexture('2F3747_6A7C9E_54637F_62748B', 256);
  console.log(matcapTexture);
  useEffect(() => {
    /*
     * 手动告知需要更新
     */
    matcapTexture.colorSpace = THREE.SRGBColorSpace;
    matcapTexture.needsUpdate = true;
    material.matcap = matcapTexture;
    material.needsUpdate = true;
  }, []);
  /*
   * 并且还可以使用group来拿到其children改变角度
   */
  useFrame((state, delta) => {
    for (let item of tourCount.current) {
      item.rotation.y += delta * 0.2;
    }
  });
  /*
   * 解决性能问题 大量几何体
   * 使用react来解决
   * 使用原生threejs来解决
   */
  return (
    <>
      {/* <torusGeometry ref={setTourGeometry} />
      <meshMatcapMaterial matcap={matcapTexture} ref={setMaterial} /> */}
      <color attach="background" args={['ivory']} />
      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        ref={directionRef}
        intensity={2}
        position={[1, 2, 3]}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-10, 10, 10, -10]}
          far={10}
        />
      </directionalLight>
      <Center>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={1}
          height={0.7}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          react-three
          <meshMatcapMaterial matcap={matcapTexture} />
        </Text3D>
      </Center>
      {[...Array(100)].map((value, index) => (
        <mesh
          key={index}
          ref={(element) => (tourCount.current[index] = element)}
          geometry={tourGeometry}
          material={material}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}
          scale={0.2 + Math.random() * 0.2}
          rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        />
      ))}
    </>
  );
};
export default TextExample;
