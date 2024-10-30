import { useQuery } from "@tanstack/react-query";
import { API } from "./base";
import { useCallback } from "react";
import { Paginated, QueryOptions } from "./api-types";

const URL = {
  GET_STUDENTS_BY_ID: (id: string) => `schoolClass/${id}/students`,
  RESERVE_STUDENT: (id: string, studentId: string) =>
    `schoolClass/${id}/students/${studentId}/reserved`,
  COUNT_SCHOOL_GRADE: "schoolClass/count/school-grade",
  ALL: "schoolClass/all-no-auth",
};

const KEY = {
  GET_STUDENTS_BY_ID: "STUDENTS_BY_CLASS",
  GRADE_COUNT: "SCHOOL_GRADE_COUNT",
  ALL: "SCHOOL_CLASS_ALL",
};

export type SchoolClass = {
  id: string;
  name: string;
  schoolGrade: SchoolGrade;
  studentsCount: number;
  teachers: {
    id: string;
    name: string;
  }[];
  schoolYear: {
    id: string;
    name: string;
  };
};

type SchoolGradeCount = {
  schoolGrade: SchoolGrade;
  count: number;
};

export type SchoolGrade =
  | "CHILDREN"
  | "FIRST_GRADE"
  | "SECOND_GRADE"
  | "THIRD_GRADE"
  | "FOURTH_GRADE"
  | "FIFTH_GRADE";

type SchoolClassAllParams = Partial<{
  schoolGrade: SchoolGrade;
}>;

export type SchoolPeriod = "MORNING" | "AFTERNOON" | "FULL";

class SchoolClassAPI extends API {
  static async countSchoolGrade() {
    const { data } = await this.api.get<SchoolGradeCount[]>(
      URL.COUNT_SCHOOL_GRADE
    );
    return data;
  }

  static async getAll(params?: SchoolClassAllParams) {
    const { data } = await this.api.get<Paginated<SchoolClass>>(URL.ALL, {
      params,
    });
    return data;
  }
}

export function useSchoolClassGetAll(
  options?: QueryOptions<Paginated<SchoolClass>, [typeof KEY.ALL, any]> & {
    params?: SchoolClassAllParams;
  }
) {
  const handler = useCallback(
    function () {
      return SchoolClassAPI.getAll(options?.params);
    },
    [options?.params]
  );

  return useQuery([KEY.ALL, options?.params], handler, options);
}

export function useSchoolGradeCount(
  options?: QueryOptions<SchoolGradeCount[], [typeof KEY.GRADE_COUNT]>
) {
  const handler = useCallback(function () {
    return SchoolClassAPI.countSchoolGrade();
  }, []);

  return useQuery([KEY.GRADE_COUNT], handler, options);
}
