"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    title: "Find the Perfect Space for Your Creativity",
    description:
      "Discover professional studios and creative spaces for photography, music, podcasting, and more.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1920",
  },
  {
    id: 2,
    title: "Bring Your Creative Vision to Life",
    description:
      "Explore inspiring production spaces equipped with everything you need to create something amazing.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920",
  },
  {
    id: 3,
    title: "Turn Your Space Into an Opportunity",
    description:
      "List your creative studio and connect with creators looking for the perfect place to work.",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920",
  },
];

const HeroSlider = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="min-h-[550px] bg-gray-900 md:min-h-[650px]" />
    );
  }

  return (
    <section className="relative overflow-hidden bg-gray-950">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          prevEl: ".hero-prev",
          nextEl: ".hero-next",
        }}
        pagination={{
          clickable: true,
        }}
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative flex min-h-[550px] items-center bg-cover bg-center px-6 py-20 md:min-h-[650px] md:px-16 lg:px-24"
              style={{
                backgroundImage: `url("${slide.image}")`,
              }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/65" />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              {/* Hero Content */}
              <div className="relative z-10 mx-auto w-full max-w-7xl">
                <div className="max-w-3xl text-white">
                  <span className="mb-5 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-md">
                    Your Space, Your Creativity
                  </span>

                  <h1 className="mb-6 text-4xl leading-tight font-bold text-white sm:text-5xl md:text-6xl lg:text-7xl">
                    {slide.title}
                  </h1>

                  <p className="mb-8 max-w-2xl text-base leading-8 text-gray-200 md:text-lg">
                    {slide.description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/studios"
                      className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3.5 font-semibold text-white transition duration-300 hover:bg-violet-700"
                    >
                      Explore Studios
                      <ArrowRight size={19} />
                    </Link>

                    <Link
                      href="/studios"
                      className="inline-flex items-center rounded-lg border border-white/80 bg-white/5 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition duration-300 hover:border-white hover:bg-white hover:text-gray-950"
                    >
                      Host Your Space
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Previous Button */}
      <button
        type="button"
        className="hero-prev absolute top-1/2 left-4 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition duration-300 hover:border-violet-600 hover:bg-violet-600 md:left-8"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Next Button */}
      <button
        type="button"
        className="hero-next absolute top-1/2 right-4 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition duration-300 hover:border-violet-600 hover:bg-violet-600 md:right-8"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Styling */}
      <style jsx global>{`
        .hero-swiper .swiper-pagination {
          bottom: 25px !important;
        }

        .hero-swiper .swiper-pagination-bullet {
          width: 9px;
          height: 9px;
          background: #ffffff;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .hero-swiper .swiper-pagination-bullet-active {
          width: 28px;
          border-radius: 10px;
          background: #7c3aed;
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default HeroSlider;