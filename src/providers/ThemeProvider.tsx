import { DEFAULT_THEME, MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { TextStyles } from "~/styles";

const fontFamily = `'Montserrat Variable', ${DEFAULT_THEME.fontFamily}`;

const theme = createTheme({
  fontFamily,
  headings: { fontFamily },
  components: {
    Text: TextStyles,
  },
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications position="top-center" />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
}
