import { Image, Modal } from "@mantine/core";

type Props = {
    opened: boolean;
    onClose(): void;
    image: string;
};

export function ModalAwards({ opened, onClose, image }: Props) {
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
            <Image src={image} width={400} />
        </Modal>
    )
}