import { Center, Group, SimpleGrid, Image, Text } from "@mantine/core";
import { Question } from "~/api/exam";
import { OuvirIcon } from "~/assets/icons/Ouvir";
import { EduButton } from "~/components/EduButton/EduButton";

export function Model27({ question }: { question: Question }) {
  return (
    <>
      <EduButton rightIcon={<OuvirIcon />}>Ouvir novamente</EduButton>

      <Group position="apart" spacing={137}>

        <SimpleGrid>
          <Image src="https://place-hold.it/362" width={269} height={175} mb={20} />
          <Text style={{ textAlign: 'center' }}>Este é o meu bairro</Text>
        </SimpleGrid>
      </Group>
    </>
  );
}
