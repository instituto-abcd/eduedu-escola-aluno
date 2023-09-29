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
        (title) => title.placeholder === text && !!title.description
      );

      return supportText;
    },
    [question]
  );

  const textTitles = useMemo(() => getTitlesOfType("TEXT"), [getTitlesOfType]);

  const imageTitles = useMemo(
    () => getTitlesOfType("IMAGE"),
    [getTitlesOfType]
  );

  const audioTitles = getTitlesOfType("AUDIO");
  const videoTitles = getTitlesOfType("VIDEO");
  const lottieTitles = getTitlesOfType("LOTTIE");
  const supportText = getSupportText("ID da historinha");

  function getLottieJson(url: string) {
    return fetch(url)
      .then((res) => res.json())
      .catch((err) => {
        return null;
      });
  }

  function optionArrKey(option: QuestionOption, inx?: number) {
    return `[${inx ?? "_"}]-[${option.position}]:${option.description}(${option.image_url ?? option.sound_url ?? "_"
      })`;
  }

  return {
    hasTitleOfType,
    getTitlesOfType,
    textTitles,
    imageTitles,
    audioTitles,
    videoTitles,
    lottieTitles,
    supportText,
    getLottieJson,
    optionArrKey,
    isExam,
    isPlanet,
  };
}
