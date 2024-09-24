import { create } from 'zustand';

type UiStore = {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  showHeader: boolean;
  isLoading: boolean;
};
const defaults = { isModalOpen: false, showHeader: false, isLoading: false };
export const useUiStore = create<UiStore>((set, get) => ({
  ...defaults,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }), 
}));
export default useUiStore;