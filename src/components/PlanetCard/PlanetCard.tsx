import { Rating, Stack, createStyles } from "@mantine/core";
import { Link } from "react-router-dom";
import { SimplifiedPlanet } from "~/api/student";
import { ButtonPlay, ButtonReplay } from "../Buttons";
import { LockIcon } from "../icons/LockIcon";

const useStyles = createStyles((_, props: { enable: boolean }) => ({
  container: {
    cursor: !props.enable ? "not-allowed" : "initial",
    opacity: !props.enable ? 0.6 : 1,
    userSelect: "none",
    paddingTop: 40,
    paddingBottom: 10,
  },

  containerMedium: {
    paddingBlock: 70,
  },

  wrapper: {
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(2px)",
    paddingTop: 10,
    paddingBottom: 5,
    width: 150,
    height: 165,
    minHeight: 165,
    borderRadius: 20,
    transition: "all 200ms ease-in-out",
  },

  wrapperMedium: {
    width: 190,
    height: 256,
    minHeight: 256,
    paddingBottom: 16,
    paddingTop: 80,
  },

  wrapperLarge: {
    width: 290,
    height: 405,
    minHeight: 405,
    paddingTop: 120,
    paddingBottom: 40,
  },

  name: {
    margin: 0,
    fontSize: 18,
    color: "#FFF",
    fontWeight: 600,
    transition: "all 200ms ease-in-out",
  },

  nameMedium: {
    fontSize: 20,
  },

  nameLarge: {
    fontSize: 35,
  },

  avatar: {
    position: "absolute",
    top: 0,
    transform: "translateY(-50%)",
    zIndex: 5,
    filter: props.enable ? "initial" : "grayscale(100%)",
    height: 115,
    width: "auto",
  },

  avatarMedium: {
    height: 140,
  },

  avatarLarge: {
    height: 220,
  },

  button: {
    filter: props.enable ? "initial" : "grayscale(100%)",
  },

  buttonLarge: {
    width: 100,
    height: 100,
  },

  lock: {
    width: 30,
    height: 48,
    filter: "grayscale(1)",
  },

  lockMedium: {
    width: 40,
    height: 58,
  },
}));

export type PlanetCardProps = {
  planet: SimplifiedPlanet;
  size: "small" | "medium" | "large";
};

type ClassTargets =
  | "container"
  | "wrapper"
  | "avatar"
  | "name"
  | "button"
  | "lock";

export function PlanetCard({ planet, size }: PlanetCardProps) {
  const { classes, cx } = useStyles({ enable: planet.enable });

  const sizeClasses: Record<
    PlanetCardProps["size"],
    Record<ClassTargets, string[]>
  > = {
    small: {
      name: [classes.name],
      avatar: [classes.avatar],
      wrapper: [classes.wrapper],
      container: [classes.container],
      button: [classes.button],
      lock: [classes.lock],
    },
    medium: {
      name: [classes.name, classes.nameMedium],
      avatar: [classes.avatar, classes.avatarMedium],
      wrapper: [classes.wrapper, classes.wrapperMedium],
      container: [classes.container, classes.containerMedium],
      button: [classes.button],
      lock: [classes.lock, classes.lockMedium],
    },
    large: {
      name: [classes.name, classes.nameLarge],
      avatar: [classes.avatar, classes.avatarLarge],
      wrapper: [classes.wrapper, classes.wrapperLarge],
      container: [classes.container, classes.containerMedium],
      button: [classes.button, classes.buttonLarge],
      lock: [classes.lock, classes.lockMedium],
    },
  };

  const getClass = (k: ClassTargets) => cx(sizeClasses[size][k]);

  return (
    <div className={getClass("container")}>
      <Stack
        className={getClass("wrapper")}
        align="center"
        justify={size === "small" ? "end" : "space-between"}
        spacing={6}
      >
        <img src={planet.planetAvatar} className={getClass("avatar")} />
        <h3 className={getClass("name")}>{planet.planetName}</h3>
        <Rating
          readOnly
          defaultValue={planet.stars ?? 0}
          value={planet.stars ?? 0}
          fractions={2}
          size={size === "large" ? "lg" : "md"}
        />
        {planet.stars == 0 && !planet.canExecutePlanet && (
          <LockIcon className={getClass("lock")} />
        )}
        {planet.stars == 0 && planet.canExecutePlanet && (
          <ButtonPlay
            component={Link}
            to={`/planeta/${planet.planetId}`}
            state={{ planet }}
            disabled={!planet.enable}
            className={getClass("button")}
          />
        )}
        {planet.stars > 0 && (
          <ButtonReplay
            component={Link}
            to={`/planeta/${planet.planetId}`}
            state={{ planet }}
            className={getClass("button")}
          />
        )}
      </Stack>
    </div>
  );
}
