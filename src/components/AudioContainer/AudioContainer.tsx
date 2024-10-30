import { Group } from "@mantine/core";
import { AudioButton } from "../AudioButton";
import { IconMessageCircle2, IconRotateClockwise } from "@tabler/icons-react";
import { useAuxiliarAudio } from "~/hooks/useAuxiliarAudio";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ReactNode } from "react";
import { Question, QuestionTitle } from "~/api/exam";

type Props = {
  question: Question;
  hasPrimaryIcon?: boolean;
  children?: ReactNode;
};

export const AudioContainer = ({
  question,
  hasPrimaryIcon = true,
  children,
}: Props) => {
  const { audioTitles } = useQuestionHelper(question);
  const { shouldPlay, shouldPlayAuxiliar, mainAudioRef, auxAudioRef } =
    useAuxiliarAudio(question);

  const buildAudioProps = (title: QuestionTitle) => {
    const isEnunciationTitle = title.position === 0;
    const shouldPlayCheck = isEnunciationTitle
      ? shouldPlay
      : shouldPlay === false;
    const props = {
      ref: isEnunciationTitle ? mainAudioRef : auxAudioRef,
      autoPlay: shouldPlayCheck ? (shouldPlayAuxiliar ? true : false) : false,
      icon: !isEnunciationTitle ? (
        hasPrimaryIcon ? (
          <IconMessageCircle2 size={30} />
        ) : (
          <IconRotateClockwise size={30} />
        )
      ) : undefined,
      variant: !isEnunciationTitle ? "yellow" : "gray",
    } as const;
    return props;
  };

  return (
    <Group
      mx="auto"
      h="50px"
    >
      {audioTitles.map((title, inx) => {
        const props = buildAudioProps(title);
        return (
          <AudioButton
            key={inx}
            src={title.file_url ?? ""}
            {...props}
          />
        );
      })}
      {children && children}
    </Group>
  );
};
