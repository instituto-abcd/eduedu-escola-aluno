import { useState } from "react";
import { Grid, Group, LoadingOverlay } from "@mantine/core";
import { Question, QuestionOption } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { EduButton } from "~/components/EduButton/EduButton";
import { MemoryCard } from "~/components/MemoryCard/MemoryCard";
import { boardW } from "~/constants/dimensions";

/* 

  Model28
    Formar pares com o POSITION das opções
    Se houver image_url, não mostrar description

*/

export function Model28({ question }: { question: Question }) {

  const [answers, setAnswers] = useState<Array<QuestionOption | null>>(
    question.options.map(() => null)
  );

  const disabled = answers.some((ans) => ans === null);

  function submitAnswer() {
    if (disabled) return;
    // TODO
  }
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      {/* Board content */}
      <Group position="apart">
        <Grid columns={3} maw={600}>
          {question.options &&
            question.options.map((option, inx) => (
              <Grid.Col span={1} key={inx}>
                <MemoryCard image={option.image_url ?? ""} text={option.description ?? ""} />
              </Grid.Col>
            ))
          }
        </Grid>
      </Group>

      {/* Continue to the next screen button */}
      <EduButton
        disabled={disabled}
        onClick={submitAnswer}
        style={{
          marginTop: "auto"
        }}
      >
        Continuar
      </EduButton>

      {/* Loading animation */}
      {/* <LoadingOverlay visible={isLoading} style={{ maxHeight: boardW(900) }} /> */}
    </>
  );
}
