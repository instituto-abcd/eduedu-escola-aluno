import { Group, Image, Stack, Text, Title } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconButton } from "~/components/EduButton";
import { OptionButton } from "~/components/OptionButton";

export function Model4({ question }: { question: Question }) {
  return (
    <>
      <IconButton icon={<OuvirIcon />} variant="gray" />

      {/* <Title align="center" color="dark.3">
        {question.description}
      </Title> */}

      <Stack my="auto">
        <Group spacing={24}>
          {question.options.map((option) => (
            <OptionButton key={option.position}>
              {option.image_url && (
                <>
                  <Image
                    src={option.image_url}
                    alt={option.description}
                    height={105}
                    width="auto"
                  />
                  <Text size={20} color="gray.7" weight={600}>
                    {option.image_name}
                  </Text>
                </>
              )}
              {!option.image_url && <Text>{option.description}</Text>}
            </OptionButton>
          ))}
        </Group>
      </Stack>
    </>
  );
}
