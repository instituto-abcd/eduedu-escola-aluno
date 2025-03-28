import { cva, VariantProps } from "class-variance-authority";
import { cx } from "~/utils/cx";

/**
 * Variação do `CardOption` que pode ser montado
 * sem passar obrigatóriamente um objeto QuestionOption
 */

type Props = VariantProps<typeof button> & {
  selected: boolean;
  image?: string;
  text?: string;
  sound?: string;
} & Pick<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "disabled" | "onClick" | "className"
  >;

const button = cva(
  [
    "shadow-card relative bg-surface rounded-[45px] flex flex-col items-center justify-evenly cursor-pointer select-none overflow-hidden",
    "[&:not(:disabled):active]:shadow-card-thin [&:not(:disabled):active]:translate-y-[3px] transition-all [container-type:inline-size]",
  ],
  {
    variants: {
      shape: {
        contain: "size-full",
        square:
          "w-[138px] h-[120px] lg:h-full lg:w-auto lg:max-h-[250px] lg:max-w-[250px] aspect-square",
        pill: "whitespace-normal w-auto px-3 py-1 min-w-fit [container-type:normal]",
      },
      selected: {
        true: "!bg-[#DFFEC5] border border-[#ACE655] !shadow-[0px_5px_0px_0px_#ACE655]",
      },
    },
    defaultVariants: {
      shape: "square",
    },
  }
);

export function CardManual({
  image,
  text,
  sound: _, // TODO: add sound if needed
  disabled = false,
  className,
  ...props
}: Props) {
  return (
    <button
      className={button({ ...props, className })}
      disabled={disabled}
      {...props}
    >
      {text && (
        <Text
          pill={props.shape === "pill"}
          neighborImg={!!image}
        >
          {text}
        </Text>
      )}

      {image && (
        <Image
          show={true}
          neighborText={!!text}
          disabled={disabled}
          url={image}
        />
      )}
    </button>
  );
}

function Text({
  children,
  neighborImg,
  pill,
}: {
  neighborImg: boolean;
  children: string;
  pill: boolean;
}) {
  return (
    <div
      className={cx(
        "text-text font-extrabold text-[10cqw] flex-1",
        "leading-[100%] break-words whitespace-nowrap min-w-max",
        {
          ["mt-1"]: neighborImg,
          ["text-[30cqw]"]: !neighborImg && !pill,
          ["text-xl md:text-2xl xl:text-4xl"]: pill,
        }
      )}
    >
      {children}
    </div>
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
