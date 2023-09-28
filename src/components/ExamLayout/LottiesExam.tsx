import { screenWidth } from "~/constants/dimensions";
import Lottie from "react-lottie";
import hologramaEduEdu from "~/assets/lotties/exam/holograma_eduedu.json";
import livroAberto from "~/assets/lotties/exam/livro_aberto.json";
import livros from "~/assets/lotties/exam/livros.json";
import luzRodape from "~/assets/lotties/exam/luz_rodape.json";
import luzMesa from "~/assets/lotties/exam/luz_mesa.json";
import vaso1 from "~/assets/lotties/exam/vaso_1.json";
import vaso2 from "~/assets/lotties/exam/vaso_2.json";
import { Box, createStyles } from "@mantine/core";

const useStyles = createStyles({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: screenWidth,
    height: 190,
    marginInline: "auto",
    marginTop: "auto",
    pointerEvents: "none",
  },
});

export function LottiesExam() {
  const { classes } = useStyles();

  return (
    <Box className={classes.wrapper}>
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
            left: "-8%",
            bottom: 18,
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
            bottom: 0,
            width: "140px",
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
            bottom: 2,
            width: "100px",
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
            width: "80px",
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
            right: "-8%",
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
          bottom: 42,
          zIndex: 2,
          width: "100%",
          height: "auto",
        }}
      />
    </Box>
  );
}
