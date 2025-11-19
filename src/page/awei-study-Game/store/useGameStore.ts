import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// 创建状态管理工具
// subscribeWithSelector增加监听状态函数
const useGameStore = create(
  subscribeWithSelector((set) => {
    return {
      gameState: 'ready',
      obstacleCount: 10,
      startTime: 0,
      endTime: 0,
      start: () => {
        set((state: any) => {
          if (state.gameState === 'ready')
            return { gameState: 'playing', startTime: Date.now() };
          return {};
        });
      },
      restart: () => {
        console.log(11111);
        set((state: any) => {
          if (state.gameState === 'playing' || state.gameState === 'ended')
            return { gameState: 'ready' };
          return {};
        });
      },
      end: () => {
        set((state: any) => {
          if (state.gameState === 'playing')
            return { gameState: 'ended', endTime: Date.now() };
          return {};
        });
      },
    };
  })
);

export default useGameStore;
