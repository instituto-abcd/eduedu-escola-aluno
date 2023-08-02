import { Title, BackgroundImage, Grid, Tooltip } from "@mantine/core";
import { AWARDS } from '../../constants/awards'

type componentProps = {
    awards: Array[]
}
export function Awards({ awards }: componentProps) {

    return (
        <>
            <Title mb={40} color="white">Minhas Conquistas</Title>

            <Grid columns={9}>
                {awards &&
                    awards.map((award) => (
                        <Grid.Col md={2} lg={1}>
                            <Tooltip
                                label={award.tooltipTitle + "\n" + award.tooltipText}
                                transitionProps={{ transition: 'scale', duration: 300 }}
                                style={{ whiteSpace: 'pre-line', textAlign: 'center' }}
                                color="dark.3"
                                position="bottom"
                                withArrow
                                multiline
                                width={200}
                            >
                                <BackgroundImage src={AWARDS[award?.name]} w={88} h={114} />
                            </Tooltip>
                        </Grid.Col>
                    ))
                }
            </Grid>
        </>
    )
}