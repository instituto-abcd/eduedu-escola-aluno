import { Group, Stack } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { DraggableCard } from "~/components/DraggableCard";
import { EduButton } from "~/components/EduButton/EduButton";
import { GrayCard } from "~/components/GrayCard/GrayCard";

export function Model13({ question }: { question: Question }) {

  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart" spacing={137}>
        <Stack align="center">
          <Group>
            <GrayCard
              image="https://place-hold.it/110"
              name="Pessoa"
            />
            <GrayCard
              image="https://place-hold.it/110"
              name="Lugar"
            />
            <GrayCard
              image="https://place-hold.it/110"
              name="Lugar"
            />
            <GrayCard
              image="https://place-hold.it/110"
              name="Coisa"
            />
          </Group>
          <DraggableCard name="Violão" />
        </Stack>
      </Group>
    </>
  );
}
