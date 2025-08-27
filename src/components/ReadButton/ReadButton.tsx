/* eslint-disable @typescript-eslint/no-empty-function */
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { Question } from "~/api/exam";
import { ModelMapper } from "../QuestionLoader/ModelMapper";
import { ButtonRead } from "../Buttons";

type Props = {
  question: Question;
};

export function ReadButton({ question }: Props) {
  const [opened, { open, close }] = useDisclosure(false);

  const onClose = () => {
    close();
  };

  return (
    <>
      <ButtonRead onClick={open} />

      <Modal
        size="auto"
        opened={opened}
        onClose={onClose}
        title="Questão de apoio"
      >
        <ModelMapper
          commonProps={{
            question,
            onAnswerChange: () => {},
            onConditionsChange: () => {},
          }}
        />
      </Modal>
    </>
  );
}
