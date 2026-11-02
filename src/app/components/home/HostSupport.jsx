import {
ShieldCheck,
BadgeCheck,
Wrench,
Headset,
ArrowRight,
} from "lucide-react";

const supportFeatures = [
{
title: "Liability Protection",
description:
"Enjoy peace of mind with protection designed to make every studio booking safer and more secure.",
icon: ShieldCheck,
},
{
title: "Verified Profiles",
description:
"Connect confidently with verified studio hosts and creative professionals.",
icon: BadgeCheck,
},
{
title: "Equipment Safety",
description:
"Find studios with properly maintained equipment and clear safety guidelines.",
icon: Wrench,
},
{
title: "24/7 Host Support",
description:
"Get assistance whenever you need help with your studio booking or hosting experience.",
icon: Headset,
},
];

const HostSupport = () => {
return ( <section className="bg-white px-4 py-20 md:px-10 lg:px-20"> <div className="mx-auto max-w-7xl">
{/* Heading */} <div className="mb-14 text-center"> <p className="mb-3 font-semibold tracking-widest text-purple-600">
YOUR TRUST, OUR PRIORITY </p>


      <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
        Host Guarantee & Creator Support
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-gray-500">
        We are committed to creating a safe, reliable, and supportive
        environment for every host and creator.
      </p>
    </div>

    {/* Features */}
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {supportFeatures.map((feature) => {
        const Icon = feature.icon;

        return (
          <div
            key={feature.title}
            className="group rounded-2xl border border-gray-200 bg-gray-50 p-7 transition-all duration-300 hover:-translate-y-2 hover:border-purple-200 hover:bg-white hover:shadow-xl"
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white">
              <Icon size={28} />
            </div>

            <h3 className="mb-3 text-lg font-bold text-gray-900 transition-colors group-hover:text-purple-600">
              {feature.title}
            </h3>

            <p className="text-sm leading-7 text-gray-500">
              {feature.description}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-purple-600">
              Learn More
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>


);
};

export default HostSupport;
