import { screenWidth } from "~/constants/dimensions";
import Lottie from "react-lottie";
import hologramaEduEdu from "~/assets/lotties/exam/holograma_eduedu.json";
import livroAberto from "~/assets/lotties/exam/livro_aberto.json";
import livros from "~/assets/lotties/exam/livros.json";
import luzRodape from "~/assets/lotties/exam/luz_rodape.json";
import luzMesa from "~/assets/lotties/exam/luz_mesa.json";
import vaso1 from "~/assets/lotties/exam/vaso_1.json";
import vaso2 from "~/assets/lotties/exam/vaso_2.json";
import { Box } from "@mantine/core";

export function LottiesExam() {
  return (
    <Box mx="auto" maw={screenWidth} h={190} style={{ position: "relative" }}>
      <Box
        my={0}
        p={0}
        mx="auto"
        h={190}
        maw={1080}
        style={{ position: "relative" }}
      >
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: vaso1,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          style={{
            position: "absolute",
            left: "2%",
            bottom: "10%",
            width: "200px",
            height: "auto",
            zIndex: 3,
          }}
        />
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: livroAberto,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          style={{
            position: "absolute",
            left: "34%",
            bottom: "2%",
            width: "180px",
            height: "auto",
            zIndex: 3,
          }}
        />
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: livros,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          style={{
            position: "absolute",
            right: "34%",
            bottom: "6%",
            width: "110px",
            height: "auto",
            zIndex: 3,
          }}
        />
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: hologramaEduEdu,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          style={{
            position: "absolute",
            right: "27%",
            bottom: "12%",
            width: "90px",
            height: "auto",
            zIndex: 3,
          }}
        />
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: vaso2,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          style={{
            position: "absolute",
            right: "2%",
            bottom: "5%",
            width: "200px",
            height: "auto",
            zIndex: 3,
          }}
        />
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: luzMesa,
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
            },
          }}
          style={{
            position: "absolute",
            left: "20%",
            bottom: "-1%",
            width: "100px",
            height: "auto",
            zIndex: 3,
          }}
        />
      </Box>
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: luzRodape,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        style={{
          position: "absolute",
          bottom: "18%",
          zIndex: 2,
          width: "100%",
          height: "auto",
        }}
      />
    </Box>
  );
}
