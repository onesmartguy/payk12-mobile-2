
import { create } from "zustand/react";
import { TenantModel } from "../types";

const defaults: TenantStoreState = {  
  currentTenant: null, 
  tenants: [],
}

type TenantStoreState = {
  currentTenant: TenantModel | null,  
  tenants: TenantModel[],
}
type TenantModelOrId = TenantModel | number;
type  TenantStoreActions = {
  setCurrentTenant: (tenant: TenantModelOrId) => any,
  upsertTenant: (tenant: TenantModel) => any,
  removeTenant: (id: number) => any,
  getTenantById: (id: number) => TenantModel | undefined,
}

const useSchoolsStore = create<TenantStoreState & TenantStoreActions>((set, get) => ({
    ...defaults,
    setCurrentTenant: (tenant: TenantModelOrId) => set({ currentTenant: typeof tenant === 'number' ? get().tenants.find((p) => p.id === tenant) : tenant }),
    upsertTenant: (tenant: TenantModel) => set((state) => {
      const existingIndex = state.tenants.findIndex((p) => p.id === tenant.id);
      if (existingIndex !== -1) {
        const updatedOrgs = [...state.tenants];
        updatedOrgs[existingIndex] = { ...updatedOrgs[existingIndex], ...tenant };
        return { tenants: updatedOrgs };
      } else {
        return { tenants: [...state.tenants, tenant] };
      }
    }),
    removeTenant: (id: number) => set((state) => ({
      tenants: state.tenants.filter((p) => p.id !== id),
    })),
    getTenantById: (id: number) => {
      return get().tenants.find((p) => p.id === id);
    },
    reset: () => {
      set(defaults);
    },
  }));

  export default useSchoolsStore;