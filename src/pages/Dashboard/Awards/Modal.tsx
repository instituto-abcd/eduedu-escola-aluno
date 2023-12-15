import { Modal } from "@mantine/core";
import Lottie from "react-lottie";
import { AWARDS_IMAGES } from "~/constants/awards";
import { useCreateSound } from "~/hooks/useCreateSound";

type Props = {
  opened: boolean;
  onClose(): void;
  image: string;
};

export function ModalAwards({ opened, onClose, image }: Props) {
  const awardLottie = AWARDS_IMAGES.filter((item) => item.name == image);

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: awardLottie.length ? awardLottie[0]["lottie"] : {},
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { sound } = useCreateSound({
    src: awardLottie?.[0]?.["sound"] ?? "",
    autoPlay: false,
  });

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      styles={{
        header: {
          background: "transparent",
        },
        content: {
          background: "transparent",
        },
      }}
    >
      {awardLottie.length !== 0 && (
        <Lottie
          options={defaultOptions}
          height={400}
          width={400}
          eventListeners={[{ eventName: "DOMLoaded", callback: sound.play }]}
        />
      )}
    </Modal>
  );
}
