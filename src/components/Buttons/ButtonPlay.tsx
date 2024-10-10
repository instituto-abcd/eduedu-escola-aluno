import {
  UnstyledButton,
  createPolymorphicComponent,
  type ButtonProps,
} from "@mantine/core";
import { useId } from "react";

type Props = {
  size?: number;
} & Omit<ButtonProps, "size">;

function _ButtonPlay({ children: _, size = 50, ...props }: Props) {
  const id1 = useId();
  const id2 = useId();

  return (
    <UnstyledButton {...props}>
      <svg
        style={{ minWidth: size, minHeight: size }}
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M25 50C11.197 50 0 38.803 0 25S11.197 0 25 0s25 11.197 25 25-11.19 25-25 25"
          fill={`url(#${id1})`}
        />
        <path
          d="M25 50c-7.11 0-13.52-2.974-18.069-7.737a24.9 24.9 0 0 0 17.275 6.943c13.81 0 25-11.196 25-25 0-6.7-2.642-12.778-6.931-17.269C47.032 11.487 50 17.897 50 25c.006 13.803-11.19 25-25 25"
          fill={`url(#${id2})`}
        />
        <path
          d="M17.263 16.256v17.482c0 1.688 1.83 2.749 3.294 1.902l15.142-8.744c1.464-.848 1.464-2.957 0-3.804l-15.142-8.744c-1.463-.847-3.294.213-3.294 1.902z"
          fill="#fff"
        />
        <defs>
          <linearGradient
            id={id1}
            x1={-7.426}
            y1={-7.426}
            x2={50.743}
            y2={50.743}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF001C" />
            <stop offset={1} stopColor="#FFD400" />
          </linearGradient>
          <linearGradient
            id={id2}
            x1={-7.425}
            y1={-7.427}
            x2={50.745}
            y2={50.742}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF001C" />
            <stop offset={1} stopColor="#FFD400" />
          </linearGradient>
        </defs>
      </svg>
    </UnstyledButton>
  );
}

export const ButtonPlay = createPolymorphicComponent<"button", Props>(
  _ButtonPlay,
);
