import { useEffect, useState } from "react";
import { useQuestionHelper } from "~/hooks/useQuestionHelper";
import { boardW } from "~/constants/dimensions";

// Components:
import { Group, Box, SimpleGrid, Image, createStyles } from "@mantine/core";
import { OptionButton } from "~/components/OptionButton";
import { VideoPlayer } from "~/components/VideoPlayer";

const useStyles = createStyles({
  option: {
    width: boardW(130),
    height: boardW(130),
  },
});

export function Model3({ question }: ModelProps) {
  const { classes } = useStyles();

  const { videoTitles } = useQuestionHelper(question);
  const [answer, setAnswer] = useState({});
  const [options, setOptions] = useState(null);

  useEffect(() => {
    setAnswer({});
    setOptions({});
    setOptions(question?.options);
  }, [question]);
  return (
    <>
      <Group m="auto" spacing={boardW(50)}>
        <Box maw={boardW(400)}>
          <VideoPlayer
            src={videoTitles[0]?.file_url ?? ""}
            autoPlay
            style={{ height: boardW(240) }}
          />
        </Box>
        <Box maw={boardW(550)}>
          <SimpleGrid cols={2}>
            {options &&
              options.map(
                ({
                  image_id,
                  description,
                  position,
                  isCorrect,
                  image_url,
                  sound_url,
                }: any) => (
                  <OptionButton
                    key={image_id ?? description}
                    onClick={() =>
                      setAnswer({
                        position: position,
                        positionAnswer: position,
                      })
                    }
                    data-selected={answer?.position === position}
                    className={classes.option}
                  >
                    <Image height={boardW(120)} width="auto" src={image_url} />
                    {description}
                  </OptionButton>
                )
              )}
          </SimpleGrid>
        </Box>
      </Group>
    </>
  );
}
