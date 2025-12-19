import { create } from "zustand";

type DebugInfoStore = {
	AudioButton: boolean;
	VideoPlayer: boolean;
	dimensions: boolean;
	answer: boolean;
	planetTrack: boolean;
};

export const useDebugInfo = create<DebugInfoStore>(() => ({
	AudioButton: false,
	VideoPlayer: false,
	dimensions: false,
	answer: false,
	planetTrack: false,
}));
