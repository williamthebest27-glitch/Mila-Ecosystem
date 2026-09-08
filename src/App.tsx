import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ScrollTrigger } from "@/lib/gsap";
import { Preloader } from "@/components/Preloader";
import Home from "@/pages/Home";
import Placeholder from "@/pages/Placeholder";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    // Layout may change between routes: refresh trigger positions.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <Preloader />
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Placeholder />} />
      </Routes>
    </>
  );
}
