import { Carousel, Embla } from "@mantine/carousel";
import { createStyles, Group, Image } from "@mantine/core";
import { useEffect, useState } from "react";
import { type MediaQueryKey } from "~/constants/dimensions";
import atividades from "~/assets/atividades.png";
import conquistas from "~/assets/conquistas.png";
import { useCurrentBreakpoint } from "~/hooks/useCurrentBreakpoint";

const modeIndex: Record<ViewMode, number> = {
  planets: 0,
  awards: 1,
};

export type ViewMode = "planets" | "awards";

type Props = {
  forceBehavior?: MediaQueryKey;
  onModeChanged: (mode: ViewMode) => void;
  mode?: ViewMode;
};

export function ViewModeToggle({ mode = "planets", onModeChanged }: Props) {
  const [carousel, setCarousel] = useState<Embla>();
  const breakpoint = useCurrentBreakpoint();

  useEffect(() => {
    if (!carousel) return;

    // Força o carrossel a respeitar `mode`
    carousel.on("init", (c) => {
      c.scrollTo(modeIndex[mode]);
    });
  }, [carousel]);

  const { classes } = useStyles();

  if (breakpoint === "MOBILE")
    return (
      <Carousel
        getEmblaApi={setCarousel}
        withControls={false}
        slideSize={241}
        slideGap={20}
        onSlideChange={(inx) =>
          onModeChanged((["planets", "awards"] as ViewMode[])[inx])
        }
      >
        <Carousel.Slide>
          <Image width={241} height={180} src={atividades} />
        </Carousel.Slide>
        <Carousel.Slide>
          <Image width={207} height={180} src={conquistas} />
        </Carousel.Slide>
      </Carousel>
    );

  return (
    <Group position="apart" px={20} py={10}>
      <Image
        width={241}
        height={180}
        src={atividades}
        onClick={() => onModeChanged("planets")}
        className={classes.img}
      />
      <Image
        width={207}
        height={180}
        src={conquistas}
        onClick={() => onModeChanged("awards")}
        className={classes.img}
      />
    </Group>
  );
}

const useStyles = createStyles({
  img: {
    "&:hover": {
      transform: "scale(1.1)",
      transition: "all 200ms ease-in-out",
      cursor: "pointer",
    },
  },
});
