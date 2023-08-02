import { Image, SimpleGrid, Stack, Title } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { Card } from "~/components/Card";
import { EduButton } from "~/components/EduButton/EduButton";

export function Model4({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Title align="center" color="dark.3">
        {question.description}
      </Title>

      <Stack>
        <SimpleGrid cols={2} spacing={24}>
          {question.options.map((o) => (
            <Card key={o.order}>
              <Image
                src="https://place-hold.it/125"
                alt={o.description}
                width={125}
              />
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );
}
