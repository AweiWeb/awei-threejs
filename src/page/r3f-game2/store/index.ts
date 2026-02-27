import create from 'zustand';
import { combine } from 'zustand/middleware';
const useCargame = create((set: any) => {
  return {
    car: 'truck',
    aduio: new Audio('/models/game2/audios/car_start.mp3'),
    gameState: 'select',
    selectCar: (payload: any) => {
      console.log(payload);
      set(() => {
        return { car: payload };
      });
    },
    playAduio: () => {
      set((state: any) => {
        if (state.aduio.currentTime !== 0) {
          state.currentTime = 0;
          state.aduio.play();
          return { aduio: new Audio('/models/game2/audios/car_start.mp3') };
        }
        state.currentTime = 0;
        state.aduio.play();
        return { aduio: new Audio('/models/game2/audios/car_start.mp3') };
      });
    },
    /*
     * 改变游戏状态
     */
    setGame(gameName: string) {
      set((state: any) => {
        return { gameState: gameName };
      });
    },
  };
}) as any;

export default useCargame;
