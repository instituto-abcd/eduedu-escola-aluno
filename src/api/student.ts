import { useCallback } from "react";
import { MutationOptions, QueryOptions } from "./api-types";
import { API } from "./base";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SchoolGrade, SchoolPeriod } from "./school-class";
import { useStudent } from "~/stores/student";
import { Question } from "./exam";

export type Student = {
  id: string;
  name: string;
  registry: string;
  schoolClassId: string;
  schoolClassName: string;
  schoolPeriod: SchoolPeriod;
  schoolGrade: SchoolGrade;
  cfo?: string;
  sea?: string;
  lct?: string;
};

export type Answer = {
  position: number;
  positionAnswer: number;
};

type GetQuestionInput = {
  questionId: string | number;
  optionsAnswered: Answer[];
};

const KEY = {
  GET_STUDENT_PLANET_TRACK: "GET_STUDENT_PLANET_TRACK",
  GET_STUDENT_AWARDS: "GET_STUDENT_AWARDS",
  FIRST_QUESTION: "FIRST_QUESTION",
  EXAM_EVALUATION: "EXAM_EVALUATION"
};

const URL = {
  GET_STUDENT: (id: string) => `student/${id}`,
  GET_STUDENT_PLANET_TRACK: (id: string) => `student/${id}/planet-track`,
  GET_STUDENT_AWARDS: (id: string) => `student/${id}/awards`,
  GET_STUDENT_EXAM_QUESTIONS_1: (id: string) =>
    `student/${id}/exam-questions/first`,
  GET_STUDENT_EXAM_QUESTIONS: (studentId: string, examId: string) =>
    `student/${studentId}/exam-questions/${examId}/answer`,
  EXAM_EVALUATION: (id: string) =>
  `student/${id}/exam-evaluation`,
};

export class StudentAPI extends API {
  // TODO: tipar retorno
  static async getStudent(id: string) {
    const { data } = await this.api.get(URL.GET_STUDENT(id));
    return data;
  }

  // TODO: tipar retorno
  static async getStudentPlanetTrack(id: string) {
    const { data } = await this.api.get(URL.GET_STUDENT_PLANET_TRACK(id));
    return data;
  }

  // TODO: tipar retorno
  static async getStudentAwards(id: string) {
    const { data } = await this.api.get(URL.GET_STUDENT_AWARDS(id));
    return data;
  }

  static async getFirstExamQuestion(studentId: string) {
    const { data } = await this.api.get<Question>(
      URL.GET_STUDENT_EXAM_QUESTIONS_1(studentId)
    );
    return data;
  }

  static async getExamQuestion(studentId: string, input: GetQuestionInput) {
    const { data } = await this.api.post<Question | { examCompleted: true }>(
      URL.GET_STUDENT_EXAM_QUESTIONS(
        studentId,
        "fa387b6c-7ecf-4752-aeb3-c810a912c421" // TODO: pegar id do exam
      ),
      input
    );

    return data;
  }

  static async submitExamEvaluation(studentId: string) {
    const { data } = await this.api.post(URL.EXAM_EVALUATION(studentId));
    return data;
  }
}

export function useGetStudent(options?: MutationOptions) {
  const handler = useCallback(function (id: string) {
    return StudentAPI.getStudent(id);
  }, []);

  return useMutation(handler, {
    ...options,

    onSuccess: (data, vars, ctx) => {
      useStudent.setState({ ...data });
      options?.onSuccess?.(data, vars, ctx);
    },
  });
}

// TODO: tipar mutationoptions
export function useGetStudentPlanetTrackMutation(options?: MutationOptions) {
  const handler = useCallback(function (id: string) {
    return StudentAPI.getStudentPlanetTrack(id);
  }, []);

  return useMutation(handler, options);
}

// TODO: tipar queryoptions
export function useGetStudentPlanetTrackQuery(options?: QueryOptions) {
  const handler = useCallback(function () {
    return StudentAPI.getStudentPlanetTrack(useStudent.getState().id);
  }, []);

  return useQuery(
    [KEY.GET_STUDENT_PLANET_TRACK, options?.search],
    handler,
    options
  );
}

// TODO: tipar queryoptions
export function useGetStudentAwardsQuery(options?: QueryOptions) {
  const handler = useCallback(function () {
    return StudentAPI.getStudentAwards(useStudent.getState().id);
  }, []);

  return useQuery([KEY.GET_STUDENT_AWARDS, options?.search], handler, options);
}

export function useGetFirstExamQuestion(
  options?: QueryOptions<Question, typeof KEY.FIRST_QUESTION>
) {
  const handler = useCallback(function () {
    return StudentAPI.getFirstExamQuestion(useStudent.getState().id);
  }, []);

  return useQuery([KEY.GET_STUDENT_AWARDS], handler, options);
}

export function useGetExamQuestion(
  options?: MutationOptions<
    GetQuestionInput,
    Question | { examCompleted: true }
  >
) {
  const handler = useCallback(function (input: GetQuestionInput) {
    return StudentAPI.getExamQuestion(useStudent.getState().id, input);
  }, []);

  return useMutation(handler, options);
}

export function useSubmitExamEvaluation(options?: QueryOptions<Question, typeof KEY.EXAM_EVALUATION>) {
  const handler = useCallback(function () {
    return StudentAPI.submitExamEvaluation(useStudent.getState().id);
  }, []);

  return useQuery([KEY.GET_STUDENT_AWARDS], handler, options);
}
