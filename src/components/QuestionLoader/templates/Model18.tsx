import { Flex, Grid, Group, Image, Text } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { DraggableCard } from "~/components/DraggableCard";
import { EduButton } from "~/components/EduButton/EduButton";
import { GrayCard } from "~/components/GrayCard";

export function Model18({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart" spacing={137}>
        <Grid columns={12}>
          <Grid.Col span={12}>
            <Text align="center">Complete a palavra com RA, RE, RI, RO ou RU</Text>
          </Grid.Col>
          <Grid.Col span={4}>
            <Image src="https://place-hold.it/220" width={220} />
          </Grid.Col>
          <Grid.Col span="auto" my="auto" ml={20}>
            <Flex mb={50}>
              <GrayCard
                name="U"
                customHeigth="70px"
                customWidth="70px"
              />
            </Flex>
            <Flex>
              <DraggableCard
                customHeigth="70px"
                customWidth="70px"
                name="R"
              />
            </Flex>
          </Grid.Col>
        </Grid>
      </Group>
    </>
  );
}
