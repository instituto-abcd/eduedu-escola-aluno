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
        {question.options.map((o) => (
          <TextOptionButton key={o.order}>{o.description}</TextOptionButton>
        ))}
      </Stack>
    </>
  );
}
