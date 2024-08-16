import { SVGProps } from "react";
import { Sprite1 } from "./Sprite1";
import { Sprite2 } from "./Sprite2";
import { Sprite3 } from "./Sprite3";
import { Sprite4 } from "./Sprite4";
import { Sprite5 } from "./Sprite5";
import { Sprite6 } from "./Sprite6";
import { Sprite7 } from "./Sprite7";
import { Sprite8 } from "./Sprite8";
import { Sprite9 } from "./Sprite9";
import { Sprite10 } from "./Sprite10";

type Props = {
  id: number;
} & Omit<SVGProps<SVGSVGElement>, "id">;

export function Sprite({ id, ...props }: Props) {
  const sprites = [
    <Sprite1 {...props} />,
    <Sprite2 {...props} />,
    <Sprite3 {...props} />,
    <Sprite4 {...props} />,
    <Sprite5 {...props} />,
    <Sprite6 {...props} />,
    <Sprite7 {...props} />,
    <Sprite8 {...props} />,
    <Sprite9 {...props} />,
    <Sprite10 {...props} />,
  ];

  return sprites[id % sprites.length];
}
