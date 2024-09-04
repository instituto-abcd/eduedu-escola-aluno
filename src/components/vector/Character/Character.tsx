import { SVGProps } from "react";
import { Char1 } from "./Char1";
import { Char2 } from "./Char2";
import { Char3 } from "./Char3";
import { Char4 } from "./Char4";
import { Char5 } from "./Char5";
import { Char6 } from "./Char6";

type Props = {
  id: number;
} & Omit<SVGProps<SVGSVGElement>, "id">;

export function Character({ id, ...props }: Props) {
  const characters = [
    null,
    <Char1 {...props} />,
    <Char2 {...props} />,
    <Char3 {...props} />,
    <Char4 {...props} />,
    <Char5 {...props} />,
    <Char6 {...props} />,
  ];

  if (id > characters.length) return null;

  return characters[id];
}
