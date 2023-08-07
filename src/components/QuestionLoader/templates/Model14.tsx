import { Grid, Group, Image } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { DraggableCard } from "~/components/DraggableCard";
import { EduButton } from "~/components/EduButton/EduButton";

export function Model14({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart" spacing={137}>
        <Grid>
          <Grid.Col span={4}>
            <Image src="https://place-hold.it/110" height={256} />
          </Grid.Col>
          <Grid.Col span={2} m="auto">
            <DraggableCard
              customWidth="80px"
              customHeigth="80px"
              name="1"
            />
          </Grid.Col>
          <Grid.Col span={2} m="auto">
            <DraggableCard
              customWidth="80px"
              customHeigth="80px"
              name="2"
            />
          </Grid.Col>
          <Grid.Col span={2} m="auto">
            <DraggableCard
              customWidth="80px"
              customHeigth="80px"
              name="3"
            />
          </Grid.Col>
          <Grid.Col span={2} m="auto">
            <DraggableCard
              customWidth="80px"
              customHeigth="80px"
              name="4"
            />
          </Grid.Col>
        </Grid>
      </Group>
    </>
  );
}
