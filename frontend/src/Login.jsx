
import { useState } from "react";

const API_URL =
  "https://attendance-management-project-v5fk.onrender.com";

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint = isRegister
        ? "/auth/register"
        : "/auth/login";

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.text();

      if (!response.ok) {
        setMessage("Request failed: " + result);
        return;
      }

      if (isRegister) {
        setMessage("Registration successful! You can now log in.");
        setIsRegister(false);
        setPassword("");
      } else if (result.trim() === "Login successful") {
        onLogin();
      } else {
        setMessage("Invalid username or password.");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "Cannot connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
            onChange={(event) =>
              setUsername(event.target.value)
            }
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isRegister
              ? "Register"
              : "Login"}
          </button>
        </form>

        {message && <p role="status">{message}</p>}

        <p>
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}
          {" "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
            }}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;