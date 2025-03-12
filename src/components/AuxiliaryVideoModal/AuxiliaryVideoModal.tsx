import { useDisclosure } from "@mantine/hooks";
import { useAudioStatus } from "~/stores/audio";
import { ButtonTVPlay } from "../Buttons";
import { Modal } from "@mantine/core";
import { VideoPlayer } from "../VideoPlayer";

export function AuxiliaryVideoModal({ videoUrl }: { videoUrl: string }) {
  const [opened, { open, close }] = useDisclosure(false);
  const audioStatus = useAudioStatus();
  const closeModal = () => {
    if (audioStatus.isPlaying) audioStatus.setPlaying(false);
    close();
  };

  return (
    <>
      <ButtonTVPlay
        onClick={open}
        disabled={audioStatus.isPlaying}
      />
      <Modal
        opened={opened}
        onClose={closeModal}
        title="Vídeo auxiliar"
        centered
      >
        <VideoPlayer
          src={videoUrl}
          autoPlay
          style={{ height: 500 }}
        />
      </Modal>
    </>
  );
}
