import { Group, Image, SimpleGrid } from "@mantine/core";
import { Question } from "~/api/exam";
import { OptionButton } from "~/components/OptionButton";

export function QME2x2Video({ question }: { question: Question }) {
  return (
    <>
      <Group noWrap grow spacing={75} py={40} my="auto">
        <video width={320} height={340} controls></video>

        <SimpleGrid cols={2} style={{ placeItems: "center" }} spacing={24}>
          {question.options.map((option) => (
            <OptionButton key={option.position}>
              <Image
                src={option.imageUrl}
                alt={option.description}
                width={132}
              />
            </OptionButton>
          ))}
        </SimpleGrid>
      </Group>
    </>
  );
}
