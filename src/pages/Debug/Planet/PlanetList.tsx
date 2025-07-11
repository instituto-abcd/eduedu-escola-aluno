import { Badge, Image, Paper, SimpleGrid, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { useDebugPlanets } from "~/api/debug";

export function PlanetList() {
  const { data } = useDebugPlanets({ initialData: [] });

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="flex flex-col gap-0 justify-center items-center">
        <Title
          color="dark.4"
          order={1}
        >
          Planetas
        </Title>
        {data && <Text color="dark.4">Total de planetas: {data.length}</Text>}
      </div>

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
            <div className="flex flex-col items-center">
              <div className="flex w-full justify-between items-center">
                <Text
                  color="dark.3"
                  weight={700}
                >
                  {planet.title}
                </Text>
                <Badge>{planet.axis_code ?? "N/A"}</Badge>
              </div>
              <Image
                src={planet.avatar_url}
                width={50}
                height={50}
              />
              <div className="flex items-center gap-2">
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
                <Text
                  color="dimmed"
                  size={12}
                >
                  Questões: {planet.questions.length}
                </Text>
              </div>
            </div>
          </Paper>
        ))}
      </SimpleGrid>
    </div>
  );
}
