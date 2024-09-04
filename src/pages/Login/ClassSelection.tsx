import { Box, createStyles, getStylesRef } from "@mantine/core";
import { MEDIA_QUERY } from "~/constants/dimensions";
import bg from "~/assets/bg-select-option.png";
import { Carousel, CarouselProps, Embla } from "@mantine/carousel";
import { useEffect, useMemo, useState } from "react";
import { Sprite } from "~/components/vector/Sprite";
import { ArrowDownBtn } from "~/components/icons/ArrowDownBtn";
import { Confirmation } from "./components/Confirmation";
import { SchoolClass, useSchoolClassGetAll } from "~/api/school-class";
import { useStudent } from "~/stores/student";
import { Header } from "./components/Header";
import { useCarouselState } from "~/hooks/useCarouselState";
import { LoginLoader } from "./LoginLoader";
import { useGridSlide } from "~/hooks/useGridSlide";

// TODO: hide controls when unable to click

const MAX_ITEMS = 5;

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const useStyles = createStyles(
  (
    _,
    props: { qty: number; canScrollPrev: boolean; canScrollNext: boolean },
  ) => ({
    container: {
      height: "calc(100vh - 40px)",
      maxHeight: "calc(100vh - 40px)",
    },

    carousel: {
      minWidth: "100vw",
      minHeight: "100%",
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
      minHeight: `calc(100% / attr(data-total number) )`,

      [`&:hover .${getStylesRef("sprite")}`]: {
        filter: "none",
        transform: "scale(1.1)",
      },

      [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
        width: `calc(100% / ${props.qty < MAX_ITEMS ? props.qty : MAX_ITEMS})`,
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
        maxWidth: "100%",
        margin: 0,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        lineHeight: 1,
        userSelect: "none",
        pointerEvents: "none",
        [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
          fontSize: "min( 20cqw, 50px )",
        },
      },

      ".item_bg": {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "auto",
        minHeight: "100%",
        zIndex: -2,
        filter: "grayscale(1)",
        transition: "filter 150ms ease",

        [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
          height: "100vh",
          width: "auto",
          minHeight: "auto",
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

    control: {
      width: 40,
      height: 40,
      position: "absolute",
      inset: 0,
      zIndex: 10,
      margin: "auto",

      [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
        width: 70,
        height: 70,
      },
    },
    // LEFT - UP - PREV
    control_1: {
      rotate: "180deg",
      marginTop: 0,
      top: "7%",
      display: props.canScrollPrev ? "block" : "none",
      [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
        rotate: "90deg",
        top: 0,
        marginLeft: 0,
        marginBlock: "auto",
        left: "7%",
      },
    },

    // RIGHT - DOWN - NEXT
    control_2: {
      marginBottom: 0,
      bottom: "7%",
      display: props.canScrollNext ? "block" : "none",
      [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
        rotate: "-90deg",
        marginRight: 0,
        marginBlock: "auto",
        right: "7%",
        bottom: 0,
      },
    },
  }),
);

export function ClassSelection({ onNext, onBack }: Props) {
  const updateStudentState = useStudent((s) => s.update);
  const [carousel, setCarousel] = useState<Embla>();
  const carouselState = useCarouselState(carousel);

  const { data: schoolClass, isLoading } = useSchoolClassGetAll({
    enabled: false,
  });
  const { classes, cx } = useStyles({
    qty: schoolClass?.items ? schoolClass.items.length : MAX_ITEMS,
    ...carouselState,
  });

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
    updateStudentState({ schoolClassId: item.id });
    if (window.innerWidth >= 1024) return onNext();

    setSelected({
      text: item.name,
      image: <Sprite id={spriteId} />,
    });
  }

  if (isLoading) return <LoginLoader />;
  return (
    <div className={classes.container}>
      <Header title="Qual a sua sala?" onClose={onBack} />

      <Carousel
        classNames={{
          container: classes.carousel,
          viewport: classes.itemsContainer,
          slide: classes.itemsContainer,
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
                className={classes.item}
                sx={{
                  height: `calc( (100vh - 40px) / min(${MAX_ITEMS}, ${arr.length}) )`,
                  [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
                    height: "100%",
                    width: `calc( 100vw / min(${MAX_ITEMS}, ${arr.length}) )`,
                  },
                }}
              >
                <p>{item.name}</p>

                <Sprite id={index * MAX_ITEMS + i} className={classes.sprite} />
                <img src={bg} alt="" role="presentation" className="item_bg" />
              </Box>
            ))}
          </Carousel.Slide>
        ))}
      </Carousel>

      <ArrowDownBtn
        className={cx([classes.control, classes.control_1])}
        onClick={() => carousel?.scrollPrev()}
      />
      <ArrowDownBtn
        className={cx([classes.control, classes.control_2])}
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
