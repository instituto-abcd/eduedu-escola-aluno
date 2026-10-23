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
  rewind: () => void;
  forward: () => void;
  duration: () => number;
  seek: (time?: number) => number;
  playing: () => boolean;
  state: () => "unloaded" | "loading" | "loaded";
  load: () => void;
  onLoad: (callback: () => void) => void;
  onceLoad: (callback: () => void) => void;
  onLoadError: (callback: () => void) => void;
  onPlayError: (callback: () => void) => void;
  onEnd: (callback: () => void) => void;
  onPlay: (callback: () => void) => void;
  onStop: (callback: () => void) => void;
  onPause: (callback: () => void) => void;
  onSeek: (callback: () => void) => void;
  off: (event: string, callback?: () => void) => void;

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
    this.destroy = () => {
      if (howl.playing()) {
        howl.stop();
      }
      howl.unload();
    };
    this.rewind = (time = 15) => {
      howl.seek(howl.duration() - time);
    };
    this.forward = (time = 15) => {
      howl.seek(howl.duration() + time);
    };
    this.duration = () => {
      return howl.duration();
    };
    this.seek = (time?: number): number => {
      return howl.seek(time);
    };
    this.playing = () => {
      return howl.playing();
    };
    this.state = () => {
      return howl.state();
    };
    this.load = () => {
      howl.load();
    };
    this.onLoad = (callback: () => void) => {
      howl.on("load", callback);
    };
    this.onceLoad = (callback: () => void) => {
      howl.once("load", callback);
    };
    // Registra o callback direto (sem embrulhar) para o `off` conseguir removê-lo.
    this.onLoadError = (callback: () => void) => {
      howl.on("loaderror", callback);
    };
    this.onPlayError = (callback: () => void) => {
      howl.on("playerror", callback);
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
    this.onPause = (callback: () => void) => {
      howl.on("pause", callback);
    };
    this.onSeek = (callback: () => void) => {
      howl.on("seek", callback);
    };
    this.off = (event: string, callback?: () => void) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
      howl.off(event, callback as any);
    };
  }
}
