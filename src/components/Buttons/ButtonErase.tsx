import {
  UnstyledButton,
  createPolymorphicComponent,
  type ButtonProps,
} from "@mantine/core";
import { useId } from "react";

type Props = {
  size?: number;
} & Omit<ButtonProps, "size">;

function _ButtonErase({ children: _, size = 50, ...props }: Props) {
  const id1 = useId();

  return (
    <UnstyledButton {...props}>
      <svg
        id={id1}
        style={{ minWidth: size, minHeight: size }}
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M150 0C67.0152 0 0 67.0152 0 150C0 232.985 67.0152 300 150 300C232.985 300 300 232.985 300 150C300 67.0152 232.7 0 150 0Z"
          fill="#D7D7D7"
        />
        <path
          d="M222.443 147.113L135.166 224.189C133.879 225.224 132.334 226 130.532 226C123.323 226 114.312 225.741 105.044 225.741C102.984 225.741 101.182 224.965 99.8945 223.414L68.2275 186.686C60.5039 177.892 61.5337 164.701 70.0297 156.941L160.911 76.7607C173.784 65.3802 193.351 66.6735 204.421 79.6058L225.275 103.401C236.603 116.075 235.316 135.991 222.443 147.113Z"
          fill="#458BC6"
        />
        <path
          d="M180.67 185L229.954 141.473C238.47 133.96 239.502 120.487 231.761 111.937L197.7 73.0743C190.217 64.5244 176.8 63.4881 168.284 71.2607L119 114.528L180.67 185Z"
          fill="#F57981"
        />
      </svg>
    </UnstyledButton>
  );
}

export const ButtonErase = createPolymorphicComponent<"button", Props>(
  _ButtonErase
);
