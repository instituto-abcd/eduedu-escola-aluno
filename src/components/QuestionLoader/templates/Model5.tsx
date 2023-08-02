import { SimpleGrid, Title } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { EduButton } from "~/components/EduButton/EduButton";

export function Model5({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Title color="dark.3" size={30} align="center">
        {question.description}
      </Title>

      <SimpleGrid cols={2} w="full">
        {question.options
          .sort((a, b) => a.order - b.order)
          .map((o) => (
            <EduButton key={o.order}>{o.description}</EduButton>
          ))}
      </SimpleGrid>
    </>
  );
}
