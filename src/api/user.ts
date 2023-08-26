import { useCallback } from "react";
import { API } from "./base";
import { QueryOptions } from "./api-types";
import { useQuery } from "@tanstack/react-query";

const KEY = {
  SCHOOL_CLASSES: "SCHOOL_CLASSES",
};

const URL = {
  SCHOOL_CLASSES: "user/school-classes/all",
};

type SchoolClass = {
  id: string;
  name: string;
};

type SchoolClassSearch = {
  "page-number"?: number;
  "page-size"?: number;
  name?: string;
  schoolGrade?: string;
  schoolPeriod?: string;
  schoolYearId?: string;
  teacherIds?: string[];
};

export class UserAPI extends API {
  static async getSchoolClasses(params?: SchoolClassSearch) {
    const { data } = await this.api.get<SchoolClass[]>(URL.SCHOOL_CLASSES, {
      params,
    });
    return data;
  }
}

export function useUserSchoolClasses(
  options?: QueryOptions<
    SchoolClass[],
    [string, SchoolClassSearch | undefined]
  > & { search?: SchoolClassSearch }
) {
  const handler = useCallback(
    function () {
      return UserAPI.getSchoolClasses(options?.search);
    },
    [options?.search]
  );

  return useQuery([KEY.SCHOOL_CLASSES, options?.search], handler, options);
}
