import {
  UnstyledButton,
  createPolymorphicComponent,
  type ButtonProps,
} from "@mantine/core";

type Props = {
  size?: number;
} & Omit<ButtonProps, "size">;

function _ButtonContinue({ children: _, size = 50, ...props }: Props) {
  return (
    <UnstyledButton {...props}>
      <svg
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          minWidth: size,
          minHeight: size,
          filter: props.disabled ? "grayscale(1)" : undefined,
        }}
      >
        <path
          d="M25 0C11.1967 0 0 11.1967 0 25C0 38.8033 11.1967 50 25 50C38.8033 50 50 38.8033 50 25C50 11.1967 38.8092 0 25 0Z"
          fill="url(#paint0_linear_5551_6858)"
        />
        <g
          style={{
            mixBlendMode: "screen",
          }}
        >
          <path
            d="M25 0C17.891 0 11.481 2.97394 6.93127 7.73697C11.4218 3.43602 17.5059 0.793837 24.2062 0.793837C38.0154 0.793837 49.2062 11.9905 49.2062 25.7938C49.2062 32.4941 46.564 38.5723 42.2749 43.0628C47.032 38.513 50 32.1031 50 25C50.0059 11.1967 38.8092 0 25 0Z"
            fill="#686159"
          />
        </g>
        <path
          d="M41.8016 27.6313L27.5775 38.197C26.1199 39.0735 24.2525 38.0159 24.2525 36.3105V33.7287H11.4385C10.9431 33.7287 10.4762 33.5572 10.1047 33.2714L9.69498 32.8618C9.41867 32.4902 9.24719 32.0328 9.24719 31.5279V19.962C9.24719 18.752 10.2285 17.7706 11.4385 17.7706H24.2525V15.1793C24.2525 13.6644 25.7292 12.6546 27.0821 13.0738C27.2536 13.1213 27.4155 13.1976 27.5775 13.2929L41.8016 23.8681C41.9731 23.9728 42.135 24.0967 42.2684 24.2397C43.2021 25.2114 43.0401 26.8882 41.8016 27.6313Z"
          fill="white"
        />
        <defs>
          <linearGradient
            id="paint0_linear_5551_6858"
            x1={-7.42595}
            y1={57.4259}
            x2={50.7435}
            y2={-0.743484}
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

export const ButtonContinue = createPolymorphicComponent<"button", Props>(
  _ButtonContinue,
);
