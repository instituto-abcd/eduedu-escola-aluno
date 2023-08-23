import { Modal } from "@mantine/core";

// Images:
import Lottie from 'react-lottie';
import { AWARDS_IMAGES } from '~/constants/awards'

// Sounds:
import { useRef } from "react";
import feedbackButtonNext from "~/assets/audio/feedback_button_next.mp3";

type Props = {
    opened: boolean;
    onClose(): void;
    image: string;
};

export function ModalAwards({ opened, onClose, image }: Props) {

    const awardLottie = AWARDS_IMAGES.filter((item) => item.name == image);
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: awardLottie.length ? awardLottie[0]['lottie'] : {},
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    // const soundRef = useRef<HTMLAudioElement>(null);
    // soundRef.current?.play();

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            styles={{
                header: {
                    background: 'transparent'
                },
                content: {
                    background: 'transparent'
                }
            }}
        >
            {/* <audio src={feedbackButtonNext} ref={soundRef} /> */}
            {defaultOptions.animationData !== undefined &&
                (
                    <Lottie
                        options={defaultOptions}
                        height={400}
                        width={400}
                    />
                )
            }
        </Modal>
    )
}