import { forwardRef, useImperativeHandle, useState } from "react";
import { Carousel, Embla } from "@mantine/carousel";
import { Box, Title, Button, Image, Stack, Skeleton } from "@mantine/core";
import arrowLeft from "~/assets/planets/arrowLeft.png";
import arrowRight from "~/assets/planets/arrowRight.png";
import { errorNotification } from "~/utils/errorNotification";
import { SimplifiedPlanet, useGetPlanetTrack } from "~/api/student";
import { PlanetCard } from "~/components/PlanetCard/PlanetCard";
import fimProvaAudio from "~/assets/audio/FIM_PROVA.mp3";
import fimProvaLottie from "~/assets/lotties/FIM_PROVA.json";
import Lottie from "react-lottie";
import { useCreateSound } from "~/hooks/useCreateSound";

export type PlanetTrackRef = {
  embla?: Embla;
  track?: SimplifiedPlanet[];
};

export const PlanetTrack = forwardRef<PlanetTrackRef>((_, ref) => {
  const [embla, setEmbla] = useState<Embla>();

  const { data, isLoading } = useGetPlanetTrack({
    onError: (error) =>
      errorNotification(
        "Erro durante a operação",
        `${error.message} (cod: ${error.code})`
      ),
  });

  const { sound } = useCreateSound({ src: fimProvaAudio, autoPlay: false });

  useImperativeHandle(ref, () => ({
    embla,
    track: data?.planetTrack,
  }));

  if (!isLoading && data?.planetTrack.length === 0)
    return (
      <Stack h="100%" w="100%" align="center" justify="center">
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

  return (
    <Stack spacing={40}>
      <Title color="white" size={26}>
        Meus planetas
      </Title>

      <Box style={{ position: "relative" }}>
        <Button
          style={{
            background: "transparent",
            position: "absolute",
            insetBlock: 0,
            marginBlock: "auto",
            left: -50,
            zIndex: 10,
          }}
          onClick={() => embla?.scrollPrev()}
        >
          <Image src={arrowLeft} />
        </Button>
        <Button
          style={{
            background: "transparent",
            position: "absolute",
            insetBlock: 0,
            marginBlock: "auto",
            right: -50,
            zIndex: 10,
          }}
          onClick={() => embla?.scrollNext()}
        >
          <Image src={arrowRight} />
        </Button>

        <Carousel align="start" getEmblaApi={setEmbla} withControls={false}>
          {data?.planetTrack.map((planet) => (
            <Carousel.Slide gap="sm" size="10%" key={planet.planetId}>
              <PlanetCard planet={planet} />
            </Carousel.Slide>
          ))}
          {isLoading &&
            Array(10)
              .fill(null)
              .map((_, inx) => (
                <Carousel.Slide gap="sm" size="10%" key={inx}>
                  <Skeleton
                    py={40}
                    visible={true}
                    width={160}
                    height={190}
                    radius={10}
                    opacity={0.3}
                  />
                </Carousel.Slide>
              ))}
        </Carousel>
      </Box>
    </Stack>
  );
});
