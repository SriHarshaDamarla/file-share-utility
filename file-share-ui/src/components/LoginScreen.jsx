import axios from "axios";
import { BASE_URL } from "../constants/constants";
import { useState } from "react";

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleLogin = () => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/auth/login`, { username, password })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          onLogin(data.sessionId);
        } else {
          setErrorMessage(response.data || "Login failed");
        }
        setLoading(false);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data || "Login failed");
        setLoading(false);
      });
  };
  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">
          File Share Host Login
        </h2>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="w-full border rounded-lg p-2 mb-2"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="w-full border rounded-lg p-2 mb-4"
        />

        <button
          onClick={() => handleLogin()}
          className={`w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2 text-center">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginScreen;
