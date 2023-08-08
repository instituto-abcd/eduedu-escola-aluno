import { Group, Image, Stack, Title } from "@mantine/core";
import { MessageDots } from "tabler-icons-react";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { DraggableLetters } from "~/components/DraggableLetters/DraggableLetters";
import { IconButton } from "~/components/EduButton";
import { TextOptionButton } from "~/components/OptionButton";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";

export function Model11({ question }: { question: Question }) {
  const { imageTitles } = useQuestionHelper(question);

  // TODO: implementar texto

  return (
    <>
      <Group>
        <IconButton icon={<OuvirIcon />} />
        <IconButton icon={<MessageDots size={34} />} variant="yellow" />
      </Group>

      <Group position="apart" spacing={137} my="auto" noWrap>
        {imageTitles.map((title) => (
          <Image
            src={title.file_url}
            alt={title.file_name}
            width={362}
            key={title.file_url}
            mx="auto"
          />
        ))}

        <Stack align="center" spacing={40}>
          <Title color="dark.3" size={30}>
            {question.description}
          </Title>
          <Group>
            {question.options
              .sort((a, b) => a.position - b.position)
              .map((option) =>
                question.axis_code === "LC" ? (
                  /* Vamos assumir que o eixo LC (leitura e compreensao de texto)
                   *  contempla alternativas em texto longo,
                   *  já as demais apenas 1 palavra ou poucas letas
                   */
                  <TextOptionButton key={option.position}>
                    {option.description}
                  </TextOptionButton>
                ) : (
                  <DraggableLetters key={option.position}>
                    {option.description}
                  </DraggableLetters>
                )
              )}
          </Group>
        </Stack>
      </Group>
    </>
  );
}
