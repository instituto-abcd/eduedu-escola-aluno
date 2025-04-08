import { BasicButton } from "../BasicButton";
import { useDebugInfo } from "~/stores/debug-info";
import { DebugProps, debug_getNumberIcon } from "../Debug";
import { QuestionOption } from "~/api/exam";

export function BasicOptionButton({
  children,
  debug,
  option,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  option?: QuestionOption;
  debug?: DebugProps;
}) {
  const canDebug = useDebugInfo((s) => s.answer);
  return (
    <BasicButton {...props}>
      {canDebug && !debug?.skipDebug && option && (
        <DebugDiv debug={debug}>{option.isCorrect}</DebugDiv>
      )}
      {children}
    </BasicButton>
  );
}

export const DebugDiv: React.FC<{
  children?: React.ReactNode;
  position?: unknown;
  debug?: DebugProps;
}> = ({ children, position, debug }) => {
  if (position !== undefined && debug?.debugProperty === "position")
    return <div className="z-1">{debug_getNumberIcon(position)}</div>;

  return (
    <div className="z-1 pr-4">
      {typeof children === "boolean" ? (children ? "✅" : "❌") : children}
    </div>
  );
};
