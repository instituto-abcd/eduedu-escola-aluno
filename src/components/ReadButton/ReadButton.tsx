/* eslint-disable @typescript-eslint/no-empty-function */
import { useDisclosure } from "@mantine/hooks";
import { IconButton } from "../EduButton";
import { Modal, Stack } from "@mantine/core";
import { IconBook } from "@tabler/icons-react";
import { Question } from "~/api/exam";
import { ModelMapper } from "../QuestionLoader/ModelMapper";
import { lousaWidth } from "~/constants/dimensions";
import { useAudioStatus } from "~/stores/audio";

type Props = {
  question: Question;
};

export function ReadButton({ question }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const isPlaying = useAudioStatus((state) => state.isPlaying);

  const onClose = () => {
    if (isPlaying) return;
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
              onConditionsChange: () => {},
            }}
          />
        </Stack>
      </Modal>
    </>
  );
}
