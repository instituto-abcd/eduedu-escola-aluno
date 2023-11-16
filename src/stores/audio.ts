import { create } from "zustand";

export type AudioStatusStore = {
  isPlaying: boolean;
  setPlaying: (isPlaying: boolean) => void;
};

export const useAudioStatus = create<AudioStatusStore>((set) => ({
  isPlaying: false,
  setPlaying: (isPlaying) => set({ isPlaying }),
}));
