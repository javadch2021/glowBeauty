import { useContext } from "react";
import { LoginContext } from "../../forms/Landing";

export const RegisterTab: React.FC = () => {
  const { isLoginMode, setIsLoginMode } = useContext(LoginContext);
  return (
    <button
      type="button"
      onClick={() => setIsLoginMode(false)}
      disabled
      className="relative py-2 text-lg font-medium focus:outline-none"
    >
      <span
        className={`transition-colors ${
          !isLoginMode ? "text-pink-600" : "text-gray-500"
        }`}
      >
        Register
      </span>
    </button>
  );
};
