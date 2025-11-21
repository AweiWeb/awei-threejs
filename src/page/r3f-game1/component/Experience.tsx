import {
  Environment,
  Gltf,
  OrbitControls,
  CameraControls,
} from '@react-three/drei';
import Avatar from './Avatar';
import { useControls } from 'leva';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
const Experience = () => {
  const { avatar } = useControls('人物角色', {
    avatar: {
      value: '3636451243928341470.vrm',
      options: [
        '262410318834873893.vrm',
        '3636451243928341470.vrm',
        '3859814441197244330.vrm',
        '8087383217573817818.vrm',
      ],
    },
  });
  return (
    <>
      {/* 环境光 */}
      <Environment files="/environmentMaps/0/2k.hdr" backgroundIntensity={1} />
      <directionalLight />
      <directionalLight />
      {/* 舞台和人物 */}
      <group position-y={-1.2}>
        <Avatar avatar={avatar} />
        <Gltf
          src="/models/sound-stage-final.glb"
          position-z={-1.4}
          position-x={-0.6}
          scale={0.7}
        />
      </group>
      {/* maxPolarAngle垂直最大旋转角度, maxAzimuthAngle 水平角度的限制 */}
      <CameraControls
        makeDefault
        maxDistance={20}
        minDistance={1}
        maxPolarAngle={Math.PI / 2}
        maxAzimuthAngle={Math.PI / 2}
        minAzimuthAngle={-Math.PI / 2}
      />
      {/* 后期处理 */}
      <EffectComposer>
        <Bloom intensity={0.7} mipmapBlur />
      </EffectComposer>
    </>
  );
};

export default Experience;
