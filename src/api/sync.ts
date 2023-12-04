import { useCallback } from "react";
import { API } from "./base";
import { useQuery } from "@tanstack/react-query";
import { QueryOptions } from "./api-types";

type SyncStatus = {
  totalFiles: number;
  syncedFiles: number;
  percent: number;
  duration: string;
  running: boolean;
  currentOperation: string;
};

const URL = {
  SYNC_STATUS: "planet-sync/sync-status",
};

const KEY = {
  SYNCSTATUS: "SYNC_STATUS",
};

class SyncAPI extends API {
  static async getSyncStatus() {
    const { data } = await this.api.get<SyncStatus>(URL.SYNC_STATUS);
    return data;
  }
}

export function useSyncStatus(
  options?: QueryOptions<SyncStatus, [typeof KEY.SYNCSTATUS]>
) {
  const handler = useCallback(function () {
    return SyncAPI.getSyncStatus();
  }, []);

  return useQuery([KEY.SYNCSTATUS], handler, options);
}
