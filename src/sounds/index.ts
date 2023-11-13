import soundbyte_feedbackNegative from "~/assets/audio/feedback_error.mp3";
import soundbyte_feedbackPositive from "~/assets/audio/feedback_button_next.mp3";
import { Howl } from "howler";

export const feedbackPositive = new Howl({
  src: [soundbyte_feedbackPositive],
});

export const feedbackNegative = new Howl({
  src: [soundbyte_feedbackNegative],

});
