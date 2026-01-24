import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "admin@veloria.com";
const ADMIN_PASSWORD = "admin123";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Agar pehle se login hai to admin panel bhej do
  useEffect(() => {
    const isAdmin = localStorage.getItem("veloria_admin") === "true";
    if (isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleLogin = () => {
    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);

    if (
      email.trim() === ADMIN_EMAIL &&
      password.trim() === ADMIN_PASSWORD
    ) {
      localStorage.setItem("veloria_admin", "true");
      navigate("/admin", { replace: true });
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf7f2]">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Admin Login
        </h1>

        <input
          className="w-full mb-4 px-4 py-3 rounded-lg border"
          placeholder="admin@veloria.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 px-4 py-3 rounded-lg border"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-lg bg-[#d4a24c] text-white font-medium"
        >
          Login
        </button>
      </div>
    </div>
  );
}
