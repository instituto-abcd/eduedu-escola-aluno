import { Group, SimpleGrid, Stack, Text } from "@mantine/core";
import {
  IconPlayerPlayFilled,
  IconRotate,
  IconRotateClockwise,
  IconVolume,
} from "@tabler/icons-react";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconButton } from "~/components/EduButton";
import { OptionButton } from "~/components/OptionButton";

export function QME2x2Audio({ question }: { question: Question }) {
  const cols = question.options.length < 6 ? question.options.length / 2 : 3;
  return (
    <>
      <Group>
        <IconButton icon={<IconRotateClockwise />} />
        <IconButton icon={<IconPlayerPlayFilled />} variant="yellow" />
        <IconButton icon={<IconRotate />} />
      </Group>

      <IconButton icon={<OuvirIcon />} variant="gray" />

      <SimpleGrid cols={cols}>
        {question.options.map((o) => (
          <OptionButton key={o.position}>
            <Stack justify="space-evenly">
              <IconVolume size={62} />
              <Text color="dark.6" size={30} weight={400}>
                {o.position + 1}
              </Text>
            </Stack>
          </OptionButton>
        ))}
      </SimpleGrid>
    </>
  );
}
