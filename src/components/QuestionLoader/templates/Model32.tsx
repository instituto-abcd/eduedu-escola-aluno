import { Image, ScrollArea, Stack, Title } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { EduButton } from "~/components/EduButton/EduButton";

export function Model32({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>
      <Title color="dark.3" size={30} align="center">
        {question.description}
      </Title>

      <ScrollArea h={290} px={30} type="always">
        <Stack align="stretch" spacing={20} py={10}>
          <Image
            src="https://place-hold.it/204"
            width={204}
            height={204}
            mx="auto"
            withPlaceholder
          />

          {question.options.map((o) => (
            <EduButton key={o.order}>{o.description}</EduButton>
          ))}
        </Stack>
      </ScrollArea>
    </>
  );
}
