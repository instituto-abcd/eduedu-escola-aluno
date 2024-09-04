import { BackgroundImage, Loader } from "@mantine/core";
import bg from "~/assets/bg-select-option.png";

export function LoginLoader() {
  return (
    <BackgroundImage
      src={bg}
      style={{
        width: "100vw",
        height: "100vh",
        objectFit: "cover",
        display: "grid",
        placeContent: "center",
      }}
    >
      <Loader size={100} color="white" />
    </BackgroundImage>
  );
}
