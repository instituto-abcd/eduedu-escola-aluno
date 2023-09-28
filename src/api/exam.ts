export type QuestionOption = {
  description: string;
  image_name: string | null;
  image_url: string | null;
  isCorrect: boolean;
  position: number;
  sound_name: string | null;
  sound_url: string | null;
  positionAnswer?: number;
};

export enum QuestionTitleClassification {
  INTRO = "INTRO",
  HISTORIA = "HISTORIA",
  ENUNCIADO = "ENUNCIADO",
}

export type QuestionTitle = {
  description: string;
  file_name: string;
  file_url: string | null;
  placeholder: string;
  position: number;
  type: string;
  classification: QuestionTitleClassification | null;
  autoplay: boolean;
};

export type Question = {
  axis_code: string;
  category: string;
  description: string;
  id: number;
  level: number;
  options: QuestionOption[];
  order: number;
  orderedAnswer: boolean;
  multiplesAnswer: boolean;
  school_year: number;
  titles: QuestionTitle[];
  progress?: number;
  status?: string;
  planet_id: string;
  title: string;
  previousQuestionIsCorrect?: boolean;
  rules: {
    name: string;
    type: string;
    value: string;
  }[];
  model_id:
    | "MODEL1"
    | "MODEL10"
    | "MODEL10-PROVA"
    | "MODEL11"
    | "MODEL12"
    | "MODEL13"
    | "MODEL14"
    | "MODEL15"
    | "MODEL16"
    | "MODEL17"
    | "MODEL18"
    | "MODEL18-PROVA"
    | "MODEL19"
    | "MODEL2"
    | "MODEL2-VIDEO"
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
    | "MODEL8-PROVA"
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
