import { Group, Image, SimpleGrid, Stack } from "@mantine/core";
import { ModelProps } from ".";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconReload } from "@tabler/icons-react";
import { DragSlotCard, DraggableCard } from "~/components/DraggableCard";
import { IconButton } from "~/components/EduButton";
import { useDrag, useDrop } from "react-dnd";
import { useState } from "react";

export function Model2({ question }: ModelProps) {
  const [droped, setDropped] = useState();

  return (
    <>
      <Group>
        <IconButton icon={<OuvirIcon />} variant="gray" />
        <IconButton icon={<IconReload />} />
      </Group>

      <Stack>
        <SimpleGrid cols={3} spacing={24}>
          <DragSlotCard />
        </SimpleGrid>
        <SimpleGrid cols={3} spacing={24}>
          <DraggableCard id={"asd123"}>
            <Image
              src="https://place-hold.it/220"
              w="100%"
              style={{ pointerEvents: "none", userSelect: "none" }}
            />
          </DraggableCard>
        </SimpleGrid>
      </Stack>
    </>
  );
}
