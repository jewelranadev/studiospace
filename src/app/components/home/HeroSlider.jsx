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
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <section className="min-h-[550px]" />;
  }

  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: ".hero-prev",
          nextEl: ".hero-next",
        }}
        pagination={{
          clickable: true,
        }}
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative flex min-h-[550px] items-center bg-cover bg-center px-6 py-20 md:min-h-[650px] md:px-16 lg:px-24"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/65"></div>

              {/* Content */}
              <div className="relative z-10 mx-auto w-full max-w-7xl">
                <div className="max-w-3xl text-white">
                  <span className="mb-5 inline-block rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium backdrop-blur-sm">
                    Your Space, Your Creativity
                  </span>

                  <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-7xl">
                    {slide.title}
                  </h1>

                  <p className="mb-8 max-w-2xl text-base leading-8 text-gray-200 md:text-lg">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/studios"
                      className="flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-700"
                    >
                      Explore Studios
                      <ArrowRight size={19} />
                    </Link>

                    <Link
                      href="/studios"
                      className="rounded-lg border border-white px-6 py-3.5 font-semibold text-white transition hover:bg-white hover:text-black"
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

      {/* Navigation Buttons */}
      <button
        type="button"
        className="hero-prev absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-violet-600 md:left-8"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        type="button"
        className="hero-next absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition hover:bg-violet-600 md:right-8"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );
};

export default HeroSlider;