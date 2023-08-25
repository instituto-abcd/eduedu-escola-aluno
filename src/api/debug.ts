import { useCallback } from "react";
import { API } from "./base";
import { Question } from "./exam";
import { useQuery } from "@tanstack/react-query";
import { QueryOptions } from "./api-types";

const URL = {
  PLANETS: "/planet",
};

const KEY = {
  PLANETS: "DEBUG_PLANETS",
} as const;

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
  updated_at: { seconds: number; nanoseconds: number };
  questions: Question[];
};

class DebugAPI extends API {
  static async planets() {
    const { data } = await this.api.get<Planet[]>(URL.PLANETS);

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
