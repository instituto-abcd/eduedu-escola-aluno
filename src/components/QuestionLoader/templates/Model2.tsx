import { Group, SimpleGrid, Stack, Text, createStyles } from "@mantine/core";
import { ModelProps } from ".";
import { DraggableCardSlot, DraggableCard } from "~/components/DraggableCard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { produce } from "immer";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { QuestionOption } from "~/api/exam";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";
import { AuxiliaryVideoModal } from "~/components/AuxiliaryVideoModal";
import { BREAKPOINT } from "~/constants/dimensions";

export function Model2({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [answers, setAnswers] = useState<Array<QuestionOption | null>>(
    question.options.map(() => null),
  );

  const handleDrop = useCallback(function (
    item: QuestionOption | null,
    index: number,
  ) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft[index] = item ? { ...item, positionAnswer: index } : item;
      }),
    );
  }, []);

  const {
    audioTitles,
    hasAudioTitle,
    audioTitleAutoplay,
    textTitles,
    getRule,
    videoTitles,
  } = useQuestionHelper(question);

  /* Autoplay Aux Audio Logic */
  const auxAutoPlayRule = getRule("auxAutoPlay");
  const shouldPlayAux = auxAutoPlayRule?.value === "false" ? false : true;
  const noPaddingRule = getRule("noPadding")?.value === "true";

  const mainAudioRef = useRef<AudioButtonRef>(null);
  const auxRef = useRef<AudioButtonRef>(null);

  useEffect(() => {
    if (mainAudioRef.current && auxRef.current) {
      if (shouldPlayAux) {
        mainAudioRef.current.sound.onEnd(() => {
          auxRef.current?.sound.play();
        });
      }
    }
  }, [mainAudioRef, auxRef]);
  /* End Aux Logic */

  useEffect(() => {
    setAnswers(question.options.map(() => null));
  }, [question]);

  useEffect(() => {
    onAnswerChange(
      answers.filter((answer) => answer !== null) as QuestionOption[],
    );
  }, [answers]);

  const conditions = useMemo(
    () => [answers.every((answer) => answer !== null)],
    [answers],
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  const auxVideo = videoTitles.find(
    (title) => title.description && title.description.includes("Botão"),
  );

  const cardSize =
    question.options.length > 3 ? question.options.length : undefined;

  const { classes } = useStyles({ noPaddingRule });

  return (
    <>
      {hasAudioTitle && (
        <Group>
          {audioTitles.map((title, inx) => (
            <AudioButton
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
              src={title.file_url!}
              ref={inx === 1 ? auxRef : mainAudioRef}
            />
          ))}
          {auxVideo && (
            <AuxiliaryVideoModal videoUrl={auxVideo.file_url ?? ""} />
          )}
        </Group>
      )}

      <Stack className={classes.content}>
        {textTitles.map((title) => (
          <Text
            size={24}
            color="dark.3"
            weight={500}
            key={title.description}
            align="center"
          >
            {title.description}
          </Text>
        ))}

        <SimpleGrid cols={question.options.length} className={classes.dropzone}>
          {answers.map((slot, inx) => (
            <DraggableCardSlot
              key={inx}
              onDrop={(item) => handleDrop(item, inx)}
              item={slot}
              size={cardSize}
              replaceWith={
                <DraggableCard
                  item={slot}
                  size={cardSize}
                  image={slot?.image_url}
                  text={slot?.description}
                  sound={slot?.sound_url}
                  disabled
                  onClear={() => handleDrop(null, inx)}
                  debug={{ skipDebug: true }}
                  noPaddingRule={noPaddingRule}
                />
              }
            />
          ))}
        </SimpleGrid>

        <SimpleGrid
          cols={question.options.length}
          className={classes.optionGrid}
        >
          {question.options.map((item) => (
            <DraggableCard
              item={item}
              key={item.position}
              size={cardSize}
              image={item.image_url}
              text={item.description}
              sound={item.sound_url}
              hidden={
                !!answers.find((slot) => slot?.position === item.position)
              }
              debug={{ debugProperty: "position" }}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );
}

type StyleProps = { noPaddingRule: boolean };
const useStyles = createStyles((theme, props: StyleProps) => ({
  optionGrid: {
    width: "100%",
    gap: 16,
    [theme.fn.largerThan(BREAKPOINT.TABLET_VERT)]: {
      gap: 35,
    },
    [theme.fn.largerThan(BREAKPOINT.DESKTOP)]: {
      placeItems: "center",
    },
  },
  dropzone: {
    width: "100%",
    gap: props.noPaddingRule ? 0 : 16,
    display: props.noPaddingRule ? "flex" : "grid",
    justifyContent: props.noPaddingRule ? "center" : "auto",
    [theme.fn.largerThan(BREAKPOINT.TABLET_VERT)]: {
      gap: props.noPaddingRule ? 0 : 35,
    },
    [theme.fn.largerThan(BREAKPOINT.DESKTOP)]: {
      placeItems: "center",
    },
  },
  content: {
    marginBlock: "auto",
    alignItems: "center",
    width: "100%",
    gap: 16,
    [theme.fn.largerThan(BREAKPOINT.TABLET_VERT)]: {
      gap: 35,
    },
  },
}));
