"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
Mail,
Lock,
Eye,
EyeOff,
Camera,
User,
Image as ImageIcon,
} from "lucide-react";

export default function RegisterPage() {
const router = useRouter();

const [formData, setFormData] = useState({
name: "",
email: "",
password: "",
image: "",
});

const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();


if (!/[A-Z]/.test(formData.password)) {
  toast.error("Password must contain at least one uppercase letter.");
  return;
}

if (!/[a-z]/.test(formData.password)) {
  toast.error("Password must contain at least one lowercase letter.");
  return;
}

if (formData.password.length < 6) {
  toast.error("Password must be at least 6 characters long.");
  return;
}

setLoading(true);

try {
  const { error } = await authClient.signUp.email({
    name: formData.name,
    email: formData.email,
    password: formData.password,
    image: formData.image || undefined,
  });

  if (error) {
    toast.error(error.message || "Registration failed!");
    return;
  }

  toast.success("Account created successfully!");

  router.push("/login?registered=true");
} catch (err) {
  console.error("Registration Error:", err);
  toast.error(err.message || "Something went wrong. Please try again.");
} finally {
  setLoading(false);
}


};

return ( <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12"> <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"> <Link href="/" className="flex items-center justify-center gap-2"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white"> <Camera size={22} /> </div>


      <span className="text-2xl font-bold text-gray-900">
        StudioSpace
      </span>
    </Link>

    <div className="mt-8 text-center">
      <h1 className="text-2xl font-bold text-gray-900">
        Create Your Account
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Join StudioSpace and start your creative journey.
      </p>
    </div>

    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Full Name
        </label>

        <div className="relative">
          <User
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black"
          />
        </div>
      </div>

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

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Profile Image URL (Optional)
        </label>

        <div className="relative">
          <ImageIcon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Enter profile image URL"
            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-black"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Password
        </label>

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
            placeholder="Create a password"
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

        <p className="mt-2 text-xs text-gray-500">
          Minimum 6 characters, including uppercase and lowercase letters.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-black py-3.5 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>

    <p className="mt-7 text-center text-sm text-gray-500">
      Already have an account?{" "}
      <Link
        href="/login"
        className="font-semibold text-black hover:underline"
      >
        Login
      </Link>
    </p>
  </div>
</main>


);
}
