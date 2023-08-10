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

export function QME2x2Text2({ question }: { question: Question }) {
  const title = "Leia a fábula e responda à pergunta.";
  const subtitle = "A raposa e a uva";
  const text =
    "Era uma vez uma raposa que estava sem comer havia muitos dias. Ela foi passear no pomar e encontrou um lindo cacho de uvas. O cacho estava no alto de uma parreira, e a raposa decidiu se esforçar para apanhá-lo. Ela deu muitos pulos para tentar alcançar, mas, depois de muitas tentativas, ficou exausta e continuava faminta. Então, a raposa deu de ombros e resolveu ir embora.";

  const imgUrl = "https://place-hold.it/102";

  const qtitle = "Por que a raposa disse que as uvas estavam verdes?";

  // TODO: "bolinha" de indicação de scroll 🤦🏻‍♀️

  return (
    <>
      <Title color="dark.3" size={30} weight={500}>
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
          {question.options.map((option) => (
            <TextOptionButton>{option.description}</TextOptionButton>
          ))}
        </Stack>
      </Group>
    </>
  );
}
