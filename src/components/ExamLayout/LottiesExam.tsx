// Lotties:
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
    <Box mx="auto" h={290} maw={1200} style={{ position: 'relative', background: '#00ffff70' }}>
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
          position: 'absolute',
          left: '35%',
          bottom: '0%',
          width: '400px',
          height: 'auto'
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
          position: 'absolute',
          left: '33%',
          bottom: '0%',
          width: '400px',
          height: 'auto'
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
          position: 'absolute',
          right: '0%',
          bottom: '-10%',
          width: '400px',
          height: 'auto'
        }}
      />
      {/* <Lottie
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
            insetInline: 0,
            bottom: 0,
            zIndex: 555,
            marginInline: "auto",
            pointerEvents: "none",
          }}
          height="auto"
          width={screenWidth}
        /> */}
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
          position: 'absolute',
          right: '2%',
          bottom: '-15%',
          width: '200px',
          height: 'auto'
        }}
      />
      {/* <Lottie
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
            insetInline: 0,
            bottom: 0,
            zIndex: 500,
            marginInline: "auto",
            pointerEvents: "none",
          }}
          height="auto"
          width={screenWidth}
        /> */}
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
          position: 'absolute',
          left: '10%',
          bottom: '0',
          width: '200px',
          height: 'auto'
        }}
      />
    </Box>
  )
}