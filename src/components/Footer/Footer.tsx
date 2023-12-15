import { Box, Container, Flex } from "@mantine/core";

const VERSION = import.meta.env.VITE_APP_VERSION;

export function Footer() {
  return (
    <Box
      style={{ backgroundColor: "#509BCA", color: "#fff", padding: "12px 0" }}
    >
      <Container>
        <Flex justify="space-between">
          <b>E.E de São Paulo</b>
          <span>Desenvolvido por EduEdu</span>
          <span>{VERSION ? `Versão ${VERSION}` : 'v1.0.0'}</span>
        </Flex>
      </Container>
    </Box>
  );
}
