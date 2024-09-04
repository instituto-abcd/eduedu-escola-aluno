import { createStyles } from "@mantine/core";
import { MEDIA_QUERY } from "~/constants/dimensions";

const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const useStyles = createStyles({
  letterGrid: {
    width: "100%",
    maxWidth: 1300,
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    placeItems: "center",
    alignItems: "center",
    rowGap: 20,

    span: {
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 30,
      lineHeight: 1,
      color: "#fff",
      display: "grid",
      placeItems: "center",
      margin: 0,
      backgroundColor: "#3B93C4",
      width: 55,
      height: 55,
      borderRadius: 55,

      "&:last-of-type": {
        gridColumn: "span 5",
      },
    },

    [`@media ${MEDIA_QUERY.TABLET_VERT}`]: {
      columnGap: 28,
      gridTemplateColumns: `repeat(${letters.length / 2}, 1fr)`,
      gridTemplateRows: "repeat(3, 1fr)",
      span: {
        "&:last-of-type": {
          gridColumn: "initial",
        },
      },
    },
  },

  selected: {
    border: "4px solid white",
  },
});

type Props = {
  onSelect: (l: string) => void;
  selected?: string;
};

export function LetterGrid({ onSelect, selected }: Props) {
  const { classes } = useStyles();
  return (
    <div className={classes.letterGrid}>
      {letters.map((l) => (
        <span
          key={l}
          className={selected === l ? classes.selected : ""}
          onClick={() => onSelect(l)}
        >
          {l}
        </span>
      ))}
    </div>
  );
}
