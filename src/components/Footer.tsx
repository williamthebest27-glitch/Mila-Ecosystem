import { ArrowUpRight, Instagram, Mail } from "lucide-react";
import { footer, routes } from "@/data/content";
import { useReveal } from "@/hooks/useGsap";
import { Link } from "./Link";
import { LogoMark } from "./Logo";

export function Footer() {
  const ref = useReveal<HTMLElement>();
  return (
    <footer ref={ref} data-nav="dark" className="relative bg-ink text-ivory grain overflow-hidden">
      <div className="container-x relative">
        {/* Top: statement + CTA */}
        <div className="grid gap-12 border-b border-ivory/12 py-16 md:py-24 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7" data-reveal>
            <div className="flex items-center gap-3">
              <LogoMark className="h-8 w-8" />
              <span className="text-lg font-medium tracking-[-0.02em]">
                Mila <span className="font-normal opacity-70">Ecosystem</span>
              </span>
            </div>
            <p className="mt-8 max-w-xl text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.3] tracking-[-0.02em] text-ivory/85 text-pretty">
              {footer.tagline}
            </p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end lg:self-end" data-reveal data-reveal-delay="0.15">
            <p className="label label-on-dark">Il primo passo</p>
            <Link
              to={routes.call}
              className="group mt-4 flex items-center gap-5 text-[clamp(1.75rem,3.5vw,3rem)] font-medium tracking-[-0.04em] leading-none"
            >
              <span className="link-underline">Prenota la call</span>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ivory/25 transition-all duration-500 [transition-timing-function:var(--ease-premium)] group-hover:bg-ivory group-hover:text-ink">
                <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>

        {/* Middle: link rails (not a 4-column grid: two horizontal rails + one column) */}
        <div className="grid gap-10 border-b border-ivory/12 py-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            <p className="label label-on-dark">Esplora</p>
            <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
              {footer.explore.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-underline text-[0.95rem] text-ivory/85 hover:text-ivory">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="label label-on-dark mt-10">Ecosistema</p>
            <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-3">
              {footer.ecosystem.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-underline text-[0.95rem] text-ivory/85 hover:text-ivory">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <p className="label label-on-dark">Account</p>
            <ul className="mt-5 flex flex-col gap-3">
              {footer.account.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="link-underline text-[0.95rem] text-ivory/85 hover:text-ivory">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="label label-on-dark mt-10">Seguimi</p>
            <div className="mt-5 flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20 transition-all duration-500 [transition-timing-function:var(--ease-premium)] hover:bg-ivory hover:text-ink"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </a>
              <a
                href="#"
                aria-label="Email"
                className="grid h-11 w-11 place-items-center rounded-full border border-ivory/20 transition-all duration-500 [transition-timing-function:var(--ease-premium)] hover:bg-ivory hover:text-ink"
              >
                <Mail className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-3 py-8 text-xs text-ivory/50 md:flex-row md:items-center md:justify-between">
          <p>{footer.copyright}</p>
          <p className="max-w-md text-pretty">{footer.disclaimer}</p>
        </div>
      </div>

      {/* Oversized wordmark, clipped at the bottom edge */}
      <div className="pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <p className="container-x translate-y-[28%] text-[clamp(4rem,17vw,17rem)] font-medium leading-none tracking-[-0.06em] text-ivory/[0.06] whitespace-nowrap">
          Mila Ecosystem
        </p>
      </div>
    </footer>
  );
}
