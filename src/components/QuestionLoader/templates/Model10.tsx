import { Group, Image, SimpleGrid, Title } from "@mantine/core";
import { IconBook } from "@tabler/icons-react";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconButton } from "~/components/EduButton";
import { OptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";

export function Model10({ question }: { question: Question }) {
  const { imageTitles, textTitles } = useQuestionHelper(question);

  return (
    <>
      <Group>
        <IconButton icon={<OuvirIcon />} variant="gray" />
        <IconButton icon={<IconBook size={34} />} variant="black" />
      </Group>
      {textTitles.map((title) => (
        <Title color="dark.3" size={30} align="center" key={title.description}>
          {title.description}
        </Title>
      ))}

      <Group spacing={100} my="auto">
        {imageTitles.map((title) => (
          <Image
            src={title.file_url}
            alt={title.description}
            width={270}
            key={title.file_url}
          />
        ))}

        <SimpleGrid cols={2}>
          {question.options
            .sort((a, b) => a.position - b.position)
            .map((option) => (
              <OptionButton key={option.description}>
                {option.description}
              </OptionButton>
            ))}
        </SimpleGrid>
      </Group>
    </>
  );
}
