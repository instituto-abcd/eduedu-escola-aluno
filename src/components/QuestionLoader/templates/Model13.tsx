import { Group, LoadingOverlay, Text, createStyles } from "@mantine/core";
import { produce } from "immer";
import { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";
import { AudioButton } from "~/components/AudioButton";
import { CardStack } from "~/components/CardStack";
import { EduButton } from "~/components/EduButton";
import { boardW, lousaHeight, lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

const useStyles = createStyles((theme) => ({
  slot: {
    width: lousaWidth * 0.17,
    height: lousaWidth * 0.2,
    borderColor: theme.colors.gray[6],
    borderWidth: 1,
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

export function Model13({ question, answerCallback }: ModelProps) {
  const { imageTitles, audioTitles } = useQuestionHelper(question);

  const [options, setOptions] = useState<QuestionOption[]>(question.options);
  const [answers, setAnswers] = useState<QuestionOption[]>([]);

  function onDrop(item: QuestionOption | null, index: number) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft.push({ ...item, positionAnswer: index } as QuestionOption);
      })
    );

    setOptions((state) =>
      state.filter((opt) => JSON.stringify(opt) !== JSON.stringify(item))
    );
  }

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    if (options.length > 0) return;

    mutate({
      planetId: question.planet_id,
      questionId: question.id,
      optionsAnswered: answers,
    });
  }

  useEffect(() => {
    setAnswers([]);
    setOptions(question.options);
  }, [question]);

  return (
    <>
      {audioTitles.filter((title) => title.file_url).length > 0 && (
        <Group mx="auto">
          {audioTitles
            .filter((title) => title.file_url)
            .map((title, inx) => (
              <AudioButton
                key={title.file_url}
                src={title.file_url!}
                autoPlay={inx === 0}
              />
            ))}
        </Group>
      )}

      <Group my="auto">
        {imageTitles
          .filter((title) => title.file_url || title.description?.length > 0)
          .map((slot, inx) => (
            <SlotCard
              image={slot.file_url}
              description={slot.description}
              onDrop={(option) => onDrop(option, inx)}
              key={inx}
            />
          ))}
      </Group>

      <CardStack options={options} />

      <EduButton disabled={options.length > 0} onClick={submitAnswer}>
        Continuar
      </EduButton>

      <LoadingOverlay
        visible={isLoading}
        style={{ maxHeight: (lousaHeight * 80) / 100 }}
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
  const { classes } = useStyles();
  const [, drop] = useDrop(
    () => ({
      accept: "ANSWER_CARD",
      drop: onDrop,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  return (
    <div className={classes.slot} ref={drop}>
      {image && <img src={image} height={boardW(96)} />}
      <Text size={boardW(20)} weight={600} color="gray.7" align="center">
        {description}
      </Text>
    </div>
  );
}
