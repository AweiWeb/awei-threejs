import { useRef } from 'react';
import { useControls, button } from 'leva';
import { Perf } from 'r3f-perf';
import * as THREE from 'three';
import {
  AccumulativeShadows,
  SoftShadows,
  useHelper,
  RandomizedLight,
  ContactShadows,
  Environment,
  Stage,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
const Debug = () => {
  const boxRef = useRef<THREE.Mesh>(null!);
  const sphereRef = useRef<THREE.Mesh>(null!);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null!);
  const { positions, color, sphereVisible } = useControls('圆', {
    positions: {
      value: { x: -1, y: 0 },
      step: 0.1,
      joystick: 'invertY',
    },
    color: '#fff000',
    sphereVisible: true,
  });
  const { BoxPosition, boxColor, boxVisible } = useControls('正方体', {
    BoxPosition: {
      value: { x: 1.5, y: 0 },
      step: 0.1,
      joystick: 'invertY',
    },
    boxColor: '#ff0000',
    boxVisible: true,
  });
  const { perfVisible } = useControls('gpu面板', {
    perfVisible: true,
  });
  // useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1);
  useFrame((state, delta) => {
    boxRef.current.rotation.y += delta;
  });
  // 控制柔和阴影参数
  const { shaowSize, shaowSample, shaowFocus } = useControls('柔和阴影', {
    shaowSize: {
      value: 10,
      min: 0,
      max: 100,
    },
    shaowSample: {
      value: 10,
      min: 0,
      max: 100,
    },
    shaowFocus: {
      value: 0.5,
      min: 0,
      max: 1,
    },
  });
  const { envGroundHeight, envGroundRadius, envGroundScale, envMapIntensity } =
    useControls('环境贴图', {
      envMapIntensity: { value: 0.2, min: 0, max: 12 },
      envGroundHeight: { value: 10, min: 0, max: 100 },
      envGroundRadius: { value: 10, min: 0, max: 100 },
      envGroundScale: { value: 100, min: 0, max: 1000 },
    });
  const { stageInstenity, shadowOpacity, shadowBlur } = useControls(
    '调试影棚',
    {
      stageInstenity: { value: 2, min: 0, max: 10 },
      shadowOpacity: { value: 0.8, min: 0, max: 1 },
      shadowBlur: { value: 3, min: 0, max: 10 },
    }
  );
  return (
    <>
      {/* 给父级添加了背景颜色 */}
      <color args={['skyblue']} attach="background" />
      {/* 柔和阴影 */}
      {/* <SoftShadows size={shaowSize} focus={shaowFocus} samples={shaowSample} /> */}
      {/* 累积阴影 */}
      {/* <AccumulativeShadows
        opacity={0.8}
        scale={10}
        frames={Infinity} //累计帧数
        position={[0, -0.99, 0]}
        temporal
        blend={100} //控制刷新频率
      >
        <RandomizedLight //随机灯光
          ambient={0.5}
          amount={8} //灯光数量
          castShadow
          intensity={2}
          position={[1, 2, 3]}
          bias={0.001}
          radius={1}
        />
      </AccumulativeShadows> */}
      {/* 接触阴影 */}
      {/* <Environment background preset="apartment" /> */}
      {/* <Environment
        background
        resolution={32}
        files={[
          '/environmentMaps/0/px.png',
          '/environmentMaps/0/nx.png',
          '/environmentMaps/0/py.png',
          '/environmentMaps/0/ny.png',
          '/environmentMaps/0/pz.png',
          '/environmentMaps/0/nz.png',
        ]}
      /> */}
      {/* <Environment
        background
        files={['/environmentMaps/0/2k.hdr']}
        backgroundBlurriness={0}
        environmentIntensity={1}
        ground={{
          height: envGroundHeight,
          radius: envGroundRadius,
          scale: envGroundScale,
        }}
      /> */}
      {/* 自定义发光环境光 */}
      {/* <Environment background backgroundIntensity={1}>
        <color attach="background" args={['black']} />
        <mesh scale={10} position-z={-3}>
          <planeGeometry />
          <meshBasicMaterial color="red" side={THREE.DoubleSide} />
        </mesh>
      </Environment> */}
      {/* 快速创建一个模版State */}
      {/* <ContactShadows
        position={[0, -0.99, 0]}
        resolution={512}
        scale={10}
        far={10}
        color={color}
        opacity={0.8}
        blur={1}
        frames={Infinity}
      /> */}
      <ambientLight intensity={0.5} />
      {/* <directionalLight
        castShadow
        ref={directionalLightRef}
        shadow-mapSize={[1024, 1024]}
        intensity={2}
        position={[1, 2, 3]}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-10, 10, 10, -10]}
          far={10}
        />
      </directionalLight> */}
      {perfVisible && <Perf position="top-left" />}
      {/* <group>
        <mesh
          castShadow
          visible={sphereVisible}
          ref={sphereRef}
          position={[positions.x, positions.y, 0]}
        >
          <sphereGeometry />
          <meshStandardMaterial
            envMapIntensity={envMapIntensity}
            color={color}
          />
        </mesh>

        <mesh
          castShadow
          visible={boxVisible}
          ref={boxRef}
          position={[BoxPosition.x, BoxPosition.y, 0]}
          scale={1.5}
        >
          <boxGeometry />
          <meshStandardMaterial
            envMapIntensity={envMapIntensity}
            color={boxColor}
          />
        </mesh>
        <mesh position-y={-1} scale={10} rotation-x={-Math.PI * 0.5}>
          <planeGeometry />
          <meshStandardMaterial
            envMapIntensity={envMapIntensity}
            color="yellowgreen"
          />
        </mesh>
      </group>  */}
      <Stage
        environment="sunset"
        preset="portrait"
        intensity={stageInstenity}
        shadows={{
          type: 'accumulative',
          intensity: 1,
          blur: shadowBlur,
          opacity: shadowOpacity,
          frames: Infinity,
          blend: 100,
        }}
      >
        <mesh ref={sphereRef} position-x={2} castShadow>
          <sphereGeometry />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh scale={1.5} ref={boxRef} position-x={-2} castShadow>
          <boxGeometry />
          <meshStandardMaterial color={'mediumpurple'} />
        </mesh>
      </Stage>
    </>
  );
};

export default Debug;
