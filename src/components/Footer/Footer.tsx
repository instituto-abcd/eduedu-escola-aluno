import { Box, Container, Flex, Group } from "@mantine/core";
import { useUserStore } from "~/stores/user";

const VERSION = import.meta.env.VITE_APP_VERSION;

export function Footer() {
  const { schoolName } = useUserStore();
  return (
    <Box
      style={{ backgroundColor: "#509BCA", color: "#fff", padding: "12px 0" }}
    >
      <Container>
        <Flex justify="space-between">
          <b>{schoolName}</b>
          <Group spacing={12}>
            <span>Desenvolvido por EduEdu+</span>
            &mdash;
            <span>{VERSION ? `Versão ${VERSION}` : "v1.0.0"}</span>
          </Group>
        </Flex>
      </Container>
    </Box>
  );
}
