"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  Aperture,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
  Building2,
  CalendarDays,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import ConfirmDialog from "@/app/components/shared/ConfirmDialog";
import {
  describeError,
  notifyError,
  notifyLoading,
  notifySuccess,
  sanitizeMessage,
} from "@/lib/notify";

const Navbar = () => {
  const [theme, setTheme] = useState("light");
  const [isMounted, setIsMounted] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    setIsMounted(true);

    const savedTheme = localStorage.getItem("studiospace-theme") || "light";

    setTheme(savedTheme);

    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About Us", href: "/about" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    if (href.includes("#")) return false;

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Theme Toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);

    localStorage.setItem("studiospace-theme", newTheme);

    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Logout (runs after the confirmation dialog)
  const handleLogout = async () => {
    const loadingId = notifyLoading("Logging out...");

    try {
      const { error } = await authClient.signOut();

      if (error) {
        notifyError(
          sanitizeMessage(error.message) || "Logout failed. Please try again.",
          { id: loadingId }
        );
        // Keep the dialog open so the user can retry.
        return;
      }

      setIsDropdownOpen(false);
      setIsMenuOpen(false);

      notifySuccess("Logged out successfully!", { id: loadingId });
      setLogoutOpen(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      notifyError(describeError(error, "Logout failed. Please try again."), {
        id: loadingId,
      });
    }
  };

  const openLogoutConfirm = () => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    setLogoutOpen(true);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // How It Works Navigation
  const handleHowItWorks = (e) => {
    e.preventDefault();

    setIsMenuOpen(false);

    if (pathname === "/") {
      document.getElementById("how-it-works")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      router.push("/#how-it-works");
    }
  };

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/95">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white">
            <Aperture size={27} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Studio<span className="text-violet-600">Space</span>
            </h1>

            <p className="text-[10px] font-medium tracking-[2px] text-gray-500 dark:text-gray-400">
              CREATE WITHOUT LIMITS
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={
                link.name === "How It Works" ? handleHowItWorks : undefined
              }
              className={`text-sm font-semibold transition ${
                isActive(link.href)
                  ? "text-violet-600"
                  : "text-gray-600 hover:text-violet-600 dark:text-gray-300 dark:hover:text-violet-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-lg border border-gray-200 p-2.5 text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {!isMounted || isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
          ) : !user ? (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:text-violet-600 dark:text-gray-200 dark:hover:text-violet-400"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
              >
                Register
              </Link>
            </>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              {/* Profile Button */}
              <button className="flex items-center gap-2 rounded-xl border border-gray-200 p-2 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="Profile"
                    width={36}
                    height={36}
                    unoptimized
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-600">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {user.name}
                </span>

                <ChevronDown
                  size={17}
                  className={`text-gray-600 transition-transform dark:text-gray-300 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full w-60 pt-2">
                  <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                    <DropdownLink
                      href="/dashboard"
                      icon={<LayoutDashboard size={18} />}
                      label="Dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    <DropdownLink
                      href="/add-studio"
                      icon={<PlusCircle size={18} />}
                      label="Add New Studio"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    <DropdownLink
                      href="/my-listings"
                      icon={<Building2 size={18} />}
                      label="My Studio Listings"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    <DropdownLink
                      href="/my-bookings"
                      icon={<CalendarDays size={18} />}
                      label="My Bookings"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    <DropdownLink
                      href="/host-bookings"
                      icon={<CalendarDays size={18} />}
                      label="Host Bookings"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    <hr className="my-2 border-gray-100 dark:border-gray-700" />

                    <button
                      onClick={openLogoutConfirm}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800 lg:hidden"
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-5 shadow-lg dark:border-gray-700 dark:bg-gray-900 lg:hidden">
          <div className="flex flex-col gap-4">
            {/* Mobile Links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={
                  link.name === "How It Works" ? handleHowItWorks : closeMenu
                }
                className={`font-semibold ${
                  isActive(link.href)
                    ? "text-violet-600"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-gray-100 dark:border-gray-700" />

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 font-semibold text-gray-700 dark:text-gray-200"
            >
              {theme === "light" ? (
                <>
                  <Moon size={20} />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun size={20} />
                  Light Mode
                </>
              )}
            </button>

            {!isMounted || isPending ? (
              <div className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
            ) : !user ? (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex-1 rounded-lg border border-violet-600 py-2.5 text-center font-semibold text-violet-600 dark:text-violet-400"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="flex-1 rounded-lg bg-violet-600 py-2.5 text-center font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            ) : (
              <>
                {/* Mobile Profile */}
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt="Profile"
                      width={40}
                      height={40}
                      unoptimized
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-600">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    {user.name}
                  </span>
                </div>

                <DropdownLink
                  href="/dashboard"
                  icon={<LayoutDashboard size={18} />}
                  label="Dashboard"
                  onClick={closeMenu}
                />

                <DropdownLink
                  href="/add-studio"
                  icon={<PlusCircle size={18} />}
                  label="Add New Studio"
                  onClick={closeMenu}
                />

                <DropdownLink
                  href="/my-listings"
                  icon={<Building2 size={18} />}
                  label="My Studio Listings"
                  onClick={closeMenu}
                />

                <DropdownLink
                  href="/my-bookings"
                  icon={<CalendarDays size={18} />}
                  label="My Bookings"
                  onClick={closeMenu}
                />

                <DropdownLink
                  href="/host-bookings"
                  icon={<CalendarDays size={18} />}
                  label="Host Bookings"
                  onClick={closeMenu}
                />

                <button
                  onClick={openLogoutConfirm}
                  className="flex items-center gap-3 text-left font-semibold text-red-500"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>

    <ConfirmDialog
      open={logoutOpen}
      variant="destructive"
      icon={<LogOut size={24} />}
      title="Log out of StudioSpace?"
      description="You will need to login again to access your account."
      confirmLabel="Logout"
      cancelLabel="Stay Logged In"
      onConfirm={handleLogout}
      onClose={() => setLogoutOpen(false)}
    />
    </>
  );
};

// Reusable Dropdown Link
const DropdownLink = ({ href, icon, label, onClick }) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-violet-50 hover:text-violet-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-violet-400"
    >
      {icon}
      {label}
    </Link>
  );
};

export default Navbar;
