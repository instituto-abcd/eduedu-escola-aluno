import { useState } from "react";
import { Grid, Group } from "@mantine/core";
import { Question, QuestionOption } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { EduButton } from "~/components/EduButton/EduButton";
import { MemoryCard } from "~/components/MemoryCard/MemoryCard";

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

  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart">
        <Grid columns={3} maw={600}>
          {question.options &&
            question.options.map((option, inx) => (
              <Grid.Col span={1} key={inx}>
                <MemoryCard
                  image={option.image_url ?? ""}
                  text={option.description ?? ""}
                />
              </Grid.Col>
            ))}
        </Grid>
      </Group>
    </>
  );
}
