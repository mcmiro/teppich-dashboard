import create from 'zustand';

interface SearchState {
  searchValue: string;
  updateSearchValue: (newValue: string) => void;
}

const useSearchStore = create<SearchState>((set) => ({
  searchValue: '',
  updateSearchValue: (newValue) => set({ searchValue: newValue }),
}));

export default useSearchStore;
