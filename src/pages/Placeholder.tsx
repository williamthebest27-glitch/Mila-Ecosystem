import { useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";

/**
 * Minimal stand-in for the routes that exist in the full app
 * (percorsi, community, chi-sono, …) so every homepage link resolves.
 */
export default function Placeholder() {
  const { pathname } = useLocation();
  const name = pathname.replace(/^\//, "").split("/")[0] || "pagina";
  return (
    <>
      <Navbar />
      <main className="container-x flex min-h-[70vh] flex-col justify-center pt-[calc(var(--nav-h)+4rem)] pb-24">
        <p className="label">Mila Ecosystem</p>
        <h1 className="display display-lg mt-4 capitalize">{name.replace(/-/g, " ")}</h1>
        <p className="lede mt-6 max-w-lg">Questa sezione appartiene all'app completa. Torna alla homepage per continuare a esplorare l'ecosistema.</p>
        <div className="mt-10">
          <Button to="/" variant="primary">
            Torna alla home
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
