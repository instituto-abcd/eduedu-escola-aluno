import { Group, Image, Stack, Title } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconButton } from "~/components/EduButton";
import { OptionButton } from "~/components/OptionButton";

export function Model4({ question }: { question: Question }) {
  return (
    <>
      <IconButton icon={<OuvirIcon />} variant="gray" />

      <Title align="center" color="dark.3">
        {question.description}
      </Title>

      <Stack>
        <Group spacing={24}>
          {question.options.map((o) => (
            <OptionButton key={o.order}>
              <Image
                src="https://place-hold.it/125"
                alt={o.description}
                width={125}
              />
            </OptionButton>
          ))}
        </Group>
      </Stack>
    </>
  );
}
