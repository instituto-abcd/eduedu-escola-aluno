import { useCallback } from "react";
import { MutationOptions, QueryOptions } from "./api-types";
import { API } from "./base";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SchoolGrade, SchoolPeriod } from "./school-class";
import { useStudent } from "~/stores/student";
import { Question, QuestionOption } from "./exam";

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
  reserved: boolean;
};

export type Planet = {
  avatar_url: string;
  axis_code: string;
  domain_code: string;
  enable: boolean;
  id: string;
  level: string;
  next_planet_id: string | null;
  position: number;
  status: string;
  title: string;
  questions: Question[];
};

export type SimplifiedPlanet = {
  planetId: string;
  planetName: string;
  planetAvatar: string;
  score: number;
  stars: number;
  canExecutePlanet: boolean;
};

export type PlanetTrack = {
  studentId: string;
  examId: string;
  examDate: Date;
  current: boolean;
  planetTrack: SimplifiedPlanet[];
  examPerformed: boolean;
};

type GetQuestionInput = {
  questionId: string | number;
  optionsAnswered: QuestionOption[];
};

const KEY = {
  STUDENT: "STUDENT",
  PLANET_TRACK: "PLANET_TRACK",
  GET_STUDENT_AWARDS: "GET_STUDENT_AWARDS",
  FIRST_QUESTION: "FIRST_QUESTION",
  EXAM_EVALUATION: "EXAM_EVALUATION",
};

const URL = {
  GET_STUDENT: (id: string) => `student/${id}`,
  GET_STUDENT_PLANET_TRACK: (id: string) => `student/${id}/planet-track`,
  GET_STUDENT_AWARDS: (id: string) => `student/${id}/awards`,
  GET_STUDENT_EXAM_QUESTIONS_1: (id: string) =>
    `student/${id}/exam-questions/first`,
  GET_STUDENT_EXAM_QUESTIONS: (studentId: string, examId: string) =>
    `student/${studentId}/exam-questions/${examId}/answer`,
  EXAM_EVALUATION: (id: string) => `student/${id}/exam-evaluation`,
};

export class StudentAPI extends API {
  static studentId = useStudent.getState().id;

  static async getStudent() {
    const { data } = await this.api.get<Student>(
      URL.GET_STUDENT(this.studentId)
    );
    return data;
  }

  static async getPlanetTrack() {
    const { data } = await this.api.get<PlanetTrack>(
      URL.GET_STUDENT_PLANET_TRACK(this.studentId)
    );

    return data;
  }

  // TODO: tipar retorno
  static async getStudentAwards() {
    const { data } = await this.api.get(URL.GET_STUDENT_AWARDS(this.studentId));
    return data;
  }

  static async getFirstExamQuestion(studentId: string) {
    const { data } = await this.api.get<Question>(
      URL.GET_STUDENT_EXAM_QUESTIONS_1(studentId)
    );
    return data;
  }

  static async getExamQuestion(input: GetQuestionInput) {
    const { data } = await this.api.post<Question | { examCompleted: true }>(
      URL.GET_STUDENT_EXAM_QUESTIONS(
        this.studentId,
        "fa387b6c-7ecf-4752-aeb3-c810a912c421" // TODO: pegar id do exam
      ),
      input
    );

    return data;
  }

  static async submitExamEvaluation() {
    const { data } = await this.api.post(URL.EXAM_EVALUATION(this.studentId));
    return data;
  }
}

export function useGetPlanetTrack(
  options?: QueryOptions<PlanetTrack, [typeof KEY.PLANET_TRACK]>
) {
  const handler = useCallback(function () {
    return StudentAPI.getPlanetTrack();
  }, []);

  return useQuery([KEY.PLANET_TRACK], handler, options);
}

// TODO: tipar queryoptions
export function useGetStudentAwardsQuery(options?: QueryOptions) {
  const handler = useCallback(function () {
    return StudentAPI.getStudentAwards();
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

export function useSubmitExamEvaluation(
  options?: QueryOptions<Question, typeof KEY.EXAM_EVALUATION>
) {
  const handler = useCallback(function () {
    return StudentAPI.submitExamEvaluation(useStudent.getState().id);
  }, []);

  return useQuery([KEY.GET_STUDENT_AWARDS], handler, options);
}
