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
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { EduButton } from "~/components/EduButton/EduButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";

const useStyles = createStyles((theme) => ({
  typography: {
    color: theme.colors.dark[3],
    fontSize: 20,
    h1: {
      fontSize: 30,
      fontWeight: 600,
    },
  },
}));

export function Model32({ question }: { question: Question }) {
  const { classes } = useStyles();

  const { textTitles, imageTitles } = useQuestionHelper(question);
  const [questionText, questionTitle, questionHeader] = textTitles;

  // TODO: !importante - sugerir identificação dos titulos, ou utilização dos POSITION para este propósito
  // TODO: id 95 e 96 não tem 3 titulos de texto como os outros (faltando o header), description está vazio

  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>
      <Title color="dark.3" size={30} align="center">
        {questionHeader.description}
      </Title>

      <Group noWrap grow spacing={50}>
        <ScrollArea h={290} px={30} type="always">
          <Stack align="stretch" spacing={20} py={10}>
            <Text
              dangerouslySetInnerHTML={{ __html: questionText.description }}
              className={classes.typography}
            />
            {imageTitles.map((title) => (
              <Image
                src={title.file_url}
                key={title.file_url}
                width={204}
                mx="auto"
              />
            ))}
          </Stack>
        </ScrollArea>
        <Stack>
          <Text size={20} weight={600} color="dark.3" align="center">
            {questionTitle.description}
          </Text>
          {question.options.map((option) => (
            <EduButton key={option.position}>{option.description}</EduButton>
          ))}
        </Stack>
      </Group>
    </>
  );
}
