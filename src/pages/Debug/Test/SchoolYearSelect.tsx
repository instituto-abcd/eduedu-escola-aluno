import { Divider, Group, NumberInput, Radio } from "@mantine/core";
import { useState } from "react";

import wideImg from "~/assets/school-year-select/wide.jpg";
import tabletVerticalImg from "~/assets/school-year-select/tablet-vertical.jpg";
import { cx } from "~/utils/cx";
import styles from "./SchoolYearSelect.module.css";

type ScreenMode = "wide" | "tablet-vertical";

const dimensions: Record<ScreenMode, { w: number; h: number }> = {
  wide: { w: 1024, h: 640 },
  "tablet-vertical": { w: 768, h: 1024 },
};

const screenModeImages: Record<ScreenMode, string> = {
  "tablet-vertical": tabletVerticalImg,
  wide: wideImg,
};

export function SchoolYearSelect() {
  const [screenMode, setScreenMode] = useState<ScreenMode>("wide");
  const [qty, setQty] = useState<number>(2);

  const containerStyle = {
    "--container-width": `${dimensions[screenMode].w}px`,
    "--container-height": `${dimensions[screenMode].h}px`,
    "--item-max-width": `${dimensions[screenMode].w / qty}px`,
    "--item-max-height": `${dimensions[screenMode].h / qty}px`,
  } as React.CSSProperties;

  return (
    <section className={styles.section}>
      <span className="text-5xl">
        Tamanho de tela: {dimensions[screenMode].w}x{dimensions[screenMode].h}
      </span>

      {/* @ts-expect-error - gap is v7, spacing is v6 */}
      <Group gap={60}>
        <ScreenModeSelect value={screenMode} onChange={setScreenMode} />
        <Divider orientation="vertical" h={80} />
        <NumberInput
          value={qty}
          onChange={(v) => Number.isInteger(v) && setQty(v as number)}
          label="Quantidade de blocos"
        />
      </Group>
      <div
        className={cx(
          styles.baseContainer,
          screenMode === "wide" ? styles.wide : styles.tabletVertical
        )}
        style={containerStyle}
      >
        {Array(qty)
          .fill(0)
          .map((_, inx) => (
            <img key={inx} src={screenModeImages[screenMode]} alt="" />
          ))}
      </div>
    </section>
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
          <Radio key={mode} value={mode} label={screenModes[mode as ScreenMode]} />
        ))}
      </div>
    </Radio.Group>
  );
}
