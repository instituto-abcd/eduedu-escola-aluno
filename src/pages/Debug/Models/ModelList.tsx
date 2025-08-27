import { Anchor, SimpleGrid, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { useDebugModelList } from "~/api/debug";

export function ModelsList() {
  const { data } = useDebugModelList({ initialData: [] });

  return (
    <div className="flex flex-col items-center min-h-screen p-8">
      <div className="flex flex-col justify-center">
        <Title
          color="dark.4"
          order={1}
        >
          Modelos
        </Title>
        {data && (
          <span className="text-gray-600">Total de modelos: {data.length}</span>
        )}
      </div>

      <SimpleGrid cols={8}>
        {data?.map((modelId) => (
          <Anchor
            component={Link}
            to={modelId}
            key={modelId}
            fw={700}
          >
            {modelId}
          </Anchor>
        ))}
      </SimpleGrid>
    </div>
  );
}
