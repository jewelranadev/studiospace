"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  describeError,
  notifyError,
  notifyLoading,
  notifySuccess,
  sanitizeMessage,
} from "@/lib/notify";
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (loading) return;

    if (!token) {
      const message = "Invalid or expired reset link.";
      setError(message);
      notifyError(message);
      return;
    }

    if (password.length < 6) {
      const message = "Password must be at least 6 characters.";
      setError(message);
      notifyError(message);
      return;
    }

    if (password !== confirmPassword) {
      const message = "Passwords do not match.";
      setError(message);
      notifyError(message);
      return;
    }

    const loadingId = notifyLoading("Updating your password...");

    try {
      setLoading(true);

      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (error) {
        const message =
          sanitizeMessage(error.message) || "Password reset failed.";
        setError(message);
        notifyError(message, { id: loadingId });
        return;
      }

      setSuccess(true);
      notifySuccess("Password changed successfully!", { id: loadingId });

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      const message = describeError(err, "Something went wrong. Please try again.");
      setError(message);
      notifyError(message, { id: loadingId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">

      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
          <Lock size={30} className="text-indigo-600" />
        </div>
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Reset Password
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          Create a new password for your StudioSpace account.
        </p>
      </div>

      {success ? (
        <div className="rounded-xl bg-green-50 p-5 text-center">
          <CheckCircle
            size={35}
            className="mx-auto mb-3 text-green-600"
          />

          <h2 className="font-semibold text-green-800">
            Password Reset Successful!
          </h2>

          <p className="mt-2 text-sm text-green-700">
            Redirecting you to login...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-gray-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirm ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>

        </form>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Back to Login
        </Link>
      </div>

    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Suspense
        fallback={<p className="text-gray-500">Loading...</p>}
      >
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}