import { Group, SimpleGrid, Stack } from "@mantine/core";
import { ModelProps } from ".";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconReload } from "@tabler/icons-react";
import { DragSlotCard, DraggableCard } from "~/components/DraggableCard";
import { IconButton } from "~/components/EduButton";
import { useCallback, useState } from "react";
import { produce } from "immer";
import type { CardItem } from "~/components/DraggableCard/DraggableCard";

type Slot = CardItem | null;

export function Model2({ question }: ModelProps) {
  const [slots, setSlots] = useState<Slot[]>(question.options.map(() => null));

  const [options] = useState<CardItem[]>(
    question.options.map((option) => ({
      id: option.position,
      type: "ANSWER_CARD",
      imageUrl: option.image_url ?? "",
      description: option.description,
      position: option.position,
    }))
  );

  const handleDrop = useCallback(function (
    item: CardItem | null,
    index: number
  ) {
    setSlots((state) =>
      produce(state, (draft) => {
        draft[index] = item;
      })
    );
  },
    []);

  return (
    <>
      <Group>
        <IconButton icon={<OuvirIcon />} variant="gray" />
        <IconButton icon={<IconReload />} />
      </Group>

      <Stack>
        <SimpleGrid cols={options.length} spacing={24}>
          {slots.map((slot, inx) => (
            <DragSlotCard
              key={inx}
              accept="ANSWER_CARD"
              onDrop={(item) => handleDrop(item, inx)}
              item={slot}
              onClear={() => handleDrop(null, inx)}
            />
          ))}
        </SimpleGrid>

        <SimpleGrid cols={options.length} spacing={24}>
          {options
            .sort((a, b) => a.position - b.position)
            .map((item, inx) => (
              <DraggableCard
                item={item}
                key={item.id}
                hidden={!!slots.find((slot) => slot?.id === item.id)}
              />
            ))}
        </SimpleGrid>
      </Stack>
    </>
  );
}
