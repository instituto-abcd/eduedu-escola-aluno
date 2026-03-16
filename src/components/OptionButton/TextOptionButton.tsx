import { OptionButton } from ".";
import { OptionButtonProps } from "./OptionButton";
import { boardW } from "~/constants/dimensions";
import { cx } from "~/utils/cx";
import styles from "./TextOptionButton.module.css";

export function TextOptionButton(props: OptionButtonProps) {
  const dynamicStyle = {
    "--text-opt-padding-inline": `${boardW(24)}px`,
    "--text-opt-padding-block": `${boardW(10)}px`,
    "--text-opt-font-size": `${boardW(40)}px`,
    ...props.style,
  } as React.CSSProperties;

  return (
    <OptionButton
      {...props}
      className={cx(props.className, styles.button)}
      style={dynamicStyle}
    />
  );
}
