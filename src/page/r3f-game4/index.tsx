import { Canvas } from '@react-three/fiber';
import Experience from './components/Experience';
import UIButton from './UI/components/UIButton';
import UIBeg from './UI/components/UIBeg';
import './styles/index.scss';
import * as THREE from 'three';
import useTreatureGame from './store';
import { useEffect } from 'react';
import { useControls } from 'leva';
const R3fGame4 = () => {
  const eluer = new THREE.Euler(Math.random(), Math.random(), 0);
  const quaternion = new THREE.Quaternion();
  quaternion.setFromEuler(eluer);
  const matrix = new THREE.Matrix4();
  matrix.makeRotationFromQuaternion(quaternion);
  matrix.setPosition(new THREE.Vector3(1, 1, 1));
  matrix.makeScale(2, 0, 0);

  console.log(matrix, quaternion);

  const { COUNT } = useControls('物品', {
    COUNT: {
      value: 10,
      min: 3,
      max: 15,
      step: 1,
    },
  });
  const { buttonState } = useTreatureGame() as any;
  const addForceBox = useTreatureGame((state: any) => state.addForceBox);
  const rotateThing = useTreatureGame((state: any) => state.rotateThing);
  const setupThing = useTreatureGame((state: any) => state.setupThing);
  const deletThing = useTreatureGame((state: any) => state.deletThing);
  const setupAduio = useTreatureGame((state: any) => state.setupAduio);
  // 初始化数据
  useEffect(() => {
    const box = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshNormalMaterial({
      transparent: true,
      opacity: 0.1,
    });
    for (let i = 0; i < COUNT; i++) {
      setupThing({
        position: [
          7 + Math.random() * 20,
          2 + Math.random() * 3,
          1 + Math.random() * 20,
        ],
        object: (
          <mesh
            scale={0.8}
            geometry={box}
            material={material}
            name={`${i}`}
            onPointerMove={(e) => {
              console.log('看到了', e);
            }}
            onClick={(e) => {
              //   rotateThing(e.object.name);
              //   console.log(e.object.name);
              //   deletThing(e.object.name);
              addForceBox(e.object.name);
            }}
          ></mesh>
        ),
        key: `ob${i}`,
        name: `treature${i}`,
        visible: true,
        isRotation: false,
        isForce: false,
      });
    }
  }, []);
  /*
   * 初始化音频数据
   */
  useEffect(() => {
    setupAduio();
  }, []);
  return (
    <div className="r3f-game4">
      <div className="canvas-box">
        <Canvas
          gl={{ antialias: true }}
          camera={{
            fov: 45,
            near: 0.1,
            far: 100,
            position: [1, 2, 3],
          }}
        >
          <Experience />
        </Canvas>
      </div>
      <UIButton />
      <UIBeg />
    </div>
  );
};

export default R3fGame4;
