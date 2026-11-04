"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const Navbar = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get logged-in user session from Better Auth
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

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

  // Logout with Better Auth
  const handleLogout = async () => {
    try {
      await authClient.signOut();

      setIsDropdownOpen(false);
      setIsMenuOpen(false);

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white">
            <Aperture size={27} />
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
              Studio<span className="text-violet-600">Space</span>
            </h1>

            <p className="text-[10px] font-medium tracking-[2px] text-gray-500">
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
                  : "text-gray-600 hover:text-violet-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 lg:flex">
          {!isMounted || isPending ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />
          ) : !user ? (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:text-violet-600"
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
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 p-2 transition hover:bg-gray-50"
              >
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="Profile"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-600">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                <span className="text-sm font-semibold text-gray-800">
                  {user.name}
                </span>

                <ChevronDown size={17} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-14 w-60 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                  <DropdownLink
                    href="/dashboard"
                    icon={<LayoutDashboard size={18} />}
                    label="Dashboard"
                  />

                  <DropdownLink
                    href="/add-studio"
                    icon={<PlusCircle size={18} />}
                    label="Add New Studio"
                  />

                  <DropdownLink
                    href="/my-listings"
                    icon={<Building2 size={18} />}
                    label="My Studio Listings"
                  />

                  <DropdownLink
                    href="/my-bookings"
                    icon={<CalendarDays size={18} />}
                    label="My Bookings"
                  />

                  <hr className="my-2 border-gray-100" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-5 shadow-lg lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className={`font-semibold ${
                  isActive(link.href) ? "text-violet-600" : "text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-gray-100" />

            {!isMounted || isPending ? (
              <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
            ) : !user ? (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex-1 rounded-lg border border-violet-600 py-2.5 text-center font-semibold text-violet-600"
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
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-600">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

                  <span className="font-semibold text-gray-800">
                    {user.name}
                  </span>
                </div>

                <DropdownLink
                  href="/dashboard"
                  icon={<LayoutDashboard size={18} />}
                  label="Dashboard"
                />

                <DropdownLink
                  href="/add-studio"
                  icon={<PlusCircle size={18} />}
                  label="Add New Studio"
                />

                <DropdownLink
                  href="/my-listings"
                  icon={<Building2 size={18} />}
                  label="My Studio Listings"
                />

                <DropdownLink
                  href="/my-bookings"
                  icon={<CalendarDays size={18} />}
                  label="My Bookings"
                />

                <button
                  onClick={handleLogout}
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
  );
};

// Reusable Dropdown Link
const DropdownLink = ({ href, icon, label }) => {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-violet-50 hover:text-violet-600"
    >
      {icon}
      {label}
    </Link>
  );
};

export default Navbar;
