import { createStyles, Modal, ModalProps, Stack, Title } from "@mantine/core";
import { AwardImage } from "~/constants/awards";
import { useCreateSound } from "~/hooks/useCreateSound";
import Lottie from "react-lottie";
import { MEDIA_QUERY } from "~/constants/dimensions";

type Props = ModalProps & {
  award: AwardImage;
};

export function AwardModal({ award, ...props }: Props) {
  const { sound } = useCreateSound({
    src: award.sound ?? "",
    autoPlay: false,
  });

  const { classes } = useStyles();

  return (
    <Modal
      {...props}
      radius={30}
      centered
    >
      <Stack
        align="center"
        justify="center"
        spacing={10}
        py={20}
      >
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
      </Stack>
    </Modal>
  );
}

const useStyles = createStyles({
  lottie: {
    width: 200,
    height: "auto",
  },
  title: {
    fontWeight: 500,
    fontSize: 25,
    color: "#339af0",
    textTransform: "capitalize",

    [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
      fontSize: 35,
    },
  },
  description: {
    fontSize: 20,
    textAlign: "center",
  },
});
