import { createStyles } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import video_360_800 from "~/assets/video/intro_360x800.mp4";
import video_1024_640 from "~/assets/video/intro_1024x640.mp4";
import video_1024_768 from "~/assets/video/intro_1024x768.mp4";
import video_768_1024 from "~/assets/video/intro_768x1024.mp4";
import { MEDIA_QUERY } from "~/constants/dimensions";
import { PATH } from "~/constants/path";
import { IconPlayerPlayFilled } from "@tabler/icons-react";

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
    minHeight: "100vh",
    maxHeight: "100%",
    objectPosition: "center",
    objectFit: "cover",
  },

  icon: {
    cursor: "pointer",
    opacity: 0.75,
    position: "absolute",
    inset: 0,
    margin: "auto",
    color: "white",
  },
});

const videosDict: Record<keyof typeof MEDIA_QUERY, string> = {
  MOBILE: video_360_800,
  TABLET_VERT: video_768_1024,
  TABLET_HORZ: video_1024_640,
  DESKTOP: video_1024_768,
};

export function IntroPage() {
  const navigate = useNavigate();
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={classes.container}>
      <video
        ref={videoRef}
        className={classes.video}
        src={videosDict[dimension]}
        autoPlay={false}
        onEnded={() => navigate(PATH.EXAM)}
        onPlay={() => setIsPlaying(true)}
      />
      <IconPlayerPlayFilled
        size={100}
        className={classes.icon}
        onClick={() => videoRef.current?.play()}
        style={{ display: isPlaying ? "none" : "block" }}
      />
    </div>
  );
}
