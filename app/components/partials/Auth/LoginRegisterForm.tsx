/* eslint-disable jsx-a11y/label-has-associated-control */
import { useContext } from "react";
import { LoginContext } from "../../forms/Landing";

export const LoginRegisterLabels: React.FC = () => {
  const { isLoginMode } = useContext(LoginContext);
  return (
    <form>
      {!isLoginMode && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Jane Doe"
          />
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="you@example.com"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="••••••••"
        />
      </div>
      <button className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition">
        {isLoginMode ? "Login" : "Register"}
      </button>
    </form>
  );
};
