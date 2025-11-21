import create from 'zustand';

export const useVideoRecognition = create((set: any) => ({
  videoElement: null,
  setVideoElement: (videoElement: any) => set({ videoElement }),
  resultsCallback: null,
  setResultsCallback: (resultsCallback: any) => set({ resultsCallback }),
})) as any;
