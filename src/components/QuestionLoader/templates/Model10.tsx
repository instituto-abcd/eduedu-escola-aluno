import { SimpleGrid, Title, createStyles } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { EduButton } from "~/components/EduButton/EduButton";

const useStyles = createStyles({
  button: {
    width: 170,
    height: 148,
    borderRadius: 8,
    border: "1px solid #228BE6",
    backgroundColor: "#fff",
    cursor: "pointer",
    boxShadow: "0px 5px 0px 0px #228BE6",
    display: "grid",
    placeItems: "center",
    fontSize: 30,
    fontWeight: 600,
    color: "#228BE6",
  },
});

export function Model10({ question }: { question: Question }) {
  const { classes } = useStyles();
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>
      <Title color="dark.3" size={30} align="center">
        {question.description}
      </Title>

      <SimpleGrid cols={2}>
        {question.options
          .sort((a, b) => a.order - b.order)
          .map((o) => (
            <button key={o.order} className={classes.button}>
              {o.description}
            </button>
          ))}
      </SimpleGrid>
    </>
  );
}
