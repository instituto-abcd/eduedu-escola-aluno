import { BackgroundImage, createStyles } from "@mantine/core";

const useStyles = createStyles({});

type Props = { onNext: () => void; onBack: () => void };

export function AudioSettings({}: Props) {
  return (
    <BackgroundImage>
      <h1>free</h1>
    </BackgroundImage>
  );
}
