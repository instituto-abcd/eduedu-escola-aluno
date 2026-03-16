import { Modal, Title, ModalProps } from "@mantine/core";
import { AwardImage } from "~/constants/awards";
import { useCreateSound } from "~/hooks/useCreateSound";
import Lottie from "react-lottie";
import classes from "./AwardModal.module.css";

type Props = ModalProps & {
  award: AwardImage;
};

export function AwardModal({ award, ...props }: Props) {
  const { sound } = useCreateSound({
    src: award.sound ?? "",
    autoPlay: false,
  });

  return (
    <Modal
      {...props}
      radius={30}
      centered
    >
      <div className="flex flex-col items-center justify-center gap-2.5 py-5">
        <Lottie
          options={{
            loop: false,
            autoplay: true,
            animationData: award.lottie,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          width={200}
          height="auto"
          eventListeners={[{ eventName: "DOMLoaded", callback: sound.play }]}
        />
        <Title className={classes.title}>{award.name}</Title>
        <span className={classes.description}>{award.description}</span>
      </div>
    </Modal>
  );
}
