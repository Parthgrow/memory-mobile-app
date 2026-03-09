 "use client";

import { useEffect } from "react";
import Link from "next/link";

const GMAIL_COMPOSE_URL =
  "https://mail.google.com/mail/?view=cm&fs=1&to=parthagarwal1984@gmail.com";

export default function ContactPage() {
  useEffect(() => {
    try {
      const width = 720;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      window.open(
        GMAIL_COMPOSE_URL,
        "gmailComposeWindow",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
      );
    } catch {
      // If window.open fails (e.g., popup blocked), user can use the fallback link below.
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md px-6 text-center">
        <h1 className="text-2xl font-semibold text-stone-900 mb-3">
          Contact MindGym
        </h1>
        <p className="text-stone-500 mb-4">
          A Gmail compose window addressed to{" "}
          <span className="font-medium text-stone-700">
            parthagarwal1984@gmail.com
          </span>{" "}
          should have opened as a popup.
        </p>
        <p className="text-stone-500 mb-6">
          If it didn&apos;t open (for example, if your browser blocked popups),
          you can open Gmail manually:
        </p>
        <a
          href={GMAIL_COMPOSE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
        >
          Open Gmail compose
        </a>
        <div className="mt-6">
          <Link
            href="/"
            className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

