import { DEBUG_API_QUERY_KEYS } from "~/api/debug";
import { PLANET_API_LOADER_KEYS } from "~/api/planet";
import { STUDENT_API_LOADER_KEYS } from "~/api/student";

export const queryKeyLoadingState: string[] = [
  ...DEBUG_API_QUERY_KEYS,
  ...PLANET_API_LOADER_KEYS,
  ...STUDENT_API_LOADER_KEYS,
];
