import { Button, PasswordInput, Stack, Notification } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconHourglass } from "@tabler/icons-react";
import { useAuthLogin } from "~/api/auth";
import { useSyncStatus } from "~/api/sync";
import { onError } from "~/utils/errorNotification";

type Props = {
  onNextStep: () => void;
};

export function LoginForm({ onNextStep }: Props) {
  const { isFetching: fetchingStatus, data: syncStatus } = useSyncStatus({
    cacheTime: 0,
  });

  const disableAccess = fetchingStatus || !!syncStatus?.running;

  const { mutate: authTeacher, isLoading: isAuthenticating } = useAuthLogin({
    onError,
    onSuccess: onNextStep,
  });

  const authForm = useForm({
    initialValues: {
      accessKey: "MIAU8003",
    },
  });

  return (
    <form
      onSubmit={authForm.onSubmit((values) => {
        authTeacher(values);
      })}
    >
      <Stack w={400} m="auto">
        {disableAccess && (
          <Notification
            title="Aviso"
            color="yellow"
            icon={<IconHourglass size={18} />}
            withCloseButton={false}
          >
            Os planetas estão sendo sincronizados. Aguarde finalizar para
            acessar o sistema.
          </Notification>
        )}
        <PasswordInput
          {...authForm.getInputProps("accessKey")}
          label="Código de acesso"
          placeholder="Digite o código de acesso"
          styles={{
            label: { color: "#fff", marginBottom: 6 },
          }}
          disabled={disableAccess}
        />
        <Button
          type="submit"
          disabled={disableAccess || !authForm.values.accessKey}
          fullWidth
          loading={isAuthenticating}
        >
          Entrar
        </Button>
      </Stack>
    </form>
  );
}
