import { BackgroundImage, Center, Container, Loader } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useSubmitExamEvaluation } from "~/api/student";
import bg from "~/assets/bgs/bg-exam-evaluation.jpg";
import { PATH } from "~/constants/path";
import Lottie from "react-lottie";
import loadingLottie from "~/assets/lotties/lottie_loading_anim.json";

export function ExamEvaluationPage() {
  const navigate = useNavigate();

  useSubmitExamEvaluation({
    onSuccess: () => navigate(PATH.DASHBOARD),
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <BackgroundImage
      src={bg}
      h="100vh"
    >
      <Center>
        <div style={{ color: "#fff", padding: "0px 0", fontSize: 20 }}>
          <Container>
            <Lottie
              options={defaultOptions}
              height={400}
              width={400}
            />
            <div className="flex flex-col items-center justify-center">
              <span>Você acabou de concluir a prova.</span>
              <span style={{ paddingBottom: 15 }}>
                Aguarde enquanto o sistema calcula as suas tarefas.
              </span>
              {true && <Loader />}
            </div>
          </Container>
        </div>
      </Center>
    </BackgroundImage>
  );
}
