import { Select, SimpleGrid, TextInput, createStyles } from "@mantine/core";
import { useEffect, useState } from "react";
import { useUserSchoolClasses } from "~/api/user";
import logo from "~/assets/logos/eduedu-branca.svg";
import { BREAKPOINT } from "~/constants/dimensions";
import { onError } from "~/utils/errorNotification";

const useStyles = createStyles((theme) => ({
  logo: {
    pointerEvents: "none",
    userSelect: "none",
    [theme.fn.smallerThan(BREAKPOINT.DESKTOP)]: {
      width: 150,
    },
    [theme.fn.largerThan(BREAKPOINT.DESKTOP)]: {
      width: "auto",
    },
  },

  grid: {
    placeItems: "baseline",
    justifyItems: "center",
    alignItems: "end",
  },

  inputLabel: { color: "#fff", marginBottom: 6 },
}));

type Props = {
  onClassChange?: (schoolClassId: string) => void;
  onSearch?: (name: string) => void;
  selectedClass?: string;
};

export function ClassHandles({
  onClassChange,
  onSearch,
  selectedClass = "",
}: Props) {
  const { classes } = useStyles();
  const [selected, setSelected] = useState(selectedClass);
  const [search, setSearch] = useState("");

  const { data: schoolClasses } = useUserSchoolClasses({
    // enabled: authSuccess, // TODO: validate
    onError,
  });

  useEffect(() => {
    onClassChange?.(selected);
  }, [selected]);

  useEffect(() => {
    onSearch?.(search);
  }, [search]);

  return (
    <SimpleGrid cols={3} className={classes.grid}>
      <Select
        label="Turma"
        placeholder="Selecione"
        onChange={(value) => value && setSelected(value)}
        value={selected}
        data={
          schoolClasses?.map((schoolClass) => ({
            value: schoolClass.id,
            label: schoolClass.name,
          })) ?? []
        }
        style={{ width: "100%" }}
        classNames={{ label: classes.inputLabel }}
      />
      <img src={logo} alt="Logo EduEdu Escola" className={classes.logo} />
      <TextInput
        label="Nome"
        placeholder="Pesquisar"
        onChange={(e) => setSearch(e.target.value)}
        classNames={{ label: classes.inputLabel }}
        style={{ width: "100%", gridColumn: 3 }}
      />
    </SimpleGrid>
  );
}
