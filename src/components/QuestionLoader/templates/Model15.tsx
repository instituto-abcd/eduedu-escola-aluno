import { Group } from "@mantine/core";
import { useEffect } from "react";
import { VideoPlayer } from "~/components/VideoPlayer";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";
import { useAudioStatus } from "~/stores/audio";

export function Model15({ question, onConditionsChange }: ModelProps) {
  const { videoTitles } = useQuestionHelper(question);
  const audioStatus = useAudioStatus();

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
          onPlayStatusChange={audioStatus.setPlaying}
          style={{ height: boardW(500) }}
        />
      ))}
    </Group>
  );
}
