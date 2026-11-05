export const metadata = {
  title: "Privacy Policy | StudioSpace",
  description:
    "How StudioSpace collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "Information We Collect",
    body: [
      "We collect information you provide directly to us, such as your name, email address, and the details you enter when creating a studio listing or making a booking.",
      "When you sign in, our authentication provider may also process your profile information, including your profile image, depending on the sign-in method you choose.",
      "We collect technical information about your visit, such as browser type and pages viewed, to keep the service reliable and secure.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "We use your information to create and manage your account, process bookings, show your listings to other users, and send service-related notifications.",
      "We use it to respond to your requests, prevent fraud and abuse, and improve how StudioSpace works.",
      "We do not sell your personal information to third parties.",
    ],
  },
  {
    title: "Cookies and Authentication",
    body: [
      "StudioSpace uses cookies to keep you signed in and to remember your session securely. You can block cookies in your browser, but some features, such as signing in, will not work without them.",
    ],
  },
  {
    title: "Sharing Your Information",
    body: [
      "Booking details are shared with the host of the studio you book, and host contact details are shared with guests, so both sides can coordinate a booking.",
      "We share information with service providers who help us operate the platform, and only to the extent necessary to provide those services.",
      "We may disclose information if required by law or to protect the rights and safety of our users.",
    ],
  },
  {
    title: "Data Retention and Security",
    body: [
      "We keep your information for as long as your account is active or as needed to provide the service, and to meet legal obligations.",
      "We use industry-standard measures to protect your information, but no method of transmission over the internet is completely secure.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "You can review and update your account information at any time, and you may request a copy or deletion of your personal data.",
      "To make a request, contact us using the address below and we will respond within a reasonable time.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16 dark:bg-gray-950 md:px-10 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 font-semibold tracking-widest text-violet-600 dark:text-violet-400">
          YOUR PRIVACY
        </p>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
          Privacy Policy
        </h1>

        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Last updated: November 2026
        </p>

        <div className="mt-8 space-y-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8">
          <p className="leading-8 text-gray-600 dark:text-gray-300">
            This policy explains what StudioSpace collects, why we collect it,
            and the choices you have. By using StudioSpace you agree to the
            practices described here.
          </p>

          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {section.title}
              </h2>

              <div className="mt-3 space-y-3">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="leading-8 text-gray-600 dark:text-gray-300"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Contact Us
            </h2>

            <p className="mt-3 leading-8 text-gray-600 dark:text-gray-300">
              If you have questions about this policy, email us at{" "}
              <a
                href="mailto:hello@studiospace.com"
                className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
              >
                hello@studiospace.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
