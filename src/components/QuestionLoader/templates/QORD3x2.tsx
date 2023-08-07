import { Group, SimpleGrid } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";

export function QORD3x2({ question }: { question: Question }) {
  return (
    <>
      <IconButton icon={<OuvirIcon />} variant="gray" />

      <Group noWrap grow spacing={75} py={40}>
        <p>___________</p>
        <p>___________</p>
      </Group>

      <SimpleGrid cols={3} style={{ placeItems: "center" }} spacing={24}>
        {question.options.map((option) => (
          <TextOptionButton>{option.description}</TextOptionButton>
        ))}
      </SimpleGrid>
    </>
  );
}
