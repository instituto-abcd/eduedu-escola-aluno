import { useCallback } from "react";
import { API } from "./base";
import { QueryOptions } from "./api-types";
import { useQuery } from "@tanstack/react-query";
import { SchoolClass } from "./school-class";

const KEY = {
  SCHOOL_CLASSES: "SCHOOL_CLASSES",
  ACCESS_CODE: "ACCESS_CODE",
};

const URL = {
  SCHOOL_CLASSES: "user/school-classes/all",
  ACCESS_CODES: (id: string) => `user/${id}/access-key-options`,
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

export type AccessCodes = {
  accessKey: string;
  correctAnswer: boolean;
};

export class UserAPI extends API {
  static async getSchoolClasses(params?: SchoolClassSearch) {
    const { data } = await this.api.get<SchoolClass[]>(URL.SCHOOL_CLASSES, {
      params,
    });
    return data;
  }

  static async getAccessCodes(id: string) {
    const { data } = await this.api.get<AccessCodes[]>(URL.ACCESS_CODES(id));
    return data;
  }
}

export function useUserSchoolClasses(
  options?: QueryOptions<
    SchoolClass[],
    [string, SchoolClassSearch | undefined]
  > & { search?: SchoolClassSearch },
) {
  const handler = useCallback(
    function() {
      return UserAPI.getSchoolClasses(options?.search);
    },
    [options?.search],
  );

  return useQuery([KEY.SCHOOL_CLASSES, options?.search], handler, options);
}

export function useGetAccessCodes(
  userId: string,
  options?: QueryOptions<AccessCodes[], [typeof KEY.ACCESS_CODE]>,
) {
  const handler = useCallback(
    function() {
      return UserAPI.getAccessCodes(userId);
    },
    [userId],
  );

  return useQuery([KEY.ACCESS_CODE], handler, options);
}
