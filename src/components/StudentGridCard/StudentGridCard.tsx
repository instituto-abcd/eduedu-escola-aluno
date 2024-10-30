import { Button, Box, Stack, createStyles, Text } from "@mantine/core";
import { IconLockOpen } from "@tabler/icons-react";
import { Student } from "~/api/student";

const useStyles = createStyles(
  (_, { selected, reserved }: { selected: boolean; reserved: boolean }) => ({
    card: {
      position: "relative",
      width: "100%",
    },
    lock: {
      position: "absolute",
      top: 10,
      right: 20,
      zIndex: 1,
    },
    button: {
      display: "flex",
      height: "100%",
      width: "100%",
      maxWidth: 298,
      padding: "10px 20px",
      borderRadius: "12px",
      border: selected ? "1px solid #ACE655" : "1px solid #228BE6",
      boxShadow: selected ? "0px 3px 0px 0px #ACE655" : "none",
    },
    buttonRoot: {
      background: reserved ? "#E9ECEF" : selected ? "#DFFEC5" : "#FFF",
      "&:hover": {
        background: reserved ? "#B8BCC1" : "#E7F5FF",
      },
    },
  })
);

type Props = {
  student: Student;
  selected: boolean;
  onLogout: (studentId: string) => void;
  onSelected: (studentId: string) => void;
};

export function StudentGridCard({
  student,
  onLogout,
  onSelected,
  selected = false,
}: Props) {
  const { classes } = useStyles({ selected, reserved: student.reserved });

  function handleClick() {
    if (student.reserved) {
      onLogout(student.id);
    } else {
      onSelected(student.id);
    }
  }

  return (
    <Box className={classes.card}>
      {student.reserved && (
        <IconLockOpen
          color="#228BE6"
          height={20}
          className={classes.lock}
        />
      )}
      <Button
        id={student.id}
        onClick={handleClick}
        className={classes.button}
        classNames={{ root: classes.buttonRoot }}
        styles={{ inner: { maxWidth: "100%" } }}
      >
        <Stack w="100%">
          <Text
            size="lg"
            color={student.reserved ? "gray.5" : "blue.6"}
            style={{ lineHeight: 1, whiteSpace: "pre-wrap" }}
          >
            {student.name}
          </Text>
          <Text
            fz="md"
            c={student.reserved ? "gray.5" : "gray.7"}
          >
            {student.registry}
          </Text>
        </Stack>
      </Button>
    </Box>
  );
}
