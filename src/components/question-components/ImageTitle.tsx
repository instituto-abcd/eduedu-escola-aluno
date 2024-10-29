import { createStyles } from "@mantine/core";
import { QuestionTitle } from "~/api/exam";

export function ImageTitle({ titles }: { titles: QuestionTitle[] }) {
  const { classes } = useStyles();
  return (
    <div className={classes.ImageTitle_container}>
      {titles.map((title) => (
        <img
          src={title.file_url!}
          alt={title.description}
          key={title.file_url}
          height={300}
        />
      ))}
    </div>
  );
}

const useStyles = createStyles(() => ({
  ImageTitle_container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    img: {
      objectFit: "contain",
      maxWidth: "90%",
      width: 295,
      maxHeight: 300,
    },
  },
}));
