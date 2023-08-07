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
  name?: string;
  customWidth?: string;
  customHeigth?: string;
}

export function DraggableCard({ customWidth, customHeigth, image, imageWidth, name }: Custom, props: Props) {
  const { classes } = useStyles();

  return (
    <div
      className={classes.card}
      {...props}
      draggable
      style={{
        width: customWidth ? customWidth : '170px',
        height: customHeigth ? customHeigth : '200px'
      }}
    >
      {image &&
        <Image src={image} width={imageWidth ? imageWidth : 120} />
      }
      <Text c="blue.6">{name}</Text>
    </div>
  );
}
