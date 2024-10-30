import { useCallback } from "react";
import { API } from "./base";
import { useQuery } from "@tanstack/react-query";
import { QueryOptions } from "./api-types";

export type LottieLayers = { layers: Record<string, string>[] };
type LottieType = Record<string, unknown> & LottieLayers;

class LottieAPI extends API {
  static async downloadLottieFile(lottieId: string) {
    const { data } = await this.api.get<LottieType>(`lottie/${lottieId}`);

    return data;
  }
}

export function useDownloadLottieFile(
  lottieId: string,
  options: QueryOptions<LottieType, ["lottie", string]>
) {
  const handler = useCallback(
    function () {
      return LottieAPI.downloadLottieFile(lottieId);
    },
    [lottieId]
  );

  return useQuery(["lottie", lottieId], handler, options);
}
