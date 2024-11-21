import { createStyles, Image, Stack, Title } from "@mantine/core";
import { OptionButton } from "../OptionButton";
import { boardW, MEDIA_QUERY } from "~/constants/dimensions";
import { Question, QuestionOption, QuestionTitle } from "~/api/exam";
import { IconVolume } from "@tabler/icons-react";
import { useMemo } from "react";

interface TypeSelectProps {
  textTitles: QuestionTitle[];
  imageTitles: QuestionTitle[];
  question: Question;
  dashes: string;
  singleAnswer: QuestionOption | null;
  setSingleAnswer: React.Dispatch<React.SetStateAction<QuestionOption | null>>;
}

const useStyles = createStyles(() => {
  return {
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

    containerThreeButtons: {
      "button.option-group:last-of-type": {
        gridColumn: "span 2",
        width: "50%",
        marginLeft: "auto",
        marginRight: "auto",
      },
    },
  };
});

export const Model24TypeSelect = ({
  textTitles,
  imageTitles,
  question,
  dashes,
  singleAnswer,
  setSingleAnswer,
}: TypeSelectProps) => {
  const { classes } = useStyles();

  const dynamicFlexBehavior = useMemo(() => {
    const isGrid = question.options.length >= 3;

    if (isGrid) {
      return question.options.some((q) => q?.description?.length >= 10)
        ? "flex-col"
        : "grid grid-cols-2";
    }

    return question.options.some((q) => q?.description?.length >= 10)
      ? "flex-col"
      : "flex-row";
  }, [question]);

  return (
    <div className="w-full">
      {textTitles
        .filter((title) => title.description && title.description.length > 0)
        .map((title) => (
          <Title
            dangerouslySetInnerHTML={{
              __html: title.description.replace(/_+/g, dashes),
            }}
            key={title.description}
            size={boardW(40)}
            weight={500}
            color="dark.3"
            align="center"
          />
        ))}

      <div
        className={`flex flex-col md:flex-row items-center justify-center w-full gap-4 mt-4 ${classes.container}`}
      >
        {imageTitles.map(
          (title) =>
            title.file_url && (
              <Stack className={`${classes.container} w-[70%]`}>
                <Image
                  key={title.file_url}
                  src={title.file_url}
                  alt={title.placeholder}
                  styles={{
                    image: {
                      marginInline: "auto",
                      objectFit: "contain",
                    },
                  }}
                />
              </Stack>
            )
        )}

        <div
          className={`flex w-full lg:w-3/6 ${dynamicFlexBehavior} ${
            question.options.length === 3
              ? classes.containerThreeButtons
              : classes.container
          } items-center justify-center w-full gap-4 `}
        >
          {question.options.map((option, inx) => (
            <OptionButton
              key={inx}
              option={option}
              onClick={() => setSingleAnswer(option)}
              data-selected={
                JSON.stringify(singleAnswer) === JSON.stringify(option)
              }
              style={{
                width: "auto",
                minWidth: option.description ? "150px" : "120px",
                height: "auto",
                minHeight: option.description ? "70px" : "150px",
              }}
              className={`flex-1 w-full lg:max-w-48 min-h-16 max-h-32 option-group `}
            >
              {option.description}
              {option.image_url && (
                <img
                  src={option.image_url}
                  style={{
                    height: boardW(170),
                  }}
                />
              )}
              {option.sound_url && !option.image_url && (
                <IconVolume size={boardW(62)} />
              )}
            </OptionButton>
          ))}
        </div>
      </div>
    </div>
  );
};
