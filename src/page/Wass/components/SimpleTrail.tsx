import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame, ReactThreeFiber } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const SimpleTrail = ({
  target = null,
  numPoints = 20,
  color = '#ffffff',
  height = 0.4,
  minDistance = 0.1,
  opacity = 0.5,
  duration = 20, //过渡时间
}: any) => {
  const trailRef = useRef(null!) as THREE.Mesh | any;
  const lasetUnshiftTime = useRef(Date.now());
  const positions = useRef(
    new Array(numPoints).fill(new THREE.Vector3(0, 0, 0))
  );

  useFrame(() => {
    /*
     * 处理跟随target
     */
    if (!trailRef.current || !target.current) return;
    const curPoint = target.current.position;
    const lastPoint = positions.current[0];
    const distanceToLastPoint = lastPoint.distanceTo(curPoint);
    if (distanceToLastPoint < minDistance) {
      // 这里就是收尾的效果，如果不移动就是直接默认lastPoint
      if (Date.now() - lasetUnshiftTime.current > duration) {
        positions.current.unshift(lastPoint);
        positions.current.pop();
        lasetUnshiftTime.current = Date.now();
      }
      /*
       * 处理时间过渡效果
       */
    } else {
      positions.current.unshift(curPoint.clone());
      positions.current.pop();
    }
    /*
     * 拿到20个顶点的位置后，改变集合体的顶点
     */
    const geometry = trailRef.current.geometry;
    const positionAttribute = geometry.getAttribute('position');
    // console.log(positionAttribute);

    for (let i = 0; i < numPoints; i++) {
      const pointCur = positions.current[positions.current.length - 1 - i];
      // 平面的一个顶点是
      positionAttribute.setXYZ(
        i * 2,
        pointCur.x,
        pointCur.y - height / 2,
        pointCur.z
      );
      positionAttribute.setXYZ(
        i * 2 + 1,
        pointCur.x,
        pointCur.y + height / 2,
        pointCur.z
      );
    }
    positionAttribute.needsUpdate = true;
  });
  return (
    <>
      <mesh ref={trailRef}>
        <planeGeometry args={[1, 1, 1, numPoints - 1]} />
        <trailMaterial
          color={color}
          opacity={opacity}
          side={THREE.DoubleSide}
          transparent
          blending={THREE.NormalBlending}
          depthWrite={false}
          wireframe={false}
        />
      </mesh>
    </>
  );
};

const TrailMaterial = shaderMaterial(
  { color: new THREE.Color('white'), opacity: 1, intensity: 1 },
  /*
   * glsl
   */
  ` varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
  uniform vec3 color;
  uniform float opacity;
  uniform float intensity;
  varying vec2 vUv;
  void main(){
    float alpha = smoothstep(1.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.y) * smoothstep(0.0, 0.5, vUv.x); 
   gl_FragColor = vec4(color, alpha * opacity);
  }
  `
) as any;

extend({ TrailMaterial });
declare module '@react-three/fiber' {
  interface ThreeElements {
    trailMaterial: ReactThreeFiber.Object3DNode<any, typeof TrailMaterial>;
  }
}
export default SimpleTrail;
