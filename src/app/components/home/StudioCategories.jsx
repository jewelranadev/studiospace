"use client";

import Link from "next/link";
import {
  Camera,
  Clapperboard,
  Mic,
  Music,
  Palette,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Photo Studios",
    description: "Perfect spaces for photography and portraits.",
    icon: Camera,
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Sound Stages",
    description: "Professional spaces for film and video production.",
    icon: Clapperboard,
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Podcast Rooms",
    description: "Create your next podcast in a quiet space.",
    icon: Mic,
    color: "bg-orange-100 text-orange-600",
  },
  {
    name: "Music Suites",
    description: "Fully equipped spaces for music production.",
    icon: Music,
    color: "bg-pink-100 text-pink-600",
  },
  {
    name: "Art Workshops",
    description: "Inspiring spaces for artists and creators.",
    icon: Palette,
    color: "bg-green-100 text-green-600",
  },
];

const StudioCategories = () => {
  return (
    <section className="bg-white px-4 py-20 transition-colors dark:bg-gray-950 md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-3 font-semibold tracking-widest text-purple-600 dark:text-purple-400">
            EXPLORE BY CATEGORY
          </p>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Find the Perfect Creative Space
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-500 dark:text-gray-400">
            Discover inspiring spaces designed for every kind of creative
            project.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/studios?category=${encodeURIComponent(category.name)}`}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-purple-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-purple-500"
              >
                <div
                  className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${category.color} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="mb-3 text-lg font-bold text-gray-900 transition-colors group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
                  {category.name}
                </h3>

                <p className="mb-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
                  {category.description}
                </p>

                <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400">
                  Explore Spaces
                  <ArrowUpRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StudioCategories;