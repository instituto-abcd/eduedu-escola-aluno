import { useCallback } from "react";
import {
  MutationOptions,
  Paginated,
  PaginationParams,
  QueryOptions,
} from "./api-types";
import { API } from "./base";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SchoolGrade, SchoolPeriod } from "./school-class";
import { useStudent } from "~/stores/student";
import { Question, QuestionOption } from "./exam";
import { useNewAward } from "~/stores/new-award";

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
  enable: boolean;
};

export type PlanetTrack = {
  studentId: string;
  examId: string;
  examDate: Date;
  current: boolean;
  planetTrack: SimplifiedPlanet[];
  examPerformed: boolean;
};

export type Award = {
  id: string;
  name: string;
  title: string;
  description: string;
};

type GetQuestionInput = {
  questionId: string | number;
  optionsAnswered: QuestionOption[];
};

type PlanetFeedback = { planetName: string; stars: number };
type GetExamQuestionResponse =
  | Question
  | { examCompleted: true; newAwards?: Award[] };

const KEY = {
  STUDENT: "STUDENT",
  PLANET_TRACK: "PLANET_TRACK",
  GET_STUDENT_AWARDS: "GET_STUDENT_AWARDS",
  FIRST_QUESTION: "FIRST_QUESTION",
  EXAM_EVALUATION: "EXAM_EVALUATION",
  PLANET_FEEDBACK: "PLANET_FEEDBACK",
  AWARDS: "STUDENT_AWARDS",
  GET_ALL: "ALL_STUDENTS",
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
  PLANET_FEEDBACK: (studentId: string, planetId: string) =>
    `student/${studentId}/planets/${planetId}`,
  GET_ALL: "student/all-no-auth",
};

type StudentGetAllSearch = {
  schoolClassId?: string;
  initialLetter?: string;
} & PaginationParams;

export class StudentAPI extends API {
  static async getAllStudents(search?: StudentGetAllSearch) {
    const { data } = await this.api.get<Paginated<Student>>(URL.GET_ALL, {
      params: search,
    });

    return data;
  }

  static async getStudent(studentId: string) {
    const { data } = await this.api.get<Student>(URL.GET_STUDENT(studentId));
    return data;
  }

  static async getPlanetTrack(studentId: string) {
    const { data } = await this.api.get<PlanetTrack>(
      URL.GET_STUDENT_PLANET_TRACK(studentId),
    );

    return data;
  }

  static async getStudentAwards(studentId: string) {
    const { data } = await this.api.get<Award[]>(
      URL.GET_STUDENT_AWARDS(studentId),
    );
    return data;
  }

  static async getFirstExamQuestion(studentId: string) {
    const { data } = await this.api.get<Question>(
      URL.GET_STUDENT_EXAM_QUESTIONS_1(studentId),
    );
    return data;
  }

  static async getExamQuestion(studentId: string, input: GetQuestionInput) {
    const { data } = await this.api.post<GetExamQuestionResponse>(
      URL.GET_STUDENT_EXAM_QUESTIONS(
        studentId,
        "fa387b6c-7ecf-4752-aeb3-c810a912c421", // TODO: pegar id do exam
      ),
      input,
    );

    return data;
  }

  static async submitExamEvaluation(studentId: string) {
    const { data } = await this.api.post(URL.EXAM_EVALUATION(studentId));
    return data;
  }

  static async planetFeedback(studentId: string, planetId: string) {
    const { data } = await this.api
      .get<PlanetFeedback>(URL.PLANET_FEEDBACK(studentId, planetId))
      .then((result) => result)
      .catch((error: Error) => {
        throw new Error(error.message);
      });
    return data;
  }
}

export function useGetPlanetTrack(
  options?: QueryOptions<PlanetTrack, [typeof KEY.PLANET_TRACK]>,
) {
  const studentId = useStudent((state) => state.id);

  const handler = useCallback(function () {
    return StudentAPI.getPlanetTrack(studentId);
  }, []);

  return useQuery([KEY.PLANET_TRACK], handler, options);
}

export function useGetStudentAwards(
  options?: QueryOptions<Award[], [typeof KEY.AWARDS]>,
) {
  const studentId = useStudent((state) => state.id);

  const handler = useCallback(function () {
    return StudentAPI.getStudentAwards(studentId);
  }, []);

  return useQuery([KEY.GET_STUDENT_AWARDS], handler, options);
}

export function useGetFirstExamQuestion(
  options?: QueryOptions<Question, [typeof KEY.FIRST_QUESTION]>,
) {
  const studentId = useStudent((state) => state.id);

  const handler = useCallback(function () {
    return StudentAPI.getFirstExamQuestion(studentId);
  }, []);

  return useQuery([KEY.FIRST_QUESTION], handler, options);
}

export function useGetExamQuestion(
  options?: MutationOptions<GetQuestionInput, GetExamQuestionResponse>,
) {
  const { setNewAwards } = useNewAward();
  const studentId = useStudent((state) => state.id);
  const handler = useCallback(function (input: GetQuestionInput) {
    return StudentAPI.getExamQuestion(studentId, input);
  }, []);

  return useMutation(handler, {
    ...options,
    onSuccess: (data, vars, ctx) => {
      type AwardCase = { newAwards: Award[] }; // 🤡 typescript
      if (
        (data as AwardCase).newAwards &&
        (data as AwardCase).newAwards.length
      ) {
        const newAwards = (data as AwardCase).newAwards.map((a) => a.name);
        setNewAwards(newAwards);
      }
      options?.onSuccess?.(data, vars, ctx);
    },
  });
}

export function useSubmitExamEvaluation(
  options?: QueryOptions<
    Question | { newAwards: Award[] },
    [typeof KEY.EXAM_EVALUATION]
  >,
) {
  const { setNewAwards, requestView } = useNewAward();
  const studentId = useStudent((state) => state.id);
  const handler = useCallback(function () {
    return StudentAPI.submitExamEvaluation(studentId);
  }, []);

  return useQuery([KEY.EXAM_EVALUATION], handler, {
    ...options,
    onSuccess: (data) => {
      type AwardCase = { newAwards: Award[] }; // 🤡 typescript
      if (
        (data as AwardCase).newAwards &&
        (data as AwardCase).newAwards.length
      ) {
        const newAwards = (data as AwardCase).newAwards.map((a) => a.name);
        setNewAwards(newAwards);
        requestView();
      }

      options?.onSuccess?.(data);
    },
  });
}

export function usePlanetFeedback(
  planetId: string,
  options?: QueryOptions<PlanetFeedback, [typeof KEY.PLANET_FEEDBACK]>,
) {
  const studentId = useStudent((state) => state.id);
  const queryClient = useQueryClient();

  const handler = useCallback(function () {
    return StudentAPI.planetFeedback(studentId, planetId);
  }, []);

  return useQuery([KEY.PLANET_FEEDBACK], handler, {
    ...options,
    onSuccess: (data, vars, ctx) => {
      options?.onSuccess?.(data, vars, ctx);
      queryClient.setQueryData([KEY.PLANET_TRACK], (oldData: PlanetTrack) => {
        if (!oldData || !oldData.planetTrack) return oldData;

        const toUpdate = oldData.planetTrack.find(
          (planet) => planet.planetName === data.name,
        );

        if (!toUpdate) return oldData;

        toUpdate.stars = data.stars;
        const newTrack = oldData.planetTrack.filter(
          (p) => p.planetName !== data.name,
        );
        newTrack.push(toUpdate);

        return {
          ...oldData,
          planetTrack: newTrack,
        };
      });
    },
  });
}

export function useStudentGetAll(
  search?: StudentGetAllSearch,
  options?: QueryOptions<
    Paginated<Student>,
    [typeof KEY.GET_ALL, StudentGetAllSearch | undefined]
  >,
) {
  const handler = useCallback(
    function () {
      return StudentAPI.getAllStudents(search);
    },
    [search],
  );

  return useQuery([KEY.GET_ALL, search], handler, options);
}
