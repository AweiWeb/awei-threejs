import useCargame from '../store';
import Home from './home';
import Operate from './Operate';
const Experience = () => {
  const gameState = useCargame((state: any) => state.gameState);
  return (
    <>
      {gameState === 'select' && <Home />}
      {/* {gameState === 'operate' && <Operate />} */}
    </>
  );
};

export default Experience;
