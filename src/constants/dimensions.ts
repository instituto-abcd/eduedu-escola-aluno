// let coefficient = window.innerHeight > window.outerHeight ? 1.64 : 1.55

// console.log(window.innerHeight);
// console.log(window.outerHeight);
export const currentHeight = Math.max(window.innerHeight, window.outerHeight);

let coefficient = 1.55;
if (currentHeight <= 900) {
  coefficient = 1.55;
}

/* Board */
export const screenWidth = innerHeight * coefficient;
export const lousaWidth = (screenWidth * 60.7) / 100;
export const lousaHeight = (lousaWidth * 74.5) / 100;

// Content stuff:
export const lousaPaddingTop = (lousaHeight * 3) / 100;

// Titles/Texts
export const textoExtraBig = "3rem";
export const textoMedium = "1.5rem";

// Scrollarea:
export const scrollAreaHeight = (lousaHeight * 80) / 100;
export const scrollAreaWidth = (lousaWidth * 50) / 100;

/* Helper */
export const boardW = (value: number) => {
  const _value = Number(
    value > 99 ? "0." + value.toString() : "0.0" + value.toString(),
  );
  return lousaWidth * _value;
};

// Breakpoints
export const BREAKPOINT = {
  TABLET_VERT: 768,
  TABLET_HORZ: 1024,
  DESKTOP: 1440,
  TV: 1920,
} as const;

export const MEDIA_QUERY = {
  MOBILE: "(max-width: 360px)",
  TABLET_VERT: "(min-width: 768px)",
  TABLET_HORZ: "(min-width: 1024px)",
  DESKTOP: "(min-width: 1024px)",
} as const;

export type MediaQueryKey = keyof typeof MEDIA_QUERY;
