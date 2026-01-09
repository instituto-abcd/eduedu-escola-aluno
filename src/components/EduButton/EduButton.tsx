import { useRef } from "react";
import feedbackButtonNext from "~/assets/audio/feedback_button_next.mp3";
import { boardW } from "~/constants/dimensions";
import { cx } from "~/utils/cx";
import styles from "./EduButton.module.css";

type EduButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  rightIcon?: JSX.Element;
  leftIcon?: JSX.Element;
  withFeedbackSound?: boolean;
};

export function EduButton({
  children,
  rightIcon,
  leftIcon,
  withFeedbackSound = false,
  style,
  ...props
}: EduButtonProps) {
  const soundRef = useRef<HTMLAudioElement>(null);

  function onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (withFeedbackSound) {
      void soundRef.current?.play();
    }
    props?.onClick?.(e);
  }

  const dynamicStyle = {
    "--edu-btn-min-width": `${boardW(113)}px`,
    "--edu-btn-height": `${boardW(20)}px`,
    "--edu-btn-padding-block": `${boardW(10)}px`,
    "--edu-btn-padding-inline": `${boardW(22)}px`,
    "--edu-btn-font-size": `${boardW(20)}px`,
    ...style,
  } as React.CSSProperties;

  return (
    <button
      {...props}
      className={cx(styles.button, props.className)}
      style={dynamicStyle}
      onClick={onClick}
    >
      {leftIcon}
      {children}
      {rightIcon}
      {withFeedbackSound && <audio src={feedbackButtonNext} ref={soundRef} />}
    </button>
  );
}
