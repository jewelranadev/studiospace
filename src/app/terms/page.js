export const metadata = {
  title: "Terms & Conditions | StudioSpace",
  description: "The terms that govern your use of StudioSpace.",
};

const sections = [
  {
    title: "Accepting These Terms",
    body: [
      "By creating an account, listing a studio, or making a booking on StudioSpace, you agree to these terms. If you do not agree, please do not use the service.",
    ],
  },
  {
    title: "Your Account",
    body: [
      "You are responsible for keeping your sign-in details secure and for all activity that happens under your account.",
      "You must provide accurate information and keep it up to date. We may suspend accounts that provide false information or abuse the platform.",
    ],
  },
  {
    title: "Bookings",
    body: [
      "When you request a booking, the host can confirm or decline it. A booking is only final once the host confirms it and any stated deposit or payment requirements are met.",
      "Study the listing details, including hourly rate, capacity, and house rules, before you book.",
    ],
  },
  {
    title: "Cancellations and Refunds",
    body: [
      "Cancellation windows and refund eligibility are shown as part of the booking process. Unless a listing states otherwise, a booking cancelled inside the stated window may not be refundable.",
      "If a host cancels a confirmed booking, the guest is refunded for the unused session.",
    ],
  },
  {
    title: "Host Responsibilities",
    body: [
      "Hosts must keep their listings accurate, their spaces safe to use, and their availability current.",
      "Hosts are responsible for the spaces they list and for complying with the laws and regulations that apply to them.",
    ],
  },
  {
    title: "Acceptable Use",
    body: [
      "You may not use StudioSpace for unlawful activity, to post misleading listings, to interfere with the service, or to harm other users.",
      "We may remove content or restrict access when these rules are broken.",
    ],
  },
  {
    title: "Disclaimer and Limitation of Liability",
    body: [
      "StudioSpace is provided as is, without warranties of any kind. We are not responsible for the condition, safety, or availability of any studio listed by a host, nor for agreements made directly between hosts and guests.",
      "To the extent permitted by law, StudioSpace is not liable for indirect or consequential damages arising from your use of the service.",
    ],
  },
  {
    title: "Changes to These Terms",
    body: [
      "We may update these terms from time to time. When we do, we will revise the date above and, where appropriate, notify you. Continuing to use StudioSpace after an update means you accept the revised terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16 dark:bg-gray-950 md:px-10 lg:px-20">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 font-semibold tracking-widest text-violet-600 dark:text-violet-400">
          THE RULES
        </p>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
          Terms &amp; Conditions
        </h1>

        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Last updated: November 2026
        </p>

        <div className="mt-8 space-y-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8">
          <p className="leading-8 text-gray-600 dark:text-gray-300">
            These terms govern your use of StudioSpace. Please read them before
            using the platform.
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
              Questions about these terms can be sent to{" "}
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
