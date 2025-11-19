import { Environment } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const Light = () => {
  /*
   * 解决灯光照射不全问题
   */
  const lightRef = useRef<THREE.DirectionalLight>(null!);
  //动态移动灯光
  useFrame((state) => {
    // console.log(lightRef);
    lightRef.current.position.z = state.camera.position.z + 1;
    lightRef.current.target.position.z = state.camera.position.z - 1;
    //更新target世界矩阵才可以跟着改变
    lightRef.current.target.updateMatrixWorld();
  });
  return (
    <>
      <Environment files="/environmentMaps/0/2k.hdr" backgroundIntensity={2} />
      <directionalLight
        ref={lightRef}
        castShadow
        shadow-mapSize={[1024, 1024]}
        intensity={2}
        position={[4, 4, 1]}
      >
        <orthographicCamera args={[-10, 10, 10, -10]} near={0.1} far={10} />
      </directionalLight>
      <ambientLight intensity={0.5} />
    </>
  );
};

export default Light;
