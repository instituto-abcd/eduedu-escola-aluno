import { SimpleGrid, Group, Image, Stack } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { ArrowPlanet } from "~/components/ArrowPlanet/ArrowPlanet";
import { DraggableCard } from "~/components/DraggableCard";
import { EduButton } from "~/components/EduButton/EduButton";

export function Model12({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart" spacing={137}>
        <Stack align="center">
          <Image src="https://place-hold.it/362" width={269} height={175} mb={20} />
          <SimpleGrid cols={3}>
            <ArrowPlanet direction="prev" />
            <DraggableCard />
            <ArrowPlanet direction="next" />
          </SimpleGrid>
        </Stack>
      </Group>
    </>
  );
}
