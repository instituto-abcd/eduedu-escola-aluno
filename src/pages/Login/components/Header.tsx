import { createStyles } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { MEDIA_QUERY } from "~/constants/dimensions";

const useStyles = createStyles({
  header: {
    width: "100%",
    paddingBlock: 8,
    paddingInline: 20,
    backgroundColor: "#000",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    height: 40,
    position: "relative",
    userSelect: "none",
    pointerEvents: "none",
    zIndex: 20,

    h1: {
      fontSize: 19,
      textAlign: "center",
      paddingLeft: "32px",
    },

    [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
      paddingBlock: 22,
      h1: {
        fontSize: 30,
        paddingLeft: 0,
      },
    },
  },

  transparent: {
    backgroundColor: "transparent",
  },

  button: {
    border: 0,
    outline: 0,
    backgroundColor: "red",
    color: "white",
    borderRadius: "100%",
    display: "grid",
    placeItems: "center",
    padding: 6.5,
    boxSizing: "border-box",
    cursor: "pointer",
    position: "absolute",
    left: 16,
    margin: "auto",
    pointerEvents: "all",
    svg: {
      strokeWidth: 5,
    },
  },
});

type Props = {
  onClose: () => void;
  title: string;
  transparent?: boolean;
};

export function Header({ title, onClose, transparent }: Props) {
  const { classes, cx } = useStyles();

  return (
    <div className={cx([classes.header, transparent && classes.transparent])}>
      <div className={classes.button} onClick={onClose}>
        <IconX size={16} />
      </div>
      <h1>{title}</h1>
    </div>
  );
}
