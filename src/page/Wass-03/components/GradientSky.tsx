import { shaderMaterial } from '@react-three/drei';
import { extend, ReactThreeFiber } from '@react-three/fiber';
import { useControls } from 'leva';
import { BackSide, Color, DoubleSide } from 'three';

const GradientSky = () => {
  const { colorTop, colorMiddle, colorBottom, blendMiddle, blendIntensity } =
    useControls('天空', {
      colorTop: '#0e1c3e',
      colorMiddle: '#ffa200',
      colorBottom: '#160c2a',
      blendMiddle: {
        value: 0.3,
        min: 0,
        max: 2,
        step: 0.1,
      },
      blendIntensity: {
        value: 0.15,
        min: 0,
        max: 3,
        step: 0.1,
      },
    });
  return (
    <mesh>
      <sphereGeometry args={[40]} />
      <skyMaterial
        side={BackSide}
        depthWrite={false}
        colorTop={colorTop}
        colorMiddle={colorMiddle}
        colorBottom={colorBottom}
        blendMiddle={blendMiddle}
        blendIntensity={blendIntensity}
      />
    </mesh>
  );
};

const SkyMaterial = shaderMaterial(
  {
    colorTop: new Color('white'),
    colorMiddle: new Color('pink'),
    colorBottom: new Color('skyblue'),
    blendMiddle: 0.3,
    blendIntensity: 0.1,
  },
  `
  varying vec2 vUv;
  void main (){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
    `,
  `
  varying vec2 vUv;
  uniform vec3 colorTop;
  uniform vec3 colorMiddle;
  uniform vec3 colorBottom;
  uniform float blendMiddle;
  uniform float blendIntensity;
  void main (){
    vec3 mixTop = mix(colorMiddle, colorTop, smoothstep(0.498, 0.502, vUv.y));
    vec3 mixBottom = mix(colorMiddle, colorBottom, smoothstep(0.502, 0.498, vUv.y));
    vec3 mixedColor = mix(mixBottom, mixTop, smoothstep(0.45, 0.55, vUv.y));
    float blend = smoothstep(0.5-blendMiddle, 0.5, vUv.y)  * smoothstep(0.5 + blendMiddle, 0.5, vUv.y) * blendIntensity;
    vec3 finalColor = mix(mixedColor, colorMiddle, blend);
    gl_FragColor = vec4(finalColor, 1.0);
  }
    `,
);

declare module '@react-three/fiber' {
  interface ThreeElements {
    skyMaterial: ReactThreeFiber.Object3DNode<any, typeof SkyMaterial>;
  }
}
extend({ SkyMaterial });
export default GradientSky;
