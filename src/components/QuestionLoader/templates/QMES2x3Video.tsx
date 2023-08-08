import { Group, Image, SimpleGrid, Text } from "@mantine/core";
import { Question } from "~/api/exam";
import { OptionButton } from "~/components/OptionButton";

export function QME2x3Video({ question }: { question: Question }) {
  // TODO: multi-select

  return (
    <>
      <Group noWrap grow spacing={75} py={40} my="auto">
        <div>
          {question.titles?.map((title) => {
            if (title.type === "VIDEO") {
              return (
                <video
                  width={320}
                  height={340}
                  controls
                  src={title.file_url}
                  key={title.description}
                ></video>
              );
            }
          })}
        </div>

        <SimpleGrid cols={2} style={{ placeItems: "center" }} spacing={24}>
          {question.options.map((option) => (
            <OptionButton key={option.position}>
              {option.image_url && (
                <Image
                  src={option.image_url}
                  alt={option.description}
                  width={132}
                />
              )}
              {!option.image_url && option.description && (
                <Text>{option.description}</Text>
              )}
            </OptionButton>
          ))}
        </SimpleGrid>
      </Group>
    </>
  );
}
