// src/pages/Register.jsx
import { useState } from "react";
import { useAuth } from "../hooks/userAuth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username:"",
    email: "",
    password: "",
    confirm: ""
  });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.username, form.email, form.password, form.confirm);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 rounded w-96 shadow">
        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {error && <p className="text-red-600 mb-2">{error}</p>}

                <input
          type="name"
          placeholder="Username"
          className="w-full p-2 border mb-3"
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        


        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 border mb-4"
          onChange={e => setForm({ ...form, confirm: e.target.value })}
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Create Account
        </button>
      </form>
    </div>
  );
}
