import { useFrame } from '@react-three/fiber';
import { Leva } from 'leva';
import {
  Bloom,
  EffectComposer,
  Glitch,
  Vignette,
  Noise,
  DepthOfField,
  ToneMapping,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useRef } from 'react';
import Drunk from './Effect';
import { useControls } from 'leva';

const Home = () => {
  const cubeRef = useRef<THREE.Mesh>(null!);
  const drunkProp = useControls('着色器', {
    frequery: { value: 2, min: 1, max: 20 },
    amplitude: { value: 0.1, min: 0, max: 1 },
  });
  const DrunkRef = useRef<any>(null!);
  useFrame((state, delta) => {
    cubeRef.current.rotation.y += delta * 0.5;
  });
  return (
    <>
      <color attach="background" args={['#ffffff']} />
      <EffectComposer disableNormalPass>
        {/* 黑色屏幕边框 */}
        {/* <Vignette offset={0.5} darkness={0.5} /> */}
        {/* 故障 */}
        {/* <Glitch delay={[0.5, 1.5]} duration={[0.1, 1]} strength={[0.3, 1]} /> */}
        {/* 颗粒 premultiply表示是否与渲染的颜色相乘*/}
        {/* <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} /> */}
        {/* 物体自发光 */}
        {/* <Bloom intensity={1} mipmapBlur luminanceThreshold={0.9} /> */}
        {/* 视觉模糊 */}
        {/* <DepthOfField
          focalLength={0.025}
          focusDistance={0.025}
          bokehScale={10}
        /> */}
        <Drunk {...drunkProp} />
        {/* <ToneMapping /> */}
      </EffectComposer>
      <directionalLight
        position={[1, 2, 3]}
        intensity={2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera args={[-10, 10, 10, -10]} near={0.1} far={10} />
      </directionalLight>
      <mesh ref={cubeRef} scale={1.5} position={[-2, 1, 0]} castShadow>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      {/*  meshStandardMaterial材质 使用envMapIntensity 来控制发光强度  emissive 发光颜色*/}
      {/* <mesh scale={1.5} position={[-2, 1, 0]} castShadow>
        <boxGeometry />
        <meshStandardMaterial
          emissive="mediumpurple"
          envMapIntensity={10}
          toneMapped={false}
        />
      </mesh> */}
      {/* 基础材质 使用 color来控制发光颜色 ，color的三个参数为 rgb 必须设置toneMapped */}
      {/* <mesh scale={1.5} position={[-2, 1, 0]} castShadow>
        <boxGeometry />
        <meshBasicMaterial color={[2, 1, 7]} toneMapped={false} />
      </mesh> */}
      <mesh position={[2, 1, 0]} castShadow>
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
      <mesh receiveShadow rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="yellowgreen" />
      </mesh>
    </>
  );
};

export default Home;
