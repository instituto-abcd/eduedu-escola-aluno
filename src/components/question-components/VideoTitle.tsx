import { QuestionTitle } from "~/api/exam";
import { VideoPlayer } from "../VideoPlayer";

export function VideoTitle({ titles }: { titles: QuestionTitle[] }) {
  return (
    <div className="grid place-content-center max-w-[90%]">
      {titles
        .filter((t) => typeof t.file_url === "string" && t.file_url !== "")
        .map((t, inx) => (
          <VideoPlayer
            src={t.file_url!}
            key={inx}
            autoPlay
          />
        ))}
    </div>
  );
}
