import { Group, Image, SimpleGrid, Text } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";

export function QORD3x2({ question }: { question: Question }) {
  // TODO: implementar

  return (
    <>
      <IconButton icon={<OuvirIcon />} variant="gray" />

      <Group noWrap grow spacing={75} py={40}>
        {question.titles
          .filter((title) => title.type === "TEXT")
          .map((title) => (
            <Text key={title.position} size="lg">
              {title.description}
            </Text>
          ))}
      </Group>

      <SimpleGrid cols={3} style={{ placeItems: "center" }} spacing={24}>
        {question.options
          .sort((a, b) => a.position - b.position)
          .map((option) => (
            <TextOptionButton key={option.position}>
              {option.image_url && (
                <Image
                  src={option.image_url}
                  width={40}
                  alt={option.image_name}
                />
              )}
              {!option.image_url && option.description && (
                <Text>{option.description}</Text>
              )}
            </TextOptionButton>
          ))}
      </SimpleGrid>
    </>
  );
}
