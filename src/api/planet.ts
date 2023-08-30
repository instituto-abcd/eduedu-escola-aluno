import { useCallback } from "react";
import { MutationOptions, QueryOptions } from "./api-types";
import { API } from "./base";
import { Question, QuestionOption } from "./exam";
import { useStudent } from "~/stores/student";
import { useMutation, useQuery } from "@tanstack/react-query";

type AnswerInput = {
  questionId: string | number;
  optionsAnswered: QuestionOption[];
};

const URL = {
  FIRST_QUESTION: (studentId: string, planetId: string) =>
    `/student/${studentId}/planets/${planetId}/first-question`,
  ANSWER_QUESTION: (studentId: string, planetId: string) =>
    `/student/${studentId}/planets/${planetId}/answer`,
};

const studentId = useStudent.getState().id;

class PlanetAPI extends API {
  static async getFirstQuestion(planetId: string) {
    const { data } = await this.api.get<Question>(
      URL.FIRST_QUESTION(studentId, planetId)
    );
    return data;
  }

  static async answerQuestion(planetId: string, answer: AnswerInput) {
    const { data } = await this.api.post<Question | { planetCompleted: true }>(
      URL.ANSWER_QUESTION(studentId, planetId),
      answer
    );

    return data;
  }
}

export function usePlanetGetFirstQuestion(
  planetId: string,
  options?: QueryOptions<Question, ["PLANET_FIRST_QUESTION"]>
) {
  const handler = useCallback(
    function () {
      return PlanetAPI.getFirstQuestion(planetId);
    },
    [planetId]
  );

  return useQuery(["PLANET_FIRST_QUESTION"], handler, options);
}

export function usePlanetAnswer(
  options?: MutationOptions<AnswerInput, Question | { planetCompleted: true }>
) {
  const handler = useCallback(function ({
    planetId,
    ...answer
  }: AnswerInput & { planetId: string }) {
    return PlanetAPI.answerQuestion(planetId, answer);
  },
  []);

  return useMutation(handler, options);
}
