import { useCallback, useMemo } from "react";
import { Question } from "~/api/exam";

export function useQuestionHelper(question: Question) {
  const hasTitleOfType = useCallback(
    function (type: string) {
      return question.titles.filter((title) => title.type === type).length > 0;
    },
    [question]
  );

  const getTitlesOfType = useCallback(
    function getTitlesOfType(type: string) {
      return question.titles.filter((title) => title.type === type);
    },
    [question]
  );

  const textTitles = useMemo(() => getTitlesOfType("TEXT"), [getTitlesOfType]);

  const imageTitles = useMemo(
    () => getTitlesOfType("IMAGE"),
    [getTitlesOfType]
  );

  const audioTitles = useMemo(
    () => getTitlesOfType("AUDIO"),
    [getTitlesOfType]
  );

  const videoTitles = getTitlesOfType("VIDEO");

  return {
    hasTitleOfType,
    getTitlesOfType,
    textTitles,
    imageTitles,
    audioTitles,
    videoTitles,
  };
}
