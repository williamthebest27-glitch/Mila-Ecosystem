import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/sections/Hero";
import { Manifesto } from "@/sections/Manifesto";
import { Ecosystem } from "@/sections/Ecosystem";
import { Future } from "@/sections/Future";
import { Pillars } from "@/sections/Pillars";
import { Story } from "@/sections/Story";
import { ForYou } from "@/sections/ForYou";
import { Community } from "@/sections/Community";
import { Testimonials } from "@/sections/Testimonials";
import { Impact } from "@/sections/Impact";
import { Resources } from "@/sections/Resources";
import { Call } from "@/sections/Call";
import { Together } from "@/sections/Together";
import { Thoughts } from "@/sections/Thoughts";
import { FinalCta } from "@/sections/FinalCta";

export default function Home() {
  // Fonts and images change layout after mount: recompute trigger positions.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 1200);
    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Manifesto />
        <Ecosystem />
        <Future />
        <Pillars />
        <Story />
        <ForYou />
        <Community />
        <Testimonials />
        <Impact />
        <Resources />
        <Call />
        <Together />
        <Thoughts />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
