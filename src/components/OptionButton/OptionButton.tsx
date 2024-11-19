import { useDebugInfo } from "~/stores/debug-info";
import { QuestionOption } from "~/api/exam";
import { useCreateSound } from "~/hooks/useCreateSound";
import { DebugDiv } from "../Debug/DebugDiv";
import { DebugProps } from "../Debug";
import { cx } from "~/utils/cx";

export type OptionButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    option?: QuestionOption;
    debug?: DebugProps;
    aspectSquare?: boolean
    fullHeight?: boolean
  };

export function OptionButton({
  option,
  debug,
  children,
  aspectSquare = true,
  fullHeight = true,
  ...props
}: OptionButtonProps) {
  const { sound, isPlaying } = useCreateSound({
    src: option?.sound_url ?? "",
    skipPlayStatus: true,
  });

  function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (!props.disabled && !isPlaying) {
      sound.play();
    }
    props?.onClick?.(e);
  }

  const canDebug = useDebugInfo((s) => s.answer);

  // TODO: experiment with using imgUrl instead of children
  // TODO: experiment with using text string instead of children

  return (
    <button
      {...props}
      className={cx(
        "shadow-card relative bg-surface rounded-[45px] flex flex-col items-center justify-center cursor-pointer select-none",
        "[&:not(:disabled):active]:shadow-card-thin [&:not(:disabled):active]:translate-y-[3px]",
        "data-[selected=true]:bg-[#DFFEC5] data-[selected=true]:border border-[#ACE655] data-[selected=true]:shadow-[0px_5px_0px_0px_#ACE655]",
        "w-[138px] h-[120px] lg:w-full",
        aspectSquare === false ? "" : "lg:aspect-square",
        fullHeight === false ? "" : "lg:h-full",
        "text-text font-extrabold text-xl lg:text-2xl xl:text-[3cqw] xl:leading-[100%] xl:break-words",
        props.className
      )}
      onClick={onClick}
      style={{ containerType: "inline-size" }}
      disabled={props.disabled || isPlaying}
    >
      {canDebug && !debug?.skipDebug && option && (
        <DebugDiv debug={debug}>{option.isCorrect}</DebugDiv>
      )}
      {children}
    </button>
  );
}
