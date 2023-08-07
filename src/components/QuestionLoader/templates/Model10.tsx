import { Group, SimpleGrid, Title } from "@mantine/core";
import { IconBook } from "@tabler/icons-react";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconButton } from "~/components/EduButton";
import { OptionButton } from "~/components/OptionButton";

export function Model10({ question }: { question: Question }) {
  return (
    <>
      <Group>
        <IconButton icon={<OuvirIcon />} variant="gray" />
        <IconButton icon={<IconBook size={34} />} variant="black" />
      </Group>
      <Title color="dark.3" size={30} align="center">
        {question.description}
      </Title>

      <SimpleGrid cols={2}>
        {question.options
          .sort((a, b) => a.order - b.order)
          .map((o) => (
            <OptionButton key={o.order}>{o.description}</OptionButton>
          ))}
      </SimpleGrid>
    </>
  );
}
