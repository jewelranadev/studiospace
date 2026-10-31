"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Aperture,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About Us", href: "/about" },
  ];

  const categories = [
    "Photo Studios",
    "Sound Stages",
    "Podcast Rooms",
    "Music Suites",
    "Art Workshops",
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, href: "https://facebook.com" },
    { icon: <FaInstagram />, href: "https://instagram.com" },
    { icon: <FaXTwitter />, href: "https://x.com" },
    { icon: <FaLinkedinIn />, href: "https://linkedin.com" },
  ];

  return (
    <footer className="bg-[#10101B] text-gray-300">

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8">

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand Section */}
          <div>
            <Link href="/" className="mb-5 inline-flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white">
                <Aperture size={27} />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-white">
                  Studio<span className="text-violet-400">Space</span>
                </h2>
                <p className="text-[9px] tracking-[2px] text-gray-400">
                  CREATE WITHOUT LIMITS
                </p>
              </div>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-gray-400">
              StudioSpace connects creative minds with inspiring spaces.
              Discover, book, and create amazing things in the perfect
              environment.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3 text-sm text-gray-400">

              <p className="flex items-center gap-3">
                <Mail size={17} className="text-violet-400" />
                hello@studiospace.com
              </p>

              <p className="flex items-center gap-3">
                <Phone size={17} className="text-violet-400" />
                +1 234 567 890
              </p>

              <p className="flex items-center gap-3">
                <MapPin size={17} className="text-violet-400" />
                Creative Spaces Worldwide
              </p>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition hover:pl-2 hover:text-violet-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Popular Categories
            </h3>

            <ul className="space-y-4">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(category)}`}
                    className="text-sm text-gray-400 transition hover:pl-2 hover:text-violet-400"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-6 text-lg font-bold text-white">
              Stay Inspired
            </h3>

            <p className="mb-5 text-sm leading-7 text-gray-400">
              Subscribe to our newsletter for creative inspiration,
              studio updates, and exclusive offers.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex overflow-hidden rounded-xl border border-gray-700 bg-[#1B1B29]"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full min-w-0 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500"
              />

              <button
                type="submit"
                aria-label="Subscribe"
                className="flex items-center justify-center bg-violet-600 px-4 text-white transition hover:bg-violet-700"
              >
                <ArrowRight size={20} />
              </button>
            </form>

            <p className="mt-3 text-xs text-gray-500">
              We respect your privacy. Unsubscribe anytime.
            </p>

            {/* Social Links */}
            <div className="mt-7">
              <h4 className="mb-4 text-sm font-semibold text-white">
                Follow Us
              </h4>

              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Social media"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 text-gray-400 transition hover:border-violet-500 hover:bg-violet-600 hover:text-white"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-center sm:px-8 md:flex-row md:text-left">

          <p className="text-sm text-gray-500">
           © {year} StudioSpace. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-gray-500">
            <Link
              href="/privacy"
              className="transition hover:text-violet-400"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-violet-400"
            >
              Terms & Conditions
            </Link>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;
