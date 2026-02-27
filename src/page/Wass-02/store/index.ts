import create from 'zustand';

/*
 * 构建发射器状态管理器
 */
const useVFXemit = create((set, get: any) => {
  return {
    emitters: {},
    registerEmitter: (name: string, emitter: any) => {
      console.log(name, 'sdhadak');
      if (get().emitters[name]) {
        console.log('已经存在', 'dhadkhadha');
        return;
      }

      set((state: any) => {
        state.emitters[name] = emitter;
        return state;
      });
    },
    unRegisterEmitter: (name: string) => {
      set((state: any) => {
        console.log('删除了', name);

        delete state.emitters[name];
        return state;
      });
    },
    emit: (name: string, ...params: any) => {
      const emitter = get().emitters[name];
      // console.log(get().emitters, '找到发射器了');

      if (!emitter) {
        return;
      }
      //调用发射器函数
      emitter(...params);
    },
  };
});

export default useVFXemit;
