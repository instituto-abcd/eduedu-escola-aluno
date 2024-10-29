import { useEffect, useMemo, useState } from "react";
import { QuestionOption, QuestionTitle } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { BREAKPOINT } from "~/constants/dimensions";
import { createStyles, ScrollArea, SimpleGrid, Title } from "@mantine/core";
import { OptionButton } from "~/components/OptionButton";
import { IconVolume } from "@tabler/icons-react";
import { ReadButton } from "~/components/ReadButton";
import { AudioContainer } from "~/components/AudioContainer";
import { ImageTitle } from "~/components/question-components";

export function Model10({
  question,
  auxQuestion,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const { imageTitles, textTitles, audioTitles, hasAudioTitle, getRule } =
    useQuestionHelper(question);

  const conditions = useMemo(() => [Boolean(answer)], [answer]);

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  const hideTextRule = getRule("options_hide_text")?.value === "true";

  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      {hasAudioTitle && (
        <AudioContainer question={question} audioTitles={audioTitles}>
          {auxQuestion && <ReadButton question={auxQuestion} />}
        </AudioContainer>
      )}

      {imageTitles.length !== 0 &&
        textTitles
          .filter(
            (title) => title.description && !title.placeholder.includes("ID"),
          )
          .map((title, inx) => (
            <ScrollArea mah={100} type="auto" key={inx} px="xs">
              <Title
                color="dark.3"
                size={22}
                align="center"
                dangerouslySetInnerHTML={{ __html: title.description ?? "" }}
                px={10}
              />
            </ScrollArea>
          ))}

      <div className={classes.content}>
        {imageTitles.length === 0 &&
          textTitles
            .filter(
              (title) => title.description && !title.placeholder.includes("ID"),
            )
            .map((title, inx) => (
              <ScrollArea mah={400} w={350} type="auto" key={inx} px="xs">
                <Title
                  color="dark.3"
                  size={title.description.split(" ").length > 1 ? 22 : 70}
                  align="center"
                  dangerouslySetInnerHTML={{ __html: title.description ?? "" }}
                />
              </ScrollArea>
            ))}

        <ImageTitle titles={imageTitles} />

        <SimpleGrid cols={2}>
          {question.options.map((option, inx) => (
            <OptionButton
              key={inx}
              onClick={() =>
                setAnswer({
                  ...option,
                  positionAnswer: question.orderedAnswer
                    ? +option.position
                    : undefined,
                })
              }
              data-selected={
                JSON.stringify(answer) ===
                JSON.stringify({
                  ...option,
                  positionAnswer: question.orderedAnswer
                    ? option.position
                    : undefined,
                })
              }
              option={option}
            >
              {(!option.image_url || !hideTextRule) && (
                <>{option.description}</>
              )}

              {option.image_url && (
                <img
                  src={option.image_url}
                  alt={option.description}
                  width={100}
                  style={{
                    maxHeight: 110,
                    objectFit: "contain",
                    marginInline: "auto",
                  }}
                />
              )}
              {!option.image_url && option.sound_url && !option.description && (
                <IconVolume size={80} />
              )}
            </OptionButton>
          ))}
        </SimpleGrid>
      </div>
    </div>
  );
}

const useStyles = createStyles((theme) => ({
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    gap: 20,
    marginBlock: "auto",
    [theme.fn.largerThan(BREAKPOINT.TABLET_HORZ)]: {
      flexDirection: "row",
      gap: 80,
    },
  },

  container: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));
