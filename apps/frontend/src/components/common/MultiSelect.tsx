import React, { useState, useRef, useEffect } from "react";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionToggle = (optionValue: string) => {
    const updatedValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(updatedValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const displayValue =
    value.length === 0
      ? placeholder
      : options
          .filter((opt) => value.includes(opt.value))
          .map((opt) => opt.label)
          .join(", ");

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="block text-sm font-semibold text-[#0b1001] mb-1">
          {label}
        </label>
      )}
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`
            w-full bg-white border rounded-lg px-3 py-2.5 pr-12 text-left text-sm 
            focus:outline-none focus:ring-2 transition-all duration-200 flex items-center justify-between
            ${error
              ? "border-red-500 focus:ring-red-500/50 focus:border-red-500"
              : "border-slate-700 focus:ring-indigo-500/50 focus:border-indigo-500"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${value.length === 0 ? "text-slate-300" : "text-indigo-800"}
          `}
        >
          <span className="truncate">{displayValue}</span>
        </button>

        {/* Custom dropdown arrow with background */}
        <div 
          className="absolute right-0 top-0 h-full flex items-center justify-center bg-[#5451FF] rounded-r-lg pointer-events-none" 
          style={{ width: '40px', height: 'calc(100% - 2px)', top: '1px' }}
        >
          <svg
            className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Dropdown list - positioned absolutely to float above content */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="max-h-52 overflow-y-auto p-2 grid grid-cols-1 gap-1">
              {options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-indigo-50 cursor-pointer text-sm text-gray-700 select-none"
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={value.includes(option.value)}
                    onChange={() => handleOptionToggle(option.value)}
                    className="w-4 h-4 accent-indigo-600 flex-shrink-0"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {value.length > 0 && (
              <div className="border-t border-slate-100 px-3 py-2 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  {value.length} seleccionado{value.length !== 1 ? "s" : ""}
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Limpiar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5 ml-1">{error}</p>}
    </div>
  );
};
