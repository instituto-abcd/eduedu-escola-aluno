import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Question, QuestionOption } from "~/api/exam";
import { PATH } from "~/constants/path";

export function useQuestionHelper(question: Question) {
  const location = useLocation();
  const isExam = location.pathname.startsWith(PATH.EXAM) && !question.planet_id;
  const isPlanet =
    location.pathname.startsWith(PATH.PLANET) || !!question.planet_id;

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

  const audioTitles = getTitlesOfType("AUDIO");
  const videoTitles = getTitlesOfType("VIDEO");
  const lottieTitles = getTitlesOfType("LOTTIE");

  function getLottieJson(url: string) {
    return fetch(url)
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
        return null;
      });
  }

  function optionArrKey(option: QuestionOption, inx?: number) {
    return `[${inx ?? "_"}]-[${option.position}]:${option.description}(${
      option.image_url ?? option.sound_url ?? "_"
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
    getLottieJson,
    optionArrKey,
    isExam,
    isPlanet,
  };
}
