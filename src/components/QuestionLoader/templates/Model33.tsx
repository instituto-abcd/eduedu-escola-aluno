import { Group, SimpleGrid, Image } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { EduButton } from "~/components/EduButton/EduButton";

export function Model33({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart" spacing={137}>
        <SimpleGrid cols={2}>
          <Image src="https://place-hold.it/346" height={346} />
          <Image src="https://place-hold.it/346" height={346} />
        </SimpleGrid>
      </Group>
    </>
  );
}
