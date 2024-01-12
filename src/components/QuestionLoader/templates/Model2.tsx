import { Group, SimpleGrid, Stack, Text, Modal, Box } from "@mantine/core";
import { ModelProps } from ".";
import { DraggableCardSlot, DraggableCard } from "~/components/DraggableCard";
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { produce } from "immer";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import { QuestionOption } from "~/api/exam";
import { boardW, lousaWidth } from "~/constants/dimensions";
import { AudioButtonRef } from "~/components/AudioButton/AudioButton";
import { IconButton } from "~/components/EduButton";
import { PlayIcon } from "~/assets/icons/Play";
import { useDisclosure } from '@mantine/hooks';
import { VideoPlayer } from "~/components/VideoPlayer";
import { IconMessageCircle2 } from "@tabler/icons-react";

export function Model2({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const [answers, setAnswers] = useState<Array<QuestionOption | null>>(
    question.options.map(() => null)
  );

  const handleDrop = useCallback(function (
    item: QuestionOption | null,
    index: number
  ) {
    setAnswers((state) =>
      produce(state, (draft) => {
        draft[index] = item ? { ...item, positionAnswer: index } : item;
      })
    );
  },
  []);

  const {
    audioTitles,
    hasAudioTitle,
    audioTitleAutoplay,
    textTitles,
    getRule,
    videoTitles
  } = useQuestionHelper(question);

  /* Autoplay Aux Audio Logic */
  const auxAutoPlayRule = getRule("auxAutoPlay");
  const shouldPlayAux = auxAutoPlayRule?.value === "false" ? false : true;
  const noPaddingRule = getRule("noPadding")?.value === "true" ?? false;

  const mainAudioRef = useRef<AudioButtonRef>(null);
  const auxRef = useRef<AudioButtonRef>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const styles: CSSProperties = {
    gap: noPaddingRule ? 0 : 'inherit',
    display: noPaddingRule ? 'flex' : 'grid',
    justifyContent: noPaddingRule ? 'center' : 'auto',
  };

  useEffect(() => {
    if (mainAudioRef.current && auxRef.current) {
      if (shouldPlayAux) {
        mainAudioRef.current.sound.onEnd(() => {
          auxRef.current?.sound.play();
        });
      }
    }
  }, [mainAudioRef, auxRef]);
  /* End Aux Logic */

  useEffect(() => {
    setAnswers(question.options.map(() => null));
  }, [question]);

  useEffect(() => {
    onAnswerChange(
      answers.filter((answer) => answer !== null) as QuestionOption[]
    );
  }, [answers]);

  const conditions = useMemo(
    () => [answers.every((answer) => answer !== null)],
    [answers]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  const auxiliarVideo = videoTitles.find((title) => title.description && title.description.includes('Botão'));
  const playIcon = <PlayIcon width={lousaWidth * 0.03} height={lousaWidth * 0.03} />;

  return (
    <>
      {hasAudioTitle && (
        <Group>
          {audioTitles.map((title, inx) => (
            <AudioButton
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
              src={title.file_url!}
              variant={inx > 0 ? "yellow" : "gray"}
              icon={inx > 0 ? <IconMessageCircle2 size={30} /> : undefined}
              ref={inx === 1 ? auxRef : mainAudioRef}
            />
          ))}
          {auxiliarVideo && (
            <IconButton
              variant="blue"
              icon={playIcon}
              onClick={open}
              disabled={false}
            />
          )}
        </Group>
      )}

      <Stack my="auto">
        {textTitles.map((title) => (
          <Text
            size={boardW(24)}
            color="dark.3"
            weight={500}
            key={title.description}
          >
            {title.description}
          </Text>
        ))}

        <SimpleGrid
          cols={question.options.length}
          spacing={boardW(20)}
          style={styles}
        >
          {answers.map((slot, inx) => (
            <DraggableCardSlot
              key={inx}
              onDrop={(item) => handleDrop(item, inx)}
              item={slot}
              replaceWith={
                <DraggableCard
                  item={slot}
                  image={slot?.image_url}
                  text={slot?.description}
                  sound={slot?.sound_url}
                  disabled
                  onClear={() => handleDrop(null, inx)}
                  debug={{ skipDebug: true }}
                  noPaddingRule={noPaddingRule}
                />
              }
            />
          ))}
        </SimpleGrid>

        <SimpleGrid cols={question.options.length} spacing={boardW(24)}>
          {question.options.map((item) => (
            <DraggableCard
              item={item}
              key={item.position}
              image={item.image_url}
              text={item.description}
              sound={item.sound_url}
              hidden={
                !!answers.find((slot) => slot?.position === item.position)
              }
              debug={{ debugProperty: "position" }}
            />
          ))}
        </SimpleGrid>
      </Stack>
      <Modal 
        opened={opened} 
        onClose={close} 
        title="Vídeo Auxiliar" 
        centered
      >
        <Box h="100%" w="100%" style={{ display: "flex", justifyContent: "center" }}>
          <VideoPlayer 
            src={auxiliarVideo?.file_url ?? ""}
            autoPlay
            style={{ height: boardW(500) }}
          />
        </Box>
      </Modal>
    </>
  );
}
