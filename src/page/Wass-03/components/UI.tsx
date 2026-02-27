import { useFireworks } from '../store/firework';

const UI = () => {
  const addFireWork = useFireworks((state: any) => state.addFireWorks);
  return (
    <div className="emitFirework">
      <div onClick={addFireWork} className="btnBox">
        🎆发射烟花
      </div>
    </div>
  );
};

export default UI;
