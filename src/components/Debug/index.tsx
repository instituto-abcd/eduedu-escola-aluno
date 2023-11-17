import {
  IconSquare0Filled,
  IconSquare1Filled,
  IconSquare2Filled,
  IconSquare3Filled,
  IconSquare4Filled,
  IconSquare5Filled,
  IconSquare6Filled,
  IconSquare7Filled,
  IconSquare8Filled,
  IconSquare9Filled,
} from "@tabler/icons-react";

export const debug_numberIcons: Record<number, JSX.Element> = {
  1: <IconSquare1Filled />,
  2: <IconSquare2Filled />,
  3: <IconSquare3Filled />,
  4: <IconSquare4Filled />,
  5: <IconSquare5Filled />,
  6: <IconSquare6Filled />,
  7: <IconSquare7Filled />,
  8: <IconSquare8Filled />,
  9: <IconSquare9Filled />,
  0: <IconSquare0Filled />,
};

export const debug_getNumberIcon = (entry: unknown) => {
  const index = !Number.isInteger(entry)
    ? typeof entry === "string"
      ? Number.isInteger(+entry)
        ? +entry
        : 0
      : 0
    : (entry as number);

  const icon = Object.hasOwn(debug_numberIcons, index)
    ? debug_numberIcons[index]
    : debug_numberIcons[0];
  return icon;
};

export type DebugProps = {
  skipDebug?: boolean;
  debugProperty?: "isCorrect" | "position";
  overwriteIsCorrect?: boolean;
  size?: number;
  outside?: boolean;
};
