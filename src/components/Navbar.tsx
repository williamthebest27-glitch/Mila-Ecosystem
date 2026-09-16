import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { nav } from "@/data/content";
import { Link } from "./Link";
import { Logo } from "./Logo";

/**
 * La seconda area del menu ("Esplora"): Blog, Risorse gratuite, Area
 * personale. Si apre al clic — non al passaggio del mouse, che su un trackpad
 * la farebbe comparire per sbaglio — e si chiude con Esc, con un clic fuori o
 * al cambio di pagina.
 */
function ExploreMenu({ linkCls, onDark }: { linkCls: string; onDark: boolean }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      btnRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      // `target` non è sempre un Node: un evento sintetico lanciato su window
      // ha window come bersaglio e `contains` solleverebbe un TypeError dentro
      // un listener globale.
      const target = e.target;
      if (!(target instanceof Node) || !wrapRef.current?.contains(target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        ref={btnRef}
        type="button"
        className={`${linkCls} inline-flex items-center gap-1.5`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="menu-esplora"
        onClick={() => setOpen((v) => !v)}
      >
        {nav.explore.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-500 [transition-timing-function:var(--ease-premium)] ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>

      <div
        id="menu-esplora"
        hidden={!open}
        className={`glass absolute right-0 top-[calc(100%+0.75rem)] w-60 rounded-2xl border p-2 shadow-[0_24px_60px_-30px_rgba(49,38,30,0.45)] ${
          onDark ? "border-white/10 bg-ink/70" : "border-white/70 bg-white/80"
        }`}
      >
        <ul>
          {nav.explore.items.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`block rounded-xl px-3 py-2.5 text-[0.9rem] font-medium transition-colors duration-300 ${
                  onDark ? "text-ivory hover:bg-white/10" : "text-ink hover:bg-sage-soft"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Floating glass navigation. Links zoom slightly and turn sage green on
 * hover; the capsule becomes denser after the first scroll and switches to
 * a dark glass over sections marked data-nav="dark".
 */
export function Navbar({ dark = false }: { dark?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        const y = 40;
        let isDark = false;
        document.querySelectorAll<HTMLElement>('[data-nav="dark"]').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top <= y && r.bottom >= y) isDark = true;
        });
        setOverDark(isDark);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [location.pathname]);

  useEffect(() => setOpen(false), [location.pathname, location.hash]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const links = el.querySelectorAll<HTMLElement>("[data-menu-item]");
    const meta = el.querySelectorAll<HTMLElement>("[data-menu-meta]");
    if (open) {
      el.style.pointerEvents = "auto";
      if (reduced) {
        gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 });
        gsap.set([links, meta], { y: 0, opacity: 1 });
        return;
      }
      const tl = gsap.timeline();
      tl.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)", opacity: 1 }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "premium" })
        .fromTo(links, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: "premium" }, "-=0.5")
        .fromTo(meta, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: "premium" }, "-=0.6");
    } else {
      el.style.pointerEvents = "none";
      if (reduced) {
        gsap.set(el, { opacity: 0 });
        return;
      }
      gsap.to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6, ease: "premium" });
    }
  }, [open]);

  const onDark = (dark && !scrolled) || overDark;

  const shell = open
    ? "bg-transparent border-transparent shadow-none"
    : onDark
      ? `border-white/10 ${scrolled ? "bg-ink/55" : "bg-ink/30"} shadow-[0_20px_50px_-30px_rgba(0,0,0,0.6)]`
      : `border-white/70 ${scrolled ? "bg-white/60" : "bg-white/35"} shadow-[0_20px_50px_-30px_rgba(28,26,23,0.35)]`;

  const linkCls = `nav-link ${onDark ? "text-ivory hover:text-sage-soft" : "text-ink hover:text-sage-deep"}`;

  return (
    <>
      <header data-site-header className="fixed inset-x-0 top-0 z-[60] px-3 pt-3 sm:px-4 lg:px-6">
        <div
          className={`glass mx-auto flex h-14 max-w-[80rem] items-center justify-between rounded-full border pl-5 pr-2 transition-[background-color,border-color,box-shadow] duration-700 [transition-timing-function:var(--ease-premium)] ${shell}`}
        >
          <Logo light={onDark} />

          <nav aria-label="Principale" className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {nav.primary.map((item) => (
              <Link key={item.to} to={item.to} className={linkCls}>
                {item.label}
              </Link>
            ))}
            <ExploreMenu linkCls={linkCls} onDark={onDark} />
          </nav>

          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            <Link to={nav.login.to} className={linkCls}>
              {nav.login.label}
            </Link>
            <span className="cta-gilded ml-2">
              <span className="cta-halo" aria-hidden="true" />
              <Link
                to={nav.cta.to}
                className={`btn btn-gilded ${onDark ? "btn-light" : "btn-primary"} !h-10 !px-5 !py-0 !text-[0.875rem]`}
              >
                <span>{nav.cta.label}</span>
                <ArrowUpRight className="btn-arrow h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </span>
          </div>

          <button
            type="button"
            className={`lg:hidden relative mr-1 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${onDark ? "text-ivory" : "text-ink"}`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="flex flex-col gap-[6px]">
              <span className="menu-line" style={{ transform: open ? "translateY(3.75px) rotate(45deg)" : "none" }} />
              <span className="menu-line" style={{ transform: open ? "translateY(-3.75px) rotate(-45deg)" : "none" }} />
            </span>
          </button>
        </div>
      </header>

      {/* Fullscreen menu */}
      <div
        id="mobile-menu"
        ref={overlayRef}
        className="fixed inset-0 z-[55] bg-sage-wash text-ink opacity-0 pointer-events-none overflow-hidden"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
        aria-hidden={!open}
      >
        <div className="container-x flex h-full flex-col pt-[calc(var(--nav-h)+1rem)] pb-8">
          {/* L'area scorre: con cinque voci principali, il gruppo Esplora e le
              due azioni finali, su uno schermo corto non ci starebbe tutto. */}
          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">
            <nav aria-label="Menu principale" className="flex flex-col">
              {nav.primary.map((item, i) => (
                <Link
                  key={item.to}
                  to={item.to}
                  data-menu-item
                  className="group flex items-baseline justify-between border-b hairline py-3.5 sm:py-4"
                  tabIndex={open ? 0 : -1}
                >
                  <span className="display text-[clamp(1.9rem,7.5vw,3.25rem)] font-normal transition-colors duration-500 group-hover:text-sage-deep">
                    {item.label}
                  </span>
                  <span className="num text-xs text-mute-2 tracking-[0.2em]">{String(i + 1).padStart(2, "0")}</span>
                </Link>
              ))}
            </nav>

            <div data-menu-item className="mt-8">
              <p className="label">{nav.explore.label}</p>
              <nav aria-label="Esplora" className="mt-2 flex flex-col">
                {nav.explore.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="border-b hairline py-3 text-[1.05rem] font-medium text-ink/85 transition-colors duration-300 hover:text-sage-deep"
                    tabIndex={open ? 0 : -1}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="mt-8 flex shrink-0 flex-col gap-4">
            <Link
              to={nav.login.to}
              data-menu-meta
              className="link-underline self-center text-[0.95rem] font-medium text-ink/80"
              tabIndex={open ? 0 : -1}
            >
              {nav.login.label}
            </Link>
            <Link to={nav.cta.to} data-menu-meta className="btn btn-primary btn-gilded w-full justify-between !py-5 !text-base" tabIndex={open ? 0 : -1}>
              <span>{nav.cta.label}</span>
              <ArrowUpRight className="btn-arrow h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            </Link>
            <div data-menu-meta className="flex items-center justify-between text-xs text-mute tracking-[0.14em] uppercase">
              <span>Mila Ecosystem</span>
              <span>Empowerment femminile</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
