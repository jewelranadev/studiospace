"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  describeError,
  notifyError,
  notifyLoading,
  notifySuccess,
  sanitizeMessage,
} from "@/lib/notify";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess(false);

    if (!email.trim()) {
      const message = "Please enter your email address.";
      setError(message);
      notifyError(message);
      return;
    }

    const loadingId = notifyLoading("Sending reset link...");

    try {
      setLoading(true);

      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        const message =
          sanitizeMessage(error.message) ||
          "Unable to send reset link. Please try again.";
        setError(message);
        notifyError(message, { id: loadingId });
        return;
      }

      setSuccess(true);
      notifySuccess("Password reset link sent! Please check your email.", {
        id: loadingId,
      });
    } catch (err) {
      const message = describeError(
        err,
        "Unable to send reset link. Please try again."
      );
      setError(message);
      notifyError(message, { id: loadingId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">

        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <Mail size={30} className="text-indigo-600" />
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Forgot Password?
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            No worries! Enter your email address and
            we'll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="rounded-xl bg-green-50 p-5 text-center">
            <CheckCircle className="mx-auto mb-3 text-green-600" size={35} />

            <h2 className="font-semibold text-green-800">
              Check Your Email
            </h2>

            <p className="mt-2 text-sm text-green-700">
              If an account exists with this email,
              you will receive a password reset link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}