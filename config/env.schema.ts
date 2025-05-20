import { z } from "zod";

export const envSchema = {
	VITE_API_URL: z.string().url(),
	VITE_ADMIN_URL: z.string().url(),
};

export const envObjectSchema = z.object(envSchema);

export const ENV_TAG = {
	PROD: "production",
	QA: "qa",
	DEV: "development",
} as const;
