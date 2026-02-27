import {
  Environment,
  Grid,
  KeyboardControls,
  OrbitControls,
} from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import Floor from './Floor';
import RotationGeometry from './rotationGeometry';
import Louti from './Louti';
import Player from './Player';
import Ecctrl, { EcctrlAnimation } from 'ecctrl';
import Cube from './cube';
import { useMemo } from 'react';
const Experience = (props: any) => {
  const { count } = props;
  const cubeInstance = useMemo(() => {
    const cube = [];
    for (let i = 0; i < count; i++) {
      cube.push({});
    }
  }, [count]);
  return (
    <>
      <Environment files="/environmentMaps/0/2k.hdr" />
      <Grid
        args={[100, 100]}
        position={[0, -1, 0]}
        sectionColor={'mediumpurple'}
        cellColor={'tomato'}
        sectionSize={1}
        cellSize={0.5}
      />

      <Physics debug={false}>
        <Floor />
        <Cube />
        <RigidBody position={[3, 5, 0]}>
          <mesh>
            <boxGeometry />
            <meshStandardMaterial
              emissive={'pink'}
              emissiveIntensity={10}
              color={'tomato'}
              toneMapped={false}
            />
          </mesh>
        </RigidBody>
        <RotationGeometry />
        {/* <Louti /> */}
        <KeyboardControls
          map={[
            { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
            { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
            { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
            { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
            { name: 'jump', keys: ['Space'] },
            { name: 'run', keys: ['Shift'] },
            { name: 'fight', keys: ['KeyQ'] },
          ]}
        >
          {/* <Ecctrl
            jumpVel={2}
            debug
            animated
            followLight
            airDragMultiplier={0.5}
            friction={0.01}
            springK={2}
            dampingC={0.2}
            autoBalanceSpringK={1.2}
            autoBalanceDampingC={0.04}
            autoBalanceSpringOnY={0.7}
            autoBalanceDampingOnY={0.05}
          > */}
          <Player />
          {/* </Ecctrl> */}
        </KeyboardControls>
      </Physics>
      <OrbitControls />
    </>
  );
};

export default Experience;
