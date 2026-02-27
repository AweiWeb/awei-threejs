import {useMagic, magicBtn} from '../store';
const UI = () => {
  console.log('重新渲染了');

  const setSpell = useMagic((state: any) => state.setSpell);
  const spell = useMagic((state: any) => state.spell);
  return (
    <div className="UI">
      {magicBtn.map((item) => {
        return (
          <div
            className={`magic magic-btn${item.id}`}
            onClick={() => setSpell(item.name)}
            style={
              spell === item.name
                ? {
                    border: '2px solid yellow',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  }
                : {}
            }
          >
            {item.name}-{item.id}
          </div>
        );
      })}
    </div>
  );
};

export default UI;
