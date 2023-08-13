import { Box, Group, SimpleGrid, Stack } from "@mantine/core";
import { useCallback, useState } from "react";
import { Question } from "~/api/exam";

import { OuvirIcon } from "~/assets/icons/Ouvir";
import { EduButton } from "~/components/EduButton/EduButton";

import type { CardItem } from "~/components/DraggableCard/DraggableCard";
import { DragSlotGrayCard, DraggableGrayCard } from "~/components/DraggableGrayCard";
import { produce } from "immer";

type Slot = CardItem | null;

export function Model13({ question }: { question: Question }) {
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
      {/* TODO: custom this as should be */}

      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart" spacing={137}>
        <Stack align="center">
          <SimpleGrid mb={50}>
            <Group>
              {slots.map((slot, inx) => (
                <DragSlotGrayCard
                  key={inx}
                  accept="ANSWER_CARD"
                  onDrop={(item) => handleDrop(item, inx)}
                  item={slot}
                  onClear={() => handleDrop(null, inx)}
                />
              ))}
            </Group>
          </SimpleGrid>

          <SimpleGrid cols={slots.length}>
            {options
              .sort((a, b) => a.position - b.position)
              .map((item, inx) => (
                <DraggableGrayCard
                  item={item}
                  key={item.id}
                  hidden={!!slots.find((slot) => slot?.id === item.id)}
                />
              ))}
          </SimpleGrid>
        </Stack>
      </Group>
    </>
  );
}
