import { Image, createStyles } from "@mantine/core"

const useStyles = createStyles({
    card: {
        width: 170,
        height: 200,
        borderRadius: 16,
        backgroundColor: "#F4F4F4",
        border: '1px solid #868E96',
        padding: 16,
        display: "grid",
        placeItems: "center",
    }
});

type componentsProps = {
    image?: string;
    name?: string;
}

export function GrayCard({ image, name }: componentsProps) {
    const { classes } = useStyles();
    return (
        <div className={classes.card}>
            <Image src={image} height={110} />
            {name}
        </div>
    )
}