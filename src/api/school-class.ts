import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "./base";
import { useCallback } from "react";
import {
  MutationOptions,
  Paginated,
  PaginationParams,
  QueryOptions,
} from "./api-types";

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

export type SimplifiedStudent = {
  id: string;
  name: string;
  registry: string;
  status: string;
  reserved: boolean;
  examPerformed: boolean;
  firstAccess: boolean;
};

export type SchoolGrade =
  | "CHILDREN"
  | "FIRST_GRADE"
  | "SECOND_GRADE"
  | "THIRD_GRADE"
  | "FOURTH_GRADE"
  | "FIFTH_GRADE";

export type SchoolPeriod = "MORNING" | "AFTERNOON" | "FULL";

export class SchoolClassAPI extends API {
  static async getStudentsById(
    id: string,
    params?: PaginationParams & { name?: string },
  ) {
    const { data } = await this.api.get<Paginated<SimplifiedStudent>>(
      URL.GET_STUDENTS_BY_ID(id),
      {
        params,
      },
    );
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
  options?: QueryOptions<
    Paginated<SimplifiedStudent>,
    Array<string | number | undefined>
  > & { search?: { name?: string } },
) {
  const handler = useCallback(
    function() {
      return SchoolClassAPI.getStudentsById(schoolClassId, {
        "page-number": options?.page,
        "page-size": options?.pageSize,
        name: options?.search?.name,
      });
    },
    [options?.page, options?.pageSize, options?.search?.name, schoolClassId],
  );

  return useQuery(
    [
      KEY.GET_STUDENTS_BY_ID,
      schoolClassId,
      options?.search?.name ?? "",
      options?.page,
      options?.pageSize,
    ],
    handler,
    options,
  );
}

export function useReserveStudent(
  options?: MutationOptions<
    {
      id: string;
      studentId: string;
    },
    ReserveStudent
  >,
) {
  const handler = useCallback(function(data: {
    id: string;
    studentId: string;
  }) {
    return SchoolClassAPI.reserveStudent(data.id, data.studentId);
  }, []);

  return useMutation(handler, options);
}

export function useUnreserveStudent(
  options?: MutationOptions<
    {
      id: string;
      studentId: string;
    },
    ReserveStudent
  >,
) {
  const handler = useCallback(function(data: {
    id: string;
    studentId: string;
  }) {
    return SchoolClassAPI.unreserveStudent(data.id, data.studentId);
  }, []);

  return useMutation(handler, options);
}
