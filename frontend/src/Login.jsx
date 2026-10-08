import { useState } from "react";

function Login({ onLogin }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then(response => response.text())
      .then(result => {

        if (result === "Login successful") {
          onLogin();
        } else {
          alert("Invalid username or password");
        }

      })
      .catch(error => {
        console.error("Error:", error);
        alert("Unable to connect to server");
      });
  };

  return (
    <div className="login-container">

      <div className="login-box">

        <h2>Attendance Management System</h2>

        <h3>Login</h3>

        <form onSubmit={handleLogin}>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;