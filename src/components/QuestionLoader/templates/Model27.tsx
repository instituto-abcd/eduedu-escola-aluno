import {
  Group,
  Image,
  Text,
  Space,
  Stack,
  LoadingOverlay,
} from "@mantine/core";
import { EduButton } from "~/components/EduButton/EduButton";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { useEffect, useState } from "react";
import { MediaType, useMediaTrackStore } from "~/stores/media-track.store";
import { TextOptionButton } from "~/components/OptionButton";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

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

  // TODO: implementar
  const submitAnswer = () => alert("TODO - implementar");
  const isLoading = false;

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
      {audioTitles.map((title) => (
        <AudioButton src={title.file_url ?? ""} key={title.file_url} autoPlay />
      ))}

      <Stack spacing={24} align="center" my="auto">
        <Image
          src={currentSlide.image_url}
          alt={currentSlide.description}
          width={280}
          height={280}
        />
        <Text color="dark.3" size={20} align="center">
          {question.description}
        </Text>
        <Space h={28} />
        <Group position="center">
          <TextOptionButton onClick={previousSlide}>
            <IconChevronLeft size={40} />
          </TextOptionButton>
          <TextOptionButton onClick={nextSlide}>
            <IconChevronRight size={40} />
          </TextOptionButton>
        </Group>
      </Stack>
      <EduButton
        disabled={slideIndex + 1 < totalSlides || mediaTrack.isPlaying}
        onClick={submitAnswer}
      >
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
