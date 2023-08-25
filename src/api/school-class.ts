import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "./base";
import { useCallback } from "react";
import { MutationOptions, PaginationParams, QueryOptions } from "./api-types";
import { Student } from "./student";

const URL = {
  GET_STUDENTS_BY_ID: (id: string) => `schoolClass/${id}/students`,
  RESERVE_STUDENT: (id: string, studentId: string) =>
    `schoolClass/${id}/students/${studentId}/reserved`,
};

const KEY = {
  GET_STUDENTS_BY_ID: "STUDENTS_BY_CLASS",
};

type ReserveStudent = {
  id: string;
  studentId: string;
};

export type SchoolGrade =
  | "CHILDREN"
  | "FIRST_GRADE"
  | "SECOND_GRADE"
  | "THIRD_GRADE";
export type SchoolPeriod = "MORNING" | "AFTERNOON" | "FULL";

export class SchoolClassAPI extends API {
  static async getStudentsById(id: string, params?: PaginationParams) {
    const { data } = await this.api.get<Student[]>(URL.GET_STUDENTS_BY_ID(id), {
      params,
    });
    return data;
  }

  static async reserveStudent(id: string, studentId: string) {
    const { data } = await this.api.patch(URL.RESERVE_STUDENT(id, studentId), {
      reserved: true,
    });
    return data;
  }

  static async unreserveStudent(id: string, studentId: string) {
    const { data } = await this.api.patch(URL.RESERVE_STUDENT(id, studentId), {
      reserved: false,
    });
    return data;
  }
}

export function useStudentsBySchoolclass(
  schoolClassId: string,
  options?: QueryOptions<Student[], [typeof KEY.GET_STUDENTS_BY_ID]>
) {
  const handler = useCallback(
    function () {
      return SchoolClassAPI.getStudentsById(schoolClassId, {
        "page-number": options?.page,
        "page-size": options?.pageSize,
      });
    },
    [options?.page, options?.pageSize]
  );

  return useQuery([KEY.GET_STUDENTS_BY_ID], handler, options);
}

export function useReserveStudent(
  options?: MutationOptions<
    {
      id: string;
      studentId: string;
    },
    ReserveStudent
  >
) {
  const handler = useCallback(function (data: {
    id: string;
    studentId: string;
  }) {
    return SchoolClassAPI.reserveStudent(data.id, data.studentId);
  },
  []);

  return useMutation(handler, options);
}

export function useUnreserveStudent(
  options?: MutationOptions<
    {
      id: string;
      studentId: string;
    },
    ReserveStudent
  >
) {
  const handler = useCallback(function (data: {
    id: string;
    studentId: string;
  }) {
    return SchoolClassAPI.unreserveStudent(data.id, data.studentId);
  },
  []);

  return useMutation(handler, options);
}
