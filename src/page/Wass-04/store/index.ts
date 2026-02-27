import create from 'zustand';

const useBuildWorld = create((set, get) => {
  return {
    worldCubeArr: [
      {
        id: `${Math.floor(Math.random() * 100)}-${Date.now()}`,
        position: [0, 1, 0],
      },
    ],
    addCube: (position: any) => {
      set((state: any) => {
        const id = `${Math.floor(Math.random() * 100)}-${Date.now()}`;
        return { worldCubeArr: [...state.worldCubeArr, { id, position }] };
      });
    },
  };
});

export default useBuildWorld;
