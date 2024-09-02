import { createStyles, getStylesRef } from "@mantine/core";
import { MEDIA_QUERY } from "~/constants/dimensions";
import bg from "~/assets/bg-select-option.png";
import { Sprite } from "~/components/vector/Sprite";
import { AccessCodes, useGetAccessCodes } from "~/api/user";
import { useStudent } from "~/stores/student";
import { Header } from "./components/Header";
import { LockIcon } from "~/components/icons/LockIcon";
import { LockOpenIcon } from "~/components/icons/LockOpenIcon";

const MAX_ITEMS = 4;

const useStyles = createStyles(() => ({
  container: {
    position: "relative",
    height: "100vh",
  },

  itemsContainer: {
    width: "100%",
    height: "calc(100vh - 40px)",
    display: "flex",
    flexDirection: "column",

    [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
      flexDirection: "row",
      height: "100vh",
    },
  },

  item: {
    position: "relative",
    isolation: "isolate",
    containerType: "inline-size",
    overflow: "clip",
    color: "#F6A313",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "100%",
    minHeight: `calc((100vh - 40px)  / ${MAX_ITEMS})`,

    [`&:hover .${getStylesRef("sprite")}`]: {
      filter: "none",
      transform: "scale(1.1)",
    },

    [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
      width: `calc(100% / ${MAX_ITEMS})`,
      minWidth: "auto",
      flexDirection: "column",
      gap: "20%",

      [`&:hover .${getStylesRef("sprite")}`]: {
        filter: "none",
        transform: "scale(1.1)",
      },
    },

    p: {
      fontSize: "min( 10cqw, 40px )",
      fontWeight: "bold",
      maxWidth: "fit-content",
      margin: 0,
      lineHeight: 1,
      userSelect: "none",
      pointerEvents: "none",
      [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
        fontSize: "min( 20cqw, 70px )",
      },
    },

    ".item_bg": {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "auto",
      zIndex: -2,
      filter: "grayscale(1)",
      transition: "filter 150ms ease",

      [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
        height: "100vh",
        width: "auto",
      },

      "&:hover": {
        filter: "none",
      },
    },
  },

  sprite: {
    ref: getStylesRef("sprite"),
    filter: "grayscale(1)",
    transition: "all 150ms ease-in-out",
    userSelect: "none",
    pointerEvents: "none",
    width: "auto",
    maxWidth: "25%",
    position: "absolute",
    right: 0,

    [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
      maxHeight: "20%",
      maxWidth: "90%",
      width: "auto",
      position: "relative",
    },
  },

  lock: {
    position: "absolute",
    zIndex: 20,
    insetBlock: 0,
    right: "10%",
    marginBlock: "auto",
    width: 37,
    [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
      width: 68.7,
    },
    [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
      width: 68.7,
      insetBlock: "auto",
      marginBlock: 0,
      insetInline: 0,
      marginInline: "auto",
      top: "10%",
    },
  },
}));

type Props = { onNext: () => void; onBack: () => void };

export function PasswordSelection({ onBack, onNext }: Props) {
  const studentState = useStudent();
  const { data: accessCodes } = useGetAccessCodes(studentState.schoolClassId, {
    enabled: false,
  });

  function handleNext(code: AccessCodes) {
    if (code.correctAnswer) {
      onNext();
    }
  }

  const { classes } = useStyles();
  return (
    <div className={classes.container}>
      <Header title="Qual sua senha?" onClose={onBack} />

      <div className={classes.itemsContainer}>
        {accessCodes?.map((code, i) => (
          <div
            className={classes.item}
            key={i}
            onClick={() => handleNext(code)}
          >
            <p>{code.accessKey}</p>

            <Sprite
              set="planets"
              id={i * MAX_ITEMS + i}
              className={classes.sprite}
            />
            <img src={bg} alt="" role="presentation" className="item_bg" />
            {code.correctAnswer ? (
              <LockOpenIcon className={classes.lock} />
            ) : (
              <LockIcon className={classes.lock} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
