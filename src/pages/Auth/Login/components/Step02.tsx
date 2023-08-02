import { Select, Stack, Button } from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form"
import { z } from "zod"

type componentsProps = {
    schoolClasses: Array<[]>;
    sendToFather: any;
}
export function Step02({ schoolClasses, sendToFather }: componentsProps) {

    const formValidation = z.object({
        id: z.string().min(1, "Selecione uma turma")
    })
    const form = useForm({
        initialValues: {
            id: ''
        },
        validate: zodResolver(formValidation)
    })

    return (
        <Stack w={400} m="auto">
            <form onSubmit={form.onSubmit((schoolClass) => { sendToFather(3, schoolClass.id) })}>
                <Select
                    {...form.getInputProps('id')}
                    label="Turma"
                    placeholder="Selecione"
                    data={schoolClasses}
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