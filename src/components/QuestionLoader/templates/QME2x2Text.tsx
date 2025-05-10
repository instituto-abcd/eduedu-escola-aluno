import {
  Box,
  Flex,
  Group,
  Image,
  ScrollArea,
  Stack,
  Text,
  Title,
  createStyles,
} from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption, QuestionTitleClassification } from "~/api/exam";
import { TextOptionButton } from "~/components/OptionButton";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

const useStyles = createStyles((theme) => ({
  typography: {
    color: theme.colors.dark[3],
    fontSize: boardW(24),
    textAlign: "center",
    b: {
      fontWeight: 500,
      fontSize: boardW(26),
    },
  },
  button: {
    width: "100%",
    height: "fit-content",
    padding: boardW(20),
  },
}));

export function QME2x2Text({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const { classes } = useStyles();
  const { textTitles, imageTitles } = useQuestionHelper(question);
  const [answer, setAnswer] = useState<QuestionOption | null>(null);

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  const title = "Leia o texto e responda à pergunta.";
  return (
    <>
      <div className="flex flex-col flex-nowrap w-full h-full items-center justify-center">
        <Title color="dark.3" size={boardW(24)} mx="auto" pb={boardW(15)}>
          {title}
        </Title>

        <div className="flex flex-nowrap w-full items-center justify-center ">
          <div className="flex flex-col w-[45%] h-full items-center justify-center">
            <ScrollArea w="100%" h={boardW(450)} pr={boardW(30)} type="always">
              <Stack align="center">
                <Text
                  className={classes.typography}
                  dangerouslySetInnerHTML={{
                    __html:
                      textTitles.find(
                        (title) =>
                          title.classification ===
                          QuestionTitleClassification.HISTORIA
                      )?.description ?? "",
                  }}
                />
                {imageTitles.map((title) => (
                  <Image
                    src={title.file_url}
                    alt={title.file_name}
                    height={boardW(120)}
                    width="auto"
                    pt={boardW(20)}
                    key={title.file_url}
                  />
                ))}
              </Stack>
            </ScrollArea>
          </div>

          <div className="flex flex-col w-[45%] h-full items-center justify-center">

            <ScrollArea w="100%" h={boardW(450)} type="always">
              <Stack align="center">
                <Title
                  align="center"
                  color="dark.3"
                  size={boardW(26)}
                  weight={500}
                >
                  {
                    textTitles.find(
                      (title) =>
                        title.classification ===
                        QuestionTitleClassification.ENUNCIADO
                    )?.description
                  }
                </Title>
                <Group align="center" position="center" w={"80%"}>
                  <div
                    className="flex flex-wrap w-full h-full items-center justify-center"
                  >
                    {question.options.map((option) => (
                      <div className="w-[40%] m-2">
                        <TextOptionButton
                          key={option.description}
                          onClick={() => setAnswer(option)}
                          data-selected={answer?.position === option.position}
                          className={classes.button}
                          option={option}
                          debug={{ size: 10 }}
                          >
                          {option.description}
                        </TextOptionButton>
                      </div>
                    ))}
                  </div>
                </Group>
              </Stack>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}
