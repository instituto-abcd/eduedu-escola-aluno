import { Box } from "@mantine/core";
import bg from "~/assets/bg-select-option.png";
import { Carousel, CarouselProps } from "@mantine/carousel";
import type { EmblaCarouselType } from "embla-carousel";
import { useEffect, useState } from "react";
import { Sprite } from "~/components/vector/Sprite";
import { ArrowDownBtn } from "~/components/icons/ArrowDownBtn";
import { Confirmation } from "./components/Confirmation";
import { SchoolClass, useSchoolClassGetAll } from "~/api/school-class";
import { useStudent } from "~/stores/student";
import { Header } from "./components/Header";
import { useCarouselState } from "~/hooks/useCarouselState";
import { LoginLoader } from "./LoginLoader";
import { useGridSlide } from "~/hooks/useGridSlide";
import { cx } from "~/utils/cx";
import styles from "./ClassSelection.module.css";

// TODO: hide controls when unable to click

const MAX_ITEMS = 5;

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export function ClassSelection({ onNext, onBack }: Props) {
  const studentState = useStudent();
  const [carousel, setCarousel] = useState<EmblaCarouselType | null>(null);
  const carouselState = useCarouselState(carousel);

  const { data: schoolClass, isFetching: isLoading } = useSchoolClassGetAll({
    enabled: false,
    params: {
      schoolGrade: studentState.schoolGrade,
    },
  });

  const qty = schoolClass?.items ? schoolClass.items.length : MAX_ITEMS;

  const slides = useGridSlide({
    items: schoolClass?.items ?? [],
    layout: [1, MAX_ITEMS],
  });

  // Handle carousel orientation based on screen size.
  const [orientation, setOrientation] =
    useState<CarouselProps["orientation"]>("horizontal");

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerWidth >= 1024 ? "horizontal" : "vertical");
    };

    updateOrientation();

    window.addEventListener("resize", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
    };
  }, [carousel]);

  useEffect(() => {
    carousel?.reInit();
  }, [orientation]);

  // Handle selection of class item
  const [selected, setSelected] = useState<{
    text: string;
    image: JSX.Element;
  }>();

  function select(item: SchoolClass, spriteId: number) {
    studentState.update({ schoolClassId: item.id });
    if (window.innerWidth >= 1024) return onNext();

    setSelected({
      text: item.name,
      image: <Sprite id={spriteId} />,
    });
  }

  if (isLoading) return <LoginLoader />;
  return (
    <div className={styles.container}>
      <Header title="Qual a sua sala?" onClose={onBack} />

      <Carousel
        classNames={{
          root: styles.carousel,
          viewport: styles.itemsContainer,
          slide: styles.itemsContainer,
        }}
        withControls={false}
        containScroll="trimSnaps"
        slidesToScroll={1}
        getEmblaApi={setCarousel}
        orientation={orientation}
      >
        {slides.map((items, index) => (
          <Carousel.Slide key={index}>
            {items.map((item, i, arr) => (
              <Box
                key={i}
                onClick={() => select(item, index * MAX_ITEMS + i)}
                className={styles.item}
                style={
                  {
                    "--item-width": `calc(100% / ${qty < MAX_ITEMS ? qty : MAX_ITEMS})`,
                    "--item-height": `calc((100vh - 40px) / ${Math.min(MAX_ITEMS, arr.length)})`,
                    "--item-height-desktop": "100%",
                    "--item-width-desktop": `calc(100vw / ${Math.min(MAX_ITEMS, arr.length)})`,
                  } as React.CSSProperties
                }
              >
                <p>{item.name}</p>

                <Sprite id={index * MAX_ITEMS + i} className={styles.sprite} />
                <img
                  src={bg}
                  alt=""
                  role="presentation"
                  className={styles.itemBg}
                />
              </Box>
            ))}
          </Carousel.Slide>
        ))}
      </Carousel>

      <ArrowDownBtn
        className={cx(
          styles.control,
          styles.controlPrev,
          !carouselState.canScrollPrev && styles.controlHidden
        )}
        onClick={() => carousel?.scrollPrev()}
      />
      <ArrowDownBtn
        className={cx(
          styles.control,
          styles.controlNext,
          !carouselState.canScrollNext && styles.controlHidden
        )}
        onClick={() => carousel?.scrollNext()}
      />

      <Confirmation
        metadata={selected}
        acceptCb={(accepted) => {
          setSelected(undefined);
          if (accepted) {
            onNext();
          }
        }}
      />
    </div>
  );
}
