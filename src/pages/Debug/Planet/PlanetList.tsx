import { Badge, Image, Paper, SimpleGrid, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { useDebugPlanets } from "~/api/debug";

export function PlanetList() {
  const { data } = useDebugPlanets({ initialData: [] });

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <div className="flex flex-col gap-0 justify-center items-center">
        <Title
          c="dark.4"
          order={1}
        >
          Planetas
        </Title>
        {data && (
          <span className="text-gray-600">
            Total de planetas: {data.length}
          </span>
        )}
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
                <span className="text-gray-700 font-bold">{planet.title}</span>
                <Badge>{planet.axis_code ?? "N/A"}</Badge>
              </div>
              <Image
                src={planet.avatar_url}
                w={50}
                h={50}
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
                <span className="text-gray-500 text-xs">
                  Questões: {planet.questions.length}
                </span>
              </div>
            </div>
          </Paper>
        ))}
      </SimpleGrid>
    </div>
  );
}
