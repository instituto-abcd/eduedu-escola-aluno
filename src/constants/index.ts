import { SchoolGrade, SchoolPeriod } from "~/api/school-class";

export const paginationOptions = [
  { value: "10", label: "10" },
  { value: "15", label: "15" },
  { value: "20", label: "20" },
];

export const SCHOOL_GRADE: Record<SchoolGrade, string> = {
  CHILDREN: "Infantil",
  FIRST_GRADE: "1º Ano Fundamental",
  SECOND_GRADE: "2º Ano Fundamental",
  THIRD_GRADE: "3º Ano Fundamental",
  FOURTH_GRADE: "4º Ano Fundamental",
  FIFTH_GRADE: "5º Ano Fundamental",
} as const;

export const SCHOOL_PERIOD: Record<SchoolPeriod, string> = {
  MORNING: "Manhã",
  AFTERNOON: "Tarde",
  FULL: "Integral",
} as const;

export const modelsAutoAdvance = ["MODEL12", "MODEL13"];

export const modelIsAutoAdvance = (model: string) => {
  return modelsAutoAdvance.includes(model);
};
