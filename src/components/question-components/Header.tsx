import { Question } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioContainer } from "../AudioContainer";
import { ReadButton } from "../ReadButton";

type Props = {
  question: Question;
  auxQuestion?: Question;
};

export function Header({ question, auxQuestion }: Props) {
  const { hasAudioTitle } = useQuestionHelper(question);

  if (!hasAudioTitle) return null;

  return (
    <div className="flex gap-6 w-full">
      <AudioContainer question={question}>
        {auxQuestion && <ReadButton question={auxQuestion} />}
      </AudioContainer>
    </div>
  );
}
