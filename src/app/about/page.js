import Link from "next/link";
import {
  Aperture,
  Camera,
  Users,
  Lightbulb,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Creative Spaces",
    description:
      "Discover professional studios for photography, videography, podcasting, and other creative projects.",
  },
  {
    icon: Users,
    title: "Creator Community",
    description:
      "Connect studio owners with creators and help bring creative ideas to life.",
  },
  {
    icon: Lightbulb,
    title: "Simple Booking",
    description:
      "Find your perfect studio, choose your preferred hours, and book your space easily.",
  },
];

const benefits = [
  "Discover studios for different creative needs",
  "Compare hourly pricing and facilities",
  "Book studios with a simple booking process",
  "Manage your bookings in one place",
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-violet-50 via-white to-purple-50 px-4 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg">
            <Aperture size={34} />
          </div>

          <p className="mb-4 font-semibold tracking-widest text-violet-600">
            ABOUT STUDIOSPACE
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
            Create Without
            <span className="text-violet-600"> Limits.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            StudioSpace is a platform that connects creative people
            with professional studio spaces. We make finding and
            booking the perfect creative environment simple and easy.
          </p>

          <Link
            href="/studios"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 font-semibold text-white shadow-lg transition hover:bg-violet-700"
          >
            Explore Studios
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 py-20 md:px-10 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-3 font-semibold tracking-widest text-violet-600">
              OUR STORY
            </p>

            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              A Better Space for Every Creative Idea
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              Every great creative project starts with an idea.
              But finding the right space to bring that idea to life
              can sometimes be difficult.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              StudioSpace aims to make that process easier by bringing
              studio owners and creative professionals together
              through one convenient platform.
            </p>
          </div>

          <div className="rounded-3xl bg-violet-600 p-10 text-white shadow-xl">
            <Aperture size={55} />

            <h3 className="mt-8 text-3xl font-bold">
              Your Space.
              <br />
              Your Creativity.
              <br />
              Your Story.
            </h3>

            <p className="mt-5 leading-7 text-violet-100">
              We believe the right environment can make every
              creative experience better.
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="bg-gray-50 px-4 py-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="font-semibold tracking-widest text-violet-600">
              WHAT WE OFFER
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Everything Creators Need
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              We bring everything together to make studio discovery
              and booking easier.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-gray-200 bg-white p-8 transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                    <Icon size={28} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-4 py-20 md:px-10 lg:px-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="font-semibold tracking-widest text-violet-600">
              WHY STUDIOSPACE
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Made for Creative People
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Whether you are a photographer, filmmaker, podcaster,
              or studio owner, StudioSpace helps you find the right
              opportunity.
            </p>
          </div>

          <div className="space-y-5">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3"
              >
                <CheckCircle
                  size={22}
                  className="shrink-0 text-green-600"
                />

                <p className="font-medium text-gray-700">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-violet-600 px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready to Bring Your Ideas to Life?
          </h2>

          <p className="mt-5 leading-7 text-violet-100">
            Discover your perfect creative space and start
            creating something amazing.
          </p>

          <Link
            href="/studios"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            Find Your Studio
            <ArrowRight size={19} />
          </Link>
        </div>
      </section>
    </main>
  );
}