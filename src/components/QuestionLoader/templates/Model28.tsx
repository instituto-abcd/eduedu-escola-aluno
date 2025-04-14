import { useEffect, useMemo, useState } from "react";
import { QuestionOption } from "~/api/exam";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { produce } from "immer";
import { useTimeout } from "@mantine/hooks";
import { ModelProps } from ".";
import { AudioInterface } from "~/sounds";
import { useCreateSound } from "~/hooks/useCreateSound";
import { cx } from "~/utils/cx";
import logo from "~/assets/logos/eduedu-azul.svg";
import { AudioContainer } from "~/components/AudioContainer";

export function Model28({ question, onConditionsChange }: ModelProps) {
  const { hasAudioTitle } = useQuestionHelper(question);

  const [flipped, setFlipped] = useState<
    [QuestionOption | null, QuestionOption | null]
  >([null, null]);

  const [answers, setAnswers] = useState<QuestionOption[]>([]);

  const [flipDisabled, setFlipDisabled] = useState(false);

  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const { start: clearFeedback } = useTimeout(() => {
    setFeedback(null);
    setFlipped([null, null]);
    setFlipDisabled(false);
  }, 1200);

  function handleFeedback(status: "correct" | "wrong") {
    setFlipDisabled(true);
    setFeedback(status);
    clearFeedback();

    setTimeout(() => {
      if (status === "correct") AudioInterface.feedback.positive.play();
      if (status === "wrong") AudioInterface.feedback.negative.play();
    }, 1000);
  }

  function handleCardFlipped(option: QuestionOption) {
    if (flipDisabled) return;
    if (flipped.some((opt) => JSON.stringify(opt) === JSON.stringify(option)))
      return;

    setFlipped(
      produce(flipped, (draft) => {
        draft[0] !== null ? (draft[1] = option) : (draft[0] = option);
      })
    );
  }

  function isCardFlipped(option: QuestionOption) {
    return (
      flipped.some((opt) => JSON.stringify(option) === JSON.stringify(opt)) ||
      answers.some((opt) => JSON.stringify(option) === JSON.stringify(opt))
    );
  }

  function handlePairCheck() {
    if (flipped.some((opt) => opt === null)) return;

    /* is correct */
    if (flipped[0]!.position === flipped[1]!.position) {
      setAnswers([...answers, flipped[0]!, flipped[1]!]);
      handleFeedback("correct");
    } else {
      /* is wrong */
      handleFeedback("wrong");
    }
  }

  useEffect(() => {
    handlePairCheck();
  }, [flipped]);

  useEffect(() => {
    setAnswers([]);
  }, [question]);

  const conditions = useMemo(
    () => [Boolean(answers.length === question.options.length)],
    [answers]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  return (
    <>
      {hasAudioTitle && <AudioContainer question={question} />}

      <div className="size-full flex flex-col items-center justify-center">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-5 lg:gap-x-20 gap-y-12">
          {question.options.map((option, inx) => (
            <FlippableCard
              option={option}
              onFlipCard={handleCardFlipped}
              isFlipped={isCardFlipped(option)}
              key={inx}
              feedback={
                flipped.some(
                  (opt) => JSON.stringify(opt) === JSON.stringify(option)
                )
                  ? feedback
                  : null
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}

type FlippableCardProps = {
  option: QuestionOption;
  onFlipCard: (option: QuestionOption) => void;
  isFlipped: boolean;
  feedback?: "correct" | "wrong" | null;
};

function FlippableCard({
  option,
  onFlipCard,
  isFlipped,
  feedback,
}: FlippableCardProps) {
  const { sound } = useCreateSound({
    src: option.sound_url ?? "",
    autoPlay: false,
  });

  return (
    <div
      className={cx(
        "[perspective:1000px] bg-surface w-[157px] md:w-[250px] h-[131px] md:h-[208px] rounded-lg shadow-card",
        "transition-all delay-100 duration-500",
        {
          ["bg-green-300 bg-opacity-30"]: feedback === "correct",
          ["bg-red-300 bg-opacity-30"]: feedback === "wrong",
        }
      )}
      onClick={() => {
        onFlipCard(option);
        sound?.play();
      }}
    >
      <div
        className={cx(
          "relative size-full [transform-style:preserve-3d]",
          "cursor-pointer transition-transform duration-500 delay-100",
          {
            ["[transform:rotateY(180deg)]"]: isFlipped,
          }
        )}
      >
        {/* Front */}

        <div
          className={cx(
            "absolute size-full [backface-visibility:hidden]",
            "flex flex-col items-center justify-center"
          )}
        >
          <img
            src={logo}
            className="w-2/3"
          />
        </div>

        {/* Back */}

        <div
          className={cx(
            "flex flex-col items-center justify-center gap-3 size-full delay-150 duration-500",
            "absolute size-full [backface-visibility:hidden] [transform:rotateY(180deg)]"
          )}
        >
          {option.description && (
            <p className="font-extrabold text-text text-2xl md:text-3xl">
              {option.description}
            </p>
          )}

          {option.image_url && (
            <img
              src={option.image_url}
              className="aspect-square object-cover w-[79px] md:w-[140px]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
