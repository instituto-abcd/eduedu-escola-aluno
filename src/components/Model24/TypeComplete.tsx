import {
  createStyles,
  Flex,
  Image,
  SimpleGrid,
  Stack,
  Title,
} from "@mantine/core";
import { OptionButton } from "../OptionButton";
import { boardW, MEDIA_QUERY } from "~/constants/dimensions";
import { Question, QuestionTitle } from "~/api/exam";

interface TypeCompleteProps {
  textTitles: QuestionTitle[];
  imageTitles: QuestionTitle[];
  question: Question;
  answer: number;
  setAnswer: (inx: number) => void;
}

const useStyles = createStyles(() => {
  return {
    content: {
      display: "flex",
      flexDirection: "column",
      gap: boardW(45),

      [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
        flexDirection: "row",
        gap: boardW(110),
      },
    },

    container: {
      img: {
        objectFit: "contain",
        maxWidth: "80%",
        width: 295,
        maxHeight: 300,
      },

      [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
        img: {
          maxWidth: "90%",
        },
      },
    },
  };
});

export const Model24TypeComplete = ({
  textTitles,
  imageTitles,
  question,
  answer,
  setAnswer,
}: TypeCompleteProps) => {
  const { classes } = useStyles();

  return (
    <Flex
      align="center"
      justify={"center"}
      gap={20}
      wrap="wrap"
      className={classes.content}
    >
      {textTitles.find((title) => title.placeholder.includes("completar"))
        ?.description && (
        <Title
          dangerouslySetInnerHTML={{
            __html:
              textTitles.find((title) =>
                title.placeholder.includes("completar")
              )?.description ?? "",
          }}
          size={boardW(24)}
          weight={500}
          color="dark.3"
          align="center"
        />
      )}

      {imageTitles.map(
        (title) =>
          title.file_url && (
            <Stack className={classes.container}>
              <Image
                key={title.file_url}
                src={title.file_url}
                alt={title.placeholder}
                styles={{
                  image: {
                    marginInline: "auto",
                  },
                }}
              />
            </Stack>
          )
      )}

      <SimpleGrid
        mb={20}
        cols={2}
      >
        {question.options.map((option, inx) => (
          <OptionButton
            key={inx}
            option={option}
            onClick={() => setAnswer(inx)}
            data-selected={answer === inx}
            style={{
              width: boardW(120),
              height: boardW(120),
            }}
          >
            {option.description}
            {option.image_url && (
              <Image
                m="auto"
                src={option.image_url}
                maw={boardW(100)}
                mah={boardW(100)}
              />
            )}
          </OptionButton>
        ))}
      </SimpleGrid>
    </Flex>
  );
};
