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
import { Planet1 } from "./Planet1";
import { Planet2 } from "./Planet2";
import { Planet3 } from "./Planet3";
import { Planet4 } from "./Planet4";

type Props = {
  set?: "sprites" | "planets";
  id: number;
} & Omit<SVGProps<SVGSVGElement>, "id">;

export function Sprite({ id, set = "sprites", ...props }: Props) {
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

  const planets = [
    <Planet1 {...props} />,
    <Planet2 {...props} />,
    <Planet3 {...props} />,
    <Planet4 {...props} />,
  ];

  if (set === "sprites") return sprites[id % sprites.length];
  if (set === "planets") return planets[id % planets.length];
}
