import Link from "next/link";

const features = [
  {
    icon: "🧠",
    title: "Customizable Training",
    description:
      "Choose your grid size — from 2×2 to 6×6 — and set your own memorization timer. Start easy and level up as your recall improves.",
  },
  {
    icon: "📊",
    title: "Daily Score Tracking",
    description:
      "Every session is saved automatically. See your performance across the past 7 days and a 90-day activity heatmap.",
  },
  {
    icon: "🔁",
    title: "Build the Habit",
    description:
      "Only your best score of the day is kept. It's just you vs. yesterday. Practice consistently and watch yourself improve.",
  },
];

const steps = [
  {
    number: "01",
    title: "Configure your session",
    description:
      "Pick how many rows and columns of words you want, and how long you have to memorize them.",
  },
  {
    number: "02",
    title: "Memorize the grid",
    description:
      "Study every word before the timer runs out. Navigate row by row or jump ahead when you're ready.",
  },
  {
    number: "03",
    title: "Recall and score",
    description:
      "Type back every word from memory. Your score is calculated instantly — correct out of total.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <span className="text-xl font-bold text-stone-900 tracking-tight">
          MindGym
        </span>
        <Link
          href="/privacy-policy"
          className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
        >
          Privacy Policy
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-28 text-center">
          <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-6">
            Memory Training App
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-stone-900 leading-tight mb-6">
            Train your mind.
            <br />
            <span className="text-orange-600">Build your memory.</span>
          </h1>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            MindGym challenges you to memorize word grids and recall them
            perfectly. A simple, daily practice to sharpen your focus and
            strengthen your recall — one session at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <span className="inline-flex items-center justify-center gap-2 bg-stone-900 text-white text-sm font-medium px-6 py-3 rounded-xl opacity-60 cursor-not-allowed select-none">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.3.17.64.24.99.2l13.7-7.91-2.97-2.97-11.72 10.68zM.54 1.42C.2 1.74 0 2.24 0 2.9v18.2c0 .66.2 1.16.55 1.48l.08.07 10.19-10.19v-.24L.62 1.34l-.08.08zM20.37 10.41l-2.92-1.69-3.27 3.27 3.27 3.27 2.94-1.7c.84-.48.84-1.27-.02-1.75v.6zM4.17.24l13.7 7.91-2.97 2.97L3.18.44A1.18 1.18 0 014.17.24z" />
              </svg>
              Coming soon on Google Play
            </span>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 bg-white border border-stone-200 text-stone-700 text-sm font-medium px-6 py-3 rounded-xl hover:bg-stone-50 transition-colors"
            >
              Learn more ↓
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-stone-900 text-center mb-4">
            Everything you need to practice
          </h2>
          <p className="text-stone-500 text-center mb-14 max-w-xl mx-auto">
            MindGym keeps it focused. No distractions, no streak pressure —
            just a clean tool to practice and improve.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-orange-50 rounded-2xl p-7 hover:shadow-sm transition-shadow"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-20"
        style={{ background: "var(--background)" }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-stone-900 text-center mb-4">
            How it works
          </h2>
          <p className="text-stone-500 text-center mb-14 max-w-xl mx-auto">
            Three steps. No tutorials needed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((s) => (
              <div key={s.number} className="flex flex-col">
                <span className="text-6xl font-black text-orange-100 mb-3 select-none leading-none">
                  {s.number}
                </span>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-orange-600">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to challenge your memory?
          </h2>
          <p className="text-orange-100 mb-8 max-w-md mx-auto leading-relaxed">
            MindGym is launching on Google Play soon. Check back here for the
            download link.
          </p>
          <span className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 text-sm font-semibold px-7 py-3 rounded-xl opacity-70 cursor-not-allowed select-none">
            Coming soon on Google Play
          </span>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-100 py-8 bg-white">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-stone-400">
          <span>© {new Date().getFullYear()} MindGym. All rights reserved.</span>
          <div className="flex gap-5">
            <Link
              href="/privacy-policy"
              className="hover:text-stone-600 transition-colors"
            >
              Privacy Policy
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
