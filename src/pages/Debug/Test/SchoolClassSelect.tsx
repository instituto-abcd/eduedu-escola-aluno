import {
  Container,
  Divider,
  Group,
  Radio,
  Title,
  createStyles,
  Textarea,
} from "@mantine/core";
import { useState } from "react";
import bgSelectOption from "~/assets/bg-select-option.png";
import { ClassIcons } from "~/components/icons/ClassIcons";

const useStyles = createStyles(
  (_, opt: { mode: ScreenMode; nItems: number }) => ({
    baseContainer: {
      width: dimensions[opt.mode].w,
      height: dimensions[opt.mode].h,
      outline: "8px solid red",
      position: "relative",
      overflow: "clip",
    },

    title: {
      position: "absolute",
      textAlign: "center",
      top: 45,
      insetInline: 0,
      zIndex: 99,
      pointerEvents: "none",
      userSelect: "none",
    },

    wide: {
      display: "flex",
      flexWrap: "nowrap",
    },

    "tablet-vertical": {
      display: "flex",
      flexDirection: "column",
    },
  })
);

const dimensions: Record<ScreenMode, { w: number; h: number }> = {
  wide: { w: 1024, h: 640 },
  "tablet-vertical": { w: 768, h: 1024 },
};

export function SchoolClassSelect() {
  const [screenMode, setSm] = useState<ScreenMode>("wide");
  const [classList, setCl] = useState(
    ["Infantil", "1ºA", "1ºB", "nomegigantesco", "1ºD", "1ºE"].join("\n")
  );

  const { classes, cx } = useStyles({ mode: screenMode, nItems: 2 });

  return (
    <Container py={24}>
      <div className="flex flex-col">
        <Title>
          Tamanho de tela: {dimensions[screenMode].w}x{dimensions[screenMode].h}
        </Title>

        <Group align="flex-start">
          <ClassListEditor
            value={classList}
            onChange={setCl}
          />
          <ScreenModeSelect
            value={screenMode}
            onChange={setSm}
          />
        </Group>

        <Divider
          my="xl"
          variant="dashed"
        />
        {classes[screenMode] !== undefined && (
          <div className={cx([classes.baseContainer, classes[screenMode]])}>
            {screenMode === "wide" && (
              <span className="text-white font-bold text-3xl absolute top-11 inset-x-0 z-[99] pointer-events-none select-none text-center">
                Qual a sua sala?
              </span>
            )}
            {classList.split("\n").map((cn) => (
              <OptionBlock
                orientation={screenMode === "wide" ? "horizontal" : "vertical"}
                text={cn}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

type OptionBlockProps = {
  orientation: "vertical" | "horizontal";
  text: string;
  withDebugFrame?: boolean;
};

const MAX_ITEMS = 6;
const HORZ_W = dimensions["wide"].w / MAX_ITEMS; // LARGURA quando o layout for em COLUNAS
const VERT_H = dimensions["tablet-vertical"].h / MAX_ITEMS; // ALTURA quando o layout for em PILHA

/* -- INUTILIZADO
  const HORZ_H = dimensions["wide"].h / MAX_ITEMS;
  const VERT_W = dimensions["tablet-vertical"].w / MAX_ITEMS;
*/

const useOptionStyles = createStyles(
  (_, { orientation }: { orientation: "vertical" | "horizontal" }) => ({
    container: {
      position: "relative",
      minWidth: orientation === "vertical" ? "auto" : HORZ_W,
      minHeight: orientation === "vertical" ? VERT_H : "auto",
      overflow: "clip",
      filter: "grayscale(1)",
      transition: "filter 100ms ease-in-out",
      ":hover": {
        filter: "none",
      },

      img: {
        objectFit: "cover",
        objectPosition: "center",
        minWidth: orientation === "vertical" ? "100%" : "auto",
        height: orientation === "vertical" ? VERT_H : "100%",
      },
    },

    content: {
      position: "absolute",
      zIndex: 5,
      width: orientation === "horizontal" ? "80%" : "100%",
      height: orientation === "vertical" ? "80%" : "100%",
      inset: 0,
      margin: "auto",
      marginRight: orientation === "vertical" ? 0 : "auto",
      display: "flex",
      flexDirection: orientation === "horizontal" ? "column" : "row",
      justifyContent: orientation === "horizontal" ? "center" : "flex-end",
      alignItems: "center",
      gap: 50,
      containerType: "inline-size",
      paddingRight: orientation === "vertical" ? "1rem" : 0,

      svg: {
        width: orientation === "horizontal" ? "100%" : "auto",
        height: orientation === "vertical" ? "100%" : "auto",
      },
    },

    text: {
      fontSize:
        orientation === "horizontal" ? "min(30cqw, 70px)" : "min(100px, 8cqh)",
      textAlign: "center",
      lineHeight: 1.1,
      wordBreak: "break-all",
      minWidth: orientation === "vertical" ? "50%" : "auto",
      maxWidth: orientation === "vertical" ? "60%" : "auto",
    },
  })
);

function OptionBlock({ orientation, text }: OptionBlockProps) {
  const { classes } = useOptionStyles({ orientation });

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <span className={`${classes.text} text-[#F6A313] font-bold`}>
          {text}
        </span>
        <ClassIcons id={0} />
      </div>
      <img src={bgSelectOption} />
    </div>
  );
}

function ScreenModeSelect({
  value,
  onChange,
}: {
  value: ScreenMode;
  onChange: (mode: ScreenMode) => void;
}) {
  const screenModes: Record<ScreenMode, string> = {
    wide: "Widescreen",
    "tablet-vertical": "Tablet vertical",
  };

  return (
    <Radio.Group
      value={value}
      onChange={onChange}
      label="Modo de tela"
    >
      <div className="flex flex-col gap-2">
        {Object.keys(screenModes).map((mode) => (
          <Radio
            value={mode}
            label={screenModes[mode as ScreenMode]}
          />
        ))}
      </div>
    </Radio.Group>
  );
}

type ScreenMode = "wide" | "tablet-vertical";

function ClassListEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <Textarea
      value={value}
      label="Lista de turmas"
      onChange={(e) => onChange(e.currentTarget.value)}
      minRows={6}
    />
  );
}
