import {
  createStyles,
  Divider,
  Group,
  NumberInput,
  Radio,
} from "@mantine/core";
import { useState } from "react";

import wideImg from "~/assets/school-year-select/wide.jpg";
import tabletVerticalImg from "~/assets/school-year-select/tablet-vertical.jpg";

const dimensions: Record<ScreenMode, { w: number; h: number }> = {
  wide: { w: 1024, h: 640 },
  "tablet-vertical": { w: 768, h: 1024 },
};

const useStyles = createStyles(
  (_, opt: { mode: ScreenMode; nItems: number }) => ({
    section: {
      width: "100%",
      maxWidth: "100vw",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "2rem",
      paddingBlock: 40,
    },

    baseContainer: {
      width: dimensions[opt.mode].w,
      height: dimensions[opt.mode].h,
      outline: "8px solid red",
    },

    wide: {
      display: "flex",
      flexWrap: "nowrap",

      img: {
        maxWidth: `calc(${dimensions[opt.mode].w}px / ${opt.nItems})`,
        objectFit: "cover",
        backgroundPosition: "center",
        filter: "grayscale(1)",
        ":hover": {
          filter: "none",
        },
      },
    },

    "tablet-vertical": {
      display: "flex",
      flexDirection: "column",

      img: {
        maxHeight: `calc(${dimensions[opt.mode].h}px / ${opt.nItems})`,
        objectFit: "cover",
        backgroundPosition: "center",
        filter: "grayscale(1)",
        ":hover": {
          filter: "none",
        },
      },
    },
  })
);

type ScreenMode = "wide" | "tablet-vertical";

const screenModeImages: Record<ScreenMode, string> = {
  "tablet-vertical": tabletVerticalImg,
  wide: wideImg,
};

export function SchoolYearSelect() {
  const [screenMode, setScreenMode] = useState<ScreenMode>("wide");
  const [qty, setQty] = useState<number>(2);
  const { classes, cx } = useStyles({ mode: screenMode, nItems: qty });

  return (
    <section className={classes.section}>
      <span className="text-5xl">
        Tamanho de tela: {dimensions[screenMode].w}x{dimensions[screenMode].h}
      </span>

      <Group spacing={60}>
        <ScreenModeSelect
          value={screenMode}
          onChange={setScreenMode}
        />
        <Divider
          orientation="vertical"
          h={80}
        />
        <NumberInput
          value={qty}
          onChange={(v) => Number.isInteger(v) && setQty(v as number)}
          label="Quantidade de blocos"
        />
      </Group>
      {classes[screenMode] !== undefined && (
        <div className={cx([classes.baseContainer, classes[screenMode]])}>
          {Array(qty)
            .fill(0)
            .map((_, inx) => (
              <img
                key={inx}
                src={screenModeImages[screenMode]}
                alt=""
              />
            ))}
        </div>
      )}
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
