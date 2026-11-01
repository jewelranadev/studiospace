import { Suspense } from "react";
import FeaturedStudios from "./components/home/FeaturedStudios";
import HeroSlider from "./components/home/HeroSlider";

export default function Home() {
  return (
    <div>
      <HeroSlider />
      <Suspense
        fallback={
          <section className="px-4 py-20 text-center">
            <p className="text-gray-500">Loading featured studios...</p>
          </section>
        }
      >
        <FeaturedStudios />
      </Suspense>
    </div>
  );
}
