import { forwardRef, useImperativeHandle, useState } from "react";
import { Carousel, CarouselProps, Embla } from "@mantine/carousel";
import { Stack, Group, createStyles } from "@mantine/core";
import { SimplifiedPlanet, useGetPlanetTrack } from "~/api/student";
import { PlanetCard } from "~/components/PlanetCard/PlanetCard";
import fimProvaAudio from "~/assets/audio/FIM_PROVA.mp3";
import fimProvaLottie from "~/assets/lotties/FIM_PROVA.json";
import Lottie from "react-lottie";
import { useCreateSound } from "~/hooks/useCreateSound";
import { useGridSlide } from "~/hooks/useGridSlide";
import { MediaQueryKey } from "~/constants/dimensions";
import { useCurrentBreakpoint } from "~/hooks/useCurrentBreakpoint";
import { useToggle } from "@mantine/hooks";

export type PlanetTrackRef = {
  embla?: Embla;
  track?: SimplifiedPlanet[];
};

type Props = {
  visible: boolean;
};

export const PlanetTrack = forwardRef<PlanetTrackRef, Props>(
  ({ visible }, ref) => {
    const [embla, setEmbla] = useState<Embla>();
    const [unlockLimit, toggleUnlockLimit] = useToggle();
    const [unlockAll, toggleUnlockAll] = useToggle();

    useImperativeHandle(ref, () => ({
      embla,
      track: track?.planetTrack,
    }));

    const { data: track, isLoading } = useGetPlanetTrack(undefined, {
      usePlanetAvailability: !unlockLimit,
      hideLastPlanets: !unlockAll,
      canExecuteAnyPlanet: unlockAll,
    });
    const breakpoint = useCurrentBreakpoint();

    const gridSlides = useGridSlide({
      items: track?.planetTrack ?? [],
      layout: [1, 2],
    });

    // usePlanetAvailability
    // true = planetas vem com limite diario
    // false = planetas vem sem limite
    //
    // hideLastPlanets
    // true = a trilha acaba com apenas +1 planeta bloqueado
    // false = a trilha vem completa
    //
    // canE

    const carouselProps: Record<MediaQueryKey, CarouselProps> = {
      MOBILE: {
        align: "start",
        orientation: "vertical",
      },
      TABLET_VERT: {
        orientation: "horizontal",
        align: "center",
        slideSize: "33%",
        styles: { slide: { marginBlock: "auto" } },
      },
      TABLET_HORZ: {
        orientation: "horizontal",
        align: "center",
        slideSize: "33%",
        styles: { slide: { marginBlock: "auto" } },
      },
      DESKTOP: {
        orientation: "horizontal",
        align: "center",
        slideSize: "33%",
        styles: { slide: { marginBlock: "auto" } },
      },
    };

    const [activeSlide, setActiveSlide] = useState(0);

    const { classes } = useStyles(visible);

    if (!isLoading && track?.planetTrack.length === 0)
      return <NoTrackAvailable />;

    return (
      <Stack
        spacing={40}
        className={classes.container}
      >
        <Carousel
          getEmblaApi={setEmbla}
          withControls={false}
          className={classes.carousel}
          onSlideChange={setActiveSlide}
          {...carouselProps[breakpoint]}
        >
          {breakpoint === "MOBILE"
            ? gridSlides.map((items, inx) => (
                <Carousel.Slide key={inx}>
                  <Group position="center">
                    {items.map((planet, i) => (
                      <PlanetCard
                        planet={planet}
                        key={i}
                        size={"small"}
                      />
                    ))}
                  </Group>
                </Carousel.Slide>
              ))
            : track?.planetTrack?.map((planet, i) => (
                <Carousel.Slide key={i}>
                  <Group position="center">
                    <PlanetCard
                      planet={planet}
                      size={activeSlide === i ? "large" : "medium"}
                    />
                  </Group>
                </Carousel.Slide>
              ))}
        </Carousel>

        <div className="absolute bottom-4 inset-x-0 mx-auto flex gap-4 w-fit">
          {!unlockLimit && (
            <button
              className="p-4 bg-blue-600 font-bold z-20 opacity-100 w-fit rounded text-white"
              onClick={() => toggleUnlockLimit()}
            >
              Remover limite diário
            </button>
          )}
          {!unlockAll && (
            <button
              className="p-4 bg-blue-600 font-bold z-20 opacity-100 w-fit rounded text-white"
              onClick={() => toggleUnlockAll()}
            >
              Listar todos planetas
            </button>
          )}
        </div>
      </Stack>
    );
  }
);

function NoTrackAvailable() {
  const { sound } = useCreateSound({ src: fimProvaAudio, autoPlay: false });
  return (
    <Stack
      h="100%"
      w="100%"
      align="center"
      justify="center"
    >
      <Lottie
        options={{
          loop: false,
          autoplay: true,
          animationData: fimProvaLottie,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        height={400}
        width={400}
        eventListeners={[
          {
            eventName: "DOMLoaded",
            callback: sound.play,
          },
        ]}
      />
    </Stack>
  );
}

const useStyles = createStyles((_, visible: boolean) => ({
  carousel: {
    maxHeight: "90vh",
    marginTop: 20,
    display: visible ? "block" : "none",
    marginBlock: "auto",
    position: "relative",
  },
  container: {
    maxHeight: "calc(100vh - 200px)",
  },
}));
