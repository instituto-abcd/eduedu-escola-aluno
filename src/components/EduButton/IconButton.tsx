import { createStyles } from "@mantine/core";

const useStyles = createStyles(
  (_, palette: { bg: string; accent: string; text: string }) => ({
    button: {
      all: "unset",
      cursor: "pointer",
      width: 50,
      height: 44,
      backgroundColor: palette.bg,
      boxShadow: `0px 8px 0px 0px ${palette.accent}`,
      padding: 5,
      display: "grid",
      placeItems: "center",
      borderRadius: 6,
      color: palette.text,
      ":disabled": {
        backgroundColor: "#E9E9E9",
        color: "#C4C4C4",
        boxShadow: "0px 8px 0px 0px #c4c4c4",
      },
      ":active": {
        boxShadow: `0px 4px 0px 0px ${palette.accent}`,
        transform: "translateY(4px)",
        transition: "all 0.1s ease",
      },
    },
  })
);

type IconButtonProps = {
  icon: JSX.Element;
  variant?: "primary" | "gray" | "black";
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function IconButton({
  icon,
  variant = "primary",
  ...props
}: IconButtonProps) {
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
  };

  const { classes, cx } = useStyles(palette[variant]);
  return (
    <button {...props} className={cx(classes.button, props.className)}>
      {icon}
    </button>
  );
}
