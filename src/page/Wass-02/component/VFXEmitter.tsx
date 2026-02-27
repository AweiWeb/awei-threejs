import {
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useState,
  useMemo,
} from 'react';
import useVFXemit from '../store';
import { Object3DProps, useFrame } from '@react-three/fiber';
import { Vector3, Euler, Quaternion, Object3D } from 'three';
import { randFloat } from 'three/src/math/MathUtils.js';
import { VFXControl } from './VFXControl';
const worldPosition = new Vector3();
const worldEuler = new Euler();
const worldQuaternion = new Quaternion();
const worldRotation = new Euler();
const worldScale = new Vector3();
const VFXEmitter = forwardRef(
  ({ emitter, debug, settings = {}, ...props }: any, forwardedRef) => {
    const emit = useVFXemit((state: any) => state.emit);
    const emitterRef = useRef<Object3DProps | any>(null);
    const emited = useRef(0);
    const elsapTime = useRef(0);
    useImperativeHandle(forwardedRef, () => emitterRef.current);
    /*
     * 获取世界坐标用的参数
     */
    // const {
    //   duration = 4, //几次发射完
    //   nbParticles = 500,
    //   spawnMode = 'time',
    //   loop = false,
    //   delay = 0,
    //   size,
    //   colorStart,
    //   colorEnd,
    //   speed = [1, 5],
    //   directionMin,
    //   directionMax,
    //   particleLifeTime = [0.1, 1],
    //   startRotationMin,
    //   startRotationMax,
    //   rotationSpeedMin,
    //   rotationSpeedMax,
    //   startPositionMin,
    //   startPositionMax,
    // } = settings;
    const [
      {
        duration = 1, //几次发射完
        nbParticles = 500,
        spawnMode = 'time',
        loop = false,
        delay = 0,
        size,
        colorStart,
        colorEnd,
        speed = [1, 5],
        directionMin,
        directionMax,
        particleLifeTime = [0.1, 1],
        startRotationMin,
        startRotationMax,
        rotationSpeedMin,
        rotationSpeedMax,
        startPositionMin,
        startPositionMax,
      },
      setSettings,
    ] = useState(settings);
    // console.log(settings);
    useFrame(({ clock }, delta) => {
      const time = clock.getElapsedTime();

      if (emited.current < nbParticles || loop) {
        console.log('我还在执行');

        if (!emitterRef) {
          return;
        }
        /*
         * ⚠️注意这里是关键点，来控制是否直接发射这么多的粒子
         * duration 代表分为几次发射
         * delay 代表延迟多久发射
         * 每一帧发射多少个 duration
         */
        const particlesToemit =
          spawnMode === 'brust'
            ? nbParticles
            : Math.max(
                0,
                Math.floor(
                  ((elsapTime.current - delay) / duration) * nbParticles,
                ),
              );
        // console.log(particlesToemit, 'lizishuliang');

        const rate = particlesToemit - emited.current;
        if (rate > 0 && elsapTime.current >= delay) {
          /*
           * 修改发射的数据
           */
          emit(emitter, rate, () => {
            /*
             * 计算世界坐标
             */
            emitterRef.current.updateWorldMatrix(true);
            const worldMatrix = emitterRef.current.matrixWorld;
            /*
             * 分解世界矩阵
             */
            worldMatrix.decompose(worldPosition, worldQuaternion, worldScale);
            worldEuler.setFromQuaternion(worldQuaternion); //旋转可以用欧拉，但是最好不用
            worldRotation.setFromQuaternion(worldQuaternion);
            // console.log(emitterRef.current.position, '发射的位置');

            const randSize = randFloat(size[0], size[1]); //xyz等比缩放
            return {
              postion: [
                worldPosition.x +
                  randFloat(startPositionMin[0], startPositionMax[0]),
                worldPosition.y +
                  randFloat(startPositionMin[1], startPositionMax[1]),
                worldPosition.z +
                  randFloat(startPositionMin[2], startPositionMax[2]),
              ],
              rotation: [
                worldRotation.x +
                  randFloat(startRotationMin[0], startRotationMax[0]),
                worldRotation.y +
                  randFloat(startRotationMin[1], startRotationMax[1]),
                worldRotation.z +
                  randFloat(startRotationMin[2], startRotationMax[2]),
              ],
              scale: [randSize, randSize, randSize],
              direction: [
                randFloat(directionMin[0], directionMax[0]),
                randFloat(directionMin[1], directionMax[1]),
                randFloat(directionMin[2], directionMax[2]),
              ],
              lifeTime: [
                time - delta,
                randFloat(particleLifeTime[0], particleLifeTime[1]),
              ],
              rotationSpeed: [
                randFloat(rotationSpeedMin[0], rotationSpeedMax[0]),
                randFloat(rotationSpeedMin[1], rotationSpeedMax[1]),
                randFloat(rotationSpeedMin[2], rotationSpeedMax[2]),
              ],
              speed: [randFloat(speed[0], speed[1])],
              colorStart: colorStart[0],
              colorEnd: colorEnd[0],
            };
          });
          emited.current += rate;
        }
      }
      elsapTime.current += delta;
    });
    const onRestart = useCallback(() => {
      emited.current = 0;
      elsapTime.current = 0;
    }, []);
    /*
     * 设置的参数
     */
    const settingBuild = useMemo(() => {
      return (
        <VFXControl
          settings={settings}
          onChange={setSettings}
          onReStart={onRestart}
        />
      );
    }, [debug]);
    return (
      <>
        {debug && settingBuild}
        <object3D {...props} ref={emitterRef} />
      </>
    );
  },
);

export default VFXEmitter;
