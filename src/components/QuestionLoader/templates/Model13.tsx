import { Group, Text, createStyles } from "@mantine/core";
import { produce } from "immer";
import { useEffect, useMemo, useState } from "react";
import { useDrop } from "react-dnd";
import { QuestionOption, QuestionTitle } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { CardStack } from "~/components/CardStack";
import { boardW, lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioInterface } from "~/sounds";

const useStyles = createStyles((theme, isOver: boolean) => ({
  slot: {
    width: lousaWidth * 0.17,
    height: lousaWidth * 0.2,
    borderColor: isOver ? theme.colors.green[4] : theme.colors.gray[6],
    borderWidth: isOver ? 3 : 1,
    borderStyle: "solid",
    backgroundColor: "#F4F4F4",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingBlock: "1rem",
    borderRadius: 16,
  },
}));

export function Model13({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const {
    audioTitles,
    textTitles,
    getRule,
    audioTitleAutoplay,
    hasAudioTitle,
    getTitlesOfType,
  } = useQuestionHelper(question);

  const [options, setOptions] = useState<QuestionOption[]>(question.options);
  const [answers, setAnswers] = useState<QuestionOption[]>([]);

  function onDrop(
    item: QuestionOption | null,
    index: number,
    title: QuestionTitle
  ) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft.push({ ...item, positionAnswer: index + 1 } as QuestionOption);
      })
    );

    setOptions((state) =>
      produce(state, (draft) => {
        const index = draft.findIndex(
          (opt) => JSON.stringify(opt) === JSON.stringify(item)
        );

        draft.splice(index, 1);
      })
    );

    AudioInterface.feedback.positive.play();
  }
  const showOptionsText = getRule("showOptionsText");
  const imageOnly = showOptionsText ? showOptionsText.value === "true" : false;

  useEffect(() => {
    setAnswers([]);
    setOptions(question.options);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answers);
  }, [answers]);

  const conditions = useMemo(
    () => [answers.length === question.options.length],
    [answers]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <>
      {hasAudioTitle && (
        <Group>
          {audioTitles.map((title, inx) => (
            <AudioButton
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
              src={title.file_url!}
            />
          ))}
        </Group>
      )}

      {textTitles.map((title) => (
        <Text
          key={title.description}
          w="80%"
          size={boardW(24)}
          weight={500}
          color="dark.3"
        >
          {title.description}
        </Text>
      ))}

      <Group my="auto">
        {getTitlesOfType("IMAGE")
          .filter((title) => title.file_url || title.description?.length > 0)
          .map((slot, inx) => (
            <SlotCard
              image={slot.file_url}
              description={slot.description}
              onDrop={(option) => onDrop(option, inx, slot)}
              key={inx}
            />
          ))}
      </Group>

      <CardStack
        options={options}
        cardProps={{
          imageOnly: !imageOnly,
          debug: { debugProperty: "position" },
        }}
      />
    </>
  );
}

function SlotCard({
  description,
  image,
  onDrop,
}: {
  description?: string;
  image?: string | null;
  onDrop: (item: QuestionOption | null) => void;
}) {
  const [collectedProps, drop] = useDrop(
    () => ({
      accept: "ANSWER_CARD",
      drop: onDrop,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  const { classes } = useStyles(collectedProps.isOver);

  return (
    <div className={classes.slot} ref={drop}>
      {image && <img src={image} height={boardW(96)} />}
      <Text size={boardW(20)} weight={600} color="gray.7" align="center">
        {description}
      </Text>
    </div>
  );
}
