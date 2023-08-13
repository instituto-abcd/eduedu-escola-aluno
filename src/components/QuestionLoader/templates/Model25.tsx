import { Card, Center, Grid, Group, SimpleGrid, Text, Title } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { DraggableCard } from "~/components/DraggableCard";
import { EduButton } from "~/components/EduButton/EduButton";

export function Model25({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart" spacing={137}>
        <Center style={{ width: '100%' }}>
          <Grid columns={3} maw={600}>
            <Grid.Col span={3}>
              <Title mb={5} style={{ textAlign: 'center' }}>O que é o que é</Title>
            </Grid.Col>
            <Grid.Col span={1}>
              <Card style={{ border: '1px solid #868E96', height: '100%' }}>
                É feito para andar e não anda
              </Card>
            </Grid.Col>
            <Grid.Col span={1}>
              <Card style={{ border: '1px solid #868E96', height: '100%' }}>
                Dá muitas voltas e não sai do lugar.
              </Card>
            </Grid.Col>
            <Grid.Col span={1}>
              <Card style={{ border: '1px solid #868E96', height: '100%' }}>
                Tem cabeça e tem dente, não é bicho e nem é gente.
              </Card>
            </Grid.Col>


            <Grid.Col span={1}>
              <DraggableCard
                image="https://place-hold.it/362"
                name="O alho"
              />
            </Grid.Col>
            <Grid.Col span={1}>
              <DraggableCard
                image="https://place-hold.it/362"
                name="A rua"
              />
            </Grid.Col>
            <Grid.Col span={1}>
              <DraggableCard
                image="https://place-hold.it/362"
                name="O relógio"
              />
            </Grid.Col>
          </Grid>
        </Center>
      </Group>
    </>
  );
}
