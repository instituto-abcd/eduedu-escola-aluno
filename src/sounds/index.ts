import soundbyte_feedbackNegative from "~/assets/audio/feedback_error.mp3";
import soundbyte_feedbackPositive from "~/assets/audio/feedback_button_next.mp3";
import { Howl } from "howler";

type CreateSound = {
  src: string[];
  autoPlay?: boolean;
  format?: string;
};

export class AudioInterface {
  static createSound(options: CreateSound): Sound {
    const howl = new Howl({
      ...options,
      src: options.src,
      autoplay: options.autoPlay,
      html5: true,
      format: [options.format ?? "mp3"],
      loop: false,
    });

    return new Sound(howl);
  }

  static readonly feedback = {
    positive: new Howl({
      src: [soundbyte_feedbackPositive],
    }),
    negative: new Howl({
      src: [soundbyte_feedbackNegative],
    }),
  };
}

class Sound {
  play: () => void;
  pause: () => void;
  stop: () => void;
  destroy: () => void;
  onLoad: (callback: () => void) => void;
  onLoadError: (callback: (err: unknown) => void) => void;
  onEnd: (callback: () => void) => void;
  onPlay: (callback: () => void) => void;
  onStop: (callback: () => void) => void;

  constructor(howl: Howl) {
    this.play = () => {
      howl.play();
    };
    this.pause = () => {
      howl.pause();
    };
    this.stop = () => {
      howl.stop();
    };
    this.onLoad = (callback: () => void) => {
      howl.on("load", callback);
    };
    this.onLoadError = (callback: (err: unknown) => void) => {
      howl.on("loaderror", (_, err) => callback(err));
    };
    this.onEnd = (callback: () => void) => {
      howl.on("end", callback);
    };
    this.onPlay = (callback: () => void) => {
      howl.on("play", callback);
    };
    this.onStop = (callback: () => void) => {
      howl.on("stop", callback);
    };
    this.destroy = () => {
      howl.unload();
    };
  }
}
