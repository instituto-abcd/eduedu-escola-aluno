import { create } from "zustand";

type DebugInfoStore = {
	AudioButton: boolean;
	VideoPlayer: boolean;
	dimensions: boolean;
	answer: boolean;
	set: (key: keyof Omit<DebugInfoStore, "set">, value: boolean) => void;
};

export const useDebugInfo = create<DebugInfoStore>((set) => ({
	AudioButton: false,
	VideoPlayer: false,
	dimensions: false,
	answer: false,

	set: (key, value) => set({ [key]: value }),
}));
