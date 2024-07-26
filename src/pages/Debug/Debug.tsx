import { Anchor, List, Title, Container, Stack } from "@mantine/core";

export function DebugPage() {
  const debugLinks = [
    {
      label: "Planetas — listagem de TODOS os planetas cadastrados",
      href: "planet",
    },
    {
      label:
        "Questões de prova — listagem das questões que podem aparecer em uma execução de prova",
      href: "questions",
    },
    {
      label: "Modelos — listagem de TODOS os modelos cadastrados",
      href: "model",
    },
  ];

  const pocLinks = [
    {
      label: "POC Seleção ano escolar (novo fluxo)",
      href: "school-year-select",
    },
    {
      label: "POC Seleção sala/turma (novo fluxo)",
      href: "school-class-select",
    },
  ];

  return (
    <Container>
      <Stack py={24}>
        <Title>Painel de desenvolvedor</Title>

        <Title order={2}>Páginas de depuração</Title>
        <List>
          {debugLinks.map((link) => (
            <List.Item key={link.label}>
              <Anchor href={`/debug/${link.href}`}>{link.label}</Anchor>
            </List.Item>
          ))}
        </List>

        <Title order={2}>Testes e POCs</Title>
        <List>
          {pocLinks.map((link) => (
            <List.Item key={link.label}>
              <Anchor href={`/debug/test/${link.href}`}>{link.label}</Anchor>
            </List.Item>
          ))}
        </List>
      </Stack>
    </Container>
  );
}
