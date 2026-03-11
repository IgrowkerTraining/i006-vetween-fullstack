import React from "react";

interface BaseInputProps {
  label?: string;
  error?: string;
  className?: string;
}

interface InputOnlyProps extends React.InputHTMLAttributes<HTMLInputElement> {
  as?: "input";
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: React.ReactNode;
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
  const rows = isTextarea && "rows" in props ? props.rows : 4;

  const inputProps = rest as React.InputHTMLAttributes<HTMLInputElement>;
  const textareaProps = rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>;

  const baseClasses = `
    w-full bg-white rounded-lg px-3 py-2.5 
    ${icon ? "pl-10" : ""} 
    ${prefix ? "pl-7" : ""}
    ${suffix ? "pr-10" : ""} 
    text-indigo-800 placeholder:text-slate-300
    focus:outline-none focus:ring-2 transition-all duration-200
    ${error
      ? "border border-red-500 focus:ring-red-500/50 focus:border-red-500"
      : "border border-slate-700 focus:ring-indigo-500/50 focus:border-indigo-500"}
    ${className}
  `;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="block text-sm font-semibold text-[#0b1001] mb-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && !isTextarea && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-400 transition-colors">
            {icon}
          </div>
        )}
        {prefix && !isTextarea && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
            {prefix}
          </div>
        )}
        
        {isTextarea ? (
          <textarea
            className={`${baseClasses} resize-none min-h-[100px] py-2`}
            rows={rows}
            {...textareaProps}
          />
        ) : (
          <input
            className={baseClasses}
            {...inputProps}
          />
        )}
        
        {suffix && !isTextarea && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5 ml-1">{error}</p>}
    </div>
  );
};
