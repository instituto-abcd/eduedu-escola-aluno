import { Button, ButtonProps, createStyles } from "@mantine/core";

const useStyles = createStyles(() => ({
  root: {
    borderRadius: 8,
    border: "1px solid #228BE6",
    backgroundColor: "#fff",
    cursor: "pointer",
    paddingInline: 22,
    paddingBlock: 8,
    boxShadow: "0px 1px 0px 0px #006AC6",
  },
  inner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  label: {
    color: "#228BE6",
  },
  icon: {
    color: "#228BE6",
  },
}));

type EduButtonProps = ButtonProps;

export function EduButton(props: EduButtonProps) {
  const { classes, cx } = useStyles();

  return (
    <Button
      {...props}
      unstyled
      classNames={{
        inner: cx(classes.inner, props.classNames?.inner),
        root: cx(classes.root, props.classNames?.root),
        label: cx(classes.label, props.classNames?.label),
        rightIcon: cx(classes.icon, props.classNames?.rightIcon),
        leftIcon: cx(classes.icon, props.classNames?.leftIcon),
      }}
    />
  );
}
