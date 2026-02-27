import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
/*
 * 记录游戏信息
 */
const musicSrc = ['laoshu'];
const useTreatureGame = create((set, get: any) => {
  return {
    currentTreatureId: null,
    buttonState: false,
    cameraState: '1',
    allThing: [],
    aduioPlayer: [],
    snow: 2000,
    findTreature: (id: number) => {
      set((state: any) => ({
        currentTreatureId: id,
        buttonState: true,
      }));
    },
    /*
     * 切换相机状态
     */
    setCameraState: (id: string) => {
      set((state: any) => ({
        cameraState: id,
      }));
    },
    setupThing: (meshObject: any) => {
      set((state: any) => {
        console.log(meshObject);
        return {
          allThing: [...state.allThing, meshObject],
        };
      });
    },
    deletThing: (id: string) => {
      set((state: any) => ({
        allThing: state.allThing.filter((item: any) => item.key !== `ob${id}`),
      }));
    },
    /*
     * 旋转
     */
    rotateThing: (id: string) => {
      set((state: any) => ({
        allThing: state.allThing.map((item: any) =>
          item.key === `ob${id}` ? { ...item, isRotation: true } : item
        ),
      }));
    },

    /*
     * 施加力
     */
    addForceBox: (id: string) => {
      set((state: any) => {
        return {
          allThing: state.allThing.map((item: any) =>
            item.key === `ob${id}`
              ? { ...item, isForce: item.isForce ? false : true }
              : item
          ),
        };
      });
    },
    /*
     * 初始化音频
     */
    setupAduio: () => {
      set((state: any) => {
        musicSrc.forEach((item) => {
          const aduioDom = new Audio(`/models/${item}.MP3`);
          state.aduioPlayer.push({ id: item, aduio: aduioDom });
        });
        console.log(state.aduioPlayer, '初始化音频');

        return { aduioPlayer: [...state.aduioPlayer] };
      });
    },
    /*
     * 播放音频
     */
    playAduio(id: any) {
      const audioPlayer = get().aduioPlayer;
      const currentMusic = audioPlayer.find((item: any) => item.id === id);
      console.log(currentMusic, 'djadj');

      currentMusic.aduio.play();
    },
  };
});

export default useTreatureGame;
