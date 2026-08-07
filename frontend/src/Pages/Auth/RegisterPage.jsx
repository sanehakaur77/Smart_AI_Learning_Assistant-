import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { BrainCircuit, Mail, Lock, ArrowRight, User } from "lucide-react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.register(username, email, password);
      toast.success("Registration successful! Please Login.");
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err.message || "Failed to register. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
            <BrainCircuit size={28} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Create an account
        </h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Start your AI-powered learning experience
        </p>

        {/* Error */}
        {error && (
          <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Username */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Username
            </label>
            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition ${
                focusedField === "username"
                  ? "border-emerald-500 ring-2 ring-emerald-200"
                  : "border-gray-200"
              }`}
            >
              <User className="text-gray-400" size={18} />
              <input
                type="text"
                placeholder="John"
                className="w-full bg-transparent text-sm outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField("username")}
                onBlur={() => setFocusedField(null)}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Email
            </label>
            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition ${
                focusedField === "email"
                  ? "border-emerald-500 ring-2 ring-emerald-200"
                  : "border-gray-200"
              }`}
            >
              <Mail className="text-gray-400" size={18} />
              <input
                type="email"
                placeholder="john@timetoprogram.com"
                className="w-full bg-transparent text-sm outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">
              Password
            </label>
            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition ${
                focusedField === "password"
                  ? "border-emerald-500 ring-2 ring-emerald-200"
                  : "border-gray-200"
              }`}
            >
              <Lock className="text-emerald-500" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent text-sm outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                required
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create account"}
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-emerald-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
