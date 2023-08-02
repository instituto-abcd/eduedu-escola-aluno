import { Group, Image, Stack, Title } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { EduButton } from "~/components/EduButton/EduButton";

export function Model11({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart" spacing={137}>
        <Image src="https://place-hold.it/362" width={362} height={362} />
        <Stack align="center" spacing={40}>
          <Title color="dark.3" size={30}>
            {question.description}
          </Title>
          <Group>
            {question.options.map((o) => (
              <EduButton key={o.order}>{o.description}</EduButton>
            ))}
          </Group>
        </Stack>
      </Group>
    </>
  );
}
