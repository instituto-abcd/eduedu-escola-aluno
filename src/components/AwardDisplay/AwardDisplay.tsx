import { Tooltip, Text, Box, BackgroundImage } from "@mantine/core";
import { type AwardImage } from "~/constants/awards";

type Props = { award: AwardImage; onClick?: (image: AwardImage) => void };

export function AwardDisplay({ award, onClick }: Props) {
  return (
    <Tooltip
      disabled={!award.active}
      label={
        <>
          <Text size="sm" weight={700}>
            {award.title}
          </Text>
          <Text size="sm">{award.description}</Text>
        </>
      }
      transitionProps={{ transition: "scale", duration: 300 }}
      style={{ whiteSpace: "pre-line", textAlign: "center" }}
      color="dark.3"
      position="bottom"
      withArrow
      multiline
      width={200}
    >
      <Box>
        <BackgroundImage
          src={award.image}
          w={88}
          h={114}
          mx="auto"
          style={{
            filter: award.active ? "" : "grayScale(100%)",
            cursor: award.active ? "pointer" : "default",
          }}
          onClick={() => onClick?.(award)}
        />
      </Box>
    </Tooltip>
  );
}
