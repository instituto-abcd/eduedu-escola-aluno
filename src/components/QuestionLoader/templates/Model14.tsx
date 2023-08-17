import { Grid, Group, Image } from "@mantine/core";
import { produce } from "immer";
import { useCallback, useState } from "react";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { DraggableCard } from "~/components/DraggableCard";
import { CardItem } from "~/components/DraggableCard/DraggableCard";
import { EduButton } from "~/components/EduButton/EduButton";

export function Model14({ question }: { question: Question }) {
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

      <Group position="apart" spacing={137}>
        <Grid>
          <Grid.Col span={4}>
            <Image src="https://place-hold.it/110" height={256} />
          </Grid.Col>
          {options
            .sort((a, b) => a.position - b.position)
            .map((item, inx) => (
              <Grid.Col span={2} m="auto" key={item.id}>
                <DraggableCard
                  item={item}
                  key={item.id}
                  hidden={!!slots.find((slot) => slot?.id === item.id)}
                />
              </Grid.Col>
            ))}
        </Grid>
      </Group>
    </>
  );
}
