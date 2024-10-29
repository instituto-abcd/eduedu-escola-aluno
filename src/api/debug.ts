import { useCallback } from "react";
import { API } from "./base";
import { useQuery } from "@tanstack/react-query";
import { QueryOptions } from "./api-types";
import { Planet } from "./student";
import { Question } from "./exam";

const URL = {
  PLANETS: "/planet",
  QUESTIONS: "/exam/questions",
  MODELS: "/planet/all-questions",
  MODEL_LIST: "/planet/question-models",
};

const KEY = {
  PLANETS: "DEBUG_PLANETS",
  QUESTIONS: "DEBUG_QUESTIONS",
  MODEL_QUESTION: "DEBUG_MODEL_QUESTION",
  MODEL_LIST: "DEBUG_MODEL_LIST",
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

  static async modelQuestions(modelId: string) {
    const { data } = await this.api.get<Question[]>(URL.MODELS, {
      params: { modelId },
    });

    return data;
  }

  static async modelList() {
    const { data } = await this.api.get<string[]>(URL.MODEL_LIST);

    return data;
  }
}

export function useDebugPlanets(
  options?: QueryOptions<Planet[], [typeof KEY.PLANETS]>,
) {
  const handler = useCallback(function() {
    return DebugAPI.planets();
  }, []);

  return useQuery([KEY.PLANETS], handler, options);
}

export function useDebugQuestions(
  options?: QueryOptions<Question[], [typeof KEY.QUESTIONS]>,
) {
  const handler = useCallback(function() {
    return DebugAPI.examQuestions();
  }, []);

  return useQuery([KEY.QUESTIONS], handler, options);
}

export function useDebugModelQuestions(
  modelId: string,
  options?: QueryOptions<Question[], [typeof KEY.MODEL_QUESTION, string]>,
) {
  const handler = useCallback(function() {
    return DebugAPI.modelQuestions(modelId);
  }, []);

  return useQuery([KEY.MODEL_QUESTION, modelId], handler, options);
}

export function useDebugModelList(
  options?: QueryOptions<string[], [typeof KEY.MODEL_LIST]>,
) {
  const handler = useCallback(function() {
    return DebugAPI.modelList();
  }, []);

  return useQuery([KEY.MODEL_LIST], handler, options);
}

export const DEBUG_API_QUERY_KEYS = Object.values(KEY);
