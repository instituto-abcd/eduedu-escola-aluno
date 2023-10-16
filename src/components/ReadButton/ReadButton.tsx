/* eslint-disable @typescript-eslint/no-empty-function */
import { useDisclosure } from "@mantine/hooks";
import { IconButton } from "../EduButton";
import { Modal, Stack } from "@mantine/core";
import { IconBook } from "@tabler/icons-react";
import { Question } from "~/api/exam";
import { ModelMapper } from "../QuestionLoader/ModelMapper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { lousaWidth } from "~/constants/dimensions";

type Props = {
  question: Question;
};

export function ReadButton({ question }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const mediaTrack = useMediaTrackStore();

  const onClose = () => {
    if (mediaTrack.isPlaying) return;
    close();
  };

  return (
    <>
      <IconButton
        onClick={open}
        icon={<IconBook size={34} />}
        variant="yellow"
      />

      <Modal
        size="auto"
        opened={opened}
        onClose={onClose}
        title="Questão de apoio"
      >
        <Stack
          spacing={lousaWidth * 0.045}
          align="center"
          h="100%"
          w="100%"
          style={{ position: "relative" }}
        >
          <ModelMapper
            commonProps={{
              question,
              onAnswerChange: () => {},
              setContinueDisabled: () => {},
            }}
          />
        </Stack>
      </Modal>
    </>
  );
}
