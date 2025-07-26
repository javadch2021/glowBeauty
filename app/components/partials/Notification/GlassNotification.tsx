import React, { useEffect, useState } from "react";

interface GlassNotificationProps {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  duration?: number; // in ms
  onAnimationComplete?: () => void;
}

const GlassNotification: React.FC<GlassNotificationProps> = ({
  message,
  type = "info",
  duration = 3000,
  onAnimationComplete,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  // Colors based on type
  const typeColors = {
    info: "from-blue-500/20 to-cyan-500/20 text-blue-800 border-blue-300",
    success:
      "from-green-500/20 to-emerald-500/20 text-green-800 border-green-300",
    warning:
      "from-yellow-500/20 to-amber-500/20 text-yellow-800 border-yellow-300",
    error: "from-red-500/20 to-rose-500/20 text-red-800 border-red-300",
  };

  const bgColor = typeColors[type];

  useEffect(() => {
    // Start exit animation after duration
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, duration);

    return () => clearTimeout(exitTimer);
  }, [duration]);

  useEffect(() => {
    if (isExiting) {
      // Wait for exit animation to complete, then notify parent
      const animationTimer = setTimeout(() => {
        setShouldRender(false);
        onAnimationComplete?.();
      }, 400); // Match the animation duration from tailwind config

      return () => clearTimeout(animationTimer);
    }
  }, [isExiting, onAnimationComplete]);

  if (!shouldRender) return null;

  return (
    <div
      className={`
        fixed top-4 left-4 
        backdrop-blur-lg 
        bg-gradient-to-r ${bgColor}
        border 
        px-4 py-3 
        rounded-xl 
        shadow-2xl 
        max-w-xs sm:max-w-sm 
        ${isExiting ? "animate-popOut" : "animate-popIn"}
        z-50
        pointer-events-auto
      `}
      style={{
        minWidth: "240px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {type === "success" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-700"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
          {type === "error" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-700"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          )}
          {type === "warning" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-yellow-700"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          )}
          {type === "info" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-700"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          )}
        </div>

        {/* Message */}
        <p className="text-sm font-medium leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

export default GlassNotification;

<style>{`
  @keyframes fadeInSlideIn {
    0% {
      opacity: 0;
      transform: translateX(-20px) translateY(-10px);
    }
    100% {
      opacity: 1;
      transform: translateX(0) translateY(0);
    }
  }
  .animate-fadeInSlideIn {
    animation: fadeInSlideIn 0.4s ease-out forwards;
  }
`}</style>;
