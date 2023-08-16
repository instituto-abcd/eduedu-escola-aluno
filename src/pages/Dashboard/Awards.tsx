import { Title, BackgroundImage, Grid, Tooltip, Box } from "@mantine/core";
import { AWARDS_IMAGES } from '~/constants/awards'
import { ModalAwards } from "./Awards/Modal";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

type componentProps = {
    awards: Array[]
}

export function Awards({ awards }: componentProps) {

    // Modal to show award image && its award image:
    const [modal, modalHandler] = useDisclosure(false);
    const [awardImage, setAwardImage] = useState('');

    // Loop to set title, description and image(CONST):
    AWARDS_IMAGES.map((item) => {
        awards.map((subitem) => {
            item.name == subitem.name ?
                (
                    item.active = true,
                    item.title = subitem.title,
                    item.description = subitem.description
                )
                : {}
        })
    })
    return (
        <>
            <Title mb={40} color="white">Minhas Conquistas</Title>

            <Grid columns={9}>
                {AWARDS_IMAGES.map((item) => (
                    <Grid.Col
                        key={item.name}
                        md={2}
                        lg={1}
                    >
                        <Tooltip
                            disabled={!!!(item.title || item.description)}
                            label={item.title + "\n" + item.description}
                            transitionProps={{ transition: 'scale', duration: 300 }}
                            style={{ whiteSpace: 'pre-line', textAlign: 'center' }}
                            color="dark.3"
                            position="bottom"
                            withArrow
                            multiline
                            width={200}
                        >
                            <Box>
                                <BackgroundImage
                                    src={item.image}
                                    w={88}
                                    h={114}
                                    style={{
                                        filter: item.active ? '' : 'grayScale(100%)'
                                    }}
                                    onClick={() => {
                                        setAwardImage(item.image)
                                        modalHandler.open()
                                    }}
                                />
                            </Box>
                        </Tooltip>
                    </Grid.Col>
                ))}
            </Grid>

            <ModalAwards
                opened={modal}
                onClose={modalHandler.close}
                image={awardImage}
            />
        </>
    )
}