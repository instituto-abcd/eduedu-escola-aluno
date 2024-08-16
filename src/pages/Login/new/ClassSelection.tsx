import { createStyles, getStylesRef } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { MEDIA_QUERY } from "~/constants/dimensions";
import bg from "~/assets/bg-select-option.png";
import { Carousel, CarouselProps, Embla } from "@mantine/carousel";
import { useEffect, useMemo, useState } from "react";
import { Sprite } from "~/components/Sprite";
import { ArrowDownBtn } from "~/components/icons/ArrowDownBtn";
import { Confirmation } from "./_components/Confirmation";

const MAX_ITEMS = 5;

type Props = {
  onNext: () => void;
  onBack: () => void;
};

const useStyles = createStyles(() => ({
  container: {
    position: "relative",
    height: "100vh",
  },

  header: {
    width: "100%",
    paddingBlock: 8,
    paddingInline: 20,
    backgroundColor: "#000",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    height: 40,
    position: "relative",
    userSelect: "none",
    pointerEvents: "none",
    zIndex: 20,

    h1: {
      fontSize: 20,
      textAlign: "center",
    },

    [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
      paddingBlock: 22,
      h1: {
        fontSize: 30,
      },
    },
    [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
      position: "fixed",
      backgroundColor: "transparent",
      zIndex: 999,
    },
  },

  button: {
    border: 0,
    outline: 0,
    backgroundColor: "red",
    color: "white",
    borderRadius: "100%",
    display: "grid",
    placeItems: "center",
    padding: 6.5,
    boxSizing: "border-box",
    cursor: "pointer",
    position: "absolute",
    left: 16,
    margin: "auto",
    pointerEvents: "all",
    svg: {
      strokeWidth: 5,
    },
  },

  carousel: {
    minWidth: "100vw",
    minHeight: "100vh",
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
    minHeight: `calc((100vh - 40px)  / ${MAX_ITEMS})`,

    [`&:hover .${getStylesRef("sprite")}`]: {
      filter: "none",
      transform: "scale(1.1)",
    },

    [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
      width: `calc(100% / ${MAX_ITEMS})`,
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
      maxWidth: "fit-content",
      margin: 0,
      lineHeight: 1,
      userSelect: "none",
      pointerEvents: "none",
      [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
        fontSize: "min( 20cqw, 70px )",
      },
    },

    ".item_bg": {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "auto",
      zIndex: -2,
      filter: "grayscale(1)",
      transition: "filter 150ms ease",

      [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
        height: "100vh",
        width: "auto",
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
    height: "90%",
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
  },

  // RIGHT - DOWN - NEXT
  control_2: {
    marginBottom: 0,
    bottom: "7%",
  },
}));

// TODO: fetch classes from api

export function ClassSelection({ onNext, onBack }: Props) {
  const [carousel, setCarousel] = useState<Embla | null>(null);
  const { classes, cx } = useStyles();

  const items = Array(15).fill("1º A");

  const slides = useMemo(() => {
    const list: Array<string[]> = [];
    if (!items.length) return list;

    items.forEach((item) => {
      const currentIndex = list.length === 0 ? 0 : list.length - 1;
      const initialized = Array.isArray(list[currentIndex]);

      if (initialized) {
        if (list[currentIndex].length === MAX_ITEMS) {
          list.push([item]);
          return;
        }

        list[currentIndex].push(item);
        return;
      }

      list.push([item]);
      return;
    });

    return list;
  }, [items]);

  // Handle carousel orientation based on screen size.
  const [orientation, setOrientation] =
    useState<CarouselProps["orientation"]>("horizontal");

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerWidth >= 1024 ? "horizontal" : "vertical");
    };

    window.addEventListener("resize", updateOrientation);
    window.addEventListener("DOMContentLoaded", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
      window.removeEventListener("DOMContentLoaded", updateOrientation);
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

  function select(name: string, spriteId: number) {
    if (window.innerWidth >= 1024) return onNext();

    setSelected({
      text: name,
      image: <Sprite id={spriteId} />,
    });
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.button} onClick={onBack}>
          <IconX size={16} />
        </div>
        <h1>Qual a sua sala?</h1>
      </div>

      <Carousel
        classNames={{
          container: classes.carousel,
          viewport: classes.itemsContainer,
          slide: classes.itemsContainer,
        }}
        withControls={false}
        containScroll="trimSnaps"
        getEmblaApi={setCarousel}
        orientation={orientation}
      >
        {slides.map((items, index) => (
          <Carousel.Slide key={index}>
            {items.map((item, i) => (
              <div
                className={classes.item}
                key={i}
                onClick={() => select(item, index * MAX_ITEMS + i)}
              >
                <p>{item}</p>

                <Sprite id={index * MAX_ITEMS + i} className={classes.sprite} />
                <img src={bg} alt="" role="presentation" className="item_bg" />
              </div>
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
