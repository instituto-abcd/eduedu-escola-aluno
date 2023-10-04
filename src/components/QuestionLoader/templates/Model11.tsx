import {
  Group,
  LoadingOverlay,
  Stack,
  Text,
  Title,
  createStyles,
} from "@mantine/core";
import { Fragment, useEffect, useState } from "react";
import { QuestionOption, QuestionTitle } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";
import { useGetExamQuestion } from "~/api/student";
import { AudioButton } from "~/components/AudioButton";
import { DragLetterSlot } from "~/components/DraggableLetters/DragLetterSlot";
import { DraggableLetters } from "~/components/DraggableLetters/DraggableLetters";
import { EduButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { boardW, lousaHeight } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { produce } from "immer";

const useStyles = createStyles({
  slot: {
    width: boardW(60),
    height: boardW(50),
  },

  option: {
    width: "auto",
    paddingBlock: boardW(10),
    fontSize: boardW(18),
  },
});

export function Model11({ question, answerCallback }: ModelProps) {
  const { classes } = useStyles();
  const {
    isExam,

    imageTitles,
    textTitles,

    audioTitles,
    hasAudioTitle,
    audioTitleAutoplay,
  } = useQuestionHelper(question);

  const [answer, setAnswer] = useState<Array<QuestionOption | null>>([null]);

  const { mutate: mutateExam, isLoading: isLoadingExam } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  const { mutate: mutatePlanet, isLoading: isLoadingPlanet } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  const isLoading = isLoadingExam || isLoadingPlanet;

  function handleAnswer(ans: QuestionOption | null, inx?: number) {
    if (Number.isInteger(inx)) {
      setAnswer((state) =>
        produce(state, (draft) => {
          draft[inx!] = ans ? { ...ans, positionAnswer: inx } : null;
        })
      );
    } else if (ans && typeof inx === "undefined") {
      setAnswer([ans]);
    } else {
      const initialSlots = new Array<null>(slotsQty).fill(null);
      setAnswer(initialSlots);
    }
  }

  function submitAnswer() {
    if (!answer) return;

    if (isExam) {
      mutateExam({
        questionId: question.id,
        optionsAnswered: answer.filter(Boolean) as QuestionOption[],
      });
    } else {
      mutatePlanet({
        questionId: question.id,
        planetId: question.planet_id,
        optionsAnswered: answer.filter(Boolean) as QuestionOption[],
      });
    }
  }

  /*
   *    Helpers para o título da questão
   *    Referente ao texto que apresenta a questão (enunciado)
   */
  const hasTitle = false;
  const questionTitle = "";

  /*
   *    Helpers para o texto de completar
   */
  const textToComplete = getTextToComplete(textTitles);
  const isCompleteText = !!textToComplete;
  /* 🧙🏻 */
  const slotsQty = textToComplete
    ? textToComplete.description.split(/_./g).filter((w) => w !== "").length -
      1 <=
      0
      ? 1
      : textToComplete.description.split(/_./g).filter((w) => w !== "").length -
      1
    : 1;

  function getTextToComplete(titles: QuestionTitle[]) {
    return titles.find(
      (title) =>
        title.placeholder?.startsWith("Texto a ser preenchido") ||
        title.placeholder?.includes("preenchido") ||
        title.placeholder?.includes("preencher")
    );
  }

  useEffect(() => {
    const initialSlots = new Array<null>(slotsQty).fill(null);
    setAnswer(initialSlots);
  }, [question]);

  return (
    <>
      {hasAudioTitle && (
        <Group>
          {audioTitles.map((title, inx) => (
            <AudioButton
              src={title.file_url ?? ""}
              autoPlay={audioTitleAutoplay(inx)}
              key={inx}
            />
          ))}
        </Group>
      )}

      {hasTitle && (
        <Title color="dark.3" size={boardW(24)}>
          {questionTitle}
        </Title>
      )}

      <Group w="100%" noWrap position="center" spacing={boardW(100)} my="auto">
        {imageTitles.map((title) => (
          <img
            src={title.file_url!}
            alt={title.file_name}
            key={title.file_url}
            width={boardW(240)}
            height="auto"
            style={{ maxHeight: boardW(240), objectFit: "contain" }}
          />
        ))}

        <Stack align="center" w="45%" spacing={boardW(60)}>
          {isCompleteText && (
            <Group spacing={0}>
              {textToComplete.description
                .replaceAll("\\n", "")
                .split(/_+/g) // separa os segmentos de texto dos underlines
                .filter((w) => w !== "") // limpa fragmentos de texto vazio
                .map((w, inx, arr) => {
                  const notLastFragment = arr.length !== inx + 1;
                  const isLastFragment = arr.length === 1 && w.endsWith(" ");
                  const isFirstFragment = arr.length === 1 && w.startsWith(" ");

                  const canRenderLast =
                    (isLastFragment || notLastFragment) && !isFirstFragment;
                  const canRenderFirst = isFirstFragment && !isLastFragment;

                  /*
                   *  [isFirstFragment] O slot deve aparecer no começo da frase. Exemplo: "__ palavra"
                   *  [isLastFragment] O slot deve aparecer no final da frase. Exemplo: "palavra __"
                   *  [notLastFragment] O slot deve aparecer entre as palavras. Exemplo: "palavra _ palavra _ palavra"
                   */

                  const isMultipleAnswer = arr.length > 2;

                  const handleDrop = (item: QuestionOption | null) =>
                    handleAnswer(item, isMultipleAnswer ? inx : undefined);
                  const handleClear = () =>
                    handleAnswer(null, isMultipleAnswer ? inx : undefined);

                  return (
                    <Fragment key={w}>
                      {canRenderFirst && (
                        <DragLetterSlot
                          onDrop={handleDrop}
                          option={answer[inx] ?? null}
                          onClear={handleClear}
                          className={classes.slot}
                          style={{
                            width: "auto",
                            height: boardW(50),
                            fontSize: boardW(18),
                            marginInline: 2,
                          }}
                        />
                      )}
                      {w.split("").map((frag, inx) => (
                        <Text
                          color="dark.3"
                          size={boardW(24)}
                          weight={700}
                          p={0}
                          m={0}
                          key={inx}
                        >
                          {frag === " " ? "\u00A0" : frag}
                        </Text>
                      ))}

                      {canRenderLast && (
                        <DragLetterSlot
                          onDrop={handleDrop}
                          option={answer[inx] ?? null}
                          onClear={handleClear}
                          className={classes.slot}
                          style={{
                            width: "auto",
                            height: boardW(50),
                            fontSize: boardW(18),
                            marginInline: 2,
                          }}
                        />
                      )}
                    </Fragment>
                  );
                })}
            </Group>
          )}

          <Group align="center" position="center">
            {question.options
              .sort((a, b) => a.position - b.position)
              .map((option, inx) =>
                question.axis_code === "LC" ? (
                  /* Vamos assumir que o eixo LC (leitura e compreensao de texto)
                   *  contempla alternativas em texto longo,
                   *  já as demais apenas 1 palavra ou poucas letas
                   */
                  <TextOptionButton key={inx}>
                    {option.description}
                  </TextOptionButton>
                ) : (
                  <DraggableLetters
                    option={option}
                    key={inx}
                    className={classes.option}
                    hidden={answer.some(
                      (item) =>
                        JSON.stringify({
                          ...item,
                          positionAnswer: undefined,
                        }) ===
                        JSON.stringify({ ...option, positionAnswer: undefined })
                    )}
                  >
                    {option.description}
                  </DraggableLetters>
                )
              )}
          </Group>
        </Stack>
      </Group>

      {/* Continue to the next screen button */}
      <EduButton
        disabled={!answer}
        onClick={submitAnswer}
        style={{
          marginTop: "auto"
        }}
      >
        Continuar
      </EduButton>

      <LoadingOverlay
        visible={isLoading}
        style={{ maxHeight: (lousaHeight * 80) / 100 }}
      />
    </>
  );
}
