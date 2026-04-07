import { LoadingOverlay } from "@mantine/core";
import { Navbar } from "~/components/Navbar";
import { Outlet } from "react-router-dom";
import { AwardSubscriber } from "../AwardSubscriber";
import { useDisclosure } from "@mantine/hooks";
import { useStore } from "@nanostores/react";
import { $loading } from "~/stores/loading-overlay.store";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useEffect } from "react";
import { queryKeyLoadingState } from "~/constants/query-key";
import classes from "./Layout.module.css";

export function Layout() {
  const [inView, headerHandler] = useDisclosure(false);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (e.clientY <= 10) {
        headerHandler.open();
      }
    }

    window.addEventListener("mousemove", handler);

    return () => {
      window.removeEventListener("mousemove", handler);
    };
  }, []);

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
    <div className="relative min-w-screen min-h-screen">
      <Navbar
        inView={inView}
        onMouseLeave={headerHandler.close}
      />
      <Outlet />
      <LoadingOverlay
        visible={isLoading}
        className={classes.loader}
      />
      <AwardSubscriber />
    </div>
  );
}
