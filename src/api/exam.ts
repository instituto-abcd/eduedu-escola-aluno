type IAxis = {
  name: string;
  description: string;
  color: string;
  order: number;
  code: string;
  domain: "PORTUGUESE" | "MATH";
};

export type Question = {
  order: number;
  description: string;
  fileUrl?: string;
  model:
    | "MODEL1"
    | "MODEL10"
    | "MODEL11"
    | "MODEL12"
    | "MODEL13"
    | "MODEL14"
    | "MODEL15"
    | "MODEL16"
    | "MODEL17"
    | "MODEL18"
    | "MODEL19"
    | "MODEL2"
    | "MODEL20"
    | "MODEL21"
    | "MODEL22"
    | "MODEL23"
    | "MODEL24"
    | "MODEL25"
    | "MODEL26"
    | "MODEL27"
    | "MODEL28"
    | "MODEL29"
    | "MODEL3"
    | "MODEL30"
    | "MODEL31"
    | "MODEL32"
    | "MODEL33"
    | "MODEL34"
    | "MODEL35"
    | "MODEL36"
    | "MODEL37"
    | "MODEL38"
    | "MODEL39"
    | "MODEL4"
    | "MODEL40"
    | "MODEL41"
    | "MODEL42"
    | "MODEL43"
    | "MODEL44"
    | "MODEL45"
    | "MODEL46"
    | "MODEL47"
    | "MODEL48"
    | "MODEL49"
    | "MODEL5"
    | "MODEL50"
    | "MODEL51"
    | "MODEL52"
    | "MODEL53"
    | "MODEL54"
    | "MODEL55"
    | "MODEL56"
    | "MODEL57"
    | "MODEL6"
    | "MODEL7"
    | "MODEL8"
    | "MODEL9";
  options: {
    order: number;
    description: string;
    isCorrect: boolean;
    imageUrl?: string;
    soundUrl?: string;
  }[];
};

export type IExam = {
  id: string;
  axis: IAxis;
  level: number;
  name: string;
  schoolYear: string;
  questions: Question[];
  version: number;
};
