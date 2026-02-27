import { Instance, Instances, Stars, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { AdditiveBlending, DoubleSide, Color } from 'three';
import { lerp, randFloat, randFloatSpread } from 'three/src/math/MathUtils.js';

// 下雪粒子
useTexture.preload('/environmentMaps/particle/snow.png');
const SnowParticle = ({ snowCount = 1000 }) => {
  const texture = useTexture('/environmentMaps/particle/snow.png');
  const particleCount = useMemo(
    () =>
      Array.from({ length: snowCount }, () => ({
        position: [randFloat(-30, 30), randFloatSpread(20), randFloat(-30, 30)],
        size: randFloat(0.1, 0.5),
        rotation: [0, randFloat(0, Math.PI * 2), 0],
        lifeTime: randFloat(1, 6),
        speed: randFloat(0.1, 0.7),
      })),
    []
  );
  return (
    <>
      <Instances range={snowCount} limit={snowCount} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          blending={AdditiveBlending}
          side={DoubleSide}
          alphaMap={texture}
          depthWrite={false}
          transparent={true}
        />
        {particleCount.map((item, index) => (
          <Particle key={index} {...item} />
        ))}
      </Instances>
    </>
  );
};
const colorStart = new Color('pink').multiplyScalar(10);
const colorEnd = new Color('white').multiplyScalar(10);
const Particle = ({ position, size, rotation, lifeTime, speed }: any) => {
  const snowRef = useRef(null!) as any;
  const age = useRef(0);
  useFrame((state, delta) => {
    if (!snowRef.current) return;
    age.current += delta;
    /*
     * 做一个方法缩小的动画
     */
    const lifeTimeProgression = age.current / lifeTime;
    snowRef.current.scale.x =
      snowRef.current.scale.y =
      snowRef.current.scale.z =
        lifeTimeProgression < 0.5
          ? lerp(0, size, lifeTimeProgression)
          : lerp(size, 0, lifeTimeProgression);
    /*
     * 颜色过渡
     */
    snowRef.current.color.r = lerp(
      colorStart.r,
      colorEnd.r,
      lifeTimeProgression
    );
    snowRef.current.color.g = lerp(
      colorStart.g,
      colorEnd.g,
      lifeTimeProgression
    );
    snowRef.current.color.b = lerp(
      colorStart.b,
      colorEnd.b,
      lifeTimeProgression
    );
    /*
     * 设置下落动画
     */
    snowRef.current.position.y -= speed * delta;
    snowRef.current.position.x += Math.sin(age.current * speed) * delta;
    snowRef.current.position.z += Math.cos(age.current * speed) * delta;
    if (age.current > lifeTime) {
      snowRef.current.position.set(position[0], position[1], position[2]);
      age.current = 0;
    }
  });
  return (
    <Instance
      ref={snowRef}
      position={position}
      rotation={rotation}
      scale={size}
    />
  );
};

export default SnowParticle;
