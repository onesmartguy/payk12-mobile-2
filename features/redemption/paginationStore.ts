import { PaginationState } from "@/types";
import { create } from "zustand/react";

const defaults = { data: [], currentPage: 1, totalPages: 1, hasMore: true, searchTerm: '' }

const usePaginationStore = create<PaginationState<any>>((set) => ({
    data: [],
    currentPage: 1,
    totalPages: 1,
    hasMore: true,
    searchTerm: '',
  
    // Set a new search term and reset pagination when it changes
    setSearchTerm: (term: string) => {
      set({ searchTerm: term, data: [], currentPage: 1, totalPages: 1, hasMore: true });
    },
  
    // Add new data to the store and update pagination info
    addData: (newData, totalPages) => {
      set((state) => ({
        data: [...state.data, ...newData],  // Append new data
        currentPage: state.currentPage + 1, // Increment page
        totalPages: totalPages,
        hasMore: state.currentPage + 1 < totalPages,  // Check if more pages are available
      }));
    },
  
    // Reset the pagination state (e.g., when changing filters or search term)
    resetPagination: () => {
      set(defaults);
    },
  }));

  export default usePaginationStore;