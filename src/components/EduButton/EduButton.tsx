import { createStyles } from "@mantine/core";

const useStyles = createStyles(() => ({
  button: {
    all: "unset",
    cursor: "pointer",
    width: "max-content",
    minWidth: 113,
    height: 20,
    backgroundColor: "#47cdff",
    boxShadow: "0px 4px 0px 0px #25abe6",
    paddingBlock: 10,
    paddingInline: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 0,
    gap: 10,
    borderRadius: 8,
    color: "#fff",
    userSelect: "none",
    ":disabled": {
      backgroundColor: "#E9E9E9",
      color: "#C4C4C4",
      boxShadow: "0px 4px 0px 0px #c4c4c4",
      cursor: "not-allowed",
      pointerEvents: "none",
    },
    ":active": {
      boxShadow: "0px 4px 0px 0px #25abe6",
      transform: "translateY(2px)",
      transition: "all 0.1s ease",
    },
  },
}));

type EduButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  rightIcon?: JSX.Element;
  leftIcon?: JSX.Element;
};

export function EduButton({
  children,
  rightIcon,
  leftIcon,
  ...props
}: EduButtonProps) {
  const { classes, cx } = useStyles();

  return (
    <button {...props} className={cx(classes.button, props.className)}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
