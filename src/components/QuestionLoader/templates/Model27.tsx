import { Box, Text, ScrollArea } from "@mantine/core";
import { ModelProps } from ".";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  IconArrowBigLeftFilled,
  IconArrowBigRightFilled,
} from "@tabler/icons-react";
import { BasicButton } from "~/components/BasicButton";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";

export function Model27({ question, onConditionsChange }: ModelProps) {
  const { audioTitles, audioTitleAutoplay } = useQuestionHelper(question);
  const totalSlides = question.options.length;
  const [slideIndex, setSlideIndex] = useState(0);
  const currentSlide = question.options[slideIndex];

  const mainAudioRef = useRef<AudioButtonRef>(null);

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
      <div className="flex gap-4 lg:self-start">
        {audioTitles.map((title, inx) => (
          <Box
            key={inx}
            hidden
          >
            <AudioButton
              index={inx}
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
              src={title?.file_url ?? ""}
              ref={mainAudioRef}
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
      </div>

      <div className="flex-col md:flex-row flex flex-1 max-h-[90%] w-screen md:w-[90%] justify-between items-center">
        {question.options.length > 1 && (
          <BasicButton
            disabled={slideIndex === 0 || mainAudioRef.current?.sound.playing()}
            onClick={previousSlide}
            className="hidden md:inline max-h-min p-6 text-[#4c494130]"
          >
            <IconArrowBigLeftFilled size={40} />
          </BasicButton>
        )}

        <div className="flex md:flex-1 h-[60%] md:h-[90%] flex-col justify-center items-center m-4">
          {currentSlide?.image_url && (
            <img
              src={currentSlide.image_url}
              alt={currentSlide.description}
              className="w-[75%] md:w-1/2 md:max-h-[70%] p-4"
            />
          )}

          {currentSlide?.description && (
            <ScrollArea
              type="always"
              style={{ overflow: "auto" }}
            >
              <Box className="max-h-[50%] p-4">
                <Text
                  m="auto"
                  fz="lg"
                  color="dark.3"
                  align="center"
                  dangerouslySetInnerHTML={{ __html: currentSlide.description }}
                />
              </Box>
            </ScrollArea>
          )}
        </div>

        {question.options.length > 1 && (
          <BasicButton
            onClick={nextSlide}
            disabled={
              slideIndex + 1 == totalSlides ||
              mainAudioRef.current?.sound.playing()
                ? true
                : false
            }
            className="hidden md:inline max-h-min p-6 text-[#4c494130]"
          >
            <IconArrowBigRightFilled size={40} />
          </BasicButton>
        )}

        {question.options.length > 1 && (
          <div className="md:hidden flex flex-1 pt-2 w-full justify-evenly">
            <BasicButton
              disabled={
                slideIndex === 0 || mainAudioRef.current?.sound.playing()
              }
              onClick={previousSlide}
              className="max-h-min p-4 text-[#4c494130]"
            >
              <IconArrowBigLeftFilled size={30} />
            </BasicButton>
            <BasicButton
              onClick={nextSlide}
              disabled={
                slideIndex + 1 == totalSlides ||
                mainAudioRef.current?.sound.playing()
                  ? true
                  : false
              }
              className="max-h-min p-4 text-[#4c494130]"
            >
              <IconArrowBigRightFilled size={30} />
            </BasicButton>
          </div>
        )}
      </div>
    </>
  );
}
