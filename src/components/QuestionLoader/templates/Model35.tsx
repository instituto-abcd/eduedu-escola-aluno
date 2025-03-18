import { useEffect, useMemo, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { QuestionOption } from "~/api/exam";
import { boardW } from "~/constants/dimensions";
import { ModelProps } from ".";
import { AudioButton } from "~/components/AudioButton";
import { produce } from "immer";
import { VirtualKeyboard } from "~/components/VirtualKeyboard";

export function Model35({
  question,
  onAnswerChange,
  onConditionsChange,
}: ModelProps) {
  const {
    textTitles,
    audioTitles,
    imageTitles,
    hasAudioTitle,
    audioTitleAutoplay,
    getRule,
  } = useQuestionHelper(question);

  const [answer, setAnswer] = useState<string>("");

  useEffect(() => {
    onAnswerChange([
      {
        description: answer,
        positionAnswer: 0,
        position: 0,
      } as QuestionOption,
    ]);
  }, [answer]);

  const fillRule = getRule("fill")?.value === "true";
  const initialSlots =
    question.titles
      .find(
        (title) =>
          title.placeholder.includes("Exp:") ||
          title.placeholder.includes("Exemplo")
      )
      ?.description.trim()
      .split(" ") ?? [];

  const slotMap = initialSlots.map((slot) => ({
    letter: slot === "_" ? "" : slot,
    fixed: slot !== "_",
  }));

  const [slots, setSlots] =
    useState<{ letter: string; fixed: boolean }[]>(slotMap);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const { value } = e.target;
    setSlots((state) =>
      produce(state, (draft) => {
        draft[index].letter = value;
      })
    );
    if (value !== "") {
      let nextInput = e.target.nextElementSibling as HTMLInputElement | null;
      while (nextInput && nextInput.value === "-") {
        nextInput = nextInput.nextElementSibling as HTMLInputElement | null;
      }
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  function handleVirtualInput(key: string) {
    if (fillRule) {
      setSlots((currentSlots) =>
        produce(currentSlots, (draft) => {
          for (let i = 0; i < draft.length; i++) {
            if (!draft[i].fixed && draft[i].letter === "") {
              draft[i].letter = key;
              break;
            }
          }
        })
      );
    } else {
      setAnswer((prev) => prev + key);
    }
  }

  function handleVirtualBackspace() {
    if (fillRule) {
      setSlots((currentSlots) =>
        produce(currentSlots, (draft) => {
          for (let i = draft.length - 1; i >= 0; i--) {
            if (!draft[i].fixed && draft[i].letter !== "") {
              draft[i].letter = "";
              break;
            }
          }
        })
      );
    } else {
      setAnswer((prev) => prev.slice(0, -1));
    }
  }
  function handleBackspace(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && e.currentTarget.value === "") {
      let previousInput = e.currentTarget
        .previousElementSibling as HTMLInputElement | null;
      while (previousInput && previousInput.value === "-") {
        previousInput =
          previousInput.previousElementSibling as HTMLInputElement | null;
      }
      if (previousInput) {
        previousInput.focus();
      }
    }
  }
  useEffect(() => {
    setAnswer(slots.map((slot) => slot.letter.toUpperCase()).join(""));
  }, [slots]);

  const conditions = useMemo(
    () => [
      Boolean(answer),
      fillRule ? slots.every((slot) => slot.letter !== "") : true,
    ],
    [answer, slots, fillRule]
  );

  useEffect(() => {
    onConditionsChange(conditions);
  }, [conditions]);

  useEffect(() => {
    setAnswer("");
    setSlots(slotMap);
  }, [question]);

  return (
    <div className="flex flex-col flex-1 justify-center items-center w-full ml-1">
      {hasAudioTitle && (
        <div className="flex mx-auto h-[50px] lg:absolute lg:top-4 lg:left-4 z-10">
          {audioTitles.map((title, inx) => (
            <AudioButton
              index={inx}
              src={title.file_url!}
              key={inx}
              autoPlay={audioTitleAutoplay(inx)}
            />
          ))}
        </div>
      )}

      {textTitles && (
        <p className="text-gray-800 text-lg mt-5 px-4 text-center">
          {
            textTitles.find((text) => text.placeholder.includes("Enunciado"))
              ?.description
          }
        </p>
      )}

      <div className="flex flex-col items-center my-auto space-y-4 w-full">
        <div
          className="flex w-full items-center justify-center"
          style={{ flexDirection: fillRule ? "column" : "row" }}
        >
          {imageTitles[0] && (
            <img
              src={imageTitles[0].file_url!}
              alt="Question Illustration"
              className="max-w-[180px] md:max-w-[240px] h-auto"
            />
          )}

          {fillRule ? (
            <div className="flex no-wrap justify-center gap-2 px-4 w-full max-w-2xl mx-auto">
              {slots.map((slot, inx) => (
                <input
                  key={inx}
                  maxLength={1}
                  className=" w-[8%] max-w-[60px] h-12 md:h-16 text-lg md:text-2xl font-semibold border-2 border-gray-300 rounded-lg text-center uppercase bg-gray-200 focus:border-blue-500 focus:outline-none"
                  style={{
                    fontSize: "clamp(1rem, 3vw, 1.5rem)",
                    flex: "1 0 auto",
                  }}
                  onChange={(e) => handleInput(e, inx)}
                  onKeyDown={handleBackspace}
                  value={slot.letter}
                  disabled={slot.fixed}
                />
              ))}
            </div>
          ) : (
            <textarea
              value={answer}
              maxLength={100}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-[150px] md:w-[300px] h-[140px] md:h-[212px] bg-gray-100 border-2 border-gray-300 p-2 rounded-3xl resize-none focus:outline-none focus:border-blue-500"
            />
          )}
        </div>

        <div className="w-full px-2">
          <VirtualKeyboard
            handleVirtualInput={handleVirtualInput}
            handleVirtualBackspace={handleVirtualBackspace}
          />
        </div>
      </div>
    </div>
  );
}
