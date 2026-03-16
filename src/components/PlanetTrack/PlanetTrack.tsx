import { forwardRef, useImperativeHandle, useState } from "react";
import { Carousel, type CarouselProps } from "@mantine/carousel";
import type { EmblaCarouselType } from "embla-carousel";
import { type SimplifiedPlanet, useGetPlanetTrack } from "~/api/student";
import { PlanetCard } from "~/components/PlanetCard/PlanetCard";
import fimProvaAudio from "~/assets/audio/FIM_PROVA.mp3";
import fimProvaLottie from "~/assets/lotties/FIM_PROVA.json";
import Lottie from "react-lottie";
import { useCreateSound } from "~/hooks/useCreateSound";
import { useGridSlide } from "~/hooks/useGridSlide";
import type { MediaQueryKey } from "~/constants/dimensions";
import { useCurrentBreakpoint } from "~/hooks/useCurrentBreakpoint";
import classes from "./PlanetTrack.module.css";

export type PlanetTrackRef = {
  embla?: EmblaCarouselType | null;
  track?: SimplifiedPlanet[];
};

export const PlanetTrack = forwardRef<PlanetTrackRef>((_, ref) => {
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);

  useImperativeHandle(ref, () => ({
    embla,
    track: track?.planetTrack,
  }));

  const { data: track, isLoading } = useGetPlanetTrack();
  const breakpoint = useCurrentBreakpoint();

  const gridSlides = useGridSlide({
    items: track?.planetTrack ?? [],
    layout: [1, 2],
  });

  const carouselProps: Record<MediaQueryKey, CarouselProps> = {
    MOBILE: {
      emblaOptions: { align: "start" },
      orientation: "vertical",
    },
    TABLET_VERT: {
      orientation: "horizontal",
      emblaOptions: { align: "center", containScroll: false },
      slideSize: "33.333%",
      classNames: { slide: classes.slide },
    },
    TABLET_HORZ: {
      orientation: "horizontal",
      emblaOptions: { align: "center", containScroll: false },
      slideSize: "33.333%",
      classNames: { slide: classes.slide },
    },
    DESKTOP: {
      orientation: "horizontal",
      emblaOptions: { align: "center", containScroll: false },
      slideSize: "33.333%",
      classNames: { slide: classes.slide },
    },
  };

  const [activeSlide, setActiveSlide] = useState(0);

  if (!isLoading && track?.planetTrack.length === 0)
    return <NoTrackAvailable />;

  return (
    <div className="flex flex-col gap-10 max-h-[calc(100vh-200px)]">
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
                <div className="flex justify-center">
                  {items.map((planet) => (
                    <PlanetCard
                      planet={planet}
                      key={planet.planetId}
                      size="small"
                    />
                  ))}
                </div>
              </Carousel.Slide>
            ))
          : track?.planetTrack?.map((planet, i) => (
              <Carousel.Slide key={planet.planetId}>
                <PlanetCard
                  planet={planet}
                  size={activeSlide === i ? "large" : "medium"}
                />
              </Carousel.Slide>
            ))}
      </Carousel>
    </div>
  );
});

function NoTrackAvailable() {
  const { sound } = useCreateSound({ src: fimProvaAudio, autoPlay: false });
  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
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
    </div>
  );
}
