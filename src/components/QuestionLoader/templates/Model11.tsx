import { Group, Image, Stack, Title } from "@mantine/core";
import { MessageDots } from "tabler-icons-react";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { DraggableLetters } from "~/components/DraggableLetters/DraggableLetters";
import { IconButton } from "~/components/EduButton";

export function Model11({ question }: { question: Question }) {
  return (
    <>
      <Group>
        <IconButton icon={<OuvirIcon />} />
        <IconButton icon={<MessageDots size={34} />} variant="yellow" />
      </Group>

      <Group position="apart" spacing={137}>
        <Image src="https://place-hold.it/362" width={362} height={362} />
        <Stack align="center" spacing={40}>
          <Title color="dark.3" size={30}>
            {question.description}
          </Title>
          <Group>
            {question.options.map((o) => (
              <DraggableLetters key={o.order}>{o.description}</DraggableLetters>
            ))}
          </Group>
        </Stack>
      </Group>
    </>
  );
}
