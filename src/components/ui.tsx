import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./reveal";

type BtnProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "leaf" | "ghost" | "light" | "outline";
  className?: string;
  external?: boolean;
  arrow?: boolean;
};

const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-[0_10px_30px_-12px_rgb(31_76_192/0.6)]",
  leaf: "bg-leaf-500 text-white hover:bg-leaf-600 shadow-[0_10px_30px_-12px_rgb(62_169_46/0.7)]",
  ghost: "text-white ring-1 ring-white/25 hover:bg-white/10",
  light: "bg-white text-brand-800 hover:bg-brand-50",
  outline: "text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50",
};

export function Button({ href, children, variant = "primary", className = "", external, arrow }: BtnProps) {
  const cls = `group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-semibold transition-all duration-200 ${variants[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />}
    </>
  );
  if (external)
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  dark,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${dark ? "!text-leaf-300" : ""}`}>{eyebrow}</p>
      <h2
        className={`mt-4 text-3xl font-bold leading-tight sm:text-4xl ${dark ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {body && <p className={`mt-4 text-base leading-relaxed sm:text-lg ${dark ? "text-brand-100/80" : "text-muted"}`}>{body}</p>}
    </Reveal>
  );
}

export function PageHero({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-950 pb-16 pt-32 text-white sm:pb-20 sm:pt-40">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="absolute -right-40 -top-40 size-[34rem] rounded-full bg-brand-600/30 blur-3xl" />
      <div className="absolute -bottom-48 left-10 size-[26rem] rounded-full bg-leaf-500/15 blur-3xl" />
      <div className="container-x relative">
        <Reveal>
          <p className="eyebrow !text-leaf-300">{eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">{title}</h1>
          {body && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-100/80">{body}</p>}
          {children}
        </Reveal>
      </div>
    </section>
  );
}
