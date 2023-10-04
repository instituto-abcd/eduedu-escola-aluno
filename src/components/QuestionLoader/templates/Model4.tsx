import {
  Group,
  Image,
  LoadingOverlay,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { usePlanetAnswer } from "~/api/planet";
import { useGetExamQuestion } from "~/api/student";
import { AudioButton } from "~/components/AudioButton";
import { EduButton } from "~/components/EduButton";
import { OptionButton } from "~/components/OptionButton";
import { boardW, lousaHeight, lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function Model4({ question, answerCallback }: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const { audioTitles, textTitles, imageTitles, optionArrKey, isExam } =
    useQuestionHelper(question);

  const { mutate: mutateExam, isLoading: isLoadingExam } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  const { mutate: mutatePlanet, isLoading: isLoadingPlanet } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  const isLoading = isLoadingExam || isLoadingPlanet;

  function submitAnswer() {
    if (answer === null) return;

    if (isExam) {
      mutateExam({
        questionId: question.id,
        optionsAnswered: [answer],
      });
    } else {
      mutatePlanet({
        questionId: question.id,
        planetId: question.planet_id,
        optionsAnswered: [answer],
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
            key={title.position}
            src={title.file_url ?? ""}
            autoPlay={!!title.file_url}
          />
        ))}
      </Group>

      {/* Board content */}
      <Stack my="auto" align="center" spacing={(lousaWidth * 5) / 100}>
        <Group noWrap spacing={20} align="center" position="center">
          {textTitles.map((title) => (
            <Title
              key={title.description}
              dangerouslySetInnerHTML={{ __html: title.description }}
              align="center"
              color="dark.3"
              size={imageTitles.length > 0 ? boardW(20) : boardW(20)}
              w={imageTitles.length > 0 ? "50%" : undefined}
            />
          ))}

          {imageTitles.map((title) => (
            <Image
              mx="auto"
              src={title.file_url}
              alt={title.description}
              width={(lousaWidth * 15) / 100}
              key={title.file_url}
              style={{ flexGrow: 1 }}
              styles={{ image: { marginInline: "auto" } }}
            />
          ))}
        </Group>

        <Group>
          {question.options.map((option, inx) => (
            <OptionButton
              key={optionArrKey(option, inx)}
              data-selected={JSON.stringify(option) === JSON.stringify(answer)}
              onClick={() => setAnswer(option)}
              sound={option.sound_url ?? undefined}
              isCorrect={option.isCorrect}
            >
              {option.image_url && (
                <>
                  <img
                    src={option.image_url}
                    alt={option.description}
                    height={105}
                    width="auto"
                    style={{
                      maxHeight: 120,
                      maxWidth: "100%",
                      objectFit: "contain",
                      marginInline: "auto",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  />
                  {!question.axis_code && question.axis_code === null && (
                    <Text size={14} color="gray.7" weight={600}>
                      {option.description}
                    </Text>
                  )}
                </>
              )}
              {!option.image_url && (
                <Text size={"2vh"}>{option.description}</Text>
              )}
            </OptionButton>
          ))}
        </Group>
      </Stack>

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

      {/* Loading animation */}
      <LoadingOverlay
        visible={isLoading}
        style={{ maxHeight: (lousaHeight * 80) / 100 }}
      />
    </>
  );
}
