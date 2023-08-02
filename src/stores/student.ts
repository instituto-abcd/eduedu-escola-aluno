import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useStudent = create()(
    persist(
        (set, get) => ({
            id: "",
            name: "",
            registry: "",
            schoolClassId: "",
            schoolClassName: "",
            schoolGrade: "",
            schoolPeriod: "",
            status: ""
        }),
        {
            name: "user_state",
        }
    )
);
