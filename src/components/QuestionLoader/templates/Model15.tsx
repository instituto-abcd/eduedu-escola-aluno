import { useEffect, useState } from "react";
import { VideoPlayer } from "~/components/VideoPlayer";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { ModelProps } from ".";

export function Model15({ question, onConditionsChange }: ModelProps) {
  const { videoTitles } = useQuestionHelper(question);

  // O botão de prosseguir só libera depois de assistir cada vídeo até o fim.
  // Sem esta condição o gate cai no `isPlaying` do store de áudio, que só diz se
  // alguma mídia toca AGORA: o botão nasceria liberado nos ~200ms antes do
  // autoplay começar e, se o autoplay for bloqueado (iOS), para sempre.
  const [watched, setWatched] = useState<boolean[]>(() =>
    videoTitles.map(() => false)
  );

  useEffect(() => {
    onConditionsChange(watched);
  }, [watched]);

  function markWatched(inx: number) {
    setWatched((prev) => prev.map((done, i) => (i === inx ? true : done)));
  }

  return (
    <div className="size-full overflow-hidden">
      {videoTitles.map((title, inx) => (
        <VideoPlayer
          src={title.file_url ?? ""}
          key={title.file_url}
          autoPlay
          className="rounded-xl"
          onEnded={() => markWatched(inx)}
          // Vídeo que não carrega não pode prender o aluno no planeta.
          onError={() => markWatched(inx)}
        />
      ))}
    </div>
  );
}
