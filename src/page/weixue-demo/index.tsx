import { OrbitControls, shaderMaterial } from '@react-three/drei';
import { Canvas, extend } from '@react-three/fiber';
import { useMemo, useState } from 'react';
import * as THREE from 'three';

const Weixue = () => {
  const [pointerArr, setPointerArr] = useState([]) as any;
  const geometry = useMemo(() => {
    const geometry = new THREE.BoxGeometry(1, 2, 1).toNonIndexed();
    const colors = [];
    const alphas = [];

    // BoxGeometry面顺序：0右 1左 2上 3下 4前 5后
    const faceConfig = [
      { color: new THREE.Color(0xff0000), alpha: 1.0 }, // 0: 右面
      { color: new THREE.Color(0xff0000), alpha: 1.0 }, // 1: 左面
      { color: new THREE.Color('pink'), alpha: 0.1 }, // 2: 上面 - 蓝色透明
      { color: new THREE.Color('pink'), alpha: 0.1 }, // 3: 下面 - 绿色透明
      { color: new THREE.Color(0xff0000), alpha: 1.0 }, // 4: 前面
      { color: new THREE.Color(0xff0000), alpha: 1.0 }, // 5: 后面
    ];

    for (let face = 0; face < 6; face++) {
      const config = faceConfig[face];
      for (let i = 0; i < 6; i++) {
        colors.push(config.color.r, config.color.g, config.color.b);
        alphas.push(config.alpha);
      }
    }

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute('alpha', new THREE.Float32BufferAttribute(alphas, 1));
    return geometry;
  }, []);

  // 但注意：即使这样设置，alpha属性默认不会被标准材质使用！
  // 需要自定义着色器才能使用顶点alpha

  return (
    <Canvas camera={{ position: [3, 3, 3] }}>
      <mesh
        geometry={geometry}
        onPointerDown={(e: any) => {
          console.log('点击的面索引:', Math.floor(e.faceIndex / 2)); // 每个面有2个三角形
          console.log(
            '实际面:',
            ['右', '左', '上', '下', '前', '后'][Math.floor(e.faceIndex / 2)],
          );

          setPointerArr((pre: any) => [
            ...pre,
            {
              id: Date.now(),
              position: e.point.toArray(),
            },
          ]);
        }}
      >
        {/* 注意：meshBasicMaterial不支持自定义alpha属性 */}
        <colorShader transparent={true} />
      </mesh>

      {pointerArr.map((point, index) => (
        <mesh key={index} position={point.position}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color="yellow" />
        </mesh>
      ))}

      <OrbitControls />
      <axesHelper args={[2]} />
    </Canvas>
  );
};

const ColorShader = shaderMaterial(
  { speed: 1 },
  `
  attribute float alpha;
  varying float vAlpha;
   void main(){
   vAlpha = alpha;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }
    `,
  `
  varying float vAlpha;
  void main(){
 gl_FragColor = vec4(1.0, 0.0, 0.0, vAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
    `,
);
extend({ ColorShader });
export default Weixue;
