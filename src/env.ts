import { envSchema } from "../config/env.schema";
import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: envSchema,

	runtimeEnv: import.meta.env,
	isServer: false,
});
