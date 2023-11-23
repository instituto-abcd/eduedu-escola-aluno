import { Howler } from "howler";
import { useEffect } from "react";

type useRegisterAudioProps = {
  debugger?: boolean;
};

export function useRegisterAudio(_?: useRegisterAudioProps) {
  function registerApi() {
    void Howler.ctx.resume();

    window.removeEventListener("click", registerApi);
  }

  useEffect(() => {
    window.addEventListener("DOMContentLoaded", (e) => {
      e.target?.addEventListener("click", registerApi);
    });

    return () => {
      window.removeEventListener("click", registerApi);
    };
  }, []);
}
