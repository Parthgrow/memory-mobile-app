import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — MindGym",
  description: "Privacy Policy for the MindGym memory training app.",
};

const sections = [
  {
    title: "1. Introduction",
    content: `MindGym ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains what information we collect when you use the MindGym app, how we use it, and the choices you have. By using MindGym, you agree to the practices described in this policy.`,
  },
  {
    title: "2. Information We Collect",
    content: null,
    subsections: [
      {
        title: "When you create an account:",
        items: [
          "Email address — used to uniquely identify your account.",
          "Password — stored as a one-way cryptographic hash (bcrypt, 10 rounds). We never store or have access to your plain-text password.",
        ],
      },
      {
        title: "When you use the app:",
        items: [
          "Practice session scores — a single number per session (e.g., \"12 correct out of 15\").",
          "Session dates — the calendar date on which each session was completed.",
        ],
      },
      {
        title: "We do NOT collect:",
        items: [
          "Device identifiers or hardware information.",
          "Location or GPS data.",
          "Contacts, photos, microphone, or camera input.",
          "Behavioral analytics or usage patterns.",
          "Any data from third-party advertising or tracking networks.",
        ],
      },
    ],
  },
  {
    title: "3. How We Use Your Information",
    content: null,
    list: [
      "Email + password: to authenticate you and keep your account secure.",
      "Scores + dates: to display your personal progress history — 7-day stats and a 90-day activity heatmap. This data is only ever visible to you.",
      "We do not use your data to build advertising profiles, sell to third parties, or send unsolicited communications.",
    ],
  },
  {
    title: "4. Data Storage & Third-Party Services",
    content: `Your data is stored on Upstash Redis, a managed key-value database service. We do not sell, rent, or share your personal data with any third party for marketing or advertising purposes.`,
    note: "Third-party service used: Upstash (upstash.com) — data storage infrastructure. Upstash's own privacy policy governs their handling of data at the infrastructure level.",
  },
  {
    title: "5. Data Security",
    content: `Passwords are hashed with bcrypt before storage and are never transmitted or logged in plain text. Authentication uses short-lived JWT tokens (7-day expiry). We take reasonable technical measures to protect your data. However, no system is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "6. Data Retention",
    content: `Your data is retained for as long as your account is active. If you request account deletion, we will remove your email, password hash, and all associated scores from our systems within a reasonable timeframe.`,
  },
  {
    title: "7. Your Rights",
    content: `You have the right to:`,
    list: [
      "Access the personal data we hold about you.",
      "Request correction of inaccurate data.",
      "Request deletion of your account and all associated data.",
      "Withdraw consent at any time by stopping use of the app.",
    ],
    note: "To exercise any of these rights, email us at parthagarwal1984@gmail.com. We will respond within 30 days.",
  },
  {
    title: "8. Children's Privacy",
    content: `MindGym does not knowingly collect personal information from children under 13 years of age. If you believe a child has provided us with personal information, please contact us immediately and we will delete it promptly.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page reflects the most recent revision. Continued use of the app after changes are posted constitutes your acceptance of the updated policy. We encourage you to review this page periodically.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at:`,
    contact: "parthagarwal1984@gmail.com",
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Nav */}
      <nav className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-stone-900 tracking-tight hover:text-orange-600 transition-colors"
        >
          MindGym
        </Link>
        <Link
          href="/"
          className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
        >
          ← Back to home
        </Link>
      </nav>

      {/* Header */}
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-8 border-b border-stone-100">
        <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
          Legal
        </span>
        <h1 className="text-4xl font-bold text-stone-900 mb-3">
          Privacy Policy
        </h1>
        <p className="text-stone-500 text-sm">Last updated: February 17, 2026</p>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-semibold text-stone-900 mb-3">
              {section.title}
            </h2>

            {section.content && (
              <p className="text-stone-600 leading-relaxed mb-3">
                {section.content}
              </p>
            )}

            {"subsections" in section && section.subsections && (
              <div className="space-y-4">
                {section.subsections.map((sub) => (
                  <div key={sub.title}>
                    <p className="text-stone-700 font-medium mb-2 text-sm">
                      {sub.title}
                    </p>
                    <ul className="space-y-1.5 pl-4">
                      {sub.items.map((item, i) => (
                        <li
                          key={i}
                          className="text-stone-600 text-sm leading-relaxed flex gap-2"
                        >
                          <span className="text-orange-400 mt-1 shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {"list" in section && section.list && (
              <ul className="space-y-2 pl-4">
                {section.list.map((item, i) => (
                  <li
                    key={i}
                    className="text-stone-600 text-sm leading-relaxed flex gap-2"
                  >
                    <span className="text-orange-400 mt-1 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            {"note" in section && section.note && (
              <div className="mt-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 text-sm text-stone-600 leading-relaxed">
                {section.note}
              </div>
            )}

            {"contact" in section && section.contact && (
              <a
                href={`mailto:${section.contact}`}
                className="inline-block mt-2 text-orange-600 font-medium hover:underline"
              >
                {section.contact}
              </a>
            )}
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-100 py-8 bg-white mt-8">
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-stone-400">
          <span>© {new Date().getFullYear()} MindGym. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/" className="hover:text-stone-600 transition-colors">
              Home
            </Link>
            <a
              href="mailto:parthagarwal1984@gmail.com"
              className="hover:text-stone-600 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
