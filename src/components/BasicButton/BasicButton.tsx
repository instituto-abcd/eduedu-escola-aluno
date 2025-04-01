import { cx } from "~/utils/cx";

export function BasicButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cx(
        "shadow-card bg-surface rounded-[45px] flex items-center justify-center cursor-pointer select-none",
        "[&:not(:disabled):active]:shadow-card-thin [&:not(:disabled):active]:translate-y-[3px]",
        "data-[selected=true]:bg-[#DFFEC5] data-[selected=true]:border data-[selected=true]:shadow-[0px_5px_0px_0px_#ACE655]",
        props.className
      )}
    >
      {children}
    </button>
  );
}
