import { Group } from '@mantine/core';
import { QuestionTitle } from '~/api/exam';
import { AudioButton } from '../AudioButton';
import { IconMessageCircle2, IconRotateClockwise } from '@tabler/icons-react';
import { useAuxiliarAudio } from '~/hooks/useAuxiliarAudio';
import { Props } from './types';

export const AudioContainer = ({ question, audioTitles, hasPrimaryIcon = true, children }: Props) => {
  const { shouldPlay, shouldPlayAuxiliar, mainAudioRef, auxAudioRef } = useAuxiliarAudio(question);

  const buildAudioProps = (title: QuestionTitle) => {
    const isEnunciationTitle = title.position === 0;
    const shouldPlayCheck = isEnunciationTitle ? shouldPlay : shouldPlay === false;
    const props = {
      ref: isEnunciationTitle ? mainAudioRef : auxAudioRef,
      autoPlay: shouldPlayCheck ? shouldPlayAuxiliar ? true : false : false,
      icon: !isEnunciationTitle ? 
        hasPrimaryIcon ? <IconMessageCircle2 size={30} /> : <IconRotateClockwise size={30} />
      : undefined,
      variant: !isEnunciationTitle ? "yellow" : "gray",
    } as const;
    return props;
  }

  return (
    <Group mx="auto" h="50px">
      {audioTitles.map((title, inx) => {
        const props = buildAudioProps(title);
        return (
          <AudioButton key={inx} src={title.file_url ?? ""} {...props} />
        );
      })}
      {children && children}
    </Group>
  );
}
