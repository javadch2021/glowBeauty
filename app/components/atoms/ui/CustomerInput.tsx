import React from "react";

interface CustomerInputProps {
  label?: string;
  type?: "text" | "email" | "tel" | "password";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const CustomerInput: React.FC<CustomerInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
      />
    </div>
  );
};
