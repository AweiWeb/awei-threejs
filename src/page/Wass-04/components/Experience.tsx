import {
  CameraControls,
  KeyboardControls,
  OrbitControls,
  Sky,
} from '@react-three/drei';
import { useRef } from 'react';
import Floor from './Floor';
import { Physics } from '@react-three/rapier';
import Cubes from './Cube';
import Player from './Player';
const Experence = () => {
  return (
    <>
      <Sky />
      <ambientLight intensity={2} />
      <KeyboardControls
        map={[
          { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
          { name: 'back', keys: ['ArrowDown', 'KeyS'] },
          { name: 'right', keys: ['ArrowRight', 'KeyD'] },
          { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
          { name: 'jump', keys: ['Space'] },
          { name: 'run', keys: ['Shift'] },
        ]}
      >
        <Physics debug={true} gravity={[0, -16.8, 0]}>
          <Floor />
          <Cubes />
          <Player />
        </Physics>
      </KeyboardControls>
      {/* <OrbitControls /> */}
    </>
  );
};

export default Experence;
