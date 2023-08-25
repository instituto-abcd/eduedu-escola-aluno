import {
  Badge,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useDebugPlanets } from "~/api/debug";

export function PlanetList() {
  const { data, isLoading } = useDebugPlanets({ initialData: [] });

  return (
    <Stack mih="100vh" align="center" p="xl">
      <LoadingOverlay visible={isLoading} />

      <Title color="dark.6" order={1}>
        Planetas
      </Title>
      {data && <Text>Total de planetas: {data.length}</Text>}

      <SimpleGrid cols={7}>
        {data?.map((planet) => (
          <Paper
            key={planet.id}
            withBorder
            radius="md"
            shadow="sm"
            p="md"
            component={Link}
            to={planet.id}
            state={{ planet }}
          >
            <Stack align="center">
              <Group w="100%" position="apart">
                <Text color="dark.3" weight={700}>
                  {planet.title}
                </Text>
                <Badge>{planet.axis_code ?? "N/A"}</Badge>
              </Group>
              <Image src={planet.avatar_url} width={50} height={50} />
              <Group>
                <Badge
                  variant="dot"
                  color={
                    !planet.status
                      ? "orange"
                      : planet.status === "PRODUÇÃO"
                      ? "green"
                      : "blue"
                  }
                >
                  {planet.status ?? "N/A"}
                </Badge>
                <Text color="dimmed" size={12}>
                  Questões: {planet.questions.length}
                </Text>
              </Group>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
