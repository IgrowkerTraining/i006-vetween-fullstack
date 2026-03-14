import React from "react";

interface BaseInputProps {
  label?: string;
  error?: string;
  className?: string;
}

interface InputOnlyProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  as?: "input";
  icon?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  isSelect?: boolean;
}

interface TextAreaOnlyProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: "textarea";
  rows?: number;
}

type InputProps = BaseInputProps & (InputOnlyProps | TextAreaOnlyProps);

export const Input: React.FC<InputProps> = (props) => {
  const {
    label,
    error,
    className = "",
    as = "input",
    ...rest
  } = props;

  const isTextarea = as === "textarea";
  const icon = !isTextarea && "icon" in props ? props.icon : undefined;
  const prefix = !isTextarea && "prefix" in props ? props.prefix : undefined;
  const suffix = !isTextarea && "suffix" in props ? props.suffix : undefined;
  const isSelect = !isTextarea && "isSelect" in props ? props.isSelect : undefined;
  const rows = isTextarea && "rows" in props ? props.rows : 4;

  const inputProps = rest as React.InputHTMLAttributes<HTMLInputElement>;
  const textareaProps = rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>;

  const baseClasses = `
    w-full bg-white rounded-lg px-3 py-2.5 
    ${icon ? "pl-10" : ""} 
    ${prefix ? "pl-10" : ""}
    ${isSelect ? "pr-12" : suffix ? "pr-10" : ""} 
    text-indigo-800 placeholder:text-slate-300
    focus:outline-none focus:ring-2 transition-all duration-200
    ${error
      ? "border border-red-500 focus:ring-red-500/50 focus:border-red-500"
      : "border border-slate-700 focus:ring-indigo-500/50 focus:border-indigo-500"}
    disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-slate-300 disabled:opacity-70
    ${className}
  `;

  const prefixContainer = prefix ? (
    <div className={`absolute left-0 top-0 h-full flex items-center justify-center pointer-events-none ${typeof prefix === 'string' ? 'bg-[#5451FF] rounded-l-lg' : ''}`} style={{ width: '32px' }}>
      {typeof prefix === 'string' ? (
        <span className="text-white font-medium text-sm">{prefix}</span>
      ) : (
        prefix
      )}
    </div>
  ) : null;

  // Dropdown arrow icon for select inputs
  const dropdownArrow = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 text-white"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19 9-7 7-7-7"
      />
    </svg>
  );

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="block text-sm font-semibold text-[#0b1001] mb-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && !isTextarea && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-400 transition-colors z-10">
            {icon}
          </div>
        )}
        
        {prefix && !isTextarea && prefixContainer}
        
        {isTextarea ? (
          <textarea
            className={`${baseClasses} resize-none min-h-[100px] py-2`}
            rows={rows}
            {...textareaProps}
          />
        ) : isSelect ? (
          <div className="relative flex items-center">
            <input
              className={baseClasses}
              readOnly
              {...inputProps}
            />
            <div className="absolute right-0 top-0 h-full flex items-center justify-center bg-[#5451FF] rounded-r-lg" style={{ width: '40px' }}>
              {dropdownArrow}
            </div>
          </div>
        ) : (
          <input
            className={baseClasses}
            {...inputProps}
          />
        )}
        
        {suffix && !isTextarea && !isSelect && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5 ml-1">{error}</p>}
    </div>
  );
};
