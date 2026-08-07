import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import { BrainCircuit, Mail, Lock, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token, user } = await authService.login(email, password);
      login(user, token);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.message || "Failed to login. Please check your credentials.",
      );
      toast.error(err.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-100">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        {/* Logo */}
        <div className="mx-auto mb-4 flex h-10 w-8 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
          <BrainCircuit size={26} />
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-900">
          Welcome back
        </h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Sign in to continue your journey
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              EMAIL
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
              <Mail className="text-emerald-500" size={18} />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              PASSWORD
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-3 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
              <Lock className="text-gray-400" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-emerald-500 hover:underline"
          >
            Sign up
          </Link>
        </p>

        <p className="mt-4 text-center text-[11px] text-gray-400">
          By continuing, you agree to our{" "}
          <span className="underline">Terms</span> &{" "}
          <span className="underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
