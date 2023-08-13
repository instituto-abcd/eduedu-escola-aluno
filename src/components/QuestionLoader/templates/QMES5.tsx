import { Group, SimpleGrid } from "@mantine/core";

import { Question } from "~/api/exam";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";

export function QMES5({ question }: { question: Question }) {
  return (
    <>
      <Group noWrap grow spacing={75} py={40}>
        {question.titles?.map((title) => {
          if (title.type === "VIDEO") {
            return <VideoPlayer src={title.file_url} key={title.file_url} />;
          }
        })}

        <SimpleGrid cols={2} style={{ placeItems: "center" }} spacing={24}>
          {question.options.map((option) => (
            <OptionButton key={option.description}>
              {option.description}
            </OptionButton>
          ))}
        </SimpleGrid>
      </Group>
    </>
  );
}
