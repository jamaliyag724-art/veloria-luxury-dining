import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_EMAIL = "admin@veloria.com";
const ADMIN_PASSWORD = "admin123";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const isAdmin = localStorage.getItem("veloria_admin") === "true";
    if (isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleLogin = () => {
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-10 rounded-2xl shadow-xl border border-border w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6 text-foreground">
          Admin Login
        </h1>

        <input
          className="w-full mb-4 px-4 py-3 rounded-lg border border-border bg-background text-foreground"
          placeholder="admin@veloria.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 px-4 py-3 rounded-lg border border-border bg-background text-foreground"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-destructive text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium"
        >
          Login
        </button>
      </div>
    </div>
  );
}
