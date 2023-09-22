import { Grid, Group } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { EduButton } from "~/components/EduButton/EduButton";
import { MemoryCard } from "~/components/MemoryCard/MemoryCard";

/* 

  Model28
    Formar pares com o POSITION das opções
    Se houver image_url, não mostrar description

*/

export function Model28({ question }: { question: Question }) {
  const cards = [
    { image: "https://place-hold.it/110", text: "triste" },
    { image: "https://place-hold.it/110", text: "noite" },
    { image: "https://place-hold.it/110", text: "cheio" },
    { image: "https://place-hold.it/110", text: "dia" },
    { image: "https://place-hold.it/110", text: "feliz" },
    { image: "https://place-hold.it/110", text: "vazio" },
  ];
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart" spacing={137}>
        <Grid columns={3} maw={600}>
          {cards &&
            cards.map((item) => (
              <Grid.Col span={1}>
                <MemoryCard image={item.image} text={item.text} />
              </Grid.Col>
            ))}
        </Grid>
      </Group>
    </>
  );
}
