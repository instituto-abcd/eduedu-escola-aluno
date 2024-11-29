import { MantineProvider, MantineThemeOverride } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { TextStyles } from "~/styles";
import { DndProvider } from "react-dnd";
// import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";

const theme: MantineThemeOverride = {
  components: {
    TextStyles,
  },

  globalStyles() {
    return {};
  },
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <MantineProvider theme={theme}>
        <ModalsProvider>
          <Notifications position="top-center" />
          {children}
        </ModalsProvider>
      </MantineProvider>
    </DndProvider>
  );
}
