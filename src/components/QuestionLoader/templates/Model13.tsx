import { CardStack } from "~/components/CardStack";
import { ModelProps } from ".";
import {
  Group,
  LoadingOverlay,
  Stack,
  Text,
  createStyles,
} from "@mantine/core";
// import slot_pessoa from "~/assets/slot_pessoa.png";
// import slot_lugar from "~/assets/slot_lugar.png";
// import slot_animal from "~/assets/slot_animal.png";
// import slot_coisa from "~/assets/slot_coisa.png";
import { useDrop } from "react-dnd";
import { QuestionOption } from "~/api/exam";
import { useEffect, useState } from "react";
import { produce } from "immer";
import { EduButton } from "~/components/EduButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { usePlanetAnswer } from "~/api/planet";
import {
  lousaHeight,
  lousaPaddingTop,
  lousaWidth,
} from "~/constants/dimensions";

const useStyles = createStyles((theme) => ({
  slot: {
    width: 170,
    height: 200,
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

      {/* Board content */}
      <Stack my="auto" pt={lousaPaddingTop} spacing={(lousaWidth * 3) / 100}>
        <Group my="auto">
          {imageTitles
            .filter((title) => title.file_url)
            .map((slot, inx) => (
              <SlotCard
                image={slot.file_url!}
                description={slot.description}
                onDrop={(option) => onDrop(option, inx)}
                key={inx}
              />
            ))}
        </Group>

        <CardStack options={options} />
      </Stack>

      {/* Continue to the next screen button */}
      <EduButton disabled={options.length > 0} onClick={submitAnswer}>
        Continuar
      </EduButton>

      {/* Loading animation */}
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
  image: string;
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
      <img src={image} height={96} />
      <Text size={20} weight={600} color="gray.7">
        {description}
      </Text>
    </div>
  );
}
