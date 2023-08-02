import { useAuthLogin } from "~/api/auth"
import { useForm, zodResolver } from "@mantine/form"
import { z } from "zod"
import { errorNotification } from "~/utils/errorNotification"
import { Stack, Button, TextInput } from "@mantine/core"

type componentsProps = {
    sendToFather: any;
}
export function Step01({ sendToFather }: componentsProps) {

    const { mutate: login } = useAuthLogin({
        onError: (error) => {
            errorNotification(
                "Erro durante a operação",
                `${error.message} (cod: ${error.code})`
            )
        },
        onSuccess: () => { sendToFather(2) }
    })
    const formValidation = z.object({
        accessKey: z.string().min(1, "Insira um código de acesso")
    })
    const form = useForm({
        initialValues: {
            accessKey: 'EDUEDU029'
        },
        validate: zodResolver(formValidation)
    })

    return (
        <Stack w={400} m="auto">
            <form onSubmit={form.onSubmit((values) => { login(values) })}>
                <TextInput
                    {...form.getInputProps("accessKey")}
                    label="Código de acesso"
                    placeholder="Digite o código de acesso"
                    styles={{
                        label: { color: "#fff", marginBottom: 6 },
                    }}
                />
                <Button
                    type="submit"
                    disabled={!form.isValid()}
                    fullWidth
                    mt={20}
                >
                    Entrar
                </Button>
            </form>
        </Stack>
    )
}