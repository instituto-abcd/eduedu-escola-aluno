import { useCallback } from "react";
import { API } from "./base";
import { useQuery } from "@tanstack/react-query";
import { QueryOptions } from "./api-types";
import { Planet } from "./student";

const URL = {
  PLANETS: "/planet",
};

const KEY = {
  PLANETS: "DEBUG_PLANETS",
} as const;

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
