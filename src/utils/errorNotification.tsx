import { showNotification } from "@mantine/notifications";
import { IconAlertTriangle } from "@tabler/icons-react";
import type { ApiError } from "~/api/api-types";

export const errorNotification = (title: string, message: string) =>
  showNotification({
    title,
    message,
    color: "red",
    icon: <IconAlertTriangle />,
  });

export const onError = (error: ApiError) =>
  errorNotification(
    "Erro durante a operação",
    `${error.message} (cod: ${error.code})`,
  );
