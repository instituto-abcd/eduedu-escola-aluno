import { createStyles, LoadingOverlay, Stack } from "@mantine/core";
import { Navbar } from "~/components/Navbar";
import { Outlet } from "react-router-dom";
import { AwardSubscriber } from "../AwardSubscriber";
import { useDisclosure } from "@mantine/hooks";
import { useStore } from "@nanostores/react";
import { $loading } from "~/stores/loading-overlay.store";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useEffect } from "react";
import { queryKeyLoadingState } from "~/constants/query-key";

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

  /* Queries que alteram o estado do LoadingOverlay */
  const isFetching = useIsFetching(queryKeyLoadingState);
  const isMutating = useIsMutating(queryKeyLoadingState);

  useEffect(() => {
    if (isFetching > 0 || isMutating > 0) {
      $loading.set(true);
    } else {
      $loading.set(false);
    }
  }, [isFetching, isMutating]);
  const isLoading = useStore($loading);

  return (
    <Stack className={classes.shell} onMouseMove={handleHeaderTrigger}>
      <Navbar inView={inView} onMouseLeave={headerHandler.close} />
      <Outlet />
      <LoadingOverlay visible={isLoading} className={classes.loader} />
      <AwardSubscriber />
    </Stack>
  );
}

const useStyles = createStyles({
  shell: {
    position: "relative",
    minWidth: "100vw",
    minHeight: "100vh",
  },
  loader: {
    minWidth: "100vw",
    minHeight: "100vh",
    position: "fixed",
    inset: 0,
  },
});
