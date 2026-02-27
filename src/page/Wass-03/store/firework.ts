import { randFloat, randInt } from 'three/src/math/MathUtils.js';
import create from 'zustand';

/*
 * 🎆 烟花数据 位置 时间 延时
 * 💥 控制烟花数量
 * 定时删除烟花
 */

const colorEndMap = [['red'], ['fuchsia'], ['pink'], ['yellow']];
const colorStartMap = [
  ['skyblue'],
  ['white'],
  ['deepskyblue'],
  ['aquamarine'],
  ['mediumaquamarine'],
  ['#368bff'],
];
const SPAWN_OFFSET = 0.2;

const spawns = [
  [1.004, -0.001 + SPAWN_OFFSET, 3.284],
  [-2.122, -0.001 + SPAWN_OFFSET, 2.678],
  [-0.988, -0.001 + SPAWN_OFFSET, 3.287],
  [2.888, -0.001 + SPAWN_OFFSET, 1.875],
  [2.115, -0.001 + SPAWN_OFFSET, 2.684],
];
const useFireworks = create((set, get) => {
  return {
    fireworks: [],
    addFireWorks: () => {
      set((state: any) => {
        const fireworkData = {
          id: `${Math.random()}-${Date.now()}`,
          position: spawns[randInt(0, spawns.length - 1)],
          velocity: [randFloat(-8, 8), randFloat(5, 10), randFloat(-8, 8)],
          delay: randFloat(0.8, 2),
          colorS: colorStartMap[randInt(0, colorStartMap.length - 1)],
          colorE: colorEndMap[randInt(0, colorEndMap.length - 1)],
          time: Date.now(),
        };
        return {
          fireworks: [...state.fireworks, fireworkData],
        };
      });
      /*
       * 定时删除烟花
       */
      setTimeout(() => {
        set((state: any) => ({
          fireworks: state.fireworks.filter(
            (item: any) => Date.now() - item.time < 4000,
          ),
        }));
      }, 4000);
    },
  };
});

export { useFireworks };
