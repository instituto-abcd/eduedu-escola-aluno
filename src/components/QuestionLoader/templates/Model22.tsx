import { Group, SimpleGrid, Text } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { EduButton } from "~/components/EduButton/EduButton";

export function Model22({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart" spacing={137}>
        <SimpleGrid>
          <Text>Selecione o substantivo da frase</Text>
          {/* TODO: textarea com draggable */}
        </SimpleGrid>
      </Group>
    </>
  );
}
