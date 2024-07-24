import { create } from "zustand";

type UseNewAwardStore = {
  awards: string[];
  setNewAwards: (awards: string[]) => void;
  viewRequested: boolean;
  requestView: () => void;
  resetView: () => void;
};

export const useNewAward = create<UseNewAwardStore>()((set, get) => ({
  awards: [],
  viewRequested: false,
  setNewAwards: (awards: string[]) => set({ awards }),
  requestView: () => {
    if (get().awards.length > 0) {
      set({ viewRequested: true });
    }
  },
  resetView: () => {
    if (get().viewRequested) {
      set({ viewRequested: false });
    }
  },
}));
