import useSearchStore from '../../store/search-store';
import Remove from '../../assets/icons/remove.svg';

const SearchBar = () => {
  const { searchValue, updateSearchValue } = useSearchStore();

  const handleInputChange = (e: any) => {
    const newValue = e.target.value;
    updateSearchValue(newValue);
  };

  const handleClear = () => {
    if (searchValue) {
      updateSearchValue('');
    }
  };

  return (
    <>
      <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
        <div className="w-full max-w-lg lg:max-w-xs">
          <label htmlFor="search" className="sr-only">
            Suchen
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Suchen..."
              value={searchValue}
              onChange={handleInputChange}
            />
            {searchValue && (
              <div
                onClick={handleClear}
                className="absolute -right-3 top-[50%] translate-y-[-50%] w-12 p-2 cursor-pointer"
              >
                <img src={Remove} alt="Löschen" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
