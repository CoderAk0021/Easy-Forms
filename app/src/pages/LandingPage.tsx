import { useLayoutEffect, useRef } from "react";
import { ArrowRight, CheckCircle2, FileText, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/ui/Logo";
import gsap from "gsap";

const features = [
  {
    title: "Fast Form Builder",
    description: "Build forms in minutes with drag-and-drop question blocks.",
    icon: Zap,
  },
  {
    title: "Live Preview",
    description: "Switch between editor and preview instantly on desktop and mobile.",
    icon: Sparkles,
  },
  {
    title: "Response Ready",
    description: "Publish quickly and track responses in one focused workspace.",
    icon: FileText,
  },
];

export function LandingPage() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-gsap='hero']",
        { y: 20, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" },
      );
      gsap.fromTo(
        "[data-gsap='feature-card']",
        { y: 16, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.45,
          ease: "power2.out",
          delay: 0.15,
          stagger: 0.08,
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(129,140,248,0.2),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_40%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-14 flex items-center justify-between">
          <div className="inline-flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 backdrop-blur">
            <Logo size={16} />
            <span className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-400">
              Easy Forms
            </span>
          </div>

          <Link
            to="/login"
            className="inline-flex h-9 items-center rounded-md border border-zinc-700 bg-zinc-900 px-4 text-sm text-zinc-200 transition hover:bg-zinc-800"
          >
            Sign In
          </Link>
        </header>

        <main className="grid flex-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section data-gsap="hero">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Smart form workflows for teams
            </p>

            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
              Build polished forms and ship them in minutes.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
              Easy Forms gives you a focused builder, live preview, and clean response flow
              with the same look and feel you already use in your app.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-zinc-100 px-5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/editor"
                className="inline-flex h-11 items-center rounded-lg border border-zinc-700 bg-zinc-900 px-5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
              >
                Open Builder
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-500">
                Platform Highlights
              </h2>
              <div className="h-2 w-2 rounded-full bg-cyan-400" />
            </div>

            <div className="space-y-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    data-gsap="feature-card"
                    className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 transition hover:border-zinc-700"
                  >
                    <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900">
                      <Icon className="h-4 w-4 text-zinc-300" />
                    </div>
                    <p className="text-sm font-medium text-zinc-100">{feature.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <div className="pointer-events-none absolute -left-24 top-0 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-52 w-52 rounded-full bg-indigo-400/15 blur-3xl" />

          <div className="relative z-10 mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Simple Pricing
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl">
                Choose the plan that fits your growth
              </h2>
            </div>
            <p className="text-xs text-zinc-500">Monthly billing</p>
          </div>

          <div className="relative z-10 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-5 shadow-lg shadow-black/20">
              <h3 className="text-lg font-semibold text-zinc-100">Free</h3>
              <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-100">
                0 <span className="text-sm font-medium text-zinc-400">rupees</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />05 Forms Creation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />No Email</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />No Logo</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />No QR</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />No Background</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />Basic response collection</li>
              </ul>
              <button className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800">
                Start Free
              </button>
            </article>

            <article className="relative rounded-2xl border border-cyan-400/60 bg-gradient-to-b from-cyan-500/10 via-zinc-900 to-zinc-950 p-5 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <span className="absolute right-4 top-4 rounded-full border border-cyan-300/40 bg-cyan-400/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                Most Popular
              </span>
              <h3 className="text-lg font-semibold text-zinc-100">Standard</h3>
              <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-100">
                500 <span className="text-sm font-medium text-zinc-300">/month</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-200">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />Unlimited forms creation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />No customize email</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />Branding controls</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />QR sharing</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />Priority support</li>
              </ul>
              <button className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-cyan-300 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200">
                Upgrade to Standard
              </button>
            </article>

            <article className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-indigo-500/10 to-zinc-950 p-5 shadow-lg shadow-black/20">
              <h3 className="text-lg font-semibold text-zinc-100">Premium</h3>
              <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-100">
                999 <span className="text-sm font-medium text-zinc-300">/month</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-200">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />All features</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />Custom email setup</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />Advanced themes and backgrounds</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />Analytics dashboard</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-300" />Dedicated support</li>
              </ul>
              <button className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg border border-indigo-300/40 bg-indigo-400/20 text-sm font-medium text-indigo-100 transition hover:bg-indigo-400/30">
                Go Premium
              </button>
            </article>
          </div>
        </div>
      </section>

    </div>
  );
}
