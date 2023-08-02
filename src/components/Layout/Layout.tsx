import { AppShell, Stack } from "@mantine/core";
import { Navbar } from "~/components/Navbar";
import { Footer } from "~/components/Footer";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <AppShell header={<Navbar />} footer={<Footer />} padding={0}>
      <Stack>
        <Outlet />
      </Stack>
    </AppShell>
  );
}
