import classes from "./LetterGrid.module.css";

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

type Props = {
  onSelect: (l: string) => void;
  selected?: string;
};

export function LetterGrid({ onSelect, selected }: Props) {
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
