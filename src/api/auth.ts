import { useCallback } from "react";
import { API } from "./base";
import { useMutation } from "@tanstack/react-query";
import { MutationOptions } from "./api-types";
import { useUserStore } from "~/stores/user";
import { decodeJwt } from "~/utils/decodeJwt";
import { z } from "zod";

const URL = {
  AUTH_ACCESS_KEY: "/auth/access-key",
};
export type UserLogin = Pick<UserAuth, "accessKey">;
type UserAuth = {
  accessKey?: string;
  token?: string;
};

export type LoginResponse = {
  id: string;
  name: string;
  email: string;
  document: string;
  accessToken: string;
};
class AuthAPI extends API {
  static async loginAccessKey(input?: UserLogin) {
    const { data } = await this.api.post(URL.AUTH_ACCESS_KEY, input);
    return data;
  }
}

export function useAuthLogin(
  options?: MutationOptions<UserLogin, LoginResponse>
) {
  const handler = useCallback(function (data: UserLogin) {
    return AuthAPI.loginAccessKey(data);
  }, []);

  return useMutation(handler, {
    ...options,

    onSuccess: (data, vars, ctx) => {
      const tokenValidation = z.object({
        email: z.string().email(),
        iat: z.number(),
      });

      const token = decodeJwt(data.accessToken) as z.infer<typeof tokenValidation>;

      tokenValidation.parse(token);

      useUserStore.setState({ ...data });
      options?.onSuccess?.(data, vars, ctx);
    },
  });
}