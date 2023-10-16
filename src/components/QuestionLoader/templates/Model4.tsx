import { Group, Image, Stack, Text, Title, createStyles } from "@mantine/core";
import { useEffect, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { OptionButton } from "~/components/OptionButton";
import { boardW, lousaWidth } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

const useStyles = createStyles({
  title: {
    fontSize: boardW(20),
    "*": {
      fontSize: boardW(20),
    },
  },
});

export function Model4({ question, onAnswerChange }: ModelProps) {
  const { classes } = useStyles();
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const {
    audioTitles,
    textTitles,
    imageTitles,
    hasAudioTitle,
    audioTitleAutoplay,
  } = useQuestionHelper(question);

  useEffect(() => {
    setAnswer(null);
  }, [question]);

  useEffect(() => {
    onAnswerChange(answer ? [answer] : []);
  }, [answer]);

  return (
    <>
      {hasAudioTitle && (
        <Group mx="auto">
          {audioTitles.map((title, inx) => (
            <AudioButton
              key={title.position}
              src={title.file_url ?? ""}
              autoPlay={audioTitleAutoplay(inx)}
            />
          ))}
        </Group>
      )}

      <Stack my="auto" align="center" spacing={(lousaWidth * 5) / 100}>
        <Group noWrap spacing={20} align="center" position="center">
          {textTitles.map((title) => (
            <Title
              key={title.description}
              dangerouslySetInnerHTML={{ __html: title.description }}
              align="center"
              color="dark.3"
              w={imageTitles.length > 0 ? "50%" : undefined}
              className={classes.title}
            />
          ))}
          {imageTitles.map((title) => (
            <Image
              mx="auto"
              src={title.file_url}
              alt={title.description}
              width={(lousaWidth * 15) / 100}
              key={title.file_url}
              style={{ flexGrow: 1 }}
              styles={{ image: { marginInline: "auto" } }}
            />
          ))}
        </Group>

        <Group>
          {question.options.map((option, inx) => (
            <OptionButton
              key={inx}
              data-selected={JSON.stringify(option) === JSON.stringify(answer)}
              onClick={() => setAnswer(option)}
              sound={option.sound_url ?? undefined}
              isCorrect={option.isCorrect}
            >
              {option.image_url && (
                <>
                  <img
                    src={option.image_url}
                    alt={option.description}
                    height={105}
                    width="auto"
                    style={{
                      maxHeight: 120,
                      maxWidth: "100%",
                      objectFit: "contain",
                      marginInline: "auto",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  />
                  {!question.axis_code && question.axis_code === null && (
                    <Text size={14} color="gray.7" weight={600}>
                      {option.description}
                    </Text>
                  )}
                </>
              )}
              {!option.image_url && (
                <Text size={"2vh"}>{option.description}</Text>
              )}
            </OptionButton>
          ))}
        </Group>
      </Stack>
    </>
  );
}
