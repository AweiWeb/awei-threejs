import { useRef } from 'react';
import { useControls, button } from 'leva';
import { Perf } from 'r3f-perf';
const Debug = () => {
  const boxRef = useRef<THREE.Mesh>(null!);
  const sphereRef = useRef<THREE.Mesh>(null!);
  const { positions, color, sphereVisible } = useControls('圆', {
    positions: {
      value: { x: -1, y: 0 },
      step: 0.1,
      joystick: 'invertY',
    },
    color: '#fff000',
    sphereVisible: true,
    choice: { options: ['a', 'b', 'c'] },
    myInterval: {
      min: 0,
      max: 10,
      value: [4, 5],
    },
    onButton: button(() => {
      console.log('我是大帅');
    }),
  });
  const { BoxPosition, boxColor, boxVisible } = useControls('正方体', {
    BoxPosition: {
      value: { x: 1.5, y: 0 },
      step: 0.1,
      joystick: 'invertY',
    },
    boxColor: '#ff0000',
    boxVisible: true,
  });
  const { perfVisible } = useControls('gpu面板', {
    perfVisible: true,
  });
  return (
    <>
      {perfVisible && <Perf position="top-left" />}
      <group>
        <mesh
          visible={sphereVisible}
          ref={sphereRef}
          position={[positions.x, positions.y, 0]}
        >
          <sphereGeometry />
          <meshStandardMaterial color={color} />
        </mesh>

        <mesh
          visible={boxVisible}
          ref={boxRef}
          position={[BoxPosition.x, BoxPosition.y, 0]}
          scale={1.5}
        >
          <boxGeometry />
          <meshStandardMaterial color={boxColor} />
        </mesh>
        <mesh position-y={-1} scale={10} rotation-x={-Math.PI * 0.5}>
          <planeGeometry />
          <meshStandardMaterial color="yellowgreen" />
        </mesh>
      </group>
    </>
  );
};

export default Debug;
