import { Group, Image, SimpleGrid, Stack, createStyles } from "@mantine/core";
import { ModelProps } from ".";
import { EduButton } from "~/components/EduButton/EduButton";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { IconReload } from "@tabler/icons-react";
import { DragSlotCard, DraggableCard } from "~/components/DraggableCard";

const useStyles = createStyles({
  contentCardImage: {
    width: "100%",
  },
});

export function Model2({ question }: ModelProps) {
  const { classes } = useStyles();

  return (
    <>
      <Group position="apart">
        <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>
        <EduButton rightIcon={<IconReload />}>Começar de novo</EduButton>
      </Group>

      <Stack>
        <SimpleGrid cols={3} spacing={24}>
          {question.options.map((o) => (
            <DragSlotCard key={o.order} />
          ))}
        </SimpleGrid>
        <SimpleGrid cols={3} spacing={24}>
          {question.options.map((o) => (
            <DraggableCard key={o.order}>
              <Image
                src="https://place-hold.it/220"
                alt={o.description}
                className={classes.contentCardImage}
              />
            </DraggableCard>
          ))}
        </SimpleGrid>
      </Stack>
    </>
  );
}
