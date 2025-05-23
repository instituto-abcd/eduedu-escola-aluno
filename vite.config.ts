import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { envObjectSchema } from "./config/env.schema";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		plugins: [
			react(),
			// {
			// 	name: "validate-env-vars",
			// 	buildStart: () => {
			// 		const env = loadEnv(mode, process.cwd(), "");
			// 		envObjectSchema.parse(env);
			// 	},
			// },
		],
		resolve: {
			alias: {
				"~": "/src",
			},
		},
	};
});
