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
      className="grid grid-rows-[auto_1fr] h-screen max-w-screen max-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Container superior com header e sprites */}
      <div className="flex flex-col justify-between">
        <Header
          title="Escute o vídeo e siga a instrução"
          onClose={onBack}
        />
        
        <div className="flex justify-between items-center w-full mx-auto z-[55] 
                        h-[80px] px-[40px] my-[10px] [&_svg]:w-auto [&_svg]:h-full">
          <Sprite id={0} />
          <Sprite
            id={7}
            onClick={onNext}
          />
          <Sprite id={8} />
        </div>
      </div>

      <div className="grid min-h-0">
        <video
          className="w-full h-full object-contain max-h-[calc(100vh-160px)]"
          src={videosDict[dimension]}
          autoPlay
          loop
        />
      </div>
    </div>
  );
}
