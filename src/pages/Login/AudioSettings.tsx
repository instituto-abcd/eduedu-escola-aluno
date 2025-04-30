import { createStyles } from "@mantine/core";
import video_360_800 from "~/assets/video/setup_fone_360x800.mp4";
import video_1024_640 from "~/assets/video/setup_fone_1024x640.mp4";
import video_1024_768 from "~/assets/video/setup_fone_1024x768.mp4";
import video_798_1024 from "~/assets/video/setup_fone_798x1024.mp4";
import { MEDIA_QUERY } from "~/constants/dimensions";
import { useEffect, useState } from "react";
import { Sprite } from "~/components/vector/Sprite";
import { Header } from "./components/Header";
import bg from "~/assets/bg-planet-track.png";

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
          : "DESKTOP"
      );
    };

    update();

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="w-screen min-h-screen flex flex-col items-center justify-between pb-10"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="w-full flex flex-col items-center">
        <Header
          title="Escute o vídeo e siga a instrução"
          onClose={onBack}
        />

        <div className="flex justify-between items-center w-full mx-auto z-[55] h-[100px] px-[40px] my-[30px] [&_svg]:w-auto [&_svg]:h-full">
          <Sprite id={0} />
          <Sprite
            id={7}
            onClick={onNext}
          />
          <Sprite id={8} />
        </div>
      </div>
      <video
        className="w-[70%]"
        src={videosDict[dimension]}
        autoPlay
        loop
      />
    </div>
  );
}
