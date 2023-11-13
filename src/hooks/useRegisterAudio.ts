import { useEffect } from "react";
import { Howler } from "howler";

export function useRegisterAudio() {
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
