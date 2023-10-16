import { Group } from "@mantine/core";
import { useEffect } from "react";
import { VideoPlayer } from "~/components/VideoPlayer";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { useMediaTrackStore } from "~/stores/media-track.store";
import { ModelProps } from ".";

export function Model15({ question, setContinueDisabled }: ModelProps) {
  const { videoTitles } = useQuestionHelper(question);
  const mediaTrack = useMediaTrackStore();

  useEffect(() => {
    setContinueDisabled(!mediaTrack.isPlaying);
  }, [question, mediaTrack.isPlaying]);

  return (
    <Group my="auto">
      {videoTitles.map((title) => (
        <VideoPlayer
          src={title.file_url ?? ""}
          key={title.file_url}
          autoPlay
          onPlayStatusChange={mediaTrack.setPlayStatus}
          style={{ height: boardW(500) }}
        />
      ))}
    </Group>
  );
}
