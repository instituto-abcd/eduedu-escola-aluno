import { ENV_TAG } from "config/env.schema";

export function envFeatureFlag(mode: keyof typeof ENV_TAG) {
	return import.meta.env.MODE === ENV_TAG[mode];
}
