import { Group, Box, Image, Text, Stack, ScrollArea } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { useEffect, useState } from "react";
import { MediaType, useMediaTrackStore } from "~/stores/media-track.store";
import { TextOptionButton } from "~/components/OptionButton";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { boardW } from "~/constants/dimensions";

// TODO: variação em que não há áudio, o slide é de imagem e texto (como visto em questão 0 do planeta Rato Miguel)

export function Model27({ question }: ModelProps) {
  const { audioTitles } = useQuestionHelper(question);
  const mediaTrack = useMediaTrackStore();

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

  // legacy, talvez resgatar no futuro?
  // const disabled = slideIndex + 1 < totalSlides || mediaTrack.isPlaying;

  useEffect(() => {
    setSlideIndex(0);
  }, [question]);

  useEffect(() => {
    if (mediaTrack.isPlaying) return;
    mediaTrack.play({
      mediaType: MediaType.AUDIO,
      trackId: currentSlide.sound_url ?? "",
      trackUrl: currentSlide.sound_url ?? "",
    });
  }, [slideIndex]);

  return (
    <>
      {/* TODO: bug no áudio tocar várias vezes é referente ao componente AudioButton e a chave autoplay */}
      {audioTitles
        .filter((title) => !!title.file_url)
        .map((title) => (
          <AudioButton
            src={title.file_url ?? ""}
            key={title.file_url}
            autoPlay={currentSlide.position != 1}
          />
        ))}

      <Stack spacing={boardW(20)} align="center" my="auto">
        {currentSlide.image_url && (
          <Image
            src={currentSlide.image_url}
            alt={currentSlide.description}
            width="auto"
            height={currentSlide.description ? boardW(200) : boardW(280)}
          />
        )}

        {currentSlide.position == 1 && (
          <Text color="dark.3" fz="xl" align="center">
            {question.description}
          </Text>
        )}

        {currentSlide.description && (
          <ScrollArea w={boardW(900)} mah={boardW(300)}>
            <Box>
              <Text
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
