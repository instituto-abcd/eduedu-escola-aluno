import { Button, Select, Stack } from "@mantine/core";
import { SchoolClass } from "~/api/user";

type Props = {
  schoolClasses?: SchoolClass[];
  onClassSelected: (classId: string) => void;
  selectedClass?: string;
  onNextStep: () => void;
};

export function ClassSelection({
  schoolClasses,
  onClassSelected,
  selectedClass,
  onNextStep,
}: Props) {
  return (
    <Stack w={400} m="auto">
      <Select
        label="Turma"
        placeholder="Selecione"
        data={
          schoolClasses?.map((schoolClass) => ({
            value: schoolClass.id,
            label: schoolClass.name,
          })) ?? []
        }
        styles={{
          label: { color: "#fff", marginBottom: 6 },
        }}
        onChange={(value) => value && onClassSelected?.(value)}
      />
      <Button disabled={!selectedClass} fullWidth onClick={() => onNextStep()}>
        Entrar
      </Button>
    </Stack>
  );
}
