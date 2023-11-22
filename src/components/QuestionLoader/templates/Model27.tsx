import { Group, Box, Image, Text, Stack, ScrollArea } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { useEffect, useState } from "react";
import { MediaType } from "~/stores/media-track.store";
import { TextOptionButton } from "~/components/OptionButton";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { boardW } from "~/constants/dimensions";
import { useAudioStatus } from "~/stores/audio";

export function Model27({ question, setContinueDisabled }: ModelProps) {
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

  const disabled = slideIndex + 1 < totalSlides || audioStatus.isPlaying;
  useEffect(() => {
    setContinueDisabled(disabled);
  }, [disabled]);

  useEffect(() => {
    setSlideIndex(0);
  }, [question]);

  useEffect(() => {
    if (audioStatus.isPlaying) return;
    // mediaTrack.play({
    //   mediaType: MediaType.AUDIO,
    //   trackId: currentSlide.sound_url ?? "",
    //   trackUrl: currentSlide.sound_url ?? "",
    // });
  }, [slideIndex]);

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
              />
            </Box>
          </ScrollArea>
        )}
        <Group position="center">
          <TextOptionButton onClick={previousSlide}>
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
