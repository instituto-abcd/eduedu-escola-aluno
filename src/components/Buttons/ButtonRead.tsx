import {
  UnstyledButton,
  createPolymorphicComponent,
  type ButtonProps,
} from "@mantine/core";
import { useId } from "react";

type Props = {
  size?: number;
} & Omit<ButtonProps, "size">;

function _ButtonRead({ children: _, size = 50, ...props }: Props) {
  const id1 = useId();

  return (
    <UnstyledButton {...props}>
      <svg
        width={size}
        height={size}
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
          fill="#686159"
          style={{
            mixBlendMode: "screen",
          }}
        />
        <path
          d="M5.638 19.914a98 98 0 0 1 2.729 14.91 1.53 1.53 0 0 0 1.148 1.32c5.143 1.294 10.307 3.294 14.509 6.586-.003-5.474 0-18.37 0-18.37s-3.039-2.526-7.072-3.957c-3.258-1.155-6.682-1.879-10.133-1.974a1.184 1.184 0 0 0-1.181 1.485"
          fill="#F7F7F7"
        />
        <path
          d="M24.024 23.8s-5.508-5.661-17.115-6.115l-.185-2.876s11.414 1.426 17.3 8.992"
          fill="#F7F7F7"
        />
        <path
          d="M23.547 22.187C22.125 20.52 16.71 15.76 8.06 14.039l.091-2.559s9.963 2.665 15.45 10.67c.145.21.27.416-.054.037"
          fill="#F7F7F7"
        />
        <path
          d="M43.36 19.914a98 98 0 0 0-2.729 14.911 1.53 1.53 0 0 1-1.148 1.32c-5.143 1.293-10.307 3.293-14.509 6.585.003-5.474 0-18.37 0-18.37s3.039-2.525 7.072-3.956c3.258-1.156 6.682-1.88 10.133-1.974a1.184 1.184 0 0 1 1.18 1.484"
          fill="#E2E2E2"
        />
        <path
          d="M24.974 23.8s5.508-5.661 17.115-6.114l.302-2.877S29.076 17.187 24.974 23.8"
          fill="#E2E2E2"
        />
        <path
          d="M25.494 22.137c1.472-1.707 7.386-6.377 15.47-7.804V11.48s-10.023 2.66-15.523 10.604c-.16.231-.3.462.053.053"
          fill="#E2E2E2"
        />
        <defs>
          <linearGradient
            id={id1}
            x1={-7.426}
            y1={57.426}
            x2={50.743}
            y2={-0.743}
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFB800" />
            <stop
              offset={1}
              stopColor="#FFD400"
            />
          </linearGradient>
        </defs>
      </svg>
    </UnstyledButton>
  );
}

export const ButtonRead = createPolymorphicComponent<"button", Props>(
  _ButtonRead
);
