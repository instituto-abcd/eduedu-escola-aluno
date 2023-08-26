import { create } from "zustand";

export enum MediaType {
  "VIDEO" = "VIDEO",
  "AUDIO" = "AUDIO",
}

export type MediaTrack = {
  trackUrl: string;
  trackId: string;
  mediaType: MediaType;
};

type MediaTrackStore = {
  currentTrack?: MediaTrack | null;
  isPlaying: boolean;
  play: (track: MediaTrack) => void;
  readonly queue: MediaTrack[];

  canPlay: (trackId?: string) => boolean;
  clearQueue: () => void;
  setPlayStatus: (isPlaying: boolean) => void;
  addToQueue: (track: MediaTrack) => void;
  hasQueue: () => boolean;
  playNext: () => void;
};

export const useMediaTrackStore = create<MediaTrackStore>((set, get) => ({
  queue: [],
  isPlaying: false,

  play: (track: MediaTrack) => set({ currentTrack: track }),

  canPlay: () => {
    return !get().isPlaying;
  },

  clearQueue: () => set({ queue: [] }),

  setPlayStatus: (isPlaying: boolean) => set({ isPlaying }),

  addToQueue: (track: MediaTrack) => {
    const queue = [...get().queue, track];
    set({ queue });
  },

  hasQueue: () => {
    return get().queue.length > 0;
  },

  playNext: () => {
    const queue = [...get().queue];
    const nextTrack = queue.shift();
    set({ queue, currentTrack: nextTrack });
  },
}));
