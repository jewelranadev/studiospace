"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  describeError,
  notifyError,
  notifyLoading,
  notifySuccess,
  sanitizeMessage,
} from "@/lib/notify";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Globe,
} from "lucide-react";

import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Camera, Globe } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Email and Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const loadingId = notifyLoading("Logging in...");

    try {
      const { error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: "/",
      });

      if (error) {
        notifyError(
          sanitizeMessage(error.message) || "Invalid email or password.",
          { id: loadingId }
        );
        return;
      }

      notifySuccess("Login successful!", { id: loadingId });

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Login Error:", err);
      notifyError(describeError(err, "Login failed. Please try again."), {
        id: loadingId,
      });
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    if (googleLoading) return;

    setGoogleLoading(true);

    const loadingId = notifyLoading("Redirecting to Google...");

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        notifyError(
          sanitizeMessage(error.message) || "Google login failed.",
          { id: loadingId }
        );
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      notifyError(describeError(err, "Unable to login with Google."), {
        id: loadingId,
      });
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
            <Camera size={22} />
          </div>

          <span className="text-2xl font-bold text-gray-900">StudioSpace</span>
        </Link>

        {/* Heading */}
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>

          <p className="mt-2 text-sm text-gray-500">
            Login to continue your creative journey.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <button
                type="button"
                onClick={() =>
                  toast.info("Password recovery is currently unavailable.")
                }
              >
                Forgot Password?
              </button>
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-12 text-sm outline-none transition focus:border-black"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full rounded-xl bg-black py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">OR CONTINUE WITH</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
        >
          <Globe size={20} />

          {googleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        {/* Register Link */}
        <p className="mt-7 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-black hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}
