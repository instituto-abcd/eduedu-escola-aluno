import bgFog from "~/assets/bg-fog.png";
import type { MEDIA_QUERY } from "~/constants/dimensions";
import {
  type Student,
  useStudentGetAll,
  useStudentReserve,
} from "~/api/student";
import { useStudent } from "~/stores/student";
import { Carousel } from "@mantine/carousel";
import type { EmblaCarouselType } from "embla-carousel";
import { useEffect, useState } from "react";
import { ArrowDownBtn } from "~/components/icons/ArrowDownBtn";
import { StudentConfirmation } from "./components/StudentConfirmation";
import { Header } from "./components/Header";
import { LetterGrid } from "./components/LetterGrid";
import { useGridSlide } from "~/hooks/useGridSlide";
import { cx } from "~/utils/cx";
import { useCarouselState } from "~/hooks/useCarouselState";
import { useCurrentBreakpoint } from "~/hooks/useCurrentBreakpoint";

type Props = { onNext: () => void; onBack: () => void };

// TODO: reserved student confirmation

export function StudentSelection({ onNext, onBack }: Props) {
  const studentState = useStudent();
  const [carouselHandler, setHandler] = useState<EmblaCarouselType | null>(null);
  const [selected, setSelected] = useState<string>();
  const carouselState = useCarouselState(carouselHandler);

  const { data: students } = useStudentGetAll(
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
    scrollQtyBreakpoint.MOBILE,
  );

  const bp = useCurrentBreakpoint();

  // Effect para atualizar o formato do grid de acordo com a tela
  useEffect(() => {
    const updateBreakpoint = () => {
      if (window.innerWidth < 768) {
        setLimit(scrollQtyBreakpoint.MOBILE);
      } else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setLimit(scrollQtyBreakpoint.TABLET_VERT);
      } else {
        setLimit(scrollQtyBreakpoint.TABLET_HORZ);
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);

    return () => {
      window.removeEventListener("resize", updateBreakpoint);
    };
  }, []);

  useEffect(() => {
    if (carouselHandler) {
      carouselHandler.reInit();
    }
  }, [limit]);

  // Dividir alunos em arrays aninhados para mostrar
  // multiplos alunos em 1 único slide de carrosel
  const slides = useGridSlide({ items: students?.items ?? [], layout: limit });

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

  /* carousel height */
  const carouselHeight = bp === "MOBILE" ? 200 : 300;

  return (
    <div
      className="w-screen h-screen max-h-screen overflow-clip flex flex-col items-center justify-between gap-5 p-4"
      style={{ backgroundImage: `url("${bgFog}")` }}
    >
      <Header transparent title="Qual o seu nome?" onClose={onBack} />
      <LetterGrid onSelect={handleLetterSelect} selected={selected} />

      <div className="flex flex-col items-center gap-2 max-h-[300px]">
        <Carousel
          orientation="vertical"
          withControls={false}
          getEmblaApi={setHandler}
          slideSize="100%"
          height={carouselHeight}
          containScroll="trimSnaps"
          align="start"
          slidesToScroll={1}
          classNames={{}}
        >
          {slides.map((slide) => {
            return (
              <Carousel.Slide
                key={slide[0].id}
                className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-1 h-min"
              >
                {slide.map((st) => (
                  <div
                    key={st.id}
                    className={cx(
                      "cursor-pointer select-none w-full max-h-min bg-white text-[#228BE6] self-start overflow-hidden",
                      "border-[#228BE6] border text-[#228BE6] text-xl font-semibold py-2 md:py-3 px-4 rounded-2xl text-ellipsis whitespace-nowrap",
                    )}
                    onClick={() => confirm(st)}
                    onKeyDown={() => confirm(st)}
                  >
                    {st.name}
                  </div>
                ))}
              </Carousel.Slide>
            );
          })}
        </Carousel>
      </div>

      <div className="flex items-center w-min gap-4">
        <ArrowDownBtn
          className={cx(
            "rotate-180 size-[40px] md:size-[60px] cursor-pointer transition-opacity",
            {
              "opacity-10": !carouselState.canScrollPrev,
            },
          )}
          onClick={() => carouselHandler?.scrollPrev()}
        />

        <ArrowDownBtn
          className={cx(
            "size-[40px] md:size-[60px] cursor-pointer transition-opacity",
            {
              "opacity-10": !carouselState.canScrollNext,
            },
          )}
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

const scrollQtyBreakpoint: Record<keyof typeof MEDIA_QUERY, [number, number]> =
  {
    MOBILE: [1, 4],
    TABLET_VERT: [4, 3],
    TABLET_HORZ: [4, 5],
    DESKTOP: [4, 5],
  };
