import { Modal, SimpleGrid, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { AWARDS_IMAGES } from "~/constants/awards";
import { useNewAward } from "~/stores/new-award";
import { AwardDisplay } from "../AwardDisplay/AwardDisplay";

export function AwardSubscriber() {
  const { awards, viewRequested, setNewAwards } = useNewAward();
  const [isOpen, { open, close }] = useDisclosure();

  function onModalClose() {
    setNewAwards([]);
    close();
  }

  useEffect(() => {
    if (viewRequested) {
      open();
    } else if (!viewRequested && isOpen) {
      close();
    }
  }, [viewRequested]);

  return (
    <Modal title="Parabéns!" opened={isOpen} onClose={onModalClose} radius="md">
      <Title size="h2" mb="md">
        Você recebeu novas conquistas.
      </Title>
      <SimpleGrid cols={awards.length > 1 ? 2 : 1}>
        {awards.map((n) => {
          const img = AWARDS_IMAGES.find((img) => img.name === n);
          if (img) {
            return <AwardDisplay award={img} key={n} />;
          }
        })}
      </SimpleGrid>
    </Modal>
  );
}
