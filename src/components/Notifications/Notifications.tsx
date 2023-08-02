import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Indicator,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { useNotificationGet, useNotificationRead } from "~/api/notification";
import { errorNotification } from "~/utils/errorNotification";

export function Notifications() {
  const { data } = useNotificationGet({
    onError: (error) => {
      errorNotification(
        "Erro durante a operação",
        `${error.message} (cod: ${error.code})`
      );
    },
    initialData: [],
    refetchOnWindowFocus: true,
    cacheTime: 1000 * 60 * 5,
  });

  const { mutate, isLoading } = useNotificationRead();

  return (
    <Menu shadow="md">
      <Menu.Target>
        <ActionIcon variant="subtle">
          <Indicator
            offset={6}
            position="top-end"
            disabled={data ? data.length < 1 : true}
          >
            <IconBell height={20} color="#2C2E33" />
          </Indicator>
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown miw={589}>
        <Stack spacing="md" px={24} py={12}>
          <Text>Notificações</Text>
          {data && data.length === 0 && <Text size="sm">Sem notificações</Text>}
          {data?.map((notification, inx) => (
            <>
              <Text size="sm" key={notification.notificationId}>
                {notification.notification.text}
              </Text>
              {inx !== data.length - 1 && <Divider variant="solid" />}
            </>
          ))}
          <Divider />
          <Group position="right">
            <Button
              variant="outline"
              size="sm"
              loading={isLoading}
              onClick={() => mutate()}
              disabled={data ? data.length < 1 : true}
            >
              Marcar como lido
            </Button>
          </Group>
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}
