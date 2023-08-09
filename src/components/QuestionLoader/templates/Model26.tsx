import { Center, Flex, Group, Image, SimpleGrid, Text } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { DraggableCard } from "~/components/DraggableCard";
import { EduButton } from "~/components/EduButton/EduButton";
import { GrayCard } from "~/components/GrayCard";

export function Model26({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart" spacing={137}>

        <SimpleGrid>
          <Center>
            <Image src="https://place-hold.it/362" width={269} height={175} mb={20} />
          </Center>

          <Center>
            <Flex my="auto">
              <Text mr={10}>A</Text>
              <GrayCard
                customWidth="80px"
                customHeigth="80px"
              />
              <GrayCard
                customWidth="80px"
                customHeigth="80px"
              />
              <GrayCard
                customWidth="80px"
                customHeigth="80px"
              />
              <Text ml={10}>é o lugar onde eu aprendo.</Text>
            </Flex>
          </Center>

          <Center>
            <Flex>
              <DraggableCard
                customWidth="80px"
                customHeigth="80px"
              />
              <DraggableCard
                customWidth="80px"
                customHeigth="80px"
              />
              <DraggableCard
                customWidth="80px"
                customHeigth="80px"
              />
            </Flex>
          </Center>
        </SimpleGrid>
      </Group>
    </>
  );
}
