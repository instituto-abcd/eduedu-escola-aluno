import { createStyles } from "@mantine/core";
import bg from "~/assets/bg-select-option.png";
import { AcceptRoundBtn } from "~/components/icons/AcceptRoundBtn";
import { RefuseRoundBtn } from "~/components/icons/RefuseRoundBtn";

const useStyles = createStyles(() => ({
  container: {
    transform: "scale(0)",
    opacity: 0,
    inset: 0,
    position: "absolute",
    isolation: "isolate",
    zIndex: 10,
    transition: "all 250ms ease-in-out",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "5vh",
    containerType: "inline-size",
  },

  visible: {
    width: "100%",
    height: "100%",
    opacity: 1,
    transform: "scale(1)",
  },

  image: {
    position: "absolute",
    transform: "scale(0)",
    objectFit: "cover",
    opacity: 0,
    inset: 0,
    zIndex: -2,
    transition: "all 250ms ease-in-out",
  },

  sprite: {
    width: "fit-content",
    height: "fit-content",

    svg: {
      width: "auto",
      height: "30vh",
    },
  },

  text: {
    fontSize: "min(20cqw, 70px)",
    fontWeight: "bold",
    color: "#F6A313",
    textAlign: "center",
    margin: 0,
  },

  controls: {
    display: "flex",
    alignItems: "center",
    gap: "min(25cqw, 140px)",

    svg: { width: "min(20vw, 130px)" },
  },
}));

type Props = {
  acceptCb: (accepted: boolean) => void;
  metadata?: {
    text: string;
    image: JSX.Element;
  };
};

export function Confirmation({ acceptCb, metadata }: Props) {
  const { classes, cx } = useStyles();
  const visible = Boolean(metadata);

  return (
    <div className={cx([classes.container, visible && classes.visible])}>
      {metadata && (
        <>
          <div className={classes.sprite}>{metadata.image}</div>
          <h1 className={classes.text}>{metadata.text}</h1>
        </>
      )}

      <div className={classes.controls}>
        <div onClick={() => acceptCb(false)}>
          <RefuseRoundBtn />
        </div>
        <div onClick={() => acceptCb(true)}>
          <AcceptRoundBtn />
        </div>
      </div>
      <img
        src={bg}
        alt=""
        role="presentation"
        className={cx([classes.image, visible && classes.visible])}
      />
    </div>
  );
}
