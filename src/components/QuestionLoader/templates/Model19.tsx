import { Flex, Group, SimpleGrid } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { DraggableCard } from "~/components/DraggableCard";
import { EduButton } from "~/components/EduButton/EduButton";
// import { GrayCard } from "~/components/GrayCard";

export function Model19({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart" spacing={137}>
        <SimpleGrid>
          <DraggableCard
            customHeigth="200px"
            customWidth="300px"
            image="https://place-hold.it/150"
            imageWidth="150"
          />

          <Flex mt={40}>
            {/* <GrayCard
              name="1"
              customHeigth="70px"
              customWidth="70px"
            /> */}
          </Flex>
        </SimpleGrid>
      </Group>
    </>
  );
}
