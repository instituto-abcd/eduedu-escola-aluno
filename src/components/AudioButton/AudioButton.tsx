import { useCreateSound } from "~/hooks/useCreateSound";
import { Button, HoverCard, Table } from "@mantine/core";
import { useDebugInfo } from "~/stores/debug-info";
import { IconPlayerStopFilled } from "@tabler/icons-react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { ButtonListen, ButtonReplay } from "../Buttons";

export type AudioButtonRef = HTMLDivElement & {
  sound: ReturnType<typeof useCreateSound>["sound"];
};

type Props = {
  autoPlay?: boolean;
  src: string;
  index?: number;
};

export const AudioButton = forwardRef(({ src, autoPlay, index }: Props, ref) => {
  const { sound, isPlaying } = useCreateSound({
    src,
    autoPlay,
  });

  useImperativeHandle(ref, () => ({
    sound,
  }));

  const debug = useDebugInfo((s) => s.AudioButton);

  const button = index === undefined || index>=1 ? <ButtonReplay onClick={sound.play} disabled={isPlaying} /> : <ButtonListen onClick={sound.play} disabled={isPlaying} />;

  const debugbutton = (
    <HoverCard width={200} shadow="md" position="top-end">
      <HoverCard.Target>
        <div>{button}</div>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Table withBorder fontSize={12}>
          <tbody>
            <tr>
              <td>Playing?</td>
              <td>{isPlaying ? "✅" : "❌"}</td>
            </tr>
            <tr>
              <td>Autoplay?</td>
              <td>{autoPlay ? "✅" : "❌"}</td>
            </tr>
          </tbody>
        </Table>
        <Button
          onClick={() => sound.stop()}
          compact
          fullWidth
          color="red"
          mt="sm"
          disabled={!isPlaying}
          leftIcon={<IconPlayerStopFilled size={16} />}
        >
          Stop
        </Button>
      </HoverCard.Dropdown>
    </HoverCard>
  );

  return debug ? debugbutton : button;
});
