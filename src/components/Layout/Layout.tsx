import { AppShell, Stack } from "@mantine/core";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { Outlet } from "react-router-dom";
import { AwardSubscriber } from "../AwardSubscriber";

export function Layout() {
  return (
    <AppShell header={<Navbar />} footer={<Footer />} padding={0}>
      <Stack>
        <Outlet />
      </Stack>

      <AwardSubscriber />
    </AppShell>
  );
}
