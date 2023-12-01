import { Group, Box, Image, Text, Stack, ScrollArea } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { useEffect, useMemo, useState } from "react";
import { TextOptionButton } from "~/components/OptionButton";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { boardW } from "~/constants/dimensions";
import { useAudioStatus } from "~/stores/audio";
import { useCreateSound } from "~/hooks/useCreateSound";

export function Model27({ question, onConditionsChange }: ModelProps) {
  const { audioTitles, hasAudioTitle, audioTitleAutoplay } =
    useQuestionHelper(question);

  const audioStatus = useAudioStatus();
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

  const { sound } = useCreateSound({
    src: currentSlide.sound_url ?? "",
    autoPlay: false,
  });

  useEffect(() => {
    if (audioStatus.isPlaying) return;
    sound.play();
  }, [slideIndex]);

  const conditions = useMemo(
    () => [slideIndex + 1 === totalSlides],
    [slideIndex]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <>
      {hasAudioTitle && (
        <Group>
          {audioTitles.map((title, inx) => (
            <AudioButton
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
              src={title.file_url!}
            />
          ))}
        </Group>
      )}

      <Stack spacing={boardW(20)} align="center" my="auto">
        {currentSlide.image_url && (
          <Image
            src={currentSlide.image_url}
            alt={currentSlide.description}
            width="auto"
            height={currentSlide.description ? boardW(200) : boardW(280)}
          />
        )}

        {currentSlide.description && (
          <ScrollArea w={boardW(900)} mah={boardW(300)}>
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
      </Stack>
    </>
  );
}
