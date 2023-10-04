import { Group, LoadingOverlay, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { EduButton } from "~/components/EduButton/EduButton";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { usePlanetAnswer } from "~/api/planet";
import { boardW, lousaHeight } from "~/constants/dimensions";

export function Model21({ question, answerCallback }: ModelProps) {
  const { audioTitles, textTitles } = useQuestionHelper(question);
  const autoPlay =
    question.rules.find((rule) => rule.name === "autoplay")?.value === "true" ??
    false;

  const title =
    textTitles.find((title) => title.position === 1)?.description ?? "";

  const statement =
    textTitles.find((title) => title.position === 2)?.description ?? "";

  const { mutate, isLoading } = usePlanetAnswer({
    onSuccess: (q) => answerCallback(q),
  });

  function submitAnswer() {
    mutate({
      planetId: question.planet_id,
      questionId: question.id,
      optionsAnswered: [],
    });
  }

  return (
    <>
      {/* Action buttons */}
      <Group mx="auto" h="50px">
        {audioTitles.filter((title) => title.file_url).length > 0 && (
          audioTitles
            .filter((title) => title.file_url)
            .map((title, inx) => (
              <AudioButton
                key={inx}
                src={title.file_url!}
                autoPlay={autoPlay}
              />
            ))
        )}
      </Group>

      {/* Board content */}
      <Stack>
        <Title color="dark.3" size={boardW(30)}>{title}</Title>

        <ScrollArea maw={boardW(800)} mah={boardW(390)} type="always">
          <Text
            dangerouslySetInnerHTML={{ __html: statement }}
            color="dark.3"
            size={boardW(20)}
          />
        </ScrollArea>
      </Stack>

      {/* Continue to the next screen button */}
      <EduButton
        onClick={submitAnswer}
        style={{
          marginTop: 'auto'
        }}>
        Continuar
      </EduButton>

      {/* Loading animation */}
      <LoadingOverlay visible={isLoading} style={{ maxHeight: lousaHeight * 80 / 100 }} />
    </>
  );
}
