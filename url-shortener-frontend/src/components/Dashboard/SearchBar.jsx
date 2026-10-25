import { memo } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = memo(function SearchBar({ searchTerm, onSearch }) {
  return (
    <div className="relative w-full md:w-80">
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        type="text"
        placeholder="Search your links..."
        value={searchTerm}
        onChange={(event) => onSearch(event.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
});

export default SearchBar;
