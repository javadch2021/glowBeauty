import React from "react";

interface CustomerButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "link";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const CustomerButton: React.FC<CustomerButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
}) => {
  const baseClasses =
    "font-medium rounded-lg transition focus:outline-none focus:ring-2";

  const variantClasses = {
    primary: "bg-pink-600 text-white hover:bg-pink-700 focus:ring-pink-400",
    secondary:
      "bg-gray-300 text-gray-700 hover:bg-gray-400 focus:ring-gray-300",
    link: "text-pink-600 hover:underline bg-transparent",
  };

  const sizeClasses = {
    sm: "px-4 py-1 text-sm",
    md: "px-6 py-2",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};
