import { create } from "zustand";

export type AudioStatusStore = {
  isPlaying: boolean;
  _playingCount: number;
  setPlaying: (isPlaying: boolean) => void;
  resetPlaying: () => void;
};

export const useAudioStatus = create<AudioStatusStore>((set) => ({
  isPlaying: false,
  _playingCount: 0,
  setPlaying: (playing) =>
    set((state) => {
      const _playingCount = Math.max(
        0,
        state._playingCount + (playing ? 1 : -1),
      );
      return { _playingCount, isPlaying: _playingCount > 0 };
    }),
  resetPlaying: () => set({ isPlaying: false, _playingCount: 0 }),
}));
