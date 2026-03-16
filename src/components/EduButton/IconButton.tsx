import { lousaWidth } from "~/constants/dimensions";
import { cx } from "~/utils/cx";
import styles from "./IconButton.module.css";

export type IconButtonProps = {
  icon: JSX.Element;
  variant?: "primary" | "gray" | "black" | "yellow" | "blue";
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const palette = {
  primary: {
    bg: "#47cdff",
    accent: "#25abe6",
    text: "#FFF",
  },
  gray: {
    bg: "#E9E9E9",
    accent: "#C4C4C4",
    text: "#C4C4C4",
  },
  black: {
    bg: "#3f4040",
    accent: "#111314",
    text: "#c4c4c4",
  },
  yellow: {
    bg: "#ffb802",
    accent: "#be8800",
    text: "#ffe071",
  },
  blue: {
    bg: "#3ACDFF",
    accent: "#11A8E0",
    text: "#ffffff",
  },
};

export function IconButton({
  icon,
  variant = "primary",
  style,
  ...props
}: IconButtonProps) {
  const colors = palette[variant];

  const dynamicStyle = {
    "--icon-btn-size": `${lousaWidth * 0.05}px`,
    "--icon-btn-bg": colors.bg,
    "--icon-btn-accent": colors.accent,
    "--icon-btn-text": colors.text,
    ...style,
  } as React.CSSProperties;

  return (
    <button
      {...props}
      className={cx(styles.button, props.className)}
      style={dynamicStyle}
    >
      {icon}
    </button>
  );
}
