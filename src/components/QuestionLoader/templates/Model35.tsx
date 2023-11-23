import { useEffect, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { QuestionOption } from "~/api/exam";
import { boardW, lousaHeight } from "~/constants/dimensions";
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

    border: '#868E96 solid 1px',
    borderRadius: '16px',
    textAlign: 'center',
    textTransform: 'uppercase',

    backgroundColor: '#F1F3F5',
  }
}));

export function Model35({
  question,
  onAnswerChange,
  setContinueDisabled,
}: ModelProps) {
  const { audioTitles, imageTitles, hasAudioTitle, audioTitleAutoplay } =
    useQuestionHelper(question);
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

    setContinueDisabled(!answer || answer === "");
  }, [answer]);

  // RULES:
  const fillRule = question.rules.find(
    (rule) => rule.name === "fill"
  );
  const isFill = Boolean(
    fillRule === undefined ? true : fillRule.value === "false" ? false : true
  );

  // In case of rule fill:
  const slots = question.titles.find(
    (title) => title.placeholder.includes("Exp:") || title.placeholder.includes("Exemplo")
  )?.description.trim().split(" ");
  const expectedAnswer = question.rules.find(
    (rule) => rule.name === "answer"
  )?.value

  function getInputValues(inx: number) {
    // GET VALUES OF EACH INPUT:
    let inputs = document.getElementsByClassName(classes.input);
    let nextField = inputs[inx + 1];

    if (nextField) nextField.focus();

    // GET ITS VALUES:
    let answer = '';
    for (let index = 0; index < inputs.length; index++) {
      const element = inputs[index];
      answer += element.value.toUpperCase()
    }

    // SET FINAL ANSWER:
    setFinalAnswer(answer)
  }

  function setFinalAnswer(data) { setAnswer(data) }

  function cleanUpInputValues() {
    let inputs = document.getElementsByClassName(classes.input);
    for (let index = 0; index < inputs.length; index++) {
      inputs[index].value = null;
    }
  };

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

      <Group my="auto" spacing={10} grow noWrap={true}>
        {imageTitles[0] && (
          <Group style={{ justifyContent: 'center', alignSelf: 'center' }}>
            <img
              src={imageTitles[0].file_url!}
              width="auto"
              height={(lousaHeight * 40) / 100}
            />

            {imageTitles[0].file_url?.length
              ? ""
              : "Ooops! Imagem não disponível :("}
          </Group>
        )}
        
        {isFill ?
          // se for verdadeiro, a regra diz que é uma questão de preencher lacunas
          <Grid style={{ justifyContent: 'center', alignSelf: 'center' }}>
            {slots && slots.map((slot, inx) => (
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
          :
          // se for falso, a regra diz que é uma questão de ditado
          <Textarea
            value={answer}
            maxLength={100} // não tem no doc regra maxLength, bloqueei pro aluno não subir lorem ipsum gigante
            onChange={(e) => setAnswer(e.target.value)}
            classNames={{ input: classes.textArea }}
          />
        }
      </Group>
    </>
  );
}
