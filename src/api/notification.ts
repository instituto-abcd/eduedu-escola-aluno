import { UserProfile } from "~/constants";
import { API } from "./base";
import { useCallback } from "react";
import { MutationOptions, QueryOptions } from "./api-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Notification = {
  userId: string;
  notificationId: string;
  read: boolean;
  notification: {
    id: string;
    text: string;
    profiles: UserProfile;
    createdAt: string;
  };
};

const URL = {
  BASE: "notification",
};

const KEY = {
  BASE: "NOTIFICATION",
} as const;

class NotificationAPI extends API {
  static async get() {
    const { data } = await this.api.get<Notification[]>(URL.BASE);
    return data;
  }

  static async read() {
    const { data } = await this.api.patch(URL.BASE);
    return data;
  }
}

export function useNotificationGet(
  options?: QueryOptions<Notification[], [typeof KEY.BASE]>
) {
  const handler = useCallback(function () {
    return NotificationAPI.get();
  }, []);

  return useQuery(["NOTIFICATION"], handler, options);
}

export function useNotificationRead(options?: MutationOptions<void, void>) {
  const queryClient = useQueryClient();
  const handler = useCallback(function () {
    return NotificationAPI.read();
  }, []);

  return useMutation(handler, {
    ...options,
    onSuccess(data, variables, context) {
      queryClient.setQueryData([KEY.BASE], []);
      options?.onSuccess?.(data, variables, context);
    },
  });
}
