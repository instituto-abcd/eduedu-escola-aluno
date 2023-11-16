import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconButton } from "../EduButton";
import { IconButtonProps } from "../EduButton/IconButton";
import { lousaWidth } from "~/constants/dimensions";
import { useCreateSound } from "~/hooks/useCreateSound";
import { Button, HoverCard, Table } from "@mantine/core";
import { useDebugInfo } from "~/stores/debug-info";
import { IconPlayerStopFilled } from "@tabler/icons-react";

type Props = {
  autoPlay?: boolean;
  src: string;
} & Partial<IconButtonProps>;

export function AudioButton({ src, autoPlay, ...props }: Props) {
  const { sound, isPlaying } = useCreateSound({
    src,
    autoPlay,
  });

  const debug = useDebugInfo((s) => s.AudioButton);

  const button = (
    <IconButton
      variant="gray"
      icon={
        props?.icon ?? (
          <OuvirIcon width={lousaWidth * 0.04} height={lousaWidth * 0.029} />
        )
      }
      {...props}
      onClick={sound.play}
      disabled={isPlaying}
    />
  );

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
}
