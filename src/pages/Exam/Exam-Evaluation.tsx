import { BackgroundImage, Box, Center, Container, Flex, Loader } from "@mantine/core";
import bg from '~/assets/bgs/bg-exam-evaluation.jpg'

export function ExamEvaluationPage() {

    // TODO: Efetuar request POST /student/{id}/exam-evaluation
    const isLoading  = true;

    // TODO: Após efetuar request, redirecionar para a tela /dashboard

    return (
        <BackgroundImage
            src={bg}
            maw={1440}
            mih="100vh"
            mx="auto"
            p={0}
            styles={{ main: { padding: 0, position: "relative" } }}
        >
            <Center h="100vh">
                <Box style={{ color: '#fff', padding: '0px 0', fontSize: 20 }}>
                    <Container>
                        <Flex direction="column" align="center" justify="center">
                        <span>Você acabou de concluir a prova.</span>
                        <span style={{paddingBottom: 15 }}>Aguarde enquanto o sistema calcula as suas tarefas.</span>
                        {isLoading && <Loader />}
                        </Flex>
                    </Container>
                </Box>
            </Center>
        </BackgroundImage>
    )
}