import { Anchor, SimpleGrid, Stack, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { useDebugModelList } from "~/api/debug";

export function ModelsList() {
  const { data } = useDebugModelList({ initialData: [] });

  return (
    <Stack
      mih="100vh"
      align="center"
      p="xl"
    >
      <Stack
        spacing={0}
        justify="center"
      >
        <Title
          color="dark.4"
          order={1}
        >
          Modelos
        </Title>
        {data && (
          <span className="text-gray-600">Total de modelos: {data.length}</span>
        )}
      </Stack>

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
    </Stack>
  );
}
