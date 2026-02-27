import { shaderMaterial } from '@react-three/drei';
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  DynamicCopyUsage,
  Euler,
  Matrix4,
  PlaneGeometry,
  Quaternion,
  Vector3,
} from 'three';
import { randFloat, randFloatSpread } from 'three/src/math/MathUtils.js';
import useVFXemit from '../store';

const VFXParticle = ({
  vfxName,
  settings = {},
  geometry,
  alphaMap, //自定义纹理
  ...props
}: any) => {
  /*
   * 引入状态控制器
   */
  const registerEmitter = useVFXemit((state: any) => state.registerEmitter);
  const unRegisterEmitter = useVFXemit((state: any) => state.unRegisterEmitter);

  const {
    nbParticle = 10000,
    intensity = 1,
    renderMode = 'mesh',
    fadeSize = [0, 0],
    gravity = [0, 0, 0],
  } = settings;
  // console.log(nbParticle, 'kedada');

  const particleMesh = useRef(null) as any;
  const pPosition = new Vector3();
  const pEuler = new Euler();
  const pRotation = new Quaternion();
  const pScale = new Vector3(1, 1, 1);
  const pMatrix = new Matrix4();
  const particleColor = new Color();
  const cursor = useRef(0);
  const lastCursor = useRef(0);
  const needsUpdate = useRef(false);
  /*
   * attribut
   */
  const [attributeArrays] = useState({
    instanceColor: new Float32Array(nbParticle * 3), //rgb
    instanceColorEnd: new Float32Array(nbParticle * 3),
    instanceSpeed: new Float32Array(nbParticle * 1),
    instanceDirection: new Float32Array(nbParticle * 3),
    instanceRotationSpeed: new Float32Array(nbParticle * 3),
    instanceLifeTime: new Float32Array(nbParticle * 2),
  }) as any;

  const onBeforeRender = () => {
    // console.log(1111);
    if (!particleMesh.current || !needsUpdate.current) {
      return;
    }

    const attributes = [
      particleMesh.current.instanceMatrix,
      particleMesh.current.geometry.getAttribute('instanceColor'),
      particleMesh.current.geometry.getAttribute('instanceColorEnd'),
      particleMesh.current.geometry.getAttribute('instanceSpeed'),
      particleMesh.current.geometry.getAttribute('instanceDirection'),
      particleMesh.current.geometry.getAttribute('instanceRotationSpeed'),
      particleMesh.current.geometry.getAttribute('instanceLifeTime'),
    ];
    /*
     * 💣 这里的clearUpdateRanges 方法只有three 173版本有，太老的版本没有
     */
    attributes.forEach((attribute) => {
      attribute.clearUpdateRanges();
      if (lastCursor.current > cursor.current) {
        attribute.addUpdateRange(0, cursor.current * attribute.itemSize);
        attribute.addUpdateRange(
          lastCursor.current * attribute.itemSize,
          nbParticle * attribute.itemSize -
            lastCursor.current * attribute.itemSize,
        );
      } else {
        attribute.addUpdateRange(
          lastCursor.current * attribute.itemSize,
          cursor.current * attribute.itemSize -
            lastCursor.current * attribute.itemSize,
        );
        attribute.needsUpdate = true;
      }
    });
    lastCursor.current = cursor.current;
    needsUpdate.current = false;
  };
  /*
   * 创建粒子数组
   */
  const emit = (count: number, setup: any) => {
    // console.log(count, 'diao用');

    /*
     * 这只粒子缓冲区
     */

    if (cursor.current >= nbParticle) {
      /*
       *如果每次调用emit函数，使用count来计数，每次都会覆盖掉i值，所以使用cursor记录
       */
      cursor.current = 0;
    }
    // console.log(cursor.current, '发射数量');

    /*
     *  🌟 接受发射的参数
     */

    // console.log('开始事件', setup());

    /*
     * 获取缓冲
     */
    const instanceColor =
      particleMesh.current.geometry.getAttribute('instanceColor');
    const instanceColorEnd =
      particleMesh.current.geometry.getAttribute('instanceColorEnd');
    const instanceSpeed =
      particleMesh.current.geometry.getAttribute('instanceSpeed');
    const instanceDirection =
      particleMesh.current.geometry.getAttribute('instanceDirection');
    const instanceRotationSpeed = particleMesh.current.geometry.getAttribute(
      'instanceRotationSpeed',
    );
    const instanceLifeTime =
      particleMesh.current.geometry.getAttribute('instanceLifeTime');

    for (let i = 0; i < count; i++) {
      /*
       * 每次发射都有自己的参数
       */
      const {
        postion,
        rotation,
        scale,
        direction,
        lifeTime,
        speed,
        rotationSpeed,
        colorStart,
        colorEnd,
      } = setup();
      particleColor.set(colorStart);
      instanceColor.set(
        [particleColor.r, particleColor.g, particleColor.b],
        cursor.current * 3,
      );
      /*
       * 最终颜色
       */
      particleColor.set(colorEnd);
      instanceColorEnd.set(
        [particleColor.r, particleColor.g, particleColor.b],
        cursor.current * 3,
      );
      /*
       * 生命时间 方向 速度 旋转速度
       */
      instanceSpeed.set([speed], cursor.current);
      instanceLifeTime.set(lifeTime, cursor.current * 2);
      instanceDirection.set(direction, cursor.current * 3);
      instanceRotationSpeed.set(rotationSpeed, cursor.current * 3);
      /*
       * 设置例子矩阵
       */
      pPosition.set(...postion);
      pEuler.set(...rotation);
      pScale.set(...scale);
      pRotation.setFromEuler(pEuler);
      // console.log(pRotation);

      pMatrix.compose(pPosition, pRotation, pScale);
      particleMesh.current.setMatrixAt(cursor.current, pMatrix);
      cursor.current++;
      cursor.current = cursor.current % nbParticle;
    }
    // particleMesh.current.instanceMatrix.needsUpdate = true;
    // instanceColor.needsUpdate = true;
    // instanceColorEnd.needsUpdate = true;
    // instanceSpeed.needsUpdate = true;
    // instanceDirection.needsUpdate = true;
    // instanceRotationSpeed.needsUpdate = true;
    // instanceLifeTime.needsUpdate = true;
    needsUpdate.current = true;
  };
  //注册发射器
  useEffect(() => {
    // emit(nbParticle);
    registerEmitter(vfxName, emit);
    return () => {
      unRegisterEmitter(vfxName);
      // console.log('zujianxidajklj2039190283');
    };
  }, []);
  useFrame(({ clock }, delta) => {
    if (!particleMesh.current) return;

    particleMesh.current.material.uniforms.uTime.value = clock.elapsedTime;
    particleMesh.current.material.uniforms.uIntensity.value = intensity;
    particleMesh.current.material.uniforms.uFadeSize.value = fadeSize;
    particleMesh.current.material.uniforms.uGravity.value = gravity;
    particleMesh.current.material.uniforms.alphaMap.value = alphaMap;
  });

  // console.log(new Vector3(1, 2, 3).length(), 'djadhak');

  const defaultGeometry = useMemo(() => new PlaneGeometry(0.5, 0.5), []);
  // console.log(geometry, 'dhjahdkajhdkahda');

  return (
    <>
      <instancedMesh
        args={[defaultGeometry, undefined, nbParticle]}
        ref={particleMesh}
        onBeforeRender={onBeforeRender}
      >
        {geometry}
        <vFXMaterialShader
          blending={AdditiveBlending}
          color="pink"
          defines={{
            MESH_MODE: renderMode === 'mesh',
            BILLBOARD_MODE: renderMode === 'bill',
            USE_APHLAMAP: !!alphaMap,
          }}
          transparent
          alphaMap={alphaMap}
          side={DoubleSide}
          depthWrite={false}
        />
        <instancedBufferAttribute
          attach={'geometry-attributes-instanceColor'}
          args={[attributeArrays.instanceColor, 3]}
          count={nbParticle}
          usage={DynamicCopyUsage}
        />
        <instancedBufferAttribute
          attach={'geometry-attributes-instanceColorEnd'}
          count={nbParticle}
          usage={DynamicCopyUsage}
          args={[attributeArrays.instanceColorEnd, 3]}
        />
        <instancedBufferAttribute
          attach={'geometry-attributes-instanceSpeed'}
          args={[attributeArrays.instanceSpeed, 1]}
          count={nbParticle}
          usage={DynamicCopyUsage}
        />
        <instancedBufferAttribute
          attach={'geometry-attributes-instanceDirection'}
          count={nbParticle}
          args={[attributeArrays.instanceDirection, 3]}
          usage={DynamicCopyUsage}
        />
        <instancedBufferAttribute
          attach={'geometry-attributes-instanceRotationSpeed'}
          args={[attributeArrays.instanceRotationSpeed, 3]}
          count={nbParticle}
          usage={DynamicCopyUsage}
        />
        <instancedBufferAttribute
          attach={'geometry-attributes-instanceLifeTime'}
          args={[attributeArrays.instanceLifeTime, 2]}
          count={nbParticle}
          usage={DynamicCopyUsage}
        />
      </instancedMesh>
    </>
  );
};

/*
 *粒子shader
 */
const VFXMaterialShader = shaderMaterial(
  {
    color: new Color('white'),
    uTime: 0,
    uIntensity: 1,
    uFadeSize: [0.1, 0.9], //淡出淡进
    uAphla: [0.5, 0.5], //透明度
    uGravity: [0, -10, 0], //重力
    alphaMap: null,
  },
  `
  vec3 billboard (vec2 v, mat4 view){
    vec3 up = vec3(view[0][1],view[1][1],view[2][1]);
    vec3 right = vec3(view[0][0],view[1][0],view[2][0]);
    vec3 p = right * v.x + up * v.y;
    return p;
  }
   varying vec2 vUv;
   varying vec3 vColor;
   varying vec3 vColorEnd;
   varying float vProgress;
   attribute vec3 instanceColor;
   attribute vec3 instanceColorEnd;
   attribute float instanceSpeed;
   attribute vec3 instanceDirection;
   attribute vec3 instanceRotationSpeed;
   attribute vec2 instanceLifeTime;
   uniform float uTime;
   uniform vec2 uFadeSize;
   uniform vec3 uGravity;

mat4 rotationX(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat4(
      1,  0,  0,  0,
      0,  c, -s,  0,
      0,  s,  c,  0,
      0,  0,  0,  1
  );
}

mat4 rotationY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat4(
       c,  0,  s,  0,
       0,  1,  0,  0,
      -s,  0,  c,  0,
       0,  0,  0,  1
  );
}

mat4 rotationZ(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat4(
      c, -s,  0,  0,
      s,  c,  0,  0,
      0,  0,  1,  0,
      0,  0,  0,  1
  );
}

    void main(){
    vUv = uv;
    float startTime = instanceLifeTime.x;
    float duration = instanceLifeTime.y;
    float age = uTime - startTime;
    vProgress = age / duration;
    if (vProgress < 0.0 || vProgress > 1.0) {
    gl_Position = vec4(vec3(9999.0), 1.0);
    return;
  };
    float scale = smoothstep(0.0, uFadeSize.x, vProgress) * smoothstep(1.01, uFadeSize.y, vProgress);
    vColor = instanceColor;
    vColorEnd = instanceColorEnd;
    vec3 rotationSpeed = instanceRotationSpeed * age;
    mat4 rotX = rotationX(rotationSpeed.x);
    mat4 rotY = rotationY(rotationSpeed.y);
    mat4 rotZ = rotationZ(rotationSpeed.z);
    mat4 rotationMatrix = rotZ * rotY * rotX;

    vec3 normalDirection = length(instanceDirection) > 0.0 ? normalize(instanceDirection) : vec3(0.0);
    vec3 gravity = 0.5 * (age * age) * uGravity;
    vec3 offset = normalDirection * age * instanceSpeed;
    offset += gravity;
    vec4 movPosition;
    #ifdef MESH_MODE
    vec4 startPosition = modelMatrix * instanceMatrix * rotationMatrix * vec4(position * scale, 1.0);
    vec3 instancePosition = startPosition.xyz;
    vec3 finalPosition = instancePosition + offset;
    movPosition = modelViewMatrix * vec4(finalPosition, 1.0);
    #endif
    #ifdef BILLBOARD_MODE
    vec4 localPos = vec4(position, 1.0);
    localPos.xyz = billboard(position.xy, viewMatrix) * scale;
    vec4 worldPo = modelMatrix * instanceMatrix * rotationMatrix * localPos;
    worldPo.xyz += offset;
    movPosition = modelViewMatrix * worldPo;
    #endif
     gl_Position = projectionMatrix * movPosition;
    }
    `,
  `
  uniform float uIntensity;
  uniform vec3 color;
  uniform sampler2D alphaMap;
   varying vec3 vColor;
   varying vec2 vUv;
   varying vec3 vColorEnd;
   varying float vProgress;
   uniform vec2 uAphla;
   void main(){
    if (vProgress < 0.0 || vProgress > 1.0) {
    discard;
  }
     float aphla = smoothstep(0.0, uAphla.x, vProgress) * smoothstep(1.01, uAphla.y, vProgress);
     vec3 finalColor = mix(vColor, vColorEnd, vProgress);
     finalColor *= uIntensity;
     #ifdef USE_APHLAMAP
     vec2 uv = vUv;
     vec4 textrure = texture2D(alphaMap, uv);
     gl_FragColor = vec4(finalColor, aphla * textrure.a);
     #else
     gl_FragColor = vec4(finalColor, aphla);
     #endif
     }
    `,
);

extend({ VFXMaterialShader });
declare module '@react-three/fiber' {
  interface ThreeElements {
    vFXMaterialShader: ReactThreeFiber.Object3DNode<
      any,
      typeof VFXMaterialShader
    >;
  }
}
export default VFXParticle;
