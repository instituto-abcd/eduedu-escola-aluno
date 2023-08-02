import { showNotification } from "@mantine/notifications";
import { IconAlertTriangle } from "@tabler/icons-react";

// TODO: validate icon, color and message

export const errorNotification = (title: string, message: string) =>
  showNotification({
    title,
    message,
    color: "red",
    icon: <IconAlertTriangle />,
  });
