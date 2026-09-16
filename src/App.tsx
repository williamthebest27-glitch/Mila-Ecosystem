import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ScrollTrigger } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { Preloader } from "@/components/Preloader";
import Home from "@/pages/Home";
import Percorsi from "@/pages/Percorsi";
import Business from "@/pages/Business";
import Libreria from "@/pages/Libreria";
import Community from "@/pages/Community";
import Dashboard from "@/pages/Dashboard";
import Placeholder from "@/pages/Placeholder";

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    // L'intro tiene il documento bloccato con `overflow: hidden` e lo riporta
    // in cima: uno spostamento tentato adesso verrebbe semplicemente
    // inghiottito, e un ingresso diretto su /#ecosistema atterrerebbe in alto.
    // Si aspetta il suo via — che scatta subito se l'intro è già passata,
    // quindi le navigazioni successive restano immediate.
    return onIntroDone(() => {
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
    });
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
        <Route path="/percorsi" element={<Percorsi />} />
        <Route path="/business" element={<Business />} />
        <Route path="/libreria" element={<Libreria />} />
        <Route path="/community" element={<Community />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Placeholder />} />
      </Routes>
    </>
  );
}
