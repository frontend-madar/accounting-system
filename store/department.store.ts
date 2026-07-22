import { create } from "zustand";
import { departmentService } from "@/services/department.service";

interface DepartmentState {
  departments: string[];
  isLoading: boolean;
  isError: boolean;
  hasFetched: boolean;
  fetchDepartments: () => Promise<void>;
  refetchDepartments: () => Promise<void>;
}

export const useDepartmentStore = create<DepartmentState>((set, get) => ({
  departments: [],
  isLoading: false,
  isError: false,
  hasFetched: false,

  fetchDepartments: async () => {
    // Already fetched (or in-flight) — skip refetching.
    if (get().hasFetched || get().isLoading) return;

    set({ isLoading: true, isError: false });
    try {
      const response = await departmentService.getDepartments();
      set({
        departments: response.data,
        isLoading: false,
        hasFetched: true,
      });
    } catch {
      set({ isLoading: false, isError: true, hasFetched: false });
    }
  },

  refetchDepartments: async () => {
    set({ isLoading: true, isError: false });
    try {
      const response = await departmentService.getDepartments();
      set({
        departments: response.data,
        isLoading: false,
        hasFetched: true,
      });
    } catch {
      set({ isLoading: false, isError: true });
    }
  },
}));