
import { useState } from "react";

const API_URL =
  "https://attendance-management-project-v5fk.onrender.com";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage("");
    setIsError(false);

    // Stop waiting forever if the server doesn't respond.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const endpoint = isRegister
        ? "/auth/register"
        : "/auth/login";

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
        signal: controller.signal,
      });

      const result = await response.text();

      if (!response.ok) {
        setIsError(true);
        setMessage(
          `Request failed (${response.status}): ${
            result || "Please try again."
          }`
        );
        return;
      }

      if (isRegister) {
        setIsError(false);
        setMessage("Registration successful! You can now log in.");
        setIsRegister(false);
        setPassword("");
      } else if (result.trim() === "Login successful") {
        onLogin();
      } else {
        setIsError(true);
        setMessage(result.trim() || "Invalid username or password.");
      }
    } catch (error) {
      console.error("Login request error:", error);

      setIsError(true);

      if (error.name === "AbortError") {
        setMessage(
          "The server is taking too long to respond. Please wait a little and try again."
        );
      } else {
        setMessage(
          "Unable to connect to the server. Check your internet connection and try again."
        );
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const toggleMode = () => {
    if (loading) return;

    setIsRegister((previous) => !previous);
    setMessage("");
    setIsError(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-icon">🎓</div>

        <h1>Attendance Management System</h1>

        <p className="login-subtitle">
          {isRegister
            ? "Create your account"
            : "Welcome back! Please sign in."}
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
            disabled={loading}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={
              isRegister ? "new-password" : "current-password"
            }
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "Connecting to server..."
              : isRegister
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className={isError ? "login-error" : "login-success"}
          >
            {message}
          </p>
        )}

        <p className="login-toggle">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            disabled={loading}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;