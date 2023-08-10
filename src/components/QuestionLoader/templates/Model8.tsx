import { Stack, Title } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";

export function Model8({ question }: { question: Question }) {
  return (
    <>
      <IconButton icon={<OuvirIcon />} variant="gray" />

      <Title color="dark.3" size={30} align="center">
        {question.description}
      </Title>

      <Stack align="stretch" spacing={40} w={555}>
        {question.options
          .sort((a, b) => a.position - b.position)
          .map((option) => (
            <TextOptionButton key={option.description}>
              {option.description}
            </TextOptionButton>
          ))}
      </Stack>
    </>
  );
}
