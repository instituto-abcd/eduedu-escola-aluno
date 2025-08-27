import { QuestionOption } from "~/api/exam";
import { useDebugInfo } from "~/stores/debug-info";
import { DebugProps } from "../Debug";
import { DebugDiv } from "../Debug/DebugDiv";
import { cx } from "~/utils/cx";
import { validString } from "~/utils/string";
import { useCreateSound } from "~/hooks/useCreateSound";
import { IconVolume } from "@tabler/icons-react";

type Props = {
  option: QuestionOption;
  debug?: DebugProps;
  properties: ("text" | "image" | "audio" | null)[];
  selected: boolean;
} & Pick<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled" | "onClick" | "className"
>;

export function CardOption({
  option,
  debug,
  properties,
  disabled,
  onClick,
  className,
  selected,
  ...props
}: Props) {
  const canDebug = useDebugInfo((s) => s.answer);

  const showImg = properties.includes("image") && validString(option.image_url);
  const showText =
    properties.includes("text") && validString(option.description);

  const { sound, isPlaying } = useCreateSound({
    src: option?.sound_url ?? "",
    skipPlayStatus: true,
  });

  function onClickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!disabled && !isPlaying) {
      sound.play();
    }
    onClick?.(e);
  }

  return (
    <button
      className={cx(
        "shadow-card relative bg-surface rounded-[45px] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden",
        "[&:not(:disabled):active]:shadow-card-thin [&:not(:disabled):active]:translate-y-[3px] transition-all [container-type:inline-size]",
        "size-full min-w-full min-h-full md:max-h-[180px] md:max-w-[180px]",
        {
          "!bg-[#DFFEC5] border border-[#ACE655] !shadow-[0px_5px_0px_0px_#ACE655]":
            selected,
        },
        className
      )}
      onClick={onClickHandler}
      disabled={disabled || isPlaying}
      {...props}
    >
      <Text neighborImg={showImg}>{option.description}</Text>

      <Image
        show={showImg}
        neighborText={showText}
        disabled={disabled || isPlaying}
        url={option.image_url!}
      />

      {!showImg && validString(option.sound_url) && !showText && (
        <IconVolume className="stroke-text size-[80%]" />
      )}

      {canDebug && !debug?.skipDebug && (
        <DebugDiv debug={debug}>{option.isCorrect}</DebugDiv>
      )}
    </button>
  );
}

function Text({
  children,
  neighborImg,
}: {
  neighborImg: boolean;
  children: string;
}) {
  return (
    <span
      className={cx(
        "text-text font-extrabold text-[10cqw] w-full",
        "leading-[100%] break-words",
        {
          ["mt-1"]: neighborImg,
        }
      )}
    >
      {children}
    </span>
  );
}

function Image({
  show,
  url,
  neighborText,
  disabled,
}: {
  show: boolean;
  url: string;
  neighborText: boolean;
  disabled: boolean;
}) {
  if (!show) return null;

  return (
    <img
      src={url}
      className={cx(
        "max-h-[90%] max-w-[90%] h-full md:h-[20cqh] xl:h-full w-auto rounded-[25px]",
        {
          ["!h-1/2"]: neighborText,
          ["grayscale"]: disabled,
        }
      )}
    />
  );
}
