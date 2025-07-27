/* eslint-disable jsx-a11y/label-has-associated-control */
import { useContext, useState } from "react";
import { LoginContext } from "../../forms/Landing";
import { useCustomerAuth } from "~/contexts/CustomerAuthContext";
import { useNotification } from "~/contexts/NotificationContext";

export const LoginRegisterLabels: React.FC = () => {
  const { isLoginMode } = useContext(LoginContext);
  const { login, register } = useCustomerAuth();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  // Password validation helper
  const getPasswordValidation = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  };

  const passwordValidation = getPasswordValidation(formData.password);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isLoginMode) {
        // Login
        if (!formData.email || !formData.password) {
          showError("Please enter both email and password");
          return;
        }

        const result = await login(formData.email, formData.password);

        if (result.success) {
          showSuccess("Login successful! Redirecting...");
          // The login function will handle the redirect
        } else {
          showError(result.message);
        }
      } else {
        // Register
        if (!formData.name || !formData.email || !formData.password) {
          showError("Please fill in all fields");
          return;
        }

        // Validate password requirements
        const validation = getPasswordValidation(formData.password);
        if (
          !validation.length ||
          !validation.uppercase ||
          !validation.lowercase ||
          !validation.number ||
          !validation.special
        ) {
          showError(
            "Password must meet all requirements: 8+ characters, uppercase, lowercase, number, and special character"
          );
          return;
        }

        const result = await register(
          formData.name,
          formData.email,
          formData.password
        );

        if (result.success) {
          showSuccess(result.message);
          // Clear form and switch to login mode
          setFormData({ name: "", email: "", password: "" });
          // You might want to switch to login mode here
        } else {
          showError(result.message);
        }
      }
    } catch (error) {
      showError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isLoginMode && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900 bg-white"
            placeholder="Jane Doe"
            required={!isLoginMode}
            disabled={isLoading}
          />
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900 bg-white"
          placeholder="you@example.com"
          required
          disabled={isLoading}
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          onFocus={() => !isLoginMode && setShowPasswordRequirements(true)}
          onBlur={() => setShowPasswordRequirements(false)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900 bg-white"
          placeholder="••••••••"
          required
          disabled={isLoading}
          minLength={8}
        />

        {/* Password Requirements - Only show during registration */}
        {!isLoginMode && (showPasswordRequirements || formData.password) && (
          <div className="mt-2 p-3 bg-gray-50 rounded-md border">
            <p className="text-xs font-medium text-gray-700 mb-2">
              Password Requirements:
            </p>
            <div className="space-y-1">
              <div
                className={`flex items-center text-xs ${
                  passwordValidation.length ? "text-green-600" : "text-gray-500"
                }`}
              >
                <span className="mr-2">
                  {passwordValidation.length ? "✓" : "○"}
                </span>
                At least 8 characters
              </div>
              <div
                className={`flex items-center text-xs ${
                  passwordValidation.uppercase
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <span className="mr-2">
                  {passwordValidation.uppercase ? "✓" : "○"}
                </span>
                One uppercase letter (A-Z)
              </div>
              <div
                className={`flex items-center text-xs ${
                  passwordValidation.lowercase
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <span className="mr-2">
                  {passwordValidation.lowercase ? "✓" : "○"}
                </span>
                One lowercase letter (a-z)
              </div>
              <div
                className={`flex items-center text-xs ${
                  passwordValidation.number ? "text-green-600" : "text-gray-500"
                }`}
              >
                <span className="mr-2">
                  {passwordValidation.number ? "✓" : "○"}
                </span>
                One number (0-9)
              </div>
              <div
                className={`flex items-center text-xs ${
                  passwordValidation.special
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <span className="mr-2">
                  {passwordValidation.special ? "✓" : "○"}
                </span>
                One special character (!@#$%^&*)
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Please wait..." : isLoginMode ? "Login" : "Register"}
      </button>
    </form>
  );
};
