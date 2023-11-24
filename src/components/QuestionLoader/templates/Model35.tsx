import { useEffect, useMemo, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { QuestionOption } from "~/api/exam";
import { boardW } from "~/constants/dimensions";
import { ModelProps } from ".";
import { Grid, Group, Textarea, createStyles } from "@mantine/core";
import { AudioButton } from "~/components/AudioButton";

const useStyles = createStyles((theme) => ({
  textArea: {
    backgroundColor: theme.colors.gray[1],
    borderColor: theme.colors.gray[6],
    width: 418,
    height: 212,
  },
  input: {
    width: boardW(115),
    height: boardW(115),

    color: "#495057",
    fontSize: boardW(50),
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
    // GET VALUES OF EACH INPUT:
    const inputs = document.getElementsByClassName(classes.input);
    const nextField = inputs[inx + 1];

    if (nextField) nextField.focus();

    // GET ITS VALUES:
    let answer = "";
    for (let index = 0; index < inputs.length; index++) {
      const element = inputs[index];
      answer += element.value.toUpperCase();
    }

    // SET FINAL ANSWER:
    setFinalAnswer(answer);
  }

  function setFinalAnswer(data) {
    setAnswer(data);
  }

  function cleanUpInputValues() {
    const inputs = document.getElementsByClassName(classes.input);
    for (let index = 0; index < inputs.length; index++) {
      inputs[index].value = null;
    }
  }

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

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

      <Group
        my="auto"
        spacing={10}
        style={{ justifyContent: "space-evenly" }}
        grow
        noWrap={true}
      >
        {imageTitles[0] && (
          <img
            src={imageTitles[0].file_url!}
            width="auto"
            height={boardW(200)}
            style={{ maxWidth: boardW(180) }}
          />
        )}

        {fillRule && (
          <Grid style={{ justifyContent: "center", alignSelf: "center" }}>
            {slots &&
              slots.map((_, inx) => (
                <Grid.Col key={inx} span={slots.length !== 3 ? 4 : 5}>
                  <input
                    key={inx + 1}
                    maxLength={1}
                    className={classes.input}
                    onChange={(_) => getInputValues(inx)}
                  />
                </Grid.Col>
              ))}
          </Grid>
        )}
        {!fillRule && (
          <Textarea
            value={answer}
            maxLength={100} // não tem no doc regra maxLength, bloqueei pro aluno não subir lorem ipsum gigante
            onChange={(e) => setAnswer(e.target.value)}
            classNames={{ input: classes.textArea }}
          />
        )}
      </Group>
    </>
  );
}
