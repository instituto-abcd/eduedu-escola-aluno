import { createStyles, Stack } from "@mantine/core";
import { Navbar } from "~/components/Navbar";
import { Outlet } from "react-router-dom";
import { AwardSubscriber } from "../AwardSubscriber";
import { useDisclosure } from "@mantine/hooks";

export function Layout() {
  const { classes } = useStyles();

  const [inView, headerHandler] = useDisclosure(false);

  function handleHeaderTrigger(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    if (e.clientY <= 10) {
      headerHandler.open();
    }
  }

  return (
    <Stack className={classes.shell} onMouseMove={handleHeaderTrigger}>
      <Navbar inView={inView} onMouseLeave={headerHandler.close} />
      <Outlet />
      <AwardSubscriber />
    </Stack>
  );
}

const useStyles = createStyles({
  shell: {
    position: "relative",
  },
});
