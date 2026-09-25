import { useCallback, useEffect, useRef, useState } from "react";
import type { Question } from "~/api/exam";
import { useQuestionProgress } from "~/stores/question-progress";

/**
 * Estado da questão atual espelhado no localStorage. A questão salva só é
 * restaurada quando o aluno atualiza a página (`isRestored`); ao sair da
 * prova/planeta pela navegação do app, o progresso salvo é descartado.
 *
 * Quando restaurar, NÃO chame o endpoint de first-question: o backend zera as
 * respostas já dadas ao iniciar a prova/planeta.
 */
export function usePersistedQuestion(key: string) {
  const [restored] = useState(() =>
    useQuestionProgress.getState().get(key)
  );
  const [question, setQuestionState] = useState<Question | undefined>(
    restored
  );

  const questionRef = useRef(question);
  questionRef.current = question;

  const setQuestion = useCallback(
    (q: Question) => {
      setQuestionState(q);
      useQuestionProgress.getState().save(key, q);
    },
    [key]
  );

  // O cleanup só roda ao desmontar pelo app (um reload não desmonta), então
  // sair da prova/planeta descarta o progresso. O save na montagem cobre o
  // mount/unmount/mount do StrictMode.
  useEffect(() => {
    const store = useQuestionProgress.getState();
    if (questionRef.current) store.save(key, questionRef.current);
    return () => store.remove(key);
  }, [key]);

  return { question, setQuestion, isRestored: !!restored };
}
