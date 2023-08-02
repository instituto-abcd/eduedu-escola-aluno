import { BackgroundImage, Center, Image } from "@mantine/core";
import { Outlet } from "react-router-dom";
import bgProva from "~/assets/bgs/bg_prova2.png";
import lousa from "~/assets/bgs/lousa.svg";
import carteiras from "~/assets/bgs/carteiras.png";

export function ExamLayout() {
  return (
    <BackgroundImage
      src={bgProva}
      maw={1440}
      mih="100vh"
      mx="auto"
      p={0}
      styles={{ main: { padding: 0, position: "relative" } }}
    >
      <Center>
        <BackgroundImage
          src={lousa}
          w={1140}
          h={846}
          mt={10}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Center h="80%" mt={55}>
            <Outlet />
          </Center>
        </BackgroundImage>
      </Center>
      <Image
        src={carteiras}
        w="100%"
        maw={1440}
        mah={1080}
        h="auto"
        style={{
          position: "absolute",
          insetInline: 0,
          bottom: 0,
          zIndex: 555,
          marginInline: "auto",
          pointerEvents: "none",
        }}
      />
    </BackgroundImage>
  );
}
