
import { create } from "zustand/react";
import { SchoolModel } from "../types";
import {uniq} from "lodash";

const defaults: SchoolStoreState = {  
  schools: [], 
  currentSchool: null
}

type SchoolStoreState = { 
  currentSchool: SchoolModel | null,
  schools: SchoolModel[]
}
type SchoolModelOrId = SchoolModel | number;
type  SchoolStoreActions = {
  setCurrentSchool: (tenant: SchoolModelOrId) => any,
  upsertSchool: (school: SchoolModel) => void,
  upsertSchools: (schools: SchoolModel[]) => void,
  removeSchool: (id: number) => any,
  getSchoolById: (id: number) => SchoolModel | undefined,
  reset: () => void,
}

const useSchoolStore = create<SchoolStoreState & SchoolStoreActions>((set, get) => ({
    ...defaults,
    setCurrentSchool: (tenant: SchoolModelOrId) => set({ currentSchool: typeof tenant === 'number' ? get().schools.find((p) => p.id === tenant) : tenant }),
    upsertSchool: (school: SchoolModel) => set((state) => {
      const existingIndex = state.schools.findIndex((p) => p.id === school.id);
      if (existingIndex !== -1) {
        const updatedSchool = [...state.schools];
        updatedSchool[existingIndex] = { ...updatedSchool[existingIndex], ...school };
        return { schools: updatedSchool };
      } else {
        return { schools: [...state.schools, school] };
      }
    }),
    upsertSchools: (schools) => set((state) => {
      console.log('upsertTickets', schools)
      return { schools: [...schools] };
    }),
    removeSchool: (id: number) => set((state) => ({
      schools: state.schools.filter((p) => p.id !== id),
    })),
    getSchoolById: (id: number) => {
      return get().schools.find((p) => p.id === id);
    },
  
    reset: () => {
      set(defaults);
    },
  }));

  export default useSchoolStore;