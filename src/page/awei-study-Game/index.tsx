import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import GameUI from './components/gameUI';
import Home from './components/home';
const JourneyGame = () => {
  return (
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
        { name: 'back', keys: ['ArrowDown', 'KeyS'] },
        { name: 'right', keys: ['ArrowRight', 'KeyD'] },
        { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
        { name: 'jump', keys: ['Space'] },
      ]}
    >
      <div className="game-home">
        <div className='canvas-home'>
          <Canvas
            dpr={[1, 2]}
            shadows
            gl={{ antialias: true }}
            camera={{
              fov: 45,
              near: 0.1,
              far: 100,
              position: [2.5, 4, 6],
            }}
          >
            <Home />
          </Canvas>
        </div>
        <GameUI />
      </div>
    </KeyboardControls>
  );
};

export default JourneyGame;
