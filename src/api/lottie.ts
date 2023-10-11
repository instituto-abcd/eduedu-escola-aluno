import { useCallback } from "react";
import { API } from "./base";
import { useQuery } from "@tanstack/react-query";
import { QueryOptions } from "./api-types";

class LottieAPI extends API {
  static async downloadLottieFile(lottieId: string) {
    const { data } = await this.api.get(`lottie/${lottieId}`);

    return data;
  }
}

export function useDownloadLottieFile(
  lottieId: string,
  options: QueryOptions<string, ["lottie", string]>
) {
  const handler = useCallback(
    function () {
      return LottieAPI.downloadLottieFile(lottieId);
    },
    [lottieId]
  );

  return useQuery(["lottie", lottieId], handler, options);
}
