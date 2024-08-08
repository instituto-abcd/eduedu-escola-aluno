import { createStyles } from "@mantine/core";
import { EduEduLogo } from "~/components/icons/EduEduLogo";

import professor360w from "~/assets/bgs/login-professor-360w.png";
import aluno360w from "~/assets/bgs/login-aluno-360w.png";
import professor768w from "~/assets/bgs/login-professor-768w.png";
import aluno768w from "~/assets/bgs/login-aluno-768w.png";
import professor1024w from "~/assets/bgs/login-professor-1024w.png";
import aluno1024w from "~/assets/bgs/login-aluno-1024w.png";
import { MEDIA_QUERY } from "~/constants/dimensions";
import { useSearchParams } from "react-router-dom";

const useStyles = createStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    minHeight: "100vh",
    userSelect: "none",

    [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
      flexDirection: "row",
    },
  },

  selectionBox: {
    width: "100%",
    height: "50%",
    filter: "grayscale(1)",
    transition: "filter 200ms ease-in-out",
    position: "relative",
    containerType: "inline-size",
    backgroundColor: "red",

    ":hover": {
      filter: "none",
    },

    h2: {
      width: "fit-content",
      height: "fit-content",
      fontSize: "12cqw",
      fontWeight: "bold",
      position: "absolute",
      inset: 0,
      top: "auto",
      marginInline: "auto",
      color: "white",
      [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
        fontSize: "8cqw",
      },
      [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
        top: 0,
        bottom: "auto",
      },
    },

    img: {
      minWidth: "100vw",
      [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
        minWidth: "50vw",
      },
    },
  },

  floatingLogo: {
    position: "fixed",
    bottom: "1.5rem",
    right: "1.5rem",
    zIndex: 5,
    pointerEvents: "none",
  },
}));

type Profile = "STUDENT" | "TEACHER";

export function ProfileSelection({ onNext }: { onNext: () => void }) {
  const { classes } = useStyles();
  const [_, setQuery] = useSearchParams();

  function handleSelection(value: Profile) {
    setQuery((ps) => {
      ps.set("profile", value);
      return ps;
    });

    onNext();
  }

  return (
    <div className={classes.container}>
      <div
        className={classes.selectionBox}
        onClick={() => handleSelection("STUDENT")}
      >
        <picture>
          <source srcSet={aluno1024w} media={MEDIA_QUERY.TABLET_HORZ} />
          <source srcSet={aluno768w} media={MEDIA_QUERY.TABLET_VERT} />
          <img src={aluno360w} alt="Login: Aluno" />
        </picture>
        <h2>Aluno</h2>
      </div>
      <div
        className={classes.selectionBox}
        onClick={() => handleSelection("TEACHER")}
      >
        <picture>
          <source srcSet={professor1024w} media={MEDIA_QUERY.TABLET_HORZ} />
          <source srcSet={professor768w} media={MEDIA_QUERY.TABLET_VERT} />
          <img src={professor360w} alt="Login: Professor" />
        </picture>
        <h2>Professor</h2>
      </div>

      <EduEduLogo className={classes.floatingLogo} />
    </div>
  );
}
