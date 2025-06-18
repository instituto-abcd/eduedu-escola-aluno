import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SchoolGrade, SchoolPeriod } from "~/api/school-class";
import type { Student } from "~/api/student";

type StudentStore = Student & {
	update: (d: Partial<Student>) => void;
	valid: () => boolean;
	clear: () => void;
};

export const useStudent = create<StudentStore>()(
	persist(
		(set, get) => ({
			id: "",
			name: "",
			registry: "",
			schoolClassId: "",
			schoolClassName: "",
			schoolGrade: "" as SchoolGrade,
			schoolPeriod: "" as SchoolPeriod,
			reserved: false,
			firstAccess: true,
			examPerformed: false,
			clear: () => set({}, true),
			update: (d) => set(d),
			valid: () => {
				const valid = validStudentSchema.safeParse(get());
				return valid.success;
			},
		}),
		{
			name: "student_state",
		},
	),
);

const validStudentSchema = z.object({
	id: z.string().uuid(),
	name: z.string().nonempty(),
	schoolClassId: z.string().uuid(),
});
