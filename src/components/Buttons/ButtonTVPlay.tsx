import {
  UnstyledButton,
  createPolymorphicComponent,
  type ButtonProps,
} from "@mantine/core";
import { useId } from "react";

type Props = {
  size?: number;
} & Omit<ButtonProps, "size">;

function _ButtonTVPlay({ children: _, size = 50, ...props }: Props) {
  const id1 = useId();
  const id2 = useId();

  return (
    <UnstyledButton {...props}>
      <svg
        style={{ minWidth: size, minHeight: size }}
        id={id1}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1079.23675 1079.23675"
      >
        <defs>
          <style>{".cls-1{fill:#4dcefe;}.cls-2{fill:#fff;}"}</style>
        </defs>
        <g id={id2}>
          <path
            className="cls-1"
            d="M1079.23675,539.61838c0,298.023-241.59538,539.61838-539.61838,539.61838S0,837.64137,0,539.61838,241.59538,0,539.61838,0s539.61838,241.59538,539.61838,539.61838Z"
          />
          <rect
            className="cls-2"
            x={182.36671}
            y={248.31763}
            width={744.1626}
            height={549.76803}
            rx={59.97486}
            ry={59.97486}
          />
          <rect
            className="cls-1"
            x={251.16863}
            y={317.21188}
            width={606.55876}
            height={401.52481}
          />
          <path
            className="cls-2"
            d="M422.08832,406.55309v222.74293c0,15.60073,16.41641,25.74853,30.3713,18.77402l222.74293-111.32471c15.47064-7.73207,15.47435-29.80762.00631-37.54488l-222.74293-111.41823c-13.9553-6.98058-30.3776,3.16705-30.3776,18.77087Z"
          />
          <rect
            className="cls-2"
            x={413.13675}
            y={782.86757}
            width={282.62252}
            height={84.09558}
          />
        </g>
      </svg>
    </UnstyledButton>
  );
}

export const ButtonTVPlay = createPolymorphicComponent<"button", Props>(
  _ButtonTVPlay
);
