import { Group, Stack, Text, Title, createStyles } from "@mantine/core";
import { produce } from "immer";
import { Fragment, useEffect, useMemo, useState } from "react";
import { QuestionOption, QuestionTitle } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { DragLetterSlot } from "~/components/DraggableLetters/DragLetterSlot";
import { DraggableLetters } from "~/components/DraggableLetters/DraggableLetters";
import { TextOptionButton } from "~/components/OptionButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

const REGULAR_TEXT_FONTSIZE = boardW(40);
const SLOT_WIDTH = boardW(50);
const SLOT_HEIGHT = boardW(70);
const OPTION_FONTSIZE = boardW(32);

const useStyles = createStyles({
  slot: {
    width: SLOT_WIDTH,
    height: SLOT_HEIGHT,
  },

  option: {
    width: "auto",
    paddingBlock: boardW(10),
    fontSize: OPTION_FONTSIZE,
  },
});

export function Model11Prova({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { classes } = useStyles();
  const {
    getRule,

    textTitles,

    audioTitles,
    hasAudioTitle,
    audioTitleAutoplay,
  } = useQuestionHelper(question);

  const [answer, setAnswer] = useState<Array<QuestionOption | null>>([null]);

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

  /*
   *    Helpers para o título da questão
   *    Referente ao texto que apresenta a questão (enunciado)
   */
  const questionTitle = textTitles[0]?.description.split("/")[0] ?? "";
  const hasTitle = !!questionTitle;

  /*
   *    Helpers para o texto de completar
   */
  const textToComplete = getTextToComplete(textTitles);
  const shouldRepeatAnswer = checkShouldRepeatAnswer();

  function checkShouldRepeatAnswer() {
    const answerRule = getRule("answers");
    if (!answerRule) return false;

    const answers = answerRule.value.split(",");
    if (answers.length === 1) return false;
    if (new Set(answers).size !== answers.length) return true;
    return false;
  }

  function getTextToComplete(titles: QuestionTitle[]) {
    return titles.find(
      (title) =>
        title.description?.includes("Complete") ||
        title.description?.includes("complete")
    ) as QuestionTitle;
  }

  /* 🧙🏻 */
  const slotsQty = textToComplete
    ? textToComplete.description.split(/_./g).filter((w) => w !== "").length -
        1 <=
      0
      ? 1
      : textToComplete.description.split(/_./g).filter((w) => w !== "").length -
        1
    : 1;

  useEffect(() => {
    const initialSlots = new Array<null>(slotsQty).fill(null);
    setAnswer(initialSlots);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answer.filter((item) => item !== null) as QuestionOption[]);
  }, [answer]);

  const conditions = useMemo(() => [!answer.includes(null)], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  /* debug */
  const overwrite = (option: QuestionOption) =>
    question.options.map((q) => q.isCorrect).every((bool) => !bool)
      ? getRule("answers")?.value === option.description
      : undefined;

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

      <Stack my="auto" align="center" spacing={boardW(40)}>
        {hasTitle && (
          <Title color="dark.3" size={boardW(24)}>
            {questionTitle}
          </Title>
        )}
        <Group w="100%" noWrap position="center" spacing={boardW(100)}>
          <Stack align="center" spacing={boardW(60)}>
            <Group spacing={0}>
              {textToComplete &&
                textToComplete.description
                  .split("/")
                  .filter((w) => w.includes("_"))[0]
                  .split(/_+/g)
                  .map((w, inx, arr) => {
                    const notLastFragment = arr.length !== inx + 1;
                    const isLastFragment = arr.length === 1 && w.endsWith(" ");
                    const isFirstFragment =
                      arr.length === 1 && w.startsWith(" ");
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
                              minHeight: SLOT_HEIGHT,
                              fontSize: REGULAR_TEXT_FONTSIZE,
                            }}
                          />
                        )}
                        {w.split(" ").map((frag, inx) => (
                          <Text
                            color="dark.3"
                            size={REGULAR_TEXT_FONTSIZE}
                            weight={700}
                            p={0}
                            my={2.5}
                            mx={2.5}
                            key={inx}
                          >
                            {frag}
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
                              minHeight: SLOT_HEIGHT,
                              fontSize: REGULAR_TEXT_FONTSIZE,
                            }}
                          />
                        )}
                      </Fragment>
                    );
                  })}
            </Group>
            <Group align="center" position="center">
              {question.options.map((option, inx) =>
                question.axis_code === "LC" ? (
                  /* Vamos assumir que o eixo LC (leitura e compreensao de texto)
                   *  contempla alternativas em texto longo,
                   *  já as demais apenas 1 palavra ou poucas letas
                   */
                  <TextOptionButton key={inx} option={option}>
                    {option.description}
                  </TextOptionButton>
                ) : (
                  <DraggableLetters
                    option={option}
                    key={inx}
                    className={classes.option}
                    hidden={
                      !shouldRepeatAnswer &&
                      answer.some(
                        (item) =>
                          JSON.stringify({
                            ...item,
                            positionAnswer: undefined,
                          }) ===
                          JSON.stringify({
                            ...option,
                            positionAnswer: undefined,
                          })
                      )
                    }
                    debug={{
                      overwriteIsCorrect: overwrite(option),
                      outside: true,
                    }}
                  >
                    {option.description}
                  </DraggableLetters>
                )
              )}
            </Group>
          </Stack>
        </Group>
      </Stack>
    </>
  );
}
