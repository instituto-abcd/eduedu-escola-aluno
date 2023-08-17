import { create } from "zustand";

type ExamProgressStore = {
  value: number;
  setValue: (value: number) => void;
};

export const useExamProgress = create<ExamProgressStore>((set) => ({
  value: 0,
  setValue: (value: number) => set({ value }),
}));
