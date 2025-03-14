import { Group, Box, Image, Text, Stack, ScrollArea } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { useEffect, useMemo, useState } from "react";
import { TextOptionButton } from "~/components/OptionButton";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { boardW } from "~/constants/dimensions";

export function Model27({ question, onConditionsChange }: ModelProps) {
  const { audioTitles, audioTitleAutoplay } = useQuestionHelper(question);
  const totalSlides = question.options.length;
  const [slideIndex, setSlideIndex] = useState(0);
  const currentSlide = question.options[slideIndex];

  function nextSlide() {
    if (slideIndex + 1 >= totalSlides) return;
    setSlideIndex(slideIndex + 1);
  }

  function previousSlide() {
    if (slideIndex - 1 < 0) return;
    setSlideIndex(slideIndex - 1);
  }

  useEffect(() => {
    setSlideIndex(0);
  }, [question]);

  const conditions = useMemo(
    () => [slideIndex + 1 === totalSlides],
    [slideIndex]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <>
      <Group>
        {audioTitles.map((title, inx) => (
          <Box key={inx} hidden>
            <AudioButton
              index={inx}
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
              src={title?.file_url ?? ""}
            />
          </Box>
        ))}
        {currentSlide?.sound_url && (
          <AudioButton
            index={0} // hardcode devido ao funcionamento com options ao inves de titles
            key={currentSlide?.sound_id}
            autoPlay={false}
            src={currentSlide?.sound_url ?? ""}
          />
        )}
      </Group>

      <Stack spacing={boardW(20)} align="center" my="auto" mih={boardW(150)}>
        {currentSlide?.image_url && (
          <Image
            src={currentSlide.image_url}
            alt={currentSlide.description}
            width="auto"
            height={currentSlide.description ? boardW(275) : boardW(300)}
          />
        )}

        {currentSlide?.description && (
          <ScrollArea
            w={boardW(900)}
            mah={boardW(400)}
            type="always"
            style={{ overflow: "auto" }}
          >
            <Box>
              <Text
                m="auto"
                fz="lg"
                color="dark.3"
                align="center"
                dangerouslySetInnerHTML={{ __html: currentSlide.description }}
                maw={800}
                mah={300}
              />
            </Box>
          </ScrollArea>
        )}
        {question.options.length > 1 && (
          <Group position="center">
            <TextOptionButton
              disabled={slideIndex === 0}
              onClick={previousSlide}
            >
              <IconChevronLeft size={40} />
            </TextOptionButton>
            <TextOptionButton
              onClick={nextSlide}
              disabled={slideIndex + 1 == totalSlides ? true : false}
            >
              <IconChevronRight size={40} />
            </TextOptionButton>
          </Group>
        )}
      </Stack>
    </>
  );
}
