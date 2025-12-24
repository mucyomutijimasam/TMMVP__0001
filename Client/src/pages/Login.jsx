// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../hooks/userAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 rounded w-96 shadow">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
