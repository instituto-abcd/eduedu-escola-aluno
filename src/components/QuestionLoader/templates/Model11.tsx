import {
  Group,
  Image,
  LoadingOverlay,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { DraggableLetters } from "~/components/DraggableLetters/DraggableLetters";
import { EduButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { AudioButton } from "~/components/AudioButton";
import { DragLetterSlot } from "~/components/DraggableLetters/DragLetterSlot";
import { QuestionOption } from "~/api/exam";
import { Fragment, useEffect, useState } from "react";
import { useGetExamQuestion } from "~/api/student";
import { usePlanetAnswer } from "~/api/planet";
import { textoMedium, textoExtraBig, lousaWidth, lousaHeight } from "~/constants/dimensions";

/*
 *   TODO: implementar "audio alternativo" (botao amarelo) removido temporariamente
 */

export function Model11({ question, answerCallback }: ModelProps) {
  const { imageTitles, audioTitles, textTitles, isExam } =
    useQuestionHelper(question);

  const [, word] = textTitles[0].description.split("/") ?? ["", ""];
  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  const { mutate: mutateExam, isLoading: isLoadingExam } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  const { mutate: mutatePlanet, isLoading: isLoadingPlanet } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  const isLoading = isLoadingExam || isLoadingPlanet;

  function submitAnswer() {
    if (!answer) return;

    if (isExam) {
      mutateExam({
        questionId: question.id,
        optionsAnswered: [
          { position: answer.position, positionAnswer: 0 } as QuestionOption,
        ],
      });
    } else {
      mutatePlanet({
        questionId: question.id,
        planetId: question.planet_id,
        optionsAnswered: [
          { position: answer.position, positionAnswer: 0 } as QuestionOption,
        ],
      });
    }
  }

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  return (
    <>
      {/* Action buttons */}
      <Group mx="auto">
        {audioTitles.map((title) => (
          <AudioButton
            src={title.file_url ?? ""}
            autoPlay
            key={title.file_url}
          />
        ))}
      </Group>

      {/* Board content */}
      <Group m="auto" spacing={(lousaWidth * 5 / 100)}>
        {imageTitles.map((title) => (
          <Image
            src={title.file_url}
            alt={title.file_name}
            width={362}
            key={title.file_url}
            mx="auto"
          />
        ))}

        <Stack align="center" spacing={40}>
          {textTitles.map((title) => (
            <Title color="dark.3" size={textoMedium} key={title.description}>
              {title.description.split("/")[0]}
            </Title>
          ))}

          <Group>
            {word &&
              word.split("_").map((w, inx, arr) => (
                <Fragment key={w}>
                  <Text
                    color="dark.3"
                    size="3rem"
                    weight={700}
                  >
                    {w}
                  </Text>
                  {arr.length !== inx + 1 && (
                    <DragLetterSlot
                      onDrop={(item) => setAnswer(item)}
                      option={answer}
                      onClear={() => setAnswer(null)}
                      style={{
                        width: '87px',
                        height: '78px',
                        textAlign: 'center'
                      }}
                    />
                  )}
                </Fragment>
              ))}
          </Group>

          <Group>
            {question.options
              .sort((a, b) => a.position - b.position)
              .map((option) =>
                question.axis_code === "LC" ? (
                  /* Vamos assumir que o eixo LC (leitura e compreensao de texto)
                   *  contempla alternativas em texto longo,
                   *  já as demais apenas 1 palavra ou poucas letas
                   */
                  <TextOptionButton key={option.position}>
                    {option.description}
                  </TextOptionButton>
                ) : (
                  <DraggableLetters
                    key={option.position}
                    option={option}
                    style={{
                      width: '87px',
                      height: '78px',
                      textAlign: 'center'
                    }}
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
          marginTop: "auto",
          marginRight: "auto",
          marginLeft: "auto",
        }}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
