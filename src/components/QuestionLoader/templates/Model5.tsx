import { SimpleGrid, Title } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";

export function Model5({ question }: { question: Question }) {
  return (
    <>
      <IconButton icon={<OuvirIcon />} />

      <Title color="dark.3" size={30} align="center">
        {question.description}
      </Title>

      <SimpleGrid cols={2} w="full">
        {question.options
          .sort((a, b) => a.order - b.order)
          .map((o) => (
            <TextOptionButton key={o.order}>{o.description}</TextOptionButton>
          ))}
      </SimpleGrid>
    </>
  );
}
