import { Rating } from "@mantine/core";
import { Link } from "react-router-dom";
import { SimplifiedPlanet } from "~/api/student";
import { ButtonPlay, ButtonReplay } from "../Buttons";
import { LockIcon } from "../icons/LockIcon";
import { cx } from "~/utils/cx";
import styles from "./PlanetCard.module.css";

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
  const enabled = planet.canExecutePlanet;

  const getClass = (k: ClassTargets) => {
    const sizeClasses: Record<
      PlanetCardProps["size"],
      Record<ClassTargets, string>
    > = {
      small: {
        name: styles.name,
        avatar: cx(styles.avatar, !enabled && styles.disabled),
        wrapper: styles.wrapper,
        container: cx(styles.container, !enabled && styles.containerDisabled),
        button: cx(styles.button, !enabled && styles.disabled),
        lock: styles.lock,
      },
      medium: {
        name: cx(styles.name, styles.nameMedium),
        avatar: cx(
          styles.avatar,
          styles.avatarMedium,
          !enabled && styles.disabled
        ),
        wrapper: cx(styles.wrapper, styles.wrapperMedium),
        container: cx(
          styles.container,
          styles.containerMedium,
          !enabled && styles.containerDisabled
        ),
        button: cx(styles.button, !enabled && styles.disabled),
        lock: cx(styles.lock, styles.lockMedium),
      },
      large: {
        name: cx(styles.name, styles.nameLarge),
        avatar: cx(
          styles.avatar,
          styles.avatarLarge,
          !enabled && styles.disabled
        ),
        wrapper: cx(styles.wrapper, styles.wrapperLarge),
        container: cx(
          styles.container,
          styles.containerMedium,
          !enabled && styles.containerDisabled
        ),
        button: cx(
          styles.button,
          styles.buttonLarge,
          !enabled && styles.disabled
        ),
        lock: cx(styles.lock, styles.lockMedium),
      },
    };

    return sizeClasses[size][k];
  };

  return (
    <div className={getClass("container")}>
      <div
        className={getClass("wrapper")}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: size === "small" ? "flex-end" : "space-between",
          gap: "6px",
        }}
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
      </div>
    </div>
  );
}
