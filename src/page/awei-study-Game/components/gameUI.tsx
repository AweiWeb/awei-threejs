import { useKeyboardControls } from '@react-three/drei';
import '../style/index.scss';
import useGameStore from '../store/useGameStore';
import { useEffect, useRef } from 'react';
import { addEffect } from '@react-three/fiber';
const GameUI = () => {
  const time = useRef<HTMLDivElement | any>();
  const restart = useGameStore((state: any) => state.restart);
  const gameState = useGameStore((state: any) => state.gameState);
  const forward = useKeyboardControls((state) => state.forward);
  const back = useKeyboardControls((state) => state.back);
  const left = useKeyboardControls((state) => state.left);
  const right = useKeyboardControls((state) => state.right);
  const jump = useKeyboardControls((state) => state.jump);
  //时间实时变化
  useEffect(() => {
    const unsubEffect = addEffect(() => {
      const state = useGameStore.getState() as any;
      let elapsedTime = 0 as any;
      if (state.gameState === 'playing') {
        // console.log(111111);
        elapsedTime = Date.now() - state.startTime;
      } else if (state.gameState === 'ended') {
        elapsedTime = state.endTime - state.startTime;
      }
      elapsedTime /= 1000;
      elapsedTime = elapsedTime.toFixed(2);
      console.log(elapsedTime);
      if (time) {
        time.current.textContent = elapsedTime;
      }
    });
    return () => {
      unsubEffect();
    };
  }, []);
  return (
    <div className="game-ui">
      <div ref={time} className="time">
        00:00
      </div>
      {gameState === 'ended' && (
        <div className="reset" onClick={restart}>
          重新开始
        </div>
      )}
      <div className="control">
        <div className="raw">
          <div className={`key ${forward ? 'active' : ''}`}></div>
        </div>
        <div className="raw">
          <div className={`key ${left ? 'active' : ''}`}></div>
          <div className={`key ${back ? 'active' : ''}`}></div>
          <div className={`key ${right ? 'active' : ''}`}></div>
        </div>
        <div className="raw">
          <div className={`key large ${jump ? 'active' : ''}`}></div>
        </div>
      </div>
    </div>
  );
};

export default GameUI;
