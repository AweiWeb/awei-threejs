import { Trail, useScroll } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import {
  extend,
  useFrame,
  ReactThreeFiber,
  useThree,
} from '@react-three/fiber';
import {
  lerp,
  randFloat,
  randFloatSpread,
  randInt,
} from 'three/src/math/MathUtils.js';
import * as THREE from 'three';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
const SateLlite = ({ countTrails = 40 }: any) => {
  const trailData = useMemo(
    () =>
      new Array(countTrails).fill(0).map(() => {
        const size = randFloat(1, 3);
        return {
          size,
          color: [
            '#e63946', // 红
            '#f1fa3c', // 黄
            '#457b9d', // 蓝
            '#2a9d8f', // 青绿
            '#f4a261', // 橙
            '#9d4edd', // 紫
            '#ff6b6b', // 淡红
            '#06d6a0', // 浅绿
            '#ffbe0b', // 金黄
          ][randInt(0, 8)],
          length: randInt(2, 4),
          startPosition: [randFloatSpread(20), 0, 0],
          defaultSpeed: (2 / size) * (randInt(0, 1) || -1),
          radius: randFloat(5, 10),
          coinSpeed: (15 / size) * (randInt(0, 1) || -1),
          planetOrbitSpeed: (4 / size) * (randInt(0, 1) || -1),
        };
      }),
    [countTrails]
  );
  return (
    <>
      {trailData.map((item, index) => {
        return <TrailComments key={index} {...item} />;
      })}
    </>
  );
};
const trailVec3 = new THREE.Vector3();
const TrailComments = ({
  size,
  color,
  startPosition,
  length,
  defaultSpeed,
  radius,
  coinSpeed,
  planetOrbitSpeed,
}: any) => {
  const trailRef = useRef(null!) as any;
  const container = useRef(null!) as any;
  const data = useScroll();
  const viewport = useThree((state) => state.viewport);
  useFrame(({ clock }, delta) => {
    if (!trailRef.current) return;
    let containerTarget = 0;
    /*
     * 卫星位置变化
     */
    // console.log(data);
    const first = data.visible(1 / 4, 1 / 4);
    const second = data.visible(2 / 4, 1 / 4);
    const third = data.visible(3 / 4, 1 / 4);
    const elapsed = clock.getElapsedTime();
    if (first) {
      containerTarget = -viewport.height;
      trailVec3.x = 16 * Math.pow(Math.sin(elapsed * coinSpeed), 3) * 8;
      trailVec3.y =
        (13 * Math.cos(elapsed * coinSpeed) -
          5 * Math.cos(2 * elapsed * coinSpeed) -
          2 * Math.cos(3 * elapsed * coinSpeed) -
          Math.cos(4 * elapsed * coinSpeed)) *
        6;
      //   trailVec3.x = Math.cos(elapsed * coinSpeed) * radius;
      //   trailVec3.y = Math.sin(elapsed * coinSpeed) * radius;
      trailVec3.z = 0;
    } else if (second) {
      containerTarget = -viewport.height * 2;
      trailVec3.x = Math.cos(elapsed * defaultSpeed) * viewport.width;
      trailVec3.y = Math.sin(elapsed * defaultSpeed) * 8;
      trailVec3.z = 0;
    } else if (third) {
      containerTarget = -viewport.height * 3;
      trailVec3.x = Math.cos(elapsed * planetOrbitSpeed) * radius;
      trailVec3.y = Math.sin(elapsed * planetOrbitSpeed) * radius;
      trailVec3.z = 0;
    } else {
      trailVec3.x = startPosition[0];
      trailVec3.y = Math.sin(elapsed * defaultSpeed) * 20;
      trailVec3.z = Math.cos(elapsed * defaultSpeed) * 80;
    }

    trailRef.current.position.lerp(trailVec3, delta * 0.5);
    container.current.position.y = lerp(
      container.current.position.y,
      containerTarget,
      delta * 2
    );
  });
  return (
    <group ref={container}>
      <Trail
        width={size} // Width of the line
        // color={color} // Color of the line
        length={length} // Length of the line
        decay={1} // How fast the line fades away
        local={false} // Wether to use the target's world or local positions
        stride={0} // Min distance between previous and current point
        interval={1} // Number of frames to wait before next calculation
        target={undefined} // Optional target. This object will produce the trail.
        attenuation={(width) => width} // A function to define the width in each point along it.
      >
        {/* If `target` is not defined, Trail will use the first `Object3D` child as the target. */}
        <mesh ref={trailRef} position={startPosition} rotation-x={Math.PI / 2}>
          <sphereGeometry args={[size / 40]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
          />
        </mesh>

        {/* You can optionally define a custom meshLineMaterial to use. */}
        <meshLineMaterial color={color} />
      </Trail>
    </group>
  );
};
declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineMaterial: ReactThreeFiber.Object3DNode<
      any,
      typeof MeshLineMaterial
    >;
  }
}
extend({ MeshLineGeometry, MeshLineMaterial });
export default SateLlite;
