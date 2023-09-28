import { useDisclosure } from "@mantine/hooks";

// Components:
import { IconButton } from "../EduButton";
import { Modal, Image, Text } from '@mantine/core';

// Icons:
import { IconBook } from "@tabler/icons-react";


type componentProps = {
    content?: Array<{}>;
};


export function ReadButton({ content }: componentProps) {
    const [opened, { open, close }] = useDisclosure(false);

    const textTitle = content?.options?.[0]?.description;
    const textImage = content?.options?.[0]?.image_url;
    const supportText = content?.options?.[1]?.description;

    return (
        <>
            <IconButton
                onClick={open}
                icon={<IconBook size={34} />}
                variant="yellow"
            />

            <Modal
                size="lg"
                opened={opened}
                onClose={close}
                title={textTitle ? `Texto de apoio - ${textTitle}` : `Texto de apoio`}
            >
                {textImage &&
                    <Image
                        maw="250px"
                        mah="250px"
                        src={textImage}
                        mx="auto"
                        mb={40}
                    />
                }

                {supportText &&
                    <Text
                        fz="lg"
                        color="dark.3"
                        align="center"
                        dangerouslySetInnerHTML={{ __html: supportText }}
                        maw={800}
                        mb={40}
                    />
                }
            </Modal>
        </>
    )
}