import Link from "next/link";

export default function AccountDeletionPage() {
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
          Account
        </span>
        <h1 className="text-3xl font-bold text-stone-900 mb-3">
          Account Deletion & Data Retention
        </h1>
        <p className="text-stone-500 text-sm">
          This page explains how MindGym users can request deletion of their
          account and what happens to their data.
        </p>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-stone-900">
            How to request deletion
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            To delete your MindGym account, please send an email from the email
            address associated with your account to:
          </p>
          <a
            href="mailto:parthagarwal1984@gmail.com?subject=MindGym%20account%20deletion%20request"
            className="inline-block text-orange-600 font-medium hover:underline text-sm"
          >
            parthagarwal1984@gmail.com
          </a>
          <p className="text-stone-600 text-sm leading-relaxed">
            In your message, please include:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-stone-600 text-sm leading-relaxed">
            <li>The email address used to register your MindGym account</li>
            <li>A short statement that you want your account deleted</li>
          </ul>
          <p className="text-stone-600 text-sm leading-relaxed">
            We will process your request and confirm via email once deletion is
            complete.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-stone-900">
            What data is deleted
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            When your deletion request is processed, we permanently delete:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-stone-600 text-sm leading-relaxed">
            <li>Your account email address</li>
            <li>Your password hash (we never store your plain-text password)</li>
            <li>All practice session scores and associated dates</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-stone-900">
            What data is retained and for how long
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            After your account is deleted, we do not keep any data that can be
            used to personally identify you in our active systems.
          </p>
          <p className="text-stone-600 text-sm leading-relaxed">
            Some technical logs or backups maintained by our infrastructure
            provider may temporarily retain data for up to 30 days for security,
            reliability, and legal compliance. These backups are automatically
            purged and are not used to recreate deleted accounts or profiles.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-stone-900">Questions</h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            If you have any questions about account deletion or data retention,
            contact us at{" "}
            <a
              href="mailto:parthagarwal1984@gmail.com"
              className="text-orange-600 font-medium hover:underline"
            >
              parthagarwal1984@gmail.com
            </a>
            .
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-100 py-8 bg-white mt-8">
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-stone-400">
          <span>© {new Date().getFullYear()} MindGym. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/" className="hover:text-stone-600 transition-colors">
              Home
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-stone-600 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

