import { Group, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { AudioButton } from "~/components/AudioButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function Model21({ question }: ModelProps) {
  const { audioTitles, textTitles, hasAudioTitle } =
    useQuestionHelper(question);
  const autoPlay =
    question.rules.find((rule) => rule.name === "autoplay")?.value === "true" ??
    false;

  const title =
    textTitles.find((title) => title.position === 1)?.description ?? "";

  const statement =
    textTitles.find((title) => title.position === 2)?.description ?? "";

  return (
    <>
      {hasAudioTitle && (
        <Group>
          {audioTitles
            .filter((title) => title.file_url)
            .map((title, inx) => (
              <AudioButton
                key={inx}
                src={title.file_url!}
                autoPlay={autoPlay}
              />
            ))}
        </Group>
      )}

      <Stack my="auto">
        {title !== "" && (
          <Title color="dark.3" size={boardW(30)}>
            {title}
          </Title>
        )}

        <ScrollArea maw={boardW(800)} mah={boardW(360)} type="always" px={20}>
          <Text
            dangerouslySetInnerHTML={{ __html: statement }}
            color="dark.3"
            size={boardW(20)}
          />
        </ScrollArea>
      </Stack>
    </>
  );
}
