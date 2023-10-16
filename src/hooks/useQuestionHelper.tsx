import { useCallback, useMemo } from "react";
import { Question, QuestionOption } from "~/api/exam";

export function useQuestionHelper(question: Question) {
  const isExam = !question.planet_id;
  const isPlanet = !!question.planet_id;

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

  const getSupportText = useCallback(
    function getSupportText(text: string) {
      const supportText = question.titles.filter(
        (title) => title?.placeholder?.includes(text) && !!title?.description
      );

      return supportText;
    },
    [question]
  );

  const textTitles = getTitlesOfType("TEXT");

  const imageTitles = getTitlesOfType("IMAGE").filter(
    (title) => title.file_url
  );

  const videoTitles = getTitlesOfType("VIDEO");
  const lottieTitles = getTitlesOfType("LOTTIE");
  const supportText = getSupportText("ID da historinha");
  const hasAuxQuestion = !!supportText[0]?.["description"];
  const auxQuestionId = hasAuxQuestion ? supportText[0].description : null;

  function optionArrKey(option: QuestionOption, inx?: number) {
    return `[${inx ?? "_"}]-[${option.position}]:${option.description}(${
      option.image_url ?? option.sound_url ?? "_"
    })`;
  }

  /*
   * Audio helpers
   */
  const audioTitles = getTitlesOfType("AUDIO").filter(
    (title) => title.file_url
  );
  const hasAudioTitle = useMemo(
    () => audioTitles.some((title) => title.file_url),
    [audioTitles]
  );
  const audioTitleAutoplay = (index: number) => {
    if (index !== 0) return false;
    const rule =
      Array.isArray(question.rules) &&
      question.rules.find((rule) => rule.name === "autoplay");

    if (!rule) return false;
    return rule.value === "true";
  };

  /*
   * Rule helpers
   */

  const getRule = (rule: string) =>
    question.rules?.find((r) => r.name === rule);

  return {
    hasTitleOfType,
    getTitlesOfType,
    textTitles,
    imageTitles,
    audioTitles,
    videoTitles,
    lottieTitles,
    supportText,
    hasAudioTitle,
    audioTitleAutoplay,
    optionArrKey,
    getRule,
    isExam,
    isPlanet,
    hasAuxQuestion,
    auxQuestionId,
  };
}
