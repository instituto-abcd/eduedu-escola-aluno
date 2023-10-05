import { useDisclosure } from "@mantine/hooks";
import { IconButton } from "../EduButton";
import { Modal } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { lousaWidth } from "~/constants/dimensions";

type Props = {
  question: Question;
};

export function AuxAudioButton({ question }: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const { audioTitles } = useQuestionHelper(question);

  const hasAudio = audioTitles.length > 0;

  return (
    <>
      <IconButton
        onClick={hasAudio ? open : undefined}
        icon={
          <OuvirIcon width={lousaWidth * 0.04} height={lousaWidth * 0.029} />
        }
        variant="yellow"
      />

      <Modal
        size="ms"
        opened={opened}
        onClose={close}
        title="Áudio de apoio"
        p="xl"
      >
        {audioTitles.map((title) => (
          <audio src={title.file_url!} controls autoPlay />
        ))}
      </Modal>
    </>
  );
}
