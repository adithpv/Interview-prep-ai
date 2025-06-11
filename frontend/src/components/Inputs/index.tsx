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
      <div className="input-box">
        <input
          id={inputId}
          {...props}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          className={`w-full bg-transparent outline-none ${className}`}
        />
        {isPassword && (
          <>
            {showPassword ? (
              <FaRegEyeSlash
                size={20}
                className="text-primary cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            ) : (
              <FaRegEye
                size={20}
                className="cursor-pointer text-slate-400"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
