import {
  Group,
  Image,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Question } from "~/api/exam";
import { TextOptionButton } from "~/components/OptionButton";

export function QME2x2Text({ question }: { question: Question }) {
  const title = "Leia o texto e responda à pergunta.";
  const subtitle = "A vida dos sapos";
  const text =
    "Os sapos têm quatro fases de vida. Em cada fase, eles crescem e mudam. Os sapos botam ovos. O bebê sapo se chama girino. O girino mora na água e respira embaixo dágua. Girinos não têm pernas. Quando o sapo cresce, ele respira fora dágua e pode viver na terra.";
  const imgUrl = "https://place-hold.it/102";

  const qtitle = "Como chama o sapo quando nasce?";

  return (
    <>
      <Title color="dark.3" size={30}>
        {title}
      </Title>

      <Group noWrap grow spacing={75}>
        <ScrollArea h={380}>
          <Stack align="center" p={20}>
            <Title align="center" color="dark.3" size={30} weight={500}>
              {subtitle}
            </Title>
            <Text align="center" color="dark.3" size={20} weight={400}>
              {text}
            </Text>
            <Image src={imgUrl} alt="Imagem" width={102} />
          </Stack>
        </ScrollArea>

        <Stack align="center" p={20}>
          <Title align="center" color="dark.3" size={30} weight={500}>
            {qtitle}
          </Title>
          <SimpleGrid cols={2}>
            {question.options.map((option) => (
              <TextOptionButton>{option.description}</TextOptionButton>
            ))}
          </SimpleGrid>
        </Stack>
      </Group>
    </>
  );
}
