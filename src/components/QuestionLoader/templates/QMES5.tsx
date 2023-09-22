import { Group, LoadingOverlay, SimpleGrid } from "@mantine/core";
import { useEffect, useState } from "react";

import { Answer, useGetExamQuestion } from "~/api/student";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";
import { ModelProps } from ".";
import { EduButton } from "~/components/EduButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { lousaWidth } from "~/utils/userScreen";

export function QMES5({ question, answerCallback }: ModelProps) {
  const [selected, setSelected] = useState<Answer[]>([]);
  const { mutate, isLoading } = useGetExamQuestion({
    onSuccess: (q) => answerCallback(q),
  });

  function selectItem(answer: Answer) {
    if (selected.find((item) => item.position === answer.position)) {
      setSelected(selected.filter((item) => item.position !== answer.position));
    } else {
      setSelected([
        ...selected,
        {
          position: answer.position,
          positionAnswer: answer.position,
        },
      ]);
    }
  }

  function submitAnswer() {
    if (selected.length === 0) return;

    mutate({
      questionId: question.id,
      optionsAnswered: selected,
    });
  }

  const { videoTitles, optionArrKey } = useQuestionHelper(question);
  const mediaTrack = useMediaTrackStore();

  useEffect(() => {
    setSelected([]);
  }, [question]);

  return (
    <>
      <Group noWrap grow spacing={75} py={40}>
        <div>
          <VideoPlayer
            src={videoTitles[0]?.file_url ?? ""}
            onPlayStatusChange={mediaTrack.setPlayStatus}
            canPlay={mediaTrack.canPlay()}
            autoPlay
            customHeight={(lousaWidth * 30 / 100).toString()}
          />
        </div>

        <SimpleGrid cols={2} style={{ placeItems: "center" }} spacing={24}>
          {question.options.map((option, inx) => (
            <OptionButton
              key={optionArrKey(option, inx)}
              onClick={() =>
                selectItem({
                  position: option.position,
                  positionAnswer: option.position,
                })
              }
              data-selected={
                !!selected.find((item) => item.position === option.position)
              }
              isCorrect={option.isCorrect}
            >
              {option.description}
            </OptionButton>
          ))}
        </SimpleGrid>
      </Group>

      <EduButton disabled={selected.length === 0} onClick={submitAnswer}>
        Continuar
      </EduButton>
      <LoadingOverlay visible={isLoading} />
    </>
  );
}
