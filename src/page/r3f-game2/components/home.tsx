import { Box, CameraControls, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Car from './Car';
import useCargame from '../store';
const Home = () => {
  const controls = useRef<CameraControls>(null!);
  const cameraRefen = useRef<any>();
  const amibientRef = useRef<THREE.Group>(null!);
  const { scene } = useGLTF('/models/game2/garage.glb');
  const shadowBias = -0.005;
  // 调整相机
  const viewport = useThree((state) => state.viewport);
  //   console.log(viewport);
  const carPlayer = useCargame((state: any) => state.car);
  console.log(carPlayer);

  const adjustCamera = () => {
    const CameraLookWidth = viewport.getCurrentViewport(
      cameraRefen.current,
      new THREE.Vector3(0, 0, 0)
    ).width;
    const factor = 10 / CameraLookWidth;
    controls.current.setLookAt(
      4.2 * factor,
      1.5 * factor,
      5 * factor,
      0,
      0.15,
      0
    );
  };
  useEffect(() => {
    adjustCamera();
  }, []);
  useEffect(() => {
    const resizeWidth = () => {
      //   console.log('调整');
      adjustCamera();
    };
    window.addEventListener('resize', resizeWidth);
    return () => {
      window.removeEventListener('resize', resizeWidth);
    };
  }, []);
  useEffect(() => {
    scene.traverse((item) => {
      if (item instanceof THREE.Mesh) {
        item.castShadow = true;
        item.receiveShadow = true;
      }
    });
  }, [scene]);

  //动态更新灯光位置
  useFrame((state, delta) => {
    const elapsedTime = state.clock.elapsedTime;
    amibientRef.current.position.x = Math.sin(elapsedTime * 0.5) * 2;
  });
  return (
    <>
      <directionalLight intensity={0.4} position={[6, 4, 6]} color={'white'} />
      <group scale={0.8}>
          <primitive object={scene} />
          <group position={[5.5, 0.5, -1.2]}>
            <pointLight intensity={3} decay={3} distance={15} color="#4124c9" />
            <Box scale={0.1} visible={false}>
              <meshBasicMaterial color="white" />
            </Box>
          </group>
          <group position={[-3, 3, -2]}>
            <pointLight color="#a5adff" intensity={3} decay={3} distance={6} />
            <Box scale={0.1} visible={false}>
              <meshBasicMaterial color="white" />
            </Box>
          </group>
        <group position={[0, 2.5, 0.5]} ref={amibientRef}>
          <pointLight
            intensity={0.9}
            distance={10}
            decay={2}
            castShadow
            color="orange"
            shadow-bias={shadowBias}
            shadow-mapSize={[1024, 1024]}
          />
          <Box scale={0.1} visible={false}>
            <meshBasicMaterial color="#f7d216" />
          </Box>
        </group>
        {/* 车与车的展示台 */}
        <group>
          <pointLight
            position-x={1}
            position-y={2}
            intensity={4}
            distance={3}
          />
          <group position-y={0.1}>
            <CarSelect player={carPlayer} />
          </group>
          <mesh position-y={0.05} scale={0.5} castShadow receiveShadow>
            <cylinderGeometry args={[2, 2, 0.2, 64]} />
            <meshStandardMaterial color="#8572af" />
          </mesh>
          <mesh rotation-x={-Math.PI * 0.5} position-y={0.01} receiveShadow>
            <circleGeometry args={[1.1, 64]} />
            <meshStandardMaterial
              color="pink"
              emissive={'pink'}
              emissiveIntensity={3}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>

      <perspectiveCamera ref={cameraRefen} position={[0, 1, 10]} />
      <CameraControls
        ref={controls}
        mouseButtons={{ left: 0, right: 0, wheel: 0, middle: 0 }}
        touches={{
          one: 0,
          two: 0,
          three: 0,
        }}
      />
    </>
  );
};

/*
 * 三段动画
 * 点击后开始缩小
 * 时间走到一半开始变大
 * 超过一时间就开始平滑过渡到新的车模型
 */
const TIME_COUNT = 600;
const CarSelect = ({ player }: any) => {
  const container = useRef<THREE.Group>(null!);
  const [carModel, setCarModel] = useState(() => useCargame.getState().car);
  const playAduio = useCargame((state: any) => state.playAduio);
  const startTIME = useRef(0);
  useFrame((state, delta) => {
    const currentTime = Date.now() - startTIME.current;
    if (currentTime < TIME_COUNT / 2) {
      container.current.rotation.y += 2 * (currentTime / TIME_COUNT / 2);
      // 模型动态缩小
      const scaleSmallFactor = 1 - currentTime / TIME_COUNT / 2;
      container.current.scale.x = scaleSmallFactor;
      container.current.scale.y = scaleSmallFactor;
      container.current.scale.z = scaleSmallFactor;
    } else if (currentTime < TIME_COUNT) {
      container.current.rotation.y += 4 * (1 - currentTime / TIME_COUNT);
      // 动态变大
      const scaleBigFactor = currentTime / TIME_COUNT;
      container.current.scale.x = scaleBigFactor;
      container.current.scale.y = scaleBigFactor;
      container.current.scale.z = scaleBigFactor;
    }
    if (currentTime > TIME_COUNT) {
      container.current.rotation.y = THREE.MathUtils.lerp(
        container.current.rotation.y,
        Math.PI * 2,
        0.1
      );
    }
  });
  console.log(carModel, '选择器');
  // 需要在渲染后监听
  useEffect(() => {
    if (player !== carModel) {
      startTIME.current = Date.now();
      console.log('改变');
      playAduio();
      setTimeout(() => {
        setCarModel(player);
        //准备变大开始换车
      }, TIME_COUNT / 2);
    }
  }, [player]);
  return (
    <group ref={container}>
      <Car scale={0.5} rotation-y={Math.PI} model={carModel} />
    </group>
  );
};

export default Home;
