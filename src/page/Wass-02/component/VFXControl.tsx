import { button, folder, useControls } from 'leva';
import { useEffect } from 'react';

export const VFXControl = ({ onChange, onReStart, settings }: any) => {
  const {} = useControls('📦 构建 粒子发射器', {
    Restart: button(() => onReStart()),
  }) as any;
  const [{ ...vfxParams }, set] = useControls(() => ({
    '🪄 发射粒子参数': folder({
      duration: 4,
      loop: false,
      delay: 0,
      nbParticles: {
        value: 500,
        min: 100,
        max: 10000,
        step: 10,
      },
      spawnMode: {
        value: 'time',
        options: ['time', 'brust'],
      },
      startPositionMin: {
        value: [-1, -1, -1],
        min: -10,
        max: 10,
        step: 0.1,
      },
      startPositionMax: {
        value: [1, 1, 1],
        min: -10,
        max: 10,
        step: 0.1,
      },
      startRotationMin: {
        value: [0, 0, 0],
        min: -Math.PI * 2,
        max: Math.PI * 2,
        step: 0.1,
      },
      startRotationMax: {
        value: [0, 0, 0],
        min: -Math.PI * 2,
        max: Math.PI * 2,
        step: 0.1,
      },
    }),
    '🌬️ 粒子生命周期': folder({
      particleLifeTime: {
        value: [0.1, 1],
        min: 0,
        max: 10,
        step: 0.01,
      },
    }),
    '✨ 粒子参数': folder({
      size: {
        value: [0.1, 1],
        min: 0,
        max: 2,
        step: 0.01,
      },
      speed: {
        value: [1, 5],
        min: 0,
        max: 20,
        step: 0.1,
      },
      directionMin: {
        value: [-0.5, 0, -0.5],
        min: -1,
        max: 1,
        step: 0.01,
      },
      directionMax: {
        value: [0.5, 1, 0.5],
        min: -1,
        max: 1,
        step: 0.01,
      },
      rotationSpeedMin: {
        value: [4, 0, 4],
        min: 0,
        max: 10,
        step: 0.1,
      },
      rotationSpeedMax: {
        value: [4, 0, 4],
        min: 0,
        max: 10,
        step: 0.1,
      },
    }),
    '🎨 粒子颜色': folder({
      colorStart: '#50ff7c',
      colorEnd: '#ffffff',
    }),
  }));
  const buildSetting = {
    ...vfxParams,
    colorStart: [vfxParams.colorStart],
    colorEnd: [vfxParams.colorEnd],
  };
  // console.log(buildSetting);

  useEffect(() => {
    if (settings) {
      const builderSetting = {
        ...settings,
      };
      //解购数据，同步
      if (settings.colorStart.length > 0) {
        builderSetting['colorStart'] = settings.colorStart[0];
      }
      if (settings.colorEnd.length > 0) {
        builderSetting['colorEnd'] = settings.colorEnd[0];
      }
      // console.log(
      //   buildSetting,
      //   'chuandicanshu1',
      //   settings.colorStart[0],
      //   settings.colorEnd[0],
      //   buildSetting['colorEnd'],
      //   buildSetting['colorStart']
      // );
      set({ ...builderSetting });
      // console.log(set);
    }
  }, [settings]);

  onChange(buildSetting);
  return null;
};
