import useCargame from '../store';
import { CarUrl } from './Car';

const UI = () => {
  const selectCar = useCargame((state: any) => state.selectCar);
  return (
    <div className="selectBox">
      {CarUrl.map((item, index) => {
        return (
          <div className="imgBox" key={index} onClick={() => selectCar(item)}>
            <img src={`/models/game2/images/cars/${item}.png`} alt="" />
          </div>
        );
      })}
    </div>
  );
};
export default UI;
