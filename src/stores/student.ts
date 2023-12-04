import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SchoolGrade, SchoolPeriod } from "~/api/school-class";
import { Student } from "~/api/student";

export const useStudent = create<Student>()(
  persist(
    (_get, _set) => ({
      id: "",
      name: "",
      registry: "",
      schoolClassId: "",
      schoolClassName: "",
      status: "",
      schoolGrade: "" as SchoolGrade,
      schoolPeriod: "" as SchoolPeriod,
      reserved: false,
    }),
    {
      name: "student_state",
    }
  )
);
