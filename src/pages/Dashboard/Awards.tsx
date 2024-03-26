import {
  Title,
  BackgroundImage,
  Tooltip,
  Box,
  SimpleGrid,
  Text,
  Skeleton,
} from "@mantine/core";
import { AWARDS_IMAGES } from "~/constants/awards";
import { ModalAwards } from "./Awards/Modal";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { errorNotification } from "~/utils/errorNotification";
import { useGetPlanetTrack, useGetStudentAwards } from "~/api/student";

export function Awards() {
  const { data, isFetching } = useGetStudentAwards({
    initialData: { awards: [] },
    onError: (error) => {
      errorNotification(
        "Erro durante a operação",
        `${error.message} (cod: ${error.code})`,
      );
    },
  });

  const [modal, modalHandler] = useDisclosure(false);
  const [awardImage, setAwardImage] = useState("");

  useEffect(() => {
    if (!data) return;

    AWARDS_IMAGES.map((item) => {
      data.awards.map((subitem) => {
        item.name === subitem.name
          ? ((item.active = true),
            (item.title = subitem.title),
            (item.description = subitem.description),
            (item.id = subitem.id))
          : {};
      });
    });
  }, [data]);

  const { data: track } = useGetPlanetTrack({
    enabled: false,
  });

  const hasPlanetTrack = track ? track.planetTrack.length > 0 : false;

  if (!hasPlanetTrack) return null;

  return (
    <>
      <Title mb={40} color="white" size={26}>
        Minhas Conquistas
      </Title>

      <SimpleGrid cols={8}>
        {!isFetching &&
          AWARDS_IMAGES.map((item, inx) => (
            <Tooltip
              key={inx}
              disabled={!item.active}
              label={
                <>
                  <Text size="sm" weight={700}>
                    {item.title}
                  </Text>
                  <Text size="sm">{item.description}</Text>
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
                  src={item.image}
                  w={88}
                  h={114}
                  mx="auto"
                  style={{
                    filter: item.active ? "" : "grayScale(100%)",
                    cursor: item.active ? "pointer" : "default",
                  }}
                  onClick={() => {
                    if (item.active) {
                      setAwardImage(item.name);
                      modalHandler.open();
                    }
                  }}
                />
              </Box>
            </Tooltip>
          ))}

        {isFetching &&
          Array(AWARDS_IMAGES.length)
            .fill(null)
            .map((_, i) => (
              <Skeleton
                key={i}
                py={40}
                visible={true}
                width={90}
                height={100}
                radius={10}
                opacity={0.3}
              />
            ))}
      </SimpleGrid>

      <ModalAwards
        opened={modal}
        onClose={modalHandler.close}
        image={awardImage}
      />
    </>
  );
}
