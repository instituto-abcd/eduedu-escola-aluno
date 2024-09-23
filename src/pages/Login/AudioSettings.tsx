import { createStyles } from "@mantine/core";
import video_360_800 from "~/assets/video/setup_fone_360x800.mp4";
import video_1024_640 from "~/assets/video/setup_fone_1024x640.mp4";
import video_1024_768 from "~/assets/video/setup_fone_1024x768.mp4";
import video_798_1024 from "~/assets/video/setup_fone_798x1024.mp4";
import { MEDIA_QUERY } from "~/constants/dimensions";
import { useEffect, useState } from "react";
import { Sprite } from "~/components/vector/Sprite";
import { Header } from "./components/Header";

const useStyles = createStyles({
  container: {
    width: "100vw",
    height: "100vh",
    overflow: "clip",
    position: "relative",
  },

  video: {
    minWidth: "100%",
    height: "auto",
    maxHeight: "100%",
    minHeight: "100vh",
    objectPosition: "bottom",
    objectFit: "cover",
    position: "absolute",
    bottom: 0,
  },

  icons: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    top: 0,
    insetInline: 0,
    marginInline: "auto",
    zIndex: 55,
    height: 100,
    paddingInline: 40,
    marginTop: 60,

    svg: {
      width: "auto",
      height: "100%",
    },
  },
});

type Props = { onNext: () => void; onBack: () => void };

const videosDict: Record<keyof typeof MEDIA_QUERY, string> = {
  MOBILE: video_360_800,
  TABLET_VERT: video_798_1024,
  TABLET_HORZ: video_1024_640,
  DESKTOP: video_1024_768,
};

export function AudioSettings({ onNext, onBack }: Props) {
  const [dimension, setDimension] =
    useState<keyof typeof MEDIA_QUERY>("MOBILE");

  useEffect(() => {
    const update = () => {
      setDimension(
        window.innerWidth < 768
          ? "MOBILE"
          : window.innerWidth < 1024
            ? "TABLET_VERT"
            : "DESKTOP",
      );
    };

    update();

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Header title="Escute o vídeo e siga a instrução" onClose={onBack} />

      <div className={classes.icons}>
        <Sprite id={0} />
        <Sprite id={7} onClick={onNext} />
        <Sprite id={8} />
      </div>

      <video
        className={classes.video}
        src={videosDict[dimension]}
        autoPlay
        loop
      />
    </div>
  );
}
