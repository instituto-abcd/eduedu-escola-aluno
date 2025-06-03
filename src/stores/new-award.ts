import { create } from "zustand";

type AwardList = { name: string; description: string }[];

type UseNewAwardStore = {
	awards: AwardList;
	setNewAwards: (awards: AwardList) => void;
	viewRequested: boolean;
	requestView: () => void;
	resetView: () => void;
};

export const useNewAward = create<UseNewAwardStore>()((set, get) => ({
	awards: [],
	viewRequested: false,

	setNewAwards: (awards: AwardList) => set({ awards }),

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
