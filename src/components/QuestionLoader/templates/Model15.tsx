import { Group } from "@mantine/core";
import { useEffect } from "react";
import { VideoPlayer } from "~/components/VideoPlayer";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function Model15({ question, onConditionsChange }: ModelProps) {
  const { videoTitles } = useQuestionHelper(question);

  useEffect(() => {
    onConditionsChange([]);
  }, []);

  return (
    <Group my="auto">
      {videoTitles.map((title) => (
        <VideoPlayer
          src={title.file_url ?? ""}
          key={title.file_url}
          autoPlay
        />
      ))}
    </Group>
  );
}
