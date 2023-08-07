import { Flex, Group, SimpleGrid, Image } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { DraggableCard } from "~/components/DraggableCard";
import { EduButton } from "~/components/EduButton/EduButton";

export function Model20({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart" spacing={137}>
        <SimpleGrid>
          <Image src="https://place-hold.it/220" width={220} />
          {/* TODO: textarea com draggable */}
          <Flex>
            <DraggableCard
              name="Caiu"
              customHeigth="83px"
            />
          </Flex>
        </SimpleGrid>
      </Group>
    </>
  );
}
