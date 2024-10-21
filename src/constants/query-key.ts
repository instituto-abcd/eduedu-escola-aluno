import { DEBUG_API_QUERY_KEYS } from "~/api/debug";
import { PLANET_API_LOADER_KEYS } from "~/api/planet";

export const queryKeyLoadingState: string[] = [
  ...DEBUG_API_QUERY_KEYS,
  ...PLANET_API_LOADER_KEYS,
];
