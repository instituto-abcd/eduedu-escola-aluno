import { useDebugInfo } from "~/stores/debug-info";
import { QuestionOption } from "~/api/exam";
import { useCreateSound } from "~/hooks/useCreateSound";
import { DebugDiv } from "../Debug/DebugDiv";
import { DebugProps } from "../Debug";
import { useStyles } from "./styles";

export type OptionButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    option?: QuestionOption;
    debug?: DebugProps;
  };

export function OptionButton({
  option,
  debug,
  children,
  ...props
}: OptionButtonProps) {
  const { classes, cx } = useStyles();
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

  return (
    <button
      {...props}
      className={cx(classes.button, props.className)}
      onClick={onClick}
      disabled={props.disabled || isPlaying}
    >
      {canDebug && !debug?.skipDebug && option && (
        <DebugDiv debug={debug}>{option.isCorrect}</DebugDiv>
      )}
      {children}
    </button>
  );
}
