import { Stack, Title } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { EduButton } from "~/components/EduButton/EduButton";

export function Model8({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Title color="dark.3" size={30} align="center">
        {question.description}
      </Title>

      <Stack align="stretch" spacing={40}>
        {question.options.map((o) => (
          <EduButton key={o.order}>{o.description}</EduButton>
        ))}
      </Stack>
    </>
  );
}
