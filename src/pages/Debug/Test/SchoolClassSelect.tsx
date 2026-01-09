import {
  Container,
  Divider,
  Group,
  Radio,
  Title,
  Textarea,
} from "@mantine/core";
import { useState } from "react";
import bgSelectOption from "~/assets/bg-select-option.png";
import { ClassIcons } from "~/components/icons/ClassIcons";
import { cx } from "~/utils/cx";
import styles from "./SchoolClassSelect.module.css";

type ScreenMode = "wide" | "tablet-vertical";

const dimensions: Record<ScreenMode, { w: number; h: number }> = {
  wide: { w: 1024, h: 640 },
  "tablet-vertical": { w: 768, h: 1024 },
};

const MAX_ITEMS = 6;
const HORZ_W = dimensions["wide"].w / MAX_ITEMS;
const VERT_H = dimensions["tablet-vertical"].h / MAX_ITEMS;

export function SchoolClassSelect() {
  const [screenMode, setSm] = useState<ScreenMode>("wide");
  const [classList, setCl] = useState(
    ["Infantil", "1ºA", "1ºB", "nomegigantesco", "1ºD", "1ºE"].join("\n")
  );

  const containerStyle = {
    "--container-width": `${dimensions[screenMode].w}px`,
    "--container-height": `${dimensions[screenMode].h}px`,
  } as React.CSSProperties;

  return (
    <Container py={24}>
      <div className="flex flex-col">
        <Title>
          Tamanho de tela: {dimensions[screenMode].w}x{dimensions[screenMode].h}
        </Title>

        <Group align="flex-start">
          <ClassListEditor value={classList} onChange={setCl} />
          <ScreenModeSelect value={screenMode} onChange={setSm} />
        </Group>

        <Divider my="xl" variant="dashed" />
        <div
          className={cx(
            styles.baseContainer,
            screenMode === "wide" ? styles.wide : styles.tabletVertical
          )}
          style={containerStyle}
        >
          {screenMode === "wide" && (
            <span className="text-white font-bold text-3xl absolute top-11 inset-x-0 z-[99] pointer-events-none select-none text-center">
              Qual a sua sala?
            </span>
          )}
          {classList.split("\n").map((cn, i) => (
            <OptionBlock
              key={i}
              orientation={screenMode === "wide" ? "horizontal" : "vertical"}
              text={cn}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}

type OptionBlockProps = {
  orientation: "vertical" | "horizontal";
  text: string;
  withDebugFrame?: boolean;
};

function OptionBlock({ orientation, text }: OptionBlockProps) {
  const isHorizontal = orientation === "horizontal";
  const isVertical = orientation === "vertical";

  const containerStyle = {
    "--opt-min-width": isVertical ? "auto" : `${HORZ_W}px`,
    "--opt-min-height": isVertical ? `${VERT_H}px` : "auto",
    "--opt-img-min-width": isVertical ? "100%" : "auto",
    "--opt-img-height": isVertical ? `${VERT_H}px` : "100%",
  } as React.CSSProperties;

  return (
    <div className={styles.optionContainer} style={containerStyle}>
      <div
        className={cx(
          styles.optionContent,
          isHorizontal ? styles.optionContentHorizontal : styles.optionContentVertical
        )}
      >
        <span
          className={cx(
            styles.optionText,
            "text-[#F6A313] font-bold",
            isHorizontal ? styles.optionTextHorizontal : styles.optionTextVertical
          )}
        >
          {text}
        </span>
        <ClassIcons id={0} />
      </div>
      <img src={bgSelectOption} alt="" />
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
    <Radio.Group value={value} onChange={onChange} label="Modo de tela">
      <div className="flex flex-col gap-2">
        {Object.keys(screenModes).map((mode) => (
          <Radio
            key={mode}
            value={mode}
            label={screenModes[mode as ScreenMode]}
          />
        ))}
      </div>
    </Radio.Group>
  );
}

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
