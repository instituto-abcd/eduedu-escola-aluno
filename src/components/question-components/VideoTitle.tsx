import { createStyles } from "@mantine/core";
import { QuestionTitle } from "~/api/exam";
import { VideoPlayer } from "../VideoPlayer";

export function VideoTitle({ titles }: { titles: QuestionTitle[] }) {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      {titles.map((t, inx) => (
        <VideoPlayer src={t.file_url!} key={inx} autoPlay />
      ))}
    </div>
  );
}

const useStyles = createStyles(() => ({
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "90%",
  },
}));
