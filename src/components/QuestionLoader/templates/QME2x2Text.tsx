import {
  Group,
  Image,
  ScrollArea,
  Stack,
  Text,
  Title,
  createStyles,
} from "@mantine/core";
import { Question } from "~/api/exam";
import { TextOptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";

const useStyles = createStyles((theme) => ({
  typography: {
    color: theme.colors.dark[3],
    fontSize: 20,
    textAlign: "center",
    b: {
      fontWeight: 500,
      fontSize: 30,
    },
  },
}));

export function QME2x2Text({ question }: { question: Question }) {
  const { classes } = useStyles();
  const title = "Leia o texto e responda à pergunta.";
  const { textTitles, imageTitles } = useQuestionHelper(question);

  return (
    <>
      <Title color="dark.3" size={30}>
        {title}
      </Title>

      <Group noWrap grow spacing={75}>
        <ScrollArea h={380}>
          <Stack align="center" p={20}>
            <Text
              className={classes.typography}
              dangerouslySetInnerHTML={{ __html: textTitles[0].description }}
            />
            {imageTitles.map((title) => (
              <Image
                src={title.file_url}
                alt={title.file_name}
                width={102}
                key={title.file_url}
              />
            ))}
          </Stack>
        </ScrollArea>

        <Stack align="center" p={20}>
          <Title align="center" color="dark.3" size={30} weight={500}>
            {textTitles[1].description}
          </Title>
          <Group align="center" position="center">
            {question.options
              .sort((a, b) => a.position - b.position)
              .map((option) => (
                <TextOptionButton key={option.description}>
                  {option.description}
                </TextOptionButton>
              ))}
          </Group>
        </Stack>
      </Group>
    </>
  );
}
