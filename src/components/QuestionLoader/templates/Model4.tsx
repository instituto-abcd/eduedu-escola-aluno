import { Group, Image, Text, Title } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { AudioButton } from "~/components/AudioButton";
import { OptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function Model4({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [answer, setAnswer] = useState<QuestionOption | null>(null);
  const {
    audioTitles,
    textTitles,
    imageTitles,
    hasAudioTitle,
    audioTitleAutoplay,
    getRule,
    isExam,
  } = useQuestionHelper(question);
  const hideOptionsTextRule = getRule("options_hide_text");
  const showOptionsText =
    hideOptionsTextRule && hideOptionsTextRule.value === "false" ? false : true;
  const hasDescription = (description: string) =>
    description !== null && description !== "";

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

  return (
    <>
      {hasAudioTitle && (
        <div className="flex gap-4 lg:self-start">
          {audioTitles.map((title, inx) => (
            <AudioButton
              index={inx}
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
              src={title.file_url!}
            />
          ))}
        </div>
      )}

      <div className="h-full w-full flex flex-col items-center justify-evenly">
        <Group
          noWrap
          spacing={20}
          align="center"
          position="center"
        >
          {textTitles.map((title) => (
            <Title
              key={title.description}
              dangerouslySetInnerHTML={{ __html: title.description }}
              color="dark.3"
              className="text-xl text-center font-semibold"
            />
          ))}
          {imageTitles.map((title) => (
            <div className="max-h-[150px]">
              <Image
                src={title.file_url}
                alt={title.description}
                key={title.file_url}
                className="max-h-[150px] max-w-[150px] min-h-[150px] min-w-[150px]"
              />
            </div>
          ))}
        </Group>

        <div className="flex w-full md:w-2/3 lg:w-full flex-wrap justify-center items-center">
          {question.options.map((option, inx) => (
            <OptionButton
              key={inx}
              data-selected={JSON.stringify(option) === JSON.stringify(answer)}
              onClick={() => setAnswer(option)}
              option={option}
              className="h-[125px] w-[125px] md:w-[200px] md:h-[200px] lg:w-[200px] lg:h-[200px] m-4 flex items-center justify-center"
            >
              {option.image_url && (
                <>
                  <img
                    src={option.image_url}
                    alt={option.description}
                    className="pointer-events-none select-none mx-auto object-contain max-w-[60%]"
                  />
                  {!isExam &&
                    showOptionsText &&
                    hasDescription(option.description) && (
                      <Text
                        size={14}
                        color="gray.7"
                        weight={600}
                      >
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
        </div>
      </div>
    </>
  );
}
