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
  PLANET_QUESTION: (planetId: string, questionId: string) =>
    `planet/${planetId}/questions/${questionId}`,
};

class PlanetAPI extends API {
  static async getFirstQuestion(studentId: string, planetId: string) {
    const { data } = await this.api.get<Question>(
      URL.FIRST_QUESTION(studentId, planetId)
    );
    return data;
  }

  static async getQuestion(planetId: string, questionId: string) {
    const { data } = await this.api.get<Question>(
      URL.PLANET_QUESTION(planetId, questionId)
    );
    return data;
  }

  static async answerQuestion(
    studentId: string,
    planetId: string,
    answer: AnswerInput
  ) {
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
  const studentId = useStudent((state) => state.id);

  const handler = useCallback(
    function () {
      return PlanetAPI.getFirstQuestion(studentId, planetId);
    },
    [planetId]
  );

  return useQuery(["PLANET_FIRST_QUESTION"], handler, options);
}

export function usePlanetAnswer(
  options?: MutationOptions<AnswerInput, Question | { planetCompleted: true }>
) {
  const studentId = useStudent((state) => state.id);

  const handler = useCallback(function ({
    planetId,
    ...answer
  }: AnswerInput & { planetId: string }) {
    return PlanetAPI.answerQuestion(studentId, planetId, answer);
  },
  []);

  return useMutation(handler, options);
}

export function usePlanetGetQuestion(
  planetId: string,
  questionId: string,
  options?: QueryOptions<Question, ["PLANET_QUESTION", string, string]>
) {
  const handler = useCallback(
    function () {
      return PlanetAPI.getQuestion(planetId, questionId);
    },
    [planetId, questionId]
  );

  return useQuery(["PLANET_QUESTION", planetId, questionId], handler, options);
}
