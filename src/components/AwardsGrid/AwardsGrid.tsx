import { Carousel, Embla } from "@mantine/carousel";
import { createStyles, Group, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { useGetStudentAwards } from "~/api/student";
import { AwardImage, AWARDS_IMAGES } from "~/constants/awards";
import { useGridSlide } from "~/hooks/useGridSlide";
import { AwardDisplay } from "../AwardDisplay/AwardDisplay";
import { useCurrentBreakpoint } from "~/hooks/useCurrentBreakpoint";
import { MediaQueryKey } from "~/constants/dimensions";
import { AwardModal } from "../AwardDisplay/AwardModal";

type Props = {
  visible: boolean;
};

export function AwardsGrid({ visible }: Props) {
  const [awards, setAwards] = useState<AwardImage[]>(AWARDS_IMAGES);
  useGetStudentAwards({
    onSuccess: (data) => {
      const newawards = AWARDS_IMAGES.map((aw) => {
        const match = data.find((award) => award.name === aw.name);
        if (!match) return aw;
        return { ...aw, ...match, active: true };
      });

      setAwards(newawards);
    },
  });

  const breakpoint = useCurrentBreakpoint();
  const gridLayoutMap: Record<MediaQueryKey, [number, number]> = {
    MOBILE: [1, 2],
    TABLET_HORZ: [4, 4],
    TABLET_VERT: [4, 4],
    DESKTOP: [4, 4],
  };

  const gridSlides = useGridSlide({
    items: awards,
    layout: gridLayoutMap[breakpoint],
  });

  const [carousel, setEmbla] = useState<Embla>();
  useEffect(() => {
    carousel?.reInit();
  }, [breakpoint]);

  // Award modal state
  const [selectedAward, setSelectedAward] = useState<AwardImage>();
  function handleOpenAward(aw: AwardImage) {
    setSelectedAward(aw);
  }
  function handleCloseAward() {
    setSelectedAward(undefined);
  }

  const { classes } = useStyles(visible);

  return (
    <Stack spacing={40} style={{ maxHeight: "calc(100vh - 200px)" }}>
      <Carousel
        getEmblaApi={setEmbla}
        withControls={false}
        className={classes.carousel}
        orientation={breakpoint === "MOBILE" ? "vertical" : "horizontal"}
        align="start"
      >
        {gridSlides.map((sl, inx) => (
          <Carousel.Slide key={inx}>
            <Group position="center" noWrap={breakpoint === "MOBILE"}>
              {sl.map((award, i) => (
                <AwardDisplay
                  award={award}
                  key={i}
                  onClick={() => handleOpenAward(award)}
                />
              ))}
            </Group>
          </Carousel.Slide>
        ))}
      </Carousel>
      {selectedAward && (
        <AwardModal
          onClose={handleCloseAward}
          opened={!!selectedAward}
          award={selectedAward}
        />
      )}
    </Stack>
  );
}

const useStyles = createStyles((_, visible: boolean) => ({
  carousel: {
    maxHeight: "90vh",
    marginTop: 20,
    display: visible ? "block" : "none",
    marginBlock: "auto",
  },
}));
