import { QuestionTitle } from "~/api/exam";
import { cx } from "~/utils/cx";

type Props = {
  titles: QuestionTitle[];
  imgClasses?: string;
  containerClasses?: string;
  height?: number;
};

export function ImageTitle({
  titles,
  imgClasses,
  containerClasses,
  height = 300,
}: Props) {
  if (!titles.length) return null;

  return (
    <div className={cx("flex justify-center items-center", containerClasses)}>
      {titles.map((title) => (
        <img
          src={title.file_url!}
          alt={title.description}
          key={title.file_url}
          height={height}
          className={cx(
            "object-contain max-w-[90%] w-[295px] max-h-[200px]",
            "lg:max-w-[400px] lg:max-h-[400px] lg:h-full lg:w-auto",
            imgClasses
          )}
        />
      ))}
    </div>
  );
}
