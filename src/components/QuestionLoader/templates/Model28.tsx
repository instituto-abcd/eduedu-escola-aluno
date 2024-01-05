import { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Group,
  SimpleGrid,
  Text,
  createStyles,
  getStylesRef,
} from "@mantine/core";
import { QuestionOption } from "~/api/exam";
import { boardW } from "~/constants/dimensions";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { AudioButton } from "~/components/AudioButton";
import whiteLogo from "~/assets/logos/eduedu-branca.svg";
import { produce } from "immer";
import { useTimeout } from "@mantine/hooks";
import { ModelProps } from ".";
import { AudioInterface } from "~/sounds";
import { useCreateSound } from "~/hooks/useCreateSound";

const useStyles = createStyles({
  card: {
    perspective: 1000,
    width: boardW(190),
    height: boardW(205),
    borderRadius: 8,

    img: {
      width: "100%",
      maxWidth: boardW(140),
      height: "auto",
      maxHeight: boardW(140),
      objectFit: "contain",
    },

    [`&[data-flipped=true] .${getStylesRef("inner")}`]: {
      transform: "rotateY(180deg)",
    },

    [`&[data-feedback=correct] .${getStylesRef("feedback")}`]: {
      backgroundColor: "#DFFEC5",
      opacity: 0.3,
    },

    [`&[data-feedback=wrong] .${getStylesRef("feedback")}`]: {
      backgroundColor: "#FF6B6B",
      opacity: 0.3,
    },
  },

  cardInner: {
    ref: getStylesRef("inner"),
    position: "relative",
    width: "100%",
    height: "100%",
    textAlign: "center",
    transition: "transform 0.6s",
    transitionDelay: "0.1s",
    transformStyle: "preserve-3d",
    borderRadius: 8,
    border: "1px solid #228BE6",
    backgroundColor: "#fff",
    cursor: "pointer",
    boxShadow: "0px 5px 0px 0px #228BE6",
  },

  cardFront: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
  },

  cardBack: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
    transform: "rotateY(180deg)",
  },

  answerFeedback: {
    ref: getStylesRef("feedback"),
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0,
    zIndex: 99,
    pointerEvents: "none",
    transition: "all 0.3s ease-in",
    transitionDelay: "0.5s",
    borderRadius: 8,
  },
});

export function Model28({ question, onConditionsChange }: ModelProps) {
  const { hasAudioTitle, audioTitles, audioTitleAutoplay } =
    useQuestionHelper(question);

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
      {hasAudioTitle && (
        <Group>
          {audioTitles.map((title, inx) => (
            <AudioButton
              key={inx}
              src={title.file_url!}
              autoPlay={audioTitleAutoplay(inx)}
            />
          ))}
        </Group>
      )}

      <SimpleGrid cols={3} m="auto" spacing={boardW(20)}>
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
      </SimpleGrid>
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
  const { classes } = useStyles();

  const { sound } = useCreateSound({
    src: option.sound_url ?? "",
    autoPlay: false,
  });

  return (
    <div
      className={classes.card}
      onClick={() => {
        onFlipCard(option);
        sound?.play();
      }}
      data-flipped={isFlipped}
      data-feedback={feedback === null ? undefined : feedback}
    >
      <div className={classes.answerFeedback} />
      <div className={classes.cardInner}>
        {/* Front */}
        <Stack
          className={classes.cardFront}
          align="center"
          justify="center"
          bg="blue.1"
        >
          <img src={whiteLogo} width={boardW(103)} />
        </Stack>

        {/* Back */}
        <Stack
          align="center"
          justify="center"
          spacing={10}
          h="100%"
          className={classes.cardBack}
        >
          <img src={option.image_url ?? ""} />
          {option.description && (
            <Text weight={600} size={boardW(20)} color="gray.7">
              {option.description}
            </Text>
          )}
        </Stack>
      </div>
    </div>
  );
}
