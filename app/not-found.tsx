import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-titre text-7xl font-extrabold text-rose">404</p>
      <h1 className="mt-4 text-2xl font-extrabold md:text-3xl">Cette page est introuvable</h1>
      <p className="mt-3 max-w-md text-encre/70">Le bien ou la page que vous cherchez n'existe plus ou a été déplacé.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-marine">Retour à l'accueil</Link>
        <Link href="/biens/" className="btn btn-outline">Voir nos biens</Link>
      </div>
    </div>
  );
}
