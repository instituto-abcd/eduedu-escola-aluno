import { CardStack } from "~/components/CardStack";
import { ModelProps } from ".";
import {
  Group,
  Image,
  LoadingOverlay,
  Stack,
  Text,
  createStyles,
} from "@mantine/core";
import slot_pessoa from "~/assets/slot_pessoa.png";
import slot_lugar from "~/assets/slot_lugar.png";
import slot_animal from "~/assets/slot_animal.png";
import slot_coisa from "~/assets/slot_coisa.png";
import { useDrop } from "react-dnd";
import { QuestionOption } from "~/api/exam";
import { useState } from "react";
import { produce } from "immer";
import { EduButton } from "~/components/EduButton";

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
    justifyContent: "flex-end",
    gap: "1rem",
    paddingBlock: "1rem",
    borderRadius: 16,
  },
}));

export function Model13({ question }: ModelProps) {
  const [options, setOptions] = useState<QuestionOption[]>(question.options);

  function onDrop(item: QuestionOption | null, index: number) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft[index] = item;
      })
    );

    setOptions(
      options.filter((opt) => JSON.stringify(opt) !== JSON.stringify(item))
    );
  }

  const [answers, setAnswers] = useState<Array<QuestionOption | null>>([
    null,
    null,
    null,
    null,
  ]);

  const slots = [
    { description: "Pessoa", image: slot_pessoa },
    { description: "Lugar", image: slot_lugar },
    { description: "Animal", image: slot_animal },
    { description: "Coisa", image: slot_coisa },
  ];

  return (
    <>
      <Stack spacing={100} my="auto" align="center">
        <Group my="auto">
          {slots.map((slot, inx) => (
            <SlotCard
              {...slot}
              onClear={() => {}}
              onDrop={(option) => onDrop(option, inx)}
            />
          ))}
        </Group>
        <CardStack options={options} />
      </Stack>

      <EduButton disabled={answers.includes(null)} onClick={() => {}}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={false} />
    </>
  );
}

function SlotCard({
  description,
  image,
  onDrop,
  onClear,
}: {
  description: string;
  image: string;
  onDrop: (item: QuestionOption | null) => void;
  onClear: () => void;
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
      <Image
        src={image}
        height={96}
        width="80%"
        maw="80%"
        mx="auto"
        fit="contain"
      />
      <Text size={20} weight={600} color="gray.7">
        {description}
      </Text>
    </div>
  );
}
