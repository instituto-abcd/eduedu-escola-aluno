import { Box, Image, createStyles } from "@mantine/core";
import arrowLeft from '~/assets/planets/arrow-left-red.png';
import arrowRight from '~/assets/planets/arrow-right-green.png';

const useStyles = createStyles({
    prev: {
        width: 130,
        height: 150,
        borderRadius: 16,
        backgroundColor: "#FFE3E3",
        padding: 16,
        display: "grid",
        placeItems: "center",
    },
    next: {
        width: 130,
        height: 150,
        borderRadius: 16,
        backgroundColor: "#D3F9D8",
        padding: 16,
        display: "grid",
        placeItems: "center",
    },
});

type Props = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;

type componentProps = {
    direction: string;
}
export function ArrowPlanet({ direction }: componentProps, props: Props) {
    const { classes } = useStyles();
    return (
        <Box className={direction == 'prev' ? classes.prev : classes.next}>
            <Image
                src={direction == 'prev' ? arrowLeft : arrowRight}
                width={60}
                m="auto"
            />
        </Box>
    )
}