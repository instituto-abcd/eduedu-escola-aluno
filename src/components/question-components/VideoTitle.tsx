import { QuestionTitle } from "~/api/exam";
import { VideoPlayer, type VideoPlayerProps } from "../VideoPlayer";

type Props = { titles: QuestionTitle[] } & Partial<VideoPlayerProps>;

export function VideoTitle({ titles, ...props }: Props) {
  const t = titles.filter(
    (t) => typeof t.file_url === "string" && t.file_url !== ""
  );

  if (!t.length) return null;
  return (
    <div className="grid place-content-center max-w-[90%]">
      {t.map((t, inx) => (
        <VideoPlayer
          src={t.file_url!}
          key={inx}
          autoPlay
          {...props}
        />
      ))}
    </div>
  );
}
