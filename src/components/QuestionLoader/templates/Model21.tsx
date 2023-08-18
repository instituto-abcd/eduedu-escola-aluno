import { Group, SimpleGrid, Text, Title } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { EduButton } from "~/components/EduButton/EduButton";

export function Model21({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart" spacing={137}>
        <SimpleGrid>
          <Title mb={40}>Leia o poema</Title>
          <Text>Lorem ipsum</Text>
        </SimpleGrid>
      </Group>
    </>
  );
}
