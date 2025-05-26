import { envSchema } from "../config/env.schema";
import { createEnv } from "@t3-oss/env-core";

const _env = createEnv({
	clientPrefix: "VITE_",
	client: envSchema,

	runtimeEnv: import.meta.env,
	isServer: false,
});

export const env = {
	..._env,
	isDev: ["offline", "development"].includes(import.meta.env.MODE),
	isQA: import.meta.env.MODE === "qa",
	isProd: import.meta.env.MODE === "production",
};
