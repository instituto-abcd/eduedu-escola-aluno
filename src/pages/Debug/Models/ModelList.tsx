import {
  Anchor,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useDebugModelList } from "~/api/debug";

export function ModelsList() {
  const { data, isFetching } = useDebugModelList({ initialData: [] });

  return (
    <Stack mih="100vh" align="center" p="xl">
      <LoadingOverlay visible={isFetching} loaderProps={{ color: "grape" }} />

      <Stack spacing={0} justify="center">
        <Title color="dark.4" order={1}>
          Modelos
        </Title>
        {data && <Text color="dark.4">Total de modelos: {data.length}</Text>}
      </Stack>

      <SimpleGrid cols={8}>
        {data?.map((modelId) => (
          <Anchor component={Link} to={modelId} key={modelId} fw={700}>
            {modelId}
          </Anchor>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
