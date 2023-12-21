import { useEffect, useMemo, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { QuestionOption } from "~/api/exam";
import { boardW } from "~/constants/dimensions";
import { ModelProps } from ".";
import { Group, Stack, Textarea, createStyles } from "@mantine/core";
import { AudioButton } from "~/components/AudioButton";

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
    audioTitles,
    imageTitles,
    hasAudioTitle,
    audioTitleAutoplay,
    getRule,
  } = useQuestionHelper(question);
  const { classes } = useStyles();
  const [answer, setAnswer] = useState<string>("");

  useEffect(() => {
    setAnswer("");
    cleanUpInputValues();
  }, [question]);

  useEffect(() => {
    onAnswerChange([
      {
        description: answer,
        positionAnswer: 0,
        position: 0,
      } as QuestionOption,
    ]);
  }, [answer]);

  const fillRule = getRule("fill")?.value === "true";

  // In case of rule fill:
  const slots = question.titles
    .find(
      (title) =>
        title.placeholder.includes("Exp:") ||
        title.placeholder.includes("Exemplo")
    )
    ?.description.trim()
    .split(" ");

  function getInputValues(inx: number) {
    const inputs = document.getElementsByClassName(
      classes.input
    ) as HTMLCollectionOf<HTMLInputElement>;
    const nextField = inputs[inx + 1];

    if (nextField) nextField.focus();

    let answer = "";
    for (let index = 0; index < inputs.length; index++) {
      const element = inputs[index];
      answer += element.value.toUpperCase();
    }

    setFinalAnswer(answer);
  }

  function setFinalAnswer(data: string) {
    setAnswer(data);
  }

  function cleanUpInputValues() {
    const inputs = document.getElementsByClassName(
      classes.input
    ) as HTMLCollectionOf<HTMLInputElement>;
    for (let index = 0; index < inputs.length; index++) {
      // @ts-expect-error assign null to string
      inputs[index].value = null;
    }
  }

  const conditions = useMemo(
    () => [Boolean(answer), answer.length === slots?.length],
    [answer]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <>
      {hasAudioTitle && (
        <Group mx="auto" h="50px">
          {audioTitles.map((title, inx) => (
            <AudioButton
              src={title.file_url!}
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
            />
          ))}
        </Group>
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
              slots.map((_, inx) => (
                <input
                  key={inx + 1}
                  maxLength={1}
                  className={classes.input}
                  onChange={(_) => getInputValues(inx)}
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
