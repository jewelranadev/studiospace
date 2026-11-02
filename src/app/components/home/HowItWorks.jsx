import {
Search,
CalendarClock,
CheckCircle,
Clapperboard,
ArrowRight,
} from "lucide-react";

const steps = [
{
number: "01",
title: "Discover Spaces",
description:
"Explore a wide range of creative studios and find the perfect space for your project.",
icon: Search,
},
{
number: "02",
title: "Select Shoot Hours",
description:
"Choose your preferred date, available time slot, and the number of hours you need.",
icon: CalendarClock,
},
{
number: "03",
title: "Book Instantly",
description:
"Confirm your booking with a few clicks and get ready for your creative session.",
icon: CheckCircle,
},
{
number: "04",
title: "Create & Produce",
description:
"Arrive at your studio, bring your ideas to life, and create something amazing.",
icon: Clapperboard,
},
];

const HowItWorks = () => {
return ( <section className="bg-gray-50 px-4 py-20 md:px-10 lg:px-20"> <div className="mx-auto max-w-7xl">
{/* Section Heading */} <div className="mb-16 text-center"> <p className="mb-3 font-semibold tracking-widest text-purple-600">
SIMPLE BOOKING PROCESS </p>


      <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
        How Booking Works
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-gray-500">
        Booking your perfect creative space is simple. Follow these four
        easy steps and start creating.
      </p>
    </div>

    {/* Steps */}
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => {
        const Icon = step.icon;

        return (
          <div key={step.number} className="group relative">
            {/* Step Card */}
            <div className="h-full rounded-2xl border border-gray-200 bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-purple-200 hover:shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white">
                  <Icon size={27} />
                </div>

                <span className="text-4xl font-bold text-gray-100 transition-colors group-hover:text-purple-100">
                  {step.number}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {step.title}
              </h3>

              <p className="text-sm leading-7 text-gray-500">
                {step.description}
              </p>
            </div>

            {/* Arrow */}
            {index !== steps.length - 1 && (
              <div className="absolute -right-6 top-1/2 z-10 hidden -translate-y-1/2 text-purple-400 lg:block">
                <ArrowRight size={24} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
</section>

);
};

export default HowItWorks;
