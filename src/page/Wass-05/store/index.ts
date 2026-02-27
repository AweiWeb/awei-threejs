import { randInt } from 'three/src/math/MathUtils.js';
import create from 'zustand';
export const magicBtn = [
  { id: '✨magic', name: 'Void' },
  { id: '🔥magic', name: 'Fire' },
  { id: '🧊magic', name: 'Ice' },
];
export const useMagic = create((set, get: any) => {
  return {
    spells: [],
    spell: '',
    setSpell: (spell: any) => {
      set(() => ({
        spell,
      }));
    },
    addSpell: (spell: any) => {
      set((state: any) => {
        console.log(state.spell, 'dayinshuju');

        return {
          spells: [
            ...state.spells,
            {
              id: `${Date.now()}-${randInt(0, 100)}-${state.spells.length}`,
              ...spell,
              time: Date.now(),
            },
          ],
        };
      });
      setTimeout(() => {
        set((state: any) => ({
          spells: state.spellls.filter(
            (spell: any) => Date.now() - spell.time < 4000,
          ),
        }));
      }, spell.duration + 4000);
    },
  };
});
