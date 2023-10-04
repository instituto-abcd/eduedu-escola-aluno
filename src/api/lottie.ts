import { useCallback } from "react";
import { API } from "./base";
import { useQuery } from "@tanstack/react-query";
import { QueryOptions } from "./api-types";

class LottieAPI extends API {
  static async downloadLottieFile(url: string) {
    const { data } = await this.api.get(url, {
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

    return data;
  }
}

export function useDownloadLottieFile(
  lottieUrl: string,
  options: QueryOptions<string, ["lottie", string]>
) {
  const handler = useCallback(
    function () {
      return LottieAPI.downloadLottieFile(lottieUrl);
    },
    [lottieUrl]
  );

  return useQuery(["lottie", lottieUrl], handler, options);
}
