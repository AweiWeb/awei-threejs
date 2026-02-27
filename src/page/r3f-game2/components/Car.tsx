import { Clone, useGLTF } from '@react-three/drei';
import { useEffect, forwardRef } from 'react';
import * as THREE from 'three';

export const CarUrl = [
  'taxi',
  'truck',
  'police',
  'ambulance',
  'delivery',
  'van',
  'suvLuxury',
  'firetruck',
  'tractor',
  'sedanSports',
];

const Car = forwardRef((props: any, ref) => {
  const { model = CarUrl[1], ...rest } = props;
  const { scene } = useGLTF(`/models/game2/cars/${model}.glb`);

  useEffect(() => {
    scene.traverse((car) => {
      if (car instanceof THREE.Mesh) {
        // 玻璃
        if (car.material.name === 'window') {
          car.material.transparent = true;
          car.material.opacity = 0.9;
        }

        // 车漆
        if (
          car.material.name.startsWith('paint') ||
          car.material.name === 'wheelInside'
        ) {
          car.material = new THREE.MeshStandardMaterial({
            color: car.material.color,
            roughness: 0.1,
            metalness: 0.5,
          });
        }

        // 车灯
        if (car.material.name.startsWith('light')) {
          car.material.emissive = car.material.color;
          car.material.emissiveIntensity = 2.5;
          car.material.toneMapped = false;
        }
      }
    });
  }, [scene]);

  return (
    <group ref={ref} {...rest}>
      <Clone object={scene} castShadow />
    </group>
  );
});

// 预加载所有模型
CarUrl.forEach((item) => {
  useGLTF.preload(`/models/game2/cars/${item}.glb`);
});

export default Car;
