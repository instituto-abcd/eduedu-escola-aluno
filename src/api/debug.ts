import { useCallback } from "react";
import { API } from "./base";
import { useQuery } from "@tanstack/react-query";
import { QueryOptions } from "./api-types";
import { Planet } from "./student";
import { Question } from "./exam";

const URL = {
  PLANETS: "/planet",
  QUESTIONS: "/exam/questions",
};

const KEY = {
  PLANETS: "DEBUG_PLANETS",
  QUESTIONS: "DEBUG_QUESTIONS",
} as const;

class DebugAPI extends API {
  static async planets() {
    const { data } = await this.api.get<Planet[]>(URL.PLANETS);

    return data;
  }

  static async examQuestions() {
    const { data } = await this.api.get<Question[]>(URL.QUESTIONS);

    return data;
  }
}

export function useDebugPlanets(
  options?: QueryOptions<Planet[], [typeof KEY.PLANETS]>
) {
  const handler = useCallback(function () {
    return DebugAPI.planets();
  }, []);

  return useQuery([KEY.PLANETS], handler, options);
}

export function useDebugQuestions(
  options?: QueryOptions<Question[], [typeof KEY.QUESTIONS]>
) {
  const handler = useCallback(function () {
    return DebugAPI.examQuestions();
  }, []);

  return useQuery([KEY.QUESTIONS], handler, options);
}
