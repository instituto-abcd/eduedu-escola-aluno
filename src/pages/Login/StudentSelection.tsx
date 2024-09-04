import bgFog from "~/assets/bg-fog.png";
import { createStyles } from "@mantine/core";
import { MEDIA_QUERY } from "~/constants/dimensions";
import { Student, useStudentGetAll, useStudentReserve } from "~/api/student";
import { useStudent } from "~/stores/student";
import { Carousel, Embla } from "@mantine/carousel";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownBtn } from "~/components/icons/ArrowDownBtn";
import { useCarouselState } from "~/hooks/useCarouselState";
import { StudentConfirmation } from "./components/StudentConfirmation";
import { Header } from "./components/Header";

const useStyles = createStyles(
  (_, props: { canScrollPrev: boolean; canScrollNext: boolean }) => ({
    bg: {
      width: "100vw",
      height: "100vh",
      maxHeight: "100vh",
      overflow: "clip",
      backgroundImage: `url("${bgFog}")`,
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 20,
      padding: 16,
    },

    letterGrid: {
      width: "100%",
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      placeItems: "center",
      alignItems: "center",
      rowGap: 20,

      span: {
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 30,
        lineHeight: 1,
        color: "#fff",
        display: "grid",
        placeItems: "center",
        margin: 0,
        backgroundColor: "#3B93C4",
        width: 55,
        height: 55,
        borderRadius: 55,

        "&:last-of-type": {
          gridColumn: "span 5",
        },
      },

      [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
        columnGap: 28,
        gridTemplateColumns: "repeat(auto-fill, 55px)",
        gridTemplateRows: "repeat(3, 1fr)",
        span: {
          "&:last-of-type": {
            gridColumn: "initial",
          },
        },
      },
    },

    selected: {
      border: "4px solid white",
    },

    carouselContainer: {
      paddingBlock: 50,
      width: "100%",
      height: "calc(100% - 50px)",
      position: "relative",
      [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
        paddingBlock: 80,
        height: "calc(100% - 80px)",
      },
    },

    carousel: {
      height: 308,
      width: "100%",
      [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
        height: "100%",
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
    control_t: {
      display: props.canScrollPrev ? "block" : "none",
      rotate: "180deg",
      marginTop: 0,
      top: 0,
    },
    control_b: {
      display: props.canScrollNext ? "block" : "none",
      marginBottom: 0,
      position: "fixed",
      bottom: 20,
    },

    studentGrid: {
      width: "100%",
      display: "grid",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "repeat(4, 1fr)",
      gridAutoFlow: "column",
      rowGap: 18,
      [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "masonry",
        columnGap: 16,
      },
      [`@media ${MEDIA_QUERY.TABLET_HORZ}`]: {
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "repeat(6, min-content)",
      },
    },

    studentButton: {
      cursor: "pointer",
      userSelect: "none",
      width: "100%",
      maxHeight: "min-content",
      backgroundColor: "#fff",
      border: "1px solid #228BE6",
      color: "#228BE6",
      fontSize: 20,
      fontWeight: 600,
      padding: "10px 14px",
      borderRadius: 16,
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      alignSelf: "start",
    },
  }),
);

type Props = { onNext: () => void; onBack: () => void };

export function StudentSelection({ onNext, onBack }: Props) {
  const studentState = useStudent();
  const [carouselHandler, setHandler] = useState<Embla>();
  const carouselState = useCarouselState(carouselHandler);
  const { classes, cx } = useStyles(carouselState);
  const [selected, setSelected] = useState<string>();

  const { data: students, isLoading } = useStudentGetAll(
    {
      schoolClassId: studentState.schoolClassId,
      initialLetter: selected,
      "page-size": 9999,
    },
    {
      enabled: !!selected,
    },
  );

  // Quantidade de alunos para mostrar, baseado nas dimensões de tela
  // [ columns, rows ]
  const [limit, setLimit] = useState<[number, number]>(
    scrollQtyBreakpoint["MOBILE"],
  );

  // Effect para atualizar o formato do grid de acordo com a tela
  useEffect(() => {
    const updateBreakpoint = () => {
      if (window.innerWidth < 768) {
        setLimit(scrollQtyBreakpoint["MOBILE"]);
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setLimit(scrollQtyBreakpoint["TABLET_VERT"]);
      } else {
        setLimit(scrollQtyBreakpoint["TABLET_HORZ"]);
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    window.addEventListener("DOMContentLoaded", updateBreakpoint);

    return () => {
      window.removeEventListener("resize", updateBreakpoint);
      window.removeEventListener("DOMContentLoaded", updateBreakpoint);
    };
  }, []);

  useEffect(() => {
    if (carouselHandler) {
      carouselHandler.reInit();
    }
  }, [limit]);

  // Dividir alunos em arrays aninhados para mostrar
  // multiplos alunos em 1 único slide de carrosel
  const slides = useMemo(() => {
    const list: Array<Student[]> = [];
    const items = students?.items ?? [];
    const [cols, rows] = limit;
    const gridLimit = cols * rows;

    if (!items.length) return list;

    items.forEach((item) => {
      const currentIndex = list.length === 0 ? 0 : list.length - 1;
      const initialized = Array.isArray(list[currentIndex]);

      if (initialized) {
        if (list[currentIndex].length === gridLimit) {
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
  }, [limit, students]);

  function handleLetterSelect(l: string) {
    if (selected === l) {
      setSelected(undefined);
      return;
    }

    setSelected(l);
  }

  const { mutate: reserve } = useStudentReserve({
    onSuccess: () => {
      studentState.update({ reserved: true });
      onNext();
    },
  });

  function handleSelection(a: boolean) {
    if (!a || !confirmation) {
      setConfirmation(undefined);
      return;
    }
    studentState.update(confirmation);
    reserve({ studentId: confirmation.id, reserved: true });
  }

  const [confirmation, setConfirmation] = useState<Student>();
  function confirm(s: Student) {
    setConfirmation(s);
  }

  return (
    <div className={classes.bg}>
      <Header transparent title="Qual o seu nome?" onClose={onBack} />

      <div className={classes.letterGrid}>
        {letters.map((l) => (
          <span
            key={l}
            className={selected === l ? classes.selected : ""}
            onClick={() => handleLetterSelect(l)}
          >
            {l}
          </span>
        ))}
      </div>

      <div className={classes.carouselContainer}>
        <Carousel
          orientation="vertical"
          slideGap={18}
          classNames={{
            viewport: classes.carousel,
            container: classes.carousel,
            root: classes.carousel,
          }}
          slidesToScroll={1}
          withControls={false}
          containScroll="trimSnaps"
          getEmblaApi={setHandler}
        >
          {slides.map((slide, index) => (
            <Carousel.Slide key={index} className={classes.studentGrid}>
              {slide.map((st) => (
                <div
                  key={st.id}
                  className={classes.studentButton}
                  onClick={() => confirm(st)}
                >
                  {st.name}
                </div>
              ))}
            </Carousel.Slide>
          ))}
        </Carousel>
        <ArrowDownBtn
          className={cx([classes.control, classes.control_t])}
          onClick={() => carouselHandler?.scrollPrev()}
        />
        <ArrowDownBtn
          className={cx([classes.control, classes.control_b])}
          onClick={() => carouselHandler?.scrollNext()}
        />
      </div>
      <StudentConfirmation
        student={confirmation}
        acceptCb={(accepted) => handleSelection(accepted)}
      />
    </div>
  );
}

const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const scrollQtyBreakpoint: Record<keyof typeof MEDIA_QUERY, [number, number]> =
  {
    MOBILE: [1, 4],
    TABLET_VERT: [3, 6],
    TABLET_HORZ: [4, 6],
    DESKTOP: [4, 6],
  };
