import { useEffect, useMemo, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { QuestionOption } from "~/api/exam";
import { boardW } from "~/constants/dimensions";
import { ModelProps } from ".";
import { Group, Stack, Text, Textarea, createStyles } from "@mantine/core";
import { AudioButton } from "~/components/AudioButton";
import { produce } from "immer";

const useStyles = createStyles((theme) => ({
  textArea: {
    backgroundColor: theme.colors.gray[1],
    borderColor: theme.colors.gray[6],
    width: 418,
    height: 212,
  },
  input: {
    width: boardW(70),
    height: boardW(95),

    color: "#495057",
    fontSize: boardW(30),
    fontWeight: 600,

    border: "#868E96 solid 1px",
    borderRadius: "16px",
    textAlign: "center",
    textTransform: "uppercase",

    backgroundColor: "#F1F3F5",
  },
}));

export function Model35({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const {
    textTitles,
    audioTitles,
    imageTitles,
    hasAudioTitle,
    audioTitleAutoplay,
    getRule,
  } = useQuestionHelper(question);
  const { classes } = useStyles();
  const [answer, setAnswer] = useState<string>("");

  useEffect(() => {
    onAnswerChange([
      {
        description: answer,
        positionAnswer: 0,
        position: 0,
      } as QuestionOption,
    ]);
  }, [answer]);

  /* VARIAÇÃO 1: Preencher */
  const fillRule = getRule("fill")?.value === "true";
  const initialSlots =
    question.titles
      .find(
        (title) =>
          title.placeholder.includes("Exp:") ||
          title.placeholder.includes("Exemplo")
      )
      ?.description.trim()
      .split(" ") ?? [];

  const slotMap = initialSlots.map((slot) => ({
    letter: slot === "_" ? "" : slot,
    fixed: slot !== "_",
  }));

  /* 1. Pré-popular inputs */
  const [slots, setSlots] =
    useState<{ letter: string; fixed: boolean }[]>(slotMap);

  /* 2. onChange */
  function handleInput(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const { value } = e.target;

    setSlots((state) =>
      produce(state, (draft) => {
        draft[index].letter = value;
      })
    );

    if (e.target.nextSibling && e.target.value !== "") {
      (e.target.nextSibling as HTMLInputElement).focus();
    }
  }

  function handleBackspace(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      e.key === "Backspace" &&
      e.currentTarget.value === "" &&
      e.currentTarget.previousSibling
    ) {
      (e.currentTarget.previousSibling as HTMLInputElement).focus();
    }
  }

  /* 3. Ouvir atualizações nos slots para fabricar a resposta */
  useEffect(() => {
    setAnswer(slots.map((slot) => slot.letter.toUpperCase()).join(""));
  }, [slots]);

  const conditions = useMemo(
    () => [
      Boolean(answer),
      fillRule ? slots.every((slot) => slot.letter !== "") : true,
    ],
    [answer]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  useEffect(() => {
    setAnswer("");
    setSlots(slotMap);
  }, [question]);

  return (
    <>
      {hasAudioTitle && (
        <Group mx="auto" h="50px">
          {audioTitles.map((title, inx) => (
            <AudioButton
              index={inx}
              src={title.file_url!}
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
            />
          ))}
        </Group>
      )}

      {textTitles && (
        <Text color="dark.3" size={boardW(22)} mt={20}>
          {textTitles.find((text) => text.placeholder.includes("Enunciado"))?.description}
        </Text>
      )}

      <Stack my="auto" spacing={10} justify="center" align="center">
        {imageTitles[0] && (
          <img
            src={imageTitles[0].file_url!}
            width="auto"
            height={boardW(200)}
            style={{ maxWidth: boardW(180) }}
          />
        )}

        {fillRule && (
          <Group noWrap spacing={10}>
            {slots &&
              slots.map((slot, inx) => (
                <input
                  key={inx + 1}
                  maxLength={1}
                  className={classes.input}
                  onChange={(e) => handleInput(e, inx)}
                  onKeyDown={handleBackspace}
                  value={slot.letter}
                  disabled={slot.fixed}
                />
              ))}
          </Group>
        )}
        {!fillRule && (
          <Textarea
            value={answer}
            maxLength={100}
            onChange={(e) => setAnswer(e.target.value)}
            classNames={{ input: classes.textArea }}
          />
        )}
      </Stack>
    </>
  );
}
