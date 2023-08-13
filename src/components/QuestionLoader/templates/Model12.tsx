import { Box, Grid, Group, Image, Stack } from "@mantine/core";
import { useCallback, useState } from "react";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { ArrowPlanet } from "~/components/ArrowPlanet/ArrowPlanet";
import { EduButton } from "~/components/EduButton/EduButton";
import { produce } from "immer";
import type { CardItem } from "~/components/DraggableCard/DraggableCard";
import { DragSlotPileCard, DraggablePileCard } from "~/components/DraggablePileCard";

type Slot = CardItem | null;

export function Model12({ question }: { question: Question }) {
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
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>
      <Group position="apart">
        <Stack align="center">
          <Image src={question.titles[0].file_url} width={269} height={175} mb={20} />
          {/* TODO: understand what should be the behavior here */}
          {/* {slots.map((slot, inx) => (
            <DragSlotPileCard
              key={inx}
              accept="ANSWER_CARD"
              onDrop={(item) => handleDrop(item, inx)}
              item={slot}
              onClear={() => handleDrop(null, inx)}
            />
          ))} */}

          <Grid columns={6}>
            <Grid.Col span={1}>
              <ArrowPlanet direction="prev" />
            </Grid.Col>
            <Grid.Col span={3}>
              <Box style={{ position: 'relative' }}>
                {options
                  .sort((a, b) => a.position - b.position)
                  .map((item, inx) => (
                    <DraggablePileCard
                      item={item}
                      key={item.id}
                      hidden={!!slots.find((slot) => slot?.id === item.id)}
                    />
                  ))}
              </Box>
            </Grid.Col>
            <Grid.Col span={1}>
              <ArrowPlanet direction="next" />
            </Grid.Col>
          </Grid>
        </Stack>
      </Group>
    </>
  );
}
