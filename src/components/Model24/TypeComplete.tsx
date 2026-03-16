import { Flex, Image, SimpleGrid, Title } from "@mantine/core";
import { OptionButton } from "../OptionButton";
import { boardW } from "~/constants/dimensions";
import { Question, QuestionTitle } from "~/api/exam";
import { ImageTitle } from "../question-components";
import styles from "./TypeComplete.module.css";

interface TypeCompleteProps {
  textTitles: QuestionTitle[];
  imageTitles: QuestionTitle[];
  question: Question;
  answer: number;
  setAnswer: React.Dispatch<React.SetStateAction<number>>;
}

export const Model24TypeComplete = ({
  textTitles,
  imageTitles,
  question,
  answer,
  setAnswer,
}: TypeCompleteProps) => {
  return (
    <Flex
      align="center"
      justify={"center"}
      gap={20}
      wrap="wrap"
      className={styles.content}
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
          fz={boardW(24)}
          fw={500}
          c="dark.3"
          ta="center"
        />
      )}
      <ImageTitle titles={imageTitles} />

      {imageTitles.map(
        (title) =>
          title.file_url && (
            <div
              key={title.file_url}
              className={`flex flex-col ${styles.container}`}
            >
              <Image
                src={title.file_url}
                alt={title.placeholder}
                style={{ marginInline: "auto" }}
              />
            </div>
          )
      )}
      <SimpleGrid mb={20} cols={2}>
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
