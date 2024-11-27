import { createStyles, Image, Stack, Title } from "@mantine/core";
import { OptionButton } from "../OptionButton";
import { boardW } from "~/constants/dimensions";
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

type FlexBehavior = "flex-col" | "grid grid-cols-2" | "flex-row";

const useStyles = createStyles(() => ({
  container: {
    img: {
      objectFit: "contain",
      maxWidth: 371,
      minWidth: 296,
    },
  },
  threeButtons: {
    "button.option-group:last-of-type": {
      gridColumn: "span 2",
      width: "50%",
      marginInline: "auto",
    },
  },
  optionButton: {
    width: "auto",
    minWidth: "120px",
    height: "auto",
    minHeight: "150px",
  },
  descriptionButton: {
    minWidth: "150px",
    minHeight: "70px",
  },
}));

const MIN_BUTTON_OPTIONS = 3;
const MIN_DESCRIPTION_LENGTH = 15;

export const Model24TypeSelect = ({
  textTitles,
  imageTitles,
  question,
  dashes,
  singleAnswer,
  setSingleAnswer,
}: TypeSelectProps) => {
  const { classes } = useStyles();

  const dynamicFlexBehavior = useMemo<FlexBehavior>(() => {
    const hasLongDescription = question.options.some(
      (q) => q?.description?.length >= MIN_DESCRIPTION_LENGTH
    );
    const isGrid = question.options.length >= MIN_BUTTON_OPTIONS;

    if (!isGrid) return hasLongDescription ? "flex-col" : "flex-row";
    return hasLongDescription ? "flex-col" : "grid grid-cols-2";
  }, [question.options]);

  return (
    <div className="w-full">
      {textTitles
        .filter((title) => title.description?.length > 0)
        .map((title) => (
          <Title
            key={title.description}
            dangerouslySetInnerHTML={{
              __html: title.description.replace(/_+/g, dashes),
            }}
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
              <Stack
                key={title.file_url}
                className={`${classes.container} lg:w-[70%] w-full`}
              >
                <Image
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
          className={`flex w-full ${dynamicFlexBehavior} ${
            question.options.length === 3
              ? classes.threeButtons
              : classes.container
          } items-center justify-center gap-4`}
        >
          {question.options.map((option, idx) => (
            <OptionButton
              key={idx}
              option={option}
              onClick={() => setSingleAnswer(option)}
              data-selected={
                JSON.stringify(singleAnswer) === JSON.stringify(option)
              }
              className={`flex-1 w-full min-h-16 max-h-32 option-group ${
                option.description
                  ? classes.descriptionButton
                  : classes.optionButton
              }`}
            >
              {option.description}
              {option.image_url && (
                <img
                  src={option.image_url}
                  style={{ height: boardW(170) }}
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
