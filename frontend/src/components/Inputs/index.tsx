import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  id,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-[13px] text-slate-800">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={inputId}
          {...props}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-50 ${className} ${isPassword ? "pr-10" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? (
              <FaRegEyeSlash size={18} className="text-amber-600" />
            ) : (
              <FaRegEye size={18} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
