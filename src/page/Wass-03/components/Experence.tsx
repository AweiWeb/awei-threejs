import { CameraControls, Float, OrbitControls, Stars } from '@react-three/drei';
import Island from './IsLand';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import VFXParticle from '@/page/Wass-02/component/VFX1';
import Fireworks from './Firework';
import { useEffect, useRef } from 'react';
import { useFireworks } from '../store/firework';
import GradientSky from './GradientSky';
import ClouldFire from './CloudFire';
/*
 * 创建粒子容器
 * 增加粒子发射器
 */
const Experience = () => {
  const control = useRef(null!) as any;
  const firework = useFireworks((state: any) => state.fireworks);
  useEffect(() => {
    control.current.setLookAt(0, 15, 10, 0, 25, 0);
    control.current.setLookAt(2, 5, 10, 4, 0, 0, true);
  }, []);

  useEffect(() => {
    if (firework.length) {
      control.current.setLookAt(0, 5, 20, 0, 5, 0, true);
    } else {
      control.current.setLookAt(2, 5, 10, 0, 0, 0, true);
    }
  }, [firework]);
  return (
    <>
      <CameraControls ref={control} />
      <ClouldFire />
      <GradientSky />
      <VFXParticle
        vfxName="awei"
        settings={{
          nbParticle: 100000,
          intensity: 1.5,
          fadeSize: [0.1, 0.9],
          gravity: [0, -9.8, 0],
          renderMode: 'bill',
        }}
      />
      <Stars count={500} />
      <color attach={'background'} args={['rgb(17, 21, 17)']} />
      <Float floatIntensity={2}>
        <Island />
      </Float>
      <Fireworks />
      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={1} mipmapBlur />
      </EffectComposer>
      <OrbitControls enableZoom={false} />
    </>
  );
};

export default Experience;
