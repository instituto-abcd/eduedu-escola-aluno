import { Image, Text, createStyles } from "@mantine/core";

const useStyles = createStyles({
    card: {
        borderRadius: 16,
        backgroundColor: "#fff",
        boxShadow: "0 1px 0 0 #006AC6",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#228BE6",
        padding: 16,
        display: "grid",
        placeItems: "center",
    },
});


type Props = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;

type Custom = {
    image?: string;
    imageWidth?: string;
    text?: string;
    customWidth?: string;
    customHeigth?: string;
}

export function MemoryCard({ customWidth, customHeigth, image, imageWidth, text }: Custom, props: Props) {

    const { classes } = useStyles();

    return (
        <div
            className={classes.card}
            {...props}
            draggable
            style={{
                width: customWidth ? customWidth : '175px',
                height: customHeigth ? customHeigth : '175px'
            }}
        >
            {image &&
                <Image src={image} width={imageWidth ? imageWidth : 110} />
            }
            <Text mt={10}>{text}</Text>
        </div>
    )
}