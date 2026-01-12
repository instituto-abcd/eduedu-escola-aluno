import { useCreateSound } from "~/hooks/useCreateSound";
import { Button, HoverCard, Table } from "@mantine/core";
import { useDebugInfo } from "~/stores/debug-info";
import { IconPlayerStopFilled } from "@tabler/icons-react";
import { forwardRef, useImperativeHandle } from "react";
import { ButtonListen, ButtonReplay } from "../Buttons";

export type AudioButtonRef = HTMLDivElement & {
  sound: ReturnType<typeof useCreateSound>["sound"];
};

type Props = {
  autoPlay?: boolean;
  src: string;
  index?: number;
};

export const AudioButton = forwardRef(
  ({ src, autoPlay, index }: Props, ref) => {
    const { sound, isPlaying } = useCreateSound({
      src,
      autoPlay,
    });

    useImperativeHandle(ref, () => ({
      sound,
    }));

    const debug = useDebugInfo((s) => s.AudioButton);

    const button =
      index === undefined || index >= 1 ? (
        <ButtonReplay
          onClick={sound.play}
          disabled={isPlaying}
          className="ml-2"
        />
      ) : (
        <ButtonListen
          onClick={sound.play}
          disabled={isPlaying}
        />
      );

    const debugbutton = (
      <HoverCard
        width={200}
        shadow="md"
        position="top-end"
      >
        <HoverCard.Target>
          <div>{button}</div>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Table
            withTableBorder
            fz={12}
          >
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Playing?</Table.Td>
                <Table.Td>{isPlaying ? "✅" : "❌"}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Autoplay?</Table.Td>
                <Table.Td>{autoPlay ? "✅" : "❌"}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Button
            onClick={() => sound.stop()}
            size="compact-sm"
            fullWidth
            color="red"
            mt="sm"
            disabled={!isPlaying}
            leftSection={<IconPlayerStopFilled size={16} />}
          >
            Stop
          </Button>
        </HoverCard.Dropdown>
      </HoverCard>
    );

    return debug ? debugbutton : button;
  }
);
