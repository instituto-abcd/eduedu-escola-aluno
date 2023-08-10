type IAxis = {
  name: string;
  description: string;
  color: string;
  order: number;
  code: string;
  domain: "PORTUGUESE" | "MATH";
};

export type Question = {
  axis_code: string;
  category: string;
  description: string;
  id: number;
  level: number;
  options: {
    description: string;
    image_name?: string;
    image_url?: string;
    isCorrect: boolean;
    position: number;
    sound_name?: string;
    sound_url?: string;
  }[];
  order: number;
  school_year: number;
  titles: {
    description: string;
    file_name: string;
    file_url: string;
    placeholder: string;
    position: number;
    type: string;
  }[];
  model_id:
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
  | "MODEL9"
  | "QME2x2Audio"
  | "QME2x2Text"
  | "QME2x2Text2"
  | "QMES5"
  | "QME2x2Video"
  | "QMES2x3Video"
  | "QORD3x2";
};

export type IExam = {
  id: string;
  domain_code: string;
  status: string;
  questions: Question[];
  version: number;
};
