import { create } from "zustand";

export type UnlockPlanetsStore = {
  unlockLimit: boolean;
  toggleUnlockLimit: (unlockLimit: boolean) => void;
  unlockAll: boolean;
  toggleUnlockAll: (unlockLimit: boolean) => void;
};

export const useUnlockPlanets = create<UnlockPlanetsStore>((set) => ({
  unlockLimit: false,
  toggleUnlockLimit: (unlockLimit) => set({ unlockLimit }),
  unlockAll: false,
  toggleUnlockAll: (unlockAll) => set({ unlockAll }),
}));
