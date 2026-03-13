import React, { useState } from "react";
import { Input } from "./Input";
import LupaBusqueda from "../../assets/lupaBusqueda.svg";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Buscar...",
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="w-full pr-10"
      />
      <button
        type="button"
        onClick={handleSearchClick}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
      >
        <img src={LupaBusqueda} alt="Buscar" />
      </button>
    </div>
  );
};
