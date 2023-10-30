import { Box, Container, Flex } from "@mantine/core";
import packageJson from "~/../package.json";

export function Footer() {
  return (
    <Box
      style={{ backgroundColor: "#509BCA", color: "#fff", padding: "12px 0" }}
    >
      <Container>
        <Flex justify="space-between">
          <b>E.E de São Paulo</b>
          <span>Desenvolvido por EduEdu</span>
          <span>v{packageJson.version}</span>
        </Flex>
      </Container>
    </Box>
  );
}
