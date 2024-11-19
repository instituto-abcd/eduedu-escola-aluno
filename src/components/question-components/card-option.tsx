import { cva, VariantProps } from "class-variance-authority";
import { QuestionOption } from "~/api/exam";
import { useDebugInfo } from "~/stores/debug-info";
import { DebugProps } from "../Debug";
import { DebugDiv } from "../Debug/DebugDiv";
import { cx } from "~/utils/cx";
import { validString } from "~/utils/string";
import { useCreateSound } from "~/hooks/useCreateSound";

type Props = VariantProps<typeof button> & {
  option: QuestionOption;
  debug?: DebugProps;
  properties: ("text" | "image" | "audio")[];
  selected: boolean;
} & Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "onClick">;

const button = cva(
  [
    "shadow-card relative bg-surface rounded-[45px] flex flex-col items-center justify-center cursor-pointer select-none",
    "[&:not(:disabled):active]:shadow-card-thin [&:not(:disabled):active]:translate-y-[3px]",
    "data-[selected=true]:bg-[#DFFEC5] data-[selected=true]:border border-[#ACE655] data-[selected=true]:shadow-[0px_5px_0px_0px_#ACE655]",
  ],
  {
    variants: {
      shape: {
        contain: "size-full",
        square:
          "w-[138px] h-[120px] lg:h-full lg:w-auto lg:max-w-full lg:max-h-[300px] aspect-square",
      },
      selected: {
        true: "bg-[#DFFEC5] shadow-[0px_5px_0px_0px_#ACE655]",
      },
    },
    defaultVariants: {
      shape: "square",
    },
  }
);

export function CardOption({
  option,
  debug,
  properties,
  disabled,
  onClick,
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
      className={button({ ...props })}
      onClick={onClickHandler}
      disabled={disabled || isPlaying}
    >
      <Image
        show={showImg}
        neighborText={showText}
        url={option.image_url!}
      />

      <Text
        show={showText}
        neighborImg={showImg}
      >
        {option.description}
      </Text>

      {canDebug && !debug?.skipDebug && (
        <DebugDiv debug={debug}>{option.isCorrect}</DebugDiv>
      )}
    </button>
  );
}

function Text({
  show,
  children,
  neighborImg,
}: {
  show: boolean;
  neighborImg: boolean;
  children: string;
}) {
  if (!show) return null;

  return (
    <span
      className={cx(
        "text-text font-extrabold text-xl w-full",
        "lg:text-[2.5cqw] lg:leading-[100%] lg:break-words",
        {
          ["lg:text-[2cqw] mt-1"]: neighborImg,
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
}: {
  show: boolean;
  url: string;
  neighborText: boolean;
}) {
  if (!show) return null;

  return (
    <img
      src={url}
      className={cx("max-h-[90%] max-w-[90%] h-full w-auto", {
        ["h-2/3"]: neighborText,
      })}
    />
  );
}
