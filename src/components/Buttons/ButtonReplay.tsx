import {
  UnstyledButton,
  createPolymorphicComponent,
  type ButtonProps,
} from "@mantine/core";
import { useId } from "react";

type Props = {
  size?: number;
} & Omit<ButtonProps, "size">;

function _ButtonReplay({ children: _, size = 50, ...props }: Props) {
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
          d="M25 0C11.197 0 0 11.197 0 25s11.197 25 25 25 25-11.197 25-25S38.81 0 25 0"
          fill={`url(#${id1})`}
        />
        <path
          d="M25 0C17.891 0 11.481 2.974 6.931 7.737A24.9 24.9 0 0 1 24.206.794c13.81 0 25 11.197 25 25 0 6.7-2.642 12.778-6.931 17.269C47.032 38.513 50 32.103 50 25c.006-13.803-11.19-25-25-25"
          fill={`url(#${id2})`}
          style={{
            mixBlendMode: "screen",
          }}
        />
        <path
          d="M37.692 25.542c0 6.818-5.761 12.316-12.67 11.881a11.89 11.89 0 0 1-11.116-11.121c-.432-6.914 5.076-12.676 11.9-12.665h.001v1.68c0 .774.838 1.259 1.509.871l6.3-3.637c.67-.387.67-1.355 0-1.742l-6.3-3.637a1.006 1.006 0 0 0-1.509.87v1.325h-.02c-9.301 0-16.794 7.89-16.135 17.33a16.136 16.136 0 0 0 14.98 14.98c9.439.66 17.33-6.833 17.33-16.135z"
          fill="#fff"
        />
        <defs>
          <linearGradient
            id={id1}
            x1={-43.894}
            y1={108.139}
            x2={66.243}
            y2={-24.77}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF001C" />
            <stop offset={0.22} stopColor="#160C5A" />
            <stop offset={0.29} stopColor="#15115E" />
            <stop offset={0.38} stopColor="#12226D" />
            <stop offset={0.49} stopColor="#0059D4" />
            <stop offset={0.689} stopColor="#0297CD" />
            <stop offset={0.77} stopColor="#0AD" />
            <stop offset={1} stopColor="#FFD400" />
          </linearGradient>
          <linearGradient
            id={id2}
            x1={-43.867}
            y1={108.159}
            x2={66.269}
            y2={-24.75}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF001C" />
            <stop offset={0.22} stopColor="#FF009D" />
            <stop offset={0.27} stopColor="#F9039E" />
            <stop offset={0.33} stopColor="#E80FA2" />
            <stop offset={0.41} stopColor="#CC21A9" />
            <stop offset={0.49} stopColor="#A53BB3" />
            <stop offset={0.57} stopColor="#725DC0" />
            <stop offset={0.66} stopColor="#3685CF" />
            <stop offset={0.74} stopColor="#0AD" />
            <stop offset={1} stopColor="#FFD400" />
          </linearGradient>
        </defs>
      </svg>
    </UnstyledButton>
  );
}

export const ButtonReplay = createPolymorphicComponent<"button", Props>(
  _ButtonReplay,
);
