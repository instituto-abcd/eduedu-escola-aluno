import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Question } from "~/api/exam";

type QuestionProgressStore = {
  entries: Record<string, Question>;
  save: (key: string, question: Question) => void;
  get: (key: string) => Question | undefined;
  remove: (key: string) => void;
  clear: () => void;
};

export const questionProgressKey = {
  exam: (studentId: string) => `exam:${studentId}`,
  planet: (studentId: string, planetId: string) =>
    `planet:${studentId}:${planetId}`,
};

/**
 * Guarda a questão atual da prova/planeta no localStorage para que o aluno
 * não perca o progresso ao atualizar a página.
 */
export const useQuestionProgress = create<QuestionProgressStore>()(
  persist(
    (set, get) => ({
      entries: {},
      save: (key, question) =>
        set({ entries: { ...get().entries, [key]: question } }),
      get: (key) => get().entries[key],
      remove: (key) => {
        const entries = { ...get().entries };
        delete entries[key];
        set({ entries });
      },
      clear: () => set({ entries: {} }),
    }),
    { name: "question_progress" }
  )
);

function isPageReload() {
  const [entry] = performance.getEntriesByType(
    "navigation"
  ) as PerformanceNavigationTiming[];
  return entry?.type === "reload";
}

// O progresso salvo só vale para um reload da página. Qualquer outra forma de
// abrir o app (nova aba, link, reabrir o navegador) começa do zero.
if (!isPageReload()) {
  useQuestionProgress.getState().clear();
}
